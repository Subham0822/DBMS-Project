-- ==========================================================
-- MATERIALIZED VIEWS FOR REPORTING AND ANALYTICS
-- ==========================================================

-- ==========================================================
-- 1. DOCTOR PERFORMANCE REPORT
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_doctor_performance AS
SELECT
    d.Doctor_ID,
    CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
    s.Specialization_Name,
    COUNT(DISTINCT a.Appointment_ID) AS Total_Appointments,
    COUNT(DISTINCT CASE WHEN a.Status = 'Completed' THEN a.Appointment_ID END) AS Completed_Appointments,
    COUNT(DISTINCT CASE WHEN a.Status = 'Cancelled' THEN a.Appointment_ID END) AS Cancelled_Appointments,
    COUNT(DISTINCT a.Patient_ID) AS Unique_Patients,
    COALESCE(SUM(b.Total_Amount), 0) AS Total_Revenue_Generated,
    COALESCE(AVG(b.Total_Amount), 0) AS Avg_Bill_Amount,
    d.Consultation_Charges,
    d.Experience_Years
FROM Doctor d
LEFT JOIN Specialization s ON d.Specialization_ID = s.Specialization_ID
LEFT JOIN Appointment a ON d.Doctor_ID = a.Doctor_ID
LEFT JOIN Billing b ON a.Appointment_ID = b.Appointment_ID
GROUP BY d.Doctor_ID, d.First_Name, d.Last_Name, s.Specialization_Name, d.Consultation_Charges, d.Experience_Years;

CREATE UNIQUE INDEX idx_mv_doctor_performance ON mv_doctor_performance(Doctor_ID);

-- ==========================================================
-- 2. PATIENT VISIT SUMMARY
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_patient_visit_summary AS
SELECT
    p.Patient_ID,
    CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
    p.Age,
    p.Gender,
    p.Blood_Group,
    p.Contact_Number,
    COUNT(DISTINCT a.Appointment_ID) AS Total_Visits,
    MAX(a.Appointment_Date) AS Last_Visit_Date,
    MIN(a.Appointment_Date) AS First_Visit_Date,
    COUNT(DISTINCT mr.Record_ID) AS Medical_Records_Count,
    COUNT(DISTINCT pd.Disease_ID) AS Disease_Count,
    COALESCE(SUM(b.Total_Amount), 0) AS Total_Bills_Amount,
    COALESCE(SUM(CASE WHEN b.Payment_Status = 'Pending' THEN b.Total_Amount ELSE 0 END), 0) AS Pending_Bills_Amount,
    COUNT(CASE WHEN b.Payment_Status = 'Pending' THEN 1 END) AS Pending_Bills_Count
FROM Patient p
LEFT JOIN Appointment a ON p.Patient_ID = a.Patient_ID
LEFT JOIN Medical_Record mr ON p.Patient_ID = mr.Patient_ID
LEFT JOIN Patient_Disease pd ON p.Patient_ID = pd.Patient_ID
LEFT JOIN Billing b ON p.Patient_ID = b.Patient_ID
GROUP BY p.Patient_ID, p.First_Name, p.Last_Name, p.Age, p.Gender, p.Blood_Group, p.Contact_Number;

CREATE UNIQUE INDEX idx_mv_patient_visit_summary ON mv_patient_visit_summary(Patient_ID);

-- ==========================================================
-- 3. DEPARTMENT WISE STATISTICS
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_department_statistics AS
SELECT
    dep.Department_ID,
    dep.Department_Name,
    dep.Location,
    COUNT(DISTINCT s.Specialization_ID) AS Specializations_Count,
    COUNT(DISTINCT d.Doctor_ID) AS Doctors_Count,
    COUNT(DISTINCT a.Appointment_ID) AS Total_Appointments,
    COUNT(DISTINCT a.Patient_ID) AS Unique_Patients,
    COALESCE(SUM(b.Total_Amount), 0) AS Total_Revenue
