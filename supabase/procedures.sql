-- ==========================================================
-- STORED PROCEDURES AND FUNCTIONS
-- ==========================================================

-- ==========================================================
-- 1. BOOK APPOINTMENT PROCEDURE
-- ==========================================================
CREATE OR REPLACE FUNCTION book_appointment(
    p_doctor_id INT,
    p_patient_id INT,
    p_appointment_date DATE,
    p_appointment_time TIME,
    p_admin_id INT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    appointment_id INT
) AS $$
DECLARE
    v_appointment_id INT;
    v_doctor_available BOOLEAN;
BEGIN
    -- Check if doctor is available
    SELECT Availability_Status = 'Available' INTO v_doctor_available
    FROM Doctor
    WHERE Doctor_ID = p_doctor_id;

    IF NOT v_doctor_available THEN
        RETURN QUERY SELECT FALSE, 'Doctor is not available', NULL::INT;
        RETURN;
    END IF;

    -- Check for conflicting appointments
    IF EXISTS (
        SELECT 1 FROM Appointment
        WHERE Doctor_ID = p_doctor_id
        AND Appointment_Date = p_appointment_date
        AND Appointment_Time = p_appointment_time
        AND Status != 'Cancelled'
    ) THEN
        RETURN QUERY SELECT FALSE, 'Time slot already booked', NULL::INT;
        RETURN;
    END IF;

    -- Create appointment
    INSERT INTO Appointment (Doctor_ID, Patient_ID, Appointment_Date, Appointment_Time, Admin_ID, Notes, Status)
    VALUES (p_doctor_id, p_patient_id, p_appointment_date, p_appointment_time, p_admin_id, p_notes, 'Scheduled')
    RETURNING Appointment_ID INTO v_appointment_id;

    RETURN QUERY SELECT TRUE, 'Appointment booked successfully', v_appointment_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 2. GENERATE BILL PROCEDURE
-- ==========================================================
CREATE OR REPLACE FUNCTION generate_bill(
    p_patient_id INT,
    p_appointment_id INT DEFAULT NULL,
    p_consultation_charges DECIMAL DEFAULT 0,
    p_medicine_charges DECIMAL DEFAULT 0,
    p_lab_charges DECIMAL DEFAULT 0,
    p_room_charges DECIMAL DEFAULT 0,
    p_discount_percentage DECIMAL DEFAULT 0
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    bill_id INT,
    total_amount DECIMAL,
    final_amount DECIMAL
) AS $$
DECLARE
    v_bill_id INT;
    v_total DECIMAL;
    v_discount DECIMAL;
    v_final DECIMAL;
    v_insurance_coverage DECIMAL;
BEGIN
    -- Calculate total
    v_total := p_consultation_charges + p_medicine_charges + p_lab_charges + p_room_charges;

    -- Check for insurance
    SELECT COALESCE(Coverage_Percentage, 0) INTO v_insurance_coverage
    FROM Insurance
    WHERE Patient_ID = p_patient_id
    AND Expiry_Date >= CURRENT_DATE
    LIMIT 1;

    -- Calculate discount
    v_discount := (v_total * p_discount_percentage / 100) + (v_total * v_insurance_coverage / 100);
    v_final := v_total - v_discount;

    -- Insert bill
    INSERT INTO Billing (Appointment_ID, Patient_ID, Total_Amount, Discount_Amount, Payment_Status)
    VALUES (p_appointment_id, p_patient_id, v_total, v_discount, 'Pending')
    RETURNING Bill_ID INTO v_bill_id;

    RETURN QUERY SELECT TRUE, 'Bill generated successfully', v_bill_id, v_total, v_final;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 3. GET PATIENT HISTORY PROCEDURE
