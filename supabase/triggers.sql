-- ==========================================================
-- TRIGGERS FOR BACKUP, RESTORATION, AND BUSINESS LOGIC
-- ==========================================================

-- ==========================================================
-- 1. PREVENT DOUBLE BOOKING TRIGGER
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_check_doctor_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if doctor has conflicting appointment
    IF EXISTS (
        SELECT 1 FROM Appointment
        WHERE Doctor_ID = NEW.Doctor_ID
        AND Appointment_Date = NEW.Appointment_Date
        AND Appointment_Time = NEW.Appointment_Time
        AND Status NOT IN ('Cancelled')
        AND Appointment_ID != COALESCE(NEW.Appointment_ID, 0)
    ) THEN
        RAISE EXCEPTION 'Doctor already has an appointment at this time';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_doctor_availability
BEFORE INSERT OR UPDATE ON Appointment
FOR EACH ROW
EXECUTE FUNCTION trg_check_doctor_availability();

-- ==========================================================
-- 2. AUTO-GENERATE BILL ON APPOINTMENT COMPLETION
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_generate_bill_auto()
RETURNS TRIGGER AS $$
DECLARE
    v_consultation_charges DECIMAL;
BEGIN
    -- Only trigger when status changes to 'Completed'
    IF NEW.Status = 'Completed' AND (OLD.Status IS NULL OR OLD.Status != 'Completed') THEN
        -- Get doctor's consultation charges
        SELECT Consultation_Charges INTO v_consultation_charges
        FROM Doctor
        WHERE Doctor_ID = NEW.Doctor_ID;

        -- Create bill only if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM Billing WHERE Appointment_ID = NEW.Appointment_ID
        ) THEN
            INSERT INTO Billing (Appointment_ID, Patient_ID, Total_Amount, Payment_Status)
            VALUES (NEW.Appointment_ID, NEW.Patient_ID, v_consultation_charges, 'Pending');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_bill_on_completion
AFTER INSERT OR UPDATE ON Appointment
FOR EACH ROW
EXECUTE FUNCTION trg_generate_bill_auto();

-- ==========================================================
-- 3. UPDATE ROOM STATUS ON PATIENT ADMISSION/DISCHARGE
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Room occupied on admission
        UPDATE Room
        SET Availability_Status = 'Occupied'
        WHERE Room_ID = NEW.Room_ID;
    ELSIF TG_OP = 'UPDATE' AND NEW.Discharge_Date IS NOT NULL AND OLD.Discharge_Date IS NULL THEN
        -- Room available on discharge
        UPDATE Room
        SET Availability_Status = 'Available'
        WHERE Room_ID = NEW.Room_ID;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_room_status
AFTER INSERT OR UPDATE ON Patient_Room
FOR EACH ROW
EXECUTE FUNCTION trg_update_room_status();

-- ==========================================================
-- 4. LOG ADMIN ACTIONS (AUDIT TRAIL)
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_log_admin_actions()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the action (Record ID stored in JSON values)
    INSERT INTO Audit_Log (User_ID, Action_Type, Table_Affected, Record_ID, Old_Values, New_Values)
    VALUES (
        NULL, -- Would be populated from application context
        TG_OP,
        TG_TABLE_NAME,
        NULL, -- Record ID available in JSON values
        CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_admin_changes
AFTER INSERT OR UPDATE OR DELETE ON Admin
FOR EACH ROW
EXECUTE FUNCTION trg_log_admin_actions();

-- ==========================================================
-- 5. UPDATE MEDICINE INVENTORY ON PRESCRIPTION
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_update_inventory()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Decrease stock when medicine is prescribed
        UPDATE Medicine
        SET Stock_Quantity = Stock_Quantity - NEW.Quantity
        WHERE Medicine_ID = NEW.Medicine_ID;

        -- Check if stock is low
        IF (SELECT Stock_Quantity FROM Medicine WHERE Medicine_ID = NEW.Medicine_ID) < 10 THEN
            -- In a real system, this would send a notification
            RAISE NOTICE 'Low stock alert for Medicine ID: %', NEW.Medicine_ID;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Restore stock if prescription is deleted
        UPDATE Medicine
        SET Stock_Quantity = Stock_Quantity + OLD.Quantity
        WHERE Medicine_ID = OLD.Medicine_ID;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Adjust stock for quantity changes
        UPDATE Medicine
        SET Stock_Quantity = Stock_Quantity + (OLD.Quantity - NEW.Quantity)
        WHERE Medicine_ID = NEW.Medicine_ID;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medicine_inventory
AFTER INSERT OR UPDATE OR DELETE ON Prescription_Medicine
FOR EACH ROW
EXECUTE FUNCTION trg_update_inventory();

-- ==========================================================
-- 6. VALIDATE APPOINTMENT DATE
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_validate_appointment_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure appointment is not in the past
    IF NEW.Appointment_Date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Appointment date cannot be in the past';
    END IF;

    -- Ensure appointment is not too far in future (e.g., max 90 days)
    IF NEW.Appointment_Date > CURRENT_DATE + INTERVAL '90 days' THEN
        RAISE EXCEPTION 'Appointment date cannot be more than 90 days in the future';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_appointment_date
BEFORE INSERT OR UPDATE ON Appointment
FOR EACH ROW
EXECUTE FUNCTION trg_validate_appointment_date();

-- ==========================================================
-- 7. AUTO-UPDATE PATIENT AGE FROM DOB
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_update_patient_age()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.DOB IS NOT NULL THEN
        NEW.Age := EXTRACT(YEAR FROM AGE(NEW.DOB));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patient_age
BEFORE INSERT OR UPDATE ON Patient
FOR EACH ROW
EXECUTE FUNCTION trg_update_patient_age();

-- ==========================================================
-- 8. LOG CRITICAL DATA CHANGES
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_log_critical_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the change with full row data as JSON
    INSERT INTO Audit_Log (User_ID, Action_Type, Table_Affected, Record_ID, Old_Values, New_Values)
    VALUES (
        NULL,
        TG_OP,
        TG_TABLE_NAME,
        NULL, -- Record ID stored in JSON values instead
        CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_billing_changes
AFTER INSERT OR UPDATE OR DELETE ON Billing
FOR EACH ROW
EXECUTE FUNCTION trg_log_critical_changes();

CREATE TRIGGER log_prescription_changes
AFTER INSERT OR UPDATE OR DELETE ON Prescription
FOR EACH ROW
EXECUTE FUNCTION trg_log_critical_changes();

CREATE TRIGGER log_medical_record_changes
AFTER INSERT OR UPDATE OR DELETE ON Medical_Record
FOR EACH ROW
EXECUTE FUNCTION trg_log_critical_changes();

-- ==========================================================
-- 9. PREVENT DELETION OF ACTIVE APPOINTMENTS
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_prevent_active_appointment_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.Status IN ('Scheduled', 'Completed') THEN
        RAISE EXCEPTION 'Cannot delete active or completed appointments. Please cancel instead.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_appointment_deletion
BEFORE DELETE ON Appointment
FOR EACH ROW
EXECUTE FUNCTION trg_prevent_active_appointment_deletion();

-- ==========================================================
-- 10. UPDATE PAYMENT DATE ON BILL PAYMENT
-- ==========================================================
CREATE OR REPLACE FUNCTION trg_update_payment_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Payment_Status = 'Paid' AND (OLD.Payment_Status IS NULL OR OLD.Payment_Status != 'Paid') THEN
        NEW.Payment_Date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_date
BEFORE UPDATE ON Billing
FOR EACH ROW
EXECUTE FUNCTION trg_update_payment_date();