FROM Department dep
LEFT JOIN Specialization s ON dep.Department_ID = s.Department_ID
LEFT JOIN Doctor d ON s.Specialization_ID = d.Specialization_ID
LEFT JOIN Appointment a ON d.Doctor_ID = a.Doctor_ID
LEFT JOIN Billing b ON a.Appointment_ID = b.Appointment_ID
GROUP BY dep.Department_ID, dep.Department_Name, dep.Location;

CREATE UNIQUE INDEX idx_mv_department_statistics ON mv_department_statistics(Department_ID);

-- ==========================================================
-- 4. REVENUE REPORT
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_revenue_report AS
SELECT
    DATE_TRUNC('month', b.Created_At) AS Month,
    COUNT(b.Bill_ID) AS Total_Bills,
    SUM(b.Total_Amount) AS Total_Revenue,
    SUM(b.Discount_Amount) AS Total_Discounts,
    SUM(b.Final_Amount) AS Net_Revenue,
    SUM(CASE WHEN b.Payment_Status = 'Paid' THEN b.Final_Amount ELSE 0 END) AS Collected_Amount,
    SUM(CASE WHEN b.Payment_Status = 'Pending' THEN b.Final_Amount ELSE 0 END) AS Pending_Amount,
    SUM(CASE WHEN b.Payment_Method = 'Cash' THEN b.Final_Amount ELSE 0 END) AS Cash_Revenue,
    SUM(CASE WHEN b.Payment_Method = 'Card' THEN b.Final_Amount ELSE 0 END) AS Card_Revenue,
    SUM(CASE WHEN b.Payment_Method = 'UPI' THEN b.Final_Amount ELSE 0 END) AS UPI_Revenue,
    SUM(CASE WHEN b.Payment_Method = 'Insurance' THEN b.Final_Amount ELSE 0 END) AS Insurance_Revenue
FROM Billing b
GROUP BY DATE_TRUNC('month', b.Created_At)
ORDER BY Month DESC;

-- ==========================================================
-- 5. ROOM OCCUPANCY REPORT
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_room_occupancy AS
SELECT
    r.Room_ID,
    r.Room_Number,
    r.Type,
    r.Availability_Status,
    r.Charges_Per_Day,
    COUNT(pr.Patient_ID) AS Total_Admissions,
    AVG(COALESCE(pr.Discharge_Date, CURRENT_DATE) - pr.Admission_Date) AS Avg_Stay_Duration,
    SUM(COALESCE(pr.Discharge_Date, CURRENT_DATE) - pr.Admission_Date) AS Total_Days_Occupied,
    MAX(pr.Admission_Date) AS Last_Admission_Date,
    SUM((COALESCE(pr.Discharge_Date, CURRENT_DATE) - pr.Admission_Date) * r.Charges_Per_Day) AS Total_Revenue
FROM Room r
LEFT JOIN Patient_Room pr ON r.Room_ID = pr.Room_ID
GROUP BY r.Room_ID, r.Room_Number, r.Type, r.Availability_Status, r.Charges_Per_Day;

CREATE UNIQUE INDEX idx_mv_room_occupancy ON mv_room_occupancy(Room_ID);

-- ==========================================================
-- 6. DISEASE PREVALENCE REPORT
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_disease_prevalence AS
SELECT
    d.Disease_ID,
    d.Disease_Name,
    d.Category,
    COUNT(DISTINCT pd.Patient_ID) AS Total_Patients,
    COUNT(CASE WHEN pd.Status = 'Active' THEN 1 END) AS Active_Cases,
    COUNT(CASE WHEN pd.Status = 'Recovered' THEN 1 END) AS Recovered_Cases,
    COUNT(CASE WHEN pd.Status = 'Chronic' THEN 1 END) AS Chronic_Cases,
    MIN(pd.Diagnosis_Date) AS First_Diagnosis_Date,
    MAX(pd.Diagnosis_Date) AS Latest_Diagnosis_Date