-- ==========================================================
CREATE OR REPLACE FUNCTION get_patient_history(p_patient_id INT)
RETURNS TABLE(
    patient_name TEXT,
    appointment_count BIGINT,
    last_visit DATE,
    total_bills_amount DECIMAL,
    pending_bills_count BIGINT,
    active_diseases BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CONCAT(p.First_Name, ' ', p.Last_Name) AS patient_name,
        (SELECT COUNT(*) FROM Appointment WHERE Patient_ID = p_patient_id) AS appointment_count,
        (SELECT MAX(Appointment_Date) FROM Appointment WHERE Patient_ID = p_patient_id AND Status = 'Completed') AS last_visit,
        (SELECT COALESCE(SUM(Total_Amount), 0) FROM Billing WHERE Patient_ID = p_patient_id) AS total_bills_amount,
        (SELECT COUNT(*) FROM Billing WHERE Patient_ID = p_patient_id AND Payment_Status = 'Pending') AS pending_bills_count,
        (SELECT COUNT(*) FROM Patient_Disease WHERE Patient_ID = p_patient_id AND Status = 'Active') AS active_diseases
    FROM Patient p
    WHERE p.Patient_ID = p_patient_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 4. ASSIGN ROOM PROCEDURE
-- ==========================================================
CREATE OR REPLACE FUNCTION assign_room(
    p_patient_id INT,
    p_room_type VARCHAR DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    room_id INT,
    room_number VARCHAR
) AS $$
DECLARE
    v_room_id INT;
    v_room_number VARCHAR;
BEGIN
    -- Find available room
    SELECT r.Room_ID, r.Room_Number INTO v_room_id, v_room_number
    FROM Room r
    WHERE r.Availability_Status = 'Available'
    AND (p_room_type IS NULL OR r.Type = p_room_type)
    LIMIT 1;

    IF v_room_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 'No available rooms of specified type', NULL::INT, NULL::VARCHAR;
        RETURN;
    END IF;

    -- Assign room
    INSERT INTO Patient_Room (Patient_ID, Room_ID, Admission_Date)
    VALUES (p_patient_id, v_room_id, CURRENT_DATE);

    -- Update room status
    UPDATE Room SET Availability_Status = 'Occupied' WHERE Room_ID = v_room_id;

    RETURN QUERY SELECT TRUE, 'Room assigned successfully', v_room_id, v_room_number;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 5. DISCHARGE PATIENT FROM ROOM
-- ==========================================================
CREATE OR REPLACE FUNCTION discharge_patient(
    p_patient_id INT,
    p_room_id INT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    days_stayed INT,
    room_charges DECIMAL
) AS $$
DECLARE
    v_admission_date DATE;
    v_days INT;
    v_charges_per_day DECIMAL;
    v_total_charges DECIMAL;
BEGIN
    -- Get admission date and room charges
    SELECT pr.Admission_Date, r.Charges_Per_Day
    INTO v_admission_date, v_charges_per_day
    FROM Patient_Room pr
    JOIN Room r ON pr.Room_ID = r.Room_ID
    WHERE pr.Patient_ID = p_patient_id
    AND pr.Room_ID = p_room_id
    AND pr.Discharge_Date IS NULL
    LIMIT 1;

    IF v_admission_date IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Patient not found in specified room', NULL::INT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Calculate days and charges
    v_days := CURRENT_DATE - v_admission_date;
    v_total_charges := v_days * v_charges_per_day;

    -- Update discharge date
    UPDATE Patient_Room
    SET Discharge_Date = CURRENT_DATE
    WHERE Patient_ID = p_patient_id AND Room_ID = p_room_id AND Discharge_Date IS NULL;

    -- Update room status
    UPDATE Room SET Availability_Status = 'Available' WHERE Room_ID = p_room_id;

    RETURN QUERY SELECT TRUE, 'Patient discharged successfully', v_days, v_total_charges;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 6. CANCEL APPOINTMENT PROCEDURE
-- ==========================================================
CREATE OR REPLACE FUNCTION cancel_appointment(
    p_appointment_id INT,
    p_reason TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_appointment_exists BOOLEAN;
BEGIN
    -- Check if appointment exists and is not already cancelled
    SELECT EXISTS(
        SELECT 1 FROM Appointment
        WHERE Appointment_ID = p_appointment_id
        AND Status != 'Cancelled'
    ) INTO v_appointment_exists;

    IF NOT v_appointment_exists THEN
        RETURN QUERY SELECT FALSE, 'Appointment not found or already cancelled';
        RETURN;
    END IF;

    -- Cancel appointment
    UPDATE Appointment
    SET Status = 'Cancelled', Notes = COALESCE(Notes || ' | Cancellation reason: ' || p_reason, 'Cancelled')
    WHERE Appointment_ID = p_appointment_id;

    RETURN QUERY SELECT TRUE, 'Appointment cancelled successfully';
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 7. GET AVAILABLE DOCTORS
-- ==========================================================
CREATE OR REPLACE FUNCTION get_available_doctors(
    p_specialization_name VARCHAR DEFAULT NULL,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    doctor_id INT,
    doctor_name TEXT,
    specialization VARCHAR,
    qualification VARCHAR,
    experience_years INT,
    consultation_charges DECIMAL,
    contact_number VARCHAR,
    email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.Doctor_ID,
        CONCAT(d.First_Name, ' ', d.Last_Name) AS doctor_name,
        s.Specialization_Name,
        d.Qualification,
        d.Experience_Years,
        d.Consultation_Charges,
        d.Contact_Number,
        d.Email
    FROM Doctor d
    LEFT JOIN Specialization s ON d.Specialization_ID = s.Specialization_ID
    WHERE d.Availability_Status = 'Available'
    AND (p_specialization_name IS NULL OR s.Specialization_Name = p_specialization_name)
    ORDER BY d.Experience_Years DESC;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 8. CREATE PRESCRIPTION WITH MEDICINES
-- ==========================================================
CREATE OR REPLACE FUNCTION create_prescription(
    p_doctor_id INT,
    p_patient_id INT,
    p_medicines JSONB,
    p_remarks TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    prescription_id INT
) AS $$
DECLARE
    v_prescription_id INT;
    v_medicine JSONB;
    v_medicine_id INT;
BEGIN
    -- Create prescription
    INSERT INTO Prescription (Doctor_ID, Patient_ID, Date_Issued, Remarks)
    VALUES (p_doctor_id, p_patient_id, CURRENT_DATE, p_remarks)
    RETURNING Prescription_ID INTO v_prescription_id;

    -- Add medicines
    FOR v_medicine IN SELECT * FROM jsonb_array_elements(p_medicines)
    LOOP
        v_medicine_id := (v_medicine->>'medicine_id')::INT;

        INSERT INTO Prescription_Medicine (
            Prescription_ID, Medicine_ID, Dosage, Frequency, Duration, Quantity
        ) VALUES (
            v_prescription_id,
            v_medicine_id,
            v_medicine->>'dosage',
            v_medicine->>'frequency',
            v_medicine->>'duration',
            (v_medicine->>'quantity')::INT
        );

        -- Update medicine stock
        UPDATE Medicine
        SET Stock_Quantity = Stock_Quantity - (v_medicine->>'quantity')::INT
        WHERE Medicine_ID = v_medicine_id;
    END LOOP;

    RETURN QUERY SELECT TRUE, 'Prescription created successfully', v_prescription_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 9. GET DOCTOR SCHEDULE
-- ==========================================================
CREATE OR REPLACE FUNCTION get_doctor_schedule(
    p_doctor_id INT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE(
    appointment_date DATE,
    appointment_time TIME,
    patient_name TEXT,
    patient_contact VARCHAR,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.Appointment_Date,
        a.Appointment_Time,
        CONCAT(p.First_Name, ' ', p.Last_Name) AS patient_name,
        p.Contact_Number,
        a.Status
    FROM Appointment a
    JOIN Patient p ON a.Patient_ID = p.Patient_ID
    WHERE a.Doctor_ID = p_doctor_id
    AND a.Appointment_Date BETWEEN p_start_date AND p_end_date
    ORDER BY a.Appointment_Date, a.Appointment_Time;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 10. SEARCH PATIENTS
-- ==========================================================
CREATE OR REPLACE FUNCTION search_patients(
    p_search_term VARCHAR
)
RETURNS TABLE(
    patient_id INT,
    patient_name TEXT,
    age INT,
    gender VARCHAR,
    contact_number VARCHAR,
    blood_group VARCHAR,
    last_visit DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.Patient_ID,
        CONCAT(p.First_Name, ' ', p.Last_Name) AS patient_name,
        p.Age,
        p.Gender,
        p.Contact_Number,
        p.Blood_Group,
        (SELECT MAX(Appointment_Date) FROM Appointment WHERE Patient_ID = p.Patient_ID AND Status = 'Completed') AS last_visit
    FROM Patient p
    WHERE
        LOWER(p.First_Name || ' ' || p.Last_Name) LIKE LOWER('%' || p_search_term || '%')
        OR p.Contact_Number LIKE '%' || p_search_term || '%'
        OR p.Email LIKE '%' || p_search_term || '%'
    ORDER BY p.Patient_ID DESC;
END;
$$ LANGUAGE plpgsql;