FROM Disease d
LEFT JOIN Patient_Disease pd ON d.Disease_ID = pd.Disease_ID
GROUP BY d.Disease_ID, d.Disease_Name, d.Category
ORDER BY Total_Patients DESC;

CREATE UNIQUE INDEX idx_mv_disease_prevalence ON mv_disease_prevalence(Disease_ID);

-- ==========================================================
-- 7. LAB TEST REPORT
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_lab_test_report AS
SELECT
    lt.Test_Name,
    COUNT(lt.Test_ID) AS Total_Tests,
    COUNT(CASE WHEN lt.Status = 'Completed' THEN 1 END) AS Completed_Tests,
    COUNT(CASE WHEN lt.Status = 'Pending' THEN 1 END) AS Pending_Tests,
    COUNT(CASE WHEN lt.Status = 'Cancelled' THEN 1 END) AS Cancelled_Tests,
    COALESCE(SUM(lt.Cost), 0) AS Total_Revenue,
    COALESCE(AVG(lt.Cost), 0) AS Avg_Cost,
    COUNT(DISTINCT lt.Patient_ID) AS Unique_Patients
FROM Lab_Test lt
GROUP BY lt.Test_Name
ORDER BY Total_Tests DESC;

-- ==========================================================
-- 8. APPOINTMENT TRENDS
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_appointment_trends AS
SELECT
    DATE_TRUNC('day', a.Appointment_Date) AS Appointment_Day,
    COUNT(a.Appointment_ID) AS Total_Appointments,
    COUNT(CASE WHEN a.Status = 'Completed' THEN 1 END) AS Completed,
    COUNT(CASE WHEN a.Status = 'Cancelled' THEN 1 END) AS Cancelled,
    COUNT(CASE WHEN a.Status = 'No-Show' THEN 1 END) AS No_Shows,
    COUNT(DISTINCT a.Patient_ID) AS Unique_Patients,
    COUNT(DISTINCT a.Doctor_ID) AS Active_Doctors
FROM Appointment a
GROUP BY DATE_TRUNC('day', a.Appointment_Date)
ORDER BY Appointment_Day DESC;

-- ==========================================================
-- 9. MEDICINE INVENTORY STATUS
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_medicine_inventory AS
SELECT
    m.Medicine_ID,
    m.Medicine_Name,
    m.Manufacturer,
    m.Dosage_Form,
    m.Unit_Price,
    m.Stock_Quantity,
    COUNT(pm.Prescription_ID) AS Times_Prescribed,
    COALESCE(SUM(pm.Quantity), 0) AS Total_Quantity_Dispensed,
    CASE
        WHEN m.Stock_Quantity = 0 THEN 'Out of Stock'
        WHEN m.Stock_Quantity < 10 THEN 'Low Stock'
        WHEN m.Stock_Quantity < 50 THEN 'Medium Stock'
        ELSE 'Well Stocked'
    END AS Stock_Status
FROM Medicine m
LEFT JOIN Prescription_Medicine pm ON m.Medicine_ID = pm.Medicine_ID
GROUP BY m.Medicine_ID, m.Medicine_Name, m.Manufacturer, m.Dosage_Form, m.Unit_Price, m.Stock_Quantity
ORDER BY m.Stock_Quantity ASC;

CREATE UNIQUE INDEX idx_mv_medicine_inventory ON mv_medicine_inventory(Medicine_ID);

-- ==========================================================
-- 10. INSURANCE CLAIMS SUMMARY
-- ==========================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_insurance_summary AS
SELECT
    i.Insurance_ID,
    i.Provider_Name,
    i.Policy_Number,
    CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
    i.Coverage_Percentage,
    i.Expiry_Date,
    COUNT(b.Bill_ID) AS Total_Bills,
    COALESCE(SUM(b.Total_Amount), 0) AS Total_Bill_Amount,
    COALESCE(SUM(b.Discount_Amount), 0) AS Total_Insurance_Coverage,
    CASE
        WHEN i.Expiry_Date < CURRENT_DATE THEN 'Expired'
        WHEN i.Expiry_Date < CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
        ELSE 'Active'
    END AS Insurance_Status
FROM Insurance i
JOIN Patient p ON i.Patient_ID = p.Patient_ID
LEFT JOIN Billing b ON i.Patient_ID = b.Patient_ID
GROUP BY i.Insurance_ID, i.Provider_Name, i.Policy_Number, p.First_Name, p.Last_Name, i.Coverage_Percentage, i.Expiry_Date;

CREATE UNIQUE INDEX idx_mv_insurance_summary ON mv_insurance_summary(Insurance_ID);

-- ==========================================================
-- REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- ==========================================================
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_doctor_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_patient_visit_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_department_statistics;
    REFRESH MATERIALIZED VIEW mv_revenue_report;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_room_occupancy;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_disease_prevalence;
    REFRESH MATERIALIZED VIEW mv_lab_test_report;
    REFRESH MATERIALIZED VIEW mv_appointment_trends;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_medicine_inventory;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_insurance_summary;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- REGULAR VIEWS FOR COMMON QUERIES
-- ==========================================================

-- View: Complete Patient Information
CREATE OR REPLACE VIEW v_patient_complete_info AS
SELECT
    p.Patient_ID,
    CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
    p.Gender,
    p.Age,
    p.DOB,
    p.Blood_Group,
    p.Contact_Number,
    p.Email,
    p.Emergency_Contact,
    CONCAT(a.Street, ', ', a.City, ', ', a.State, ', ', a.Pincode) AS Full_Address,
    i.Provider_Name AS Insurance_Provider,
    i.Policy_Number,
    i.Coverage_Percentage
FROM Patient p
LEFT JOIN Address a ON p.Address_ID = a.Address_ID
LEFT JOIN Insurance i ON p.Patient_ID = i.Patient_ID AND i.Expiry_Date >= CURRENT_DATE;

-- View: Doctor with Specialization
CREATE OR REPLACE VIEW v_doctor_details AS
SELECT
    d.Doctor_ID,
    CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
    d.Gender,
    d.Age,
    d.Qualification,
    d.Experience_Years,
    d.Consultation_Charges,
    d.Availability_Status,
    d.Contact_Number,
    d.Email,
    s.Specialization_Name,
    dep.Department_Name
FROM Doctor d
LEFT JOIN Specialization s ON d.Specialization_ID = s.Specialization_ID
LEFT JOIN Department dep ON s.Department_ID = dep.Department_ID;

-- View: Upcoming Appointments
CREATE OR REPLACE VIEW v_upcoming_appointments AS
SELECT
    a.Appointment_ID,
    a.Appointment_Date,
    a.Appointment_Time,
    CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
    p.Contact_Number AS Patient_Contact,
    CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
    s.Specialization_Name,
    a.Status,
    a.Notes
FROM Appointment a
JOIN Patient p ON a.Patient_ID = p.Patient_ID
JOIN Doctor d ON a.Doctor_ID = d.Doctor_ID
LEFT JOIN Specialization s ON d.Specialization_ID = s.Specialization_ID
WHERE a.Appointment_Date >= CURRENT_DATE AND a.Status = 'Scheduled'
ORDER BY a.Appointment_Date, a.Appointment_Time;

-- View: Pending Bills
CREATE OR REPLACE VIEW v_pending_bills AS
SELECT
    b.Bill_ID,
    CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
    p.Contact_Number,
    b.Total_Amount,
    b.Discount_Amount,
    b.Final_Amount,
    b.Created_At AS Bill_Date,
    CURRENT_DATE - b.Created_At::DATE AS Days_Pending
FROM Billing b
JOIN Patient p ON b.Patient_ID = p.Patient_ID
WHERE b.Payment_Status = 'Pending'
ORDER BY Days_Pending DESC;
