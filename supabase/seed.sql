-- ==========================================================
-- SEED DATA FOR HOSPITAL MANAGEMENT SYSTEM
-- ==========================================================

-- ==========================================================
-- 1. DEPARTMENTS
-- ==========================================================
INSERT INTO Department (Department_ID, Department_Name, Location) VALUES
(1, 'Cardiology', 'Building A, Floor 3'),
(2, 'Neurology', 'Building B, Floor 2'),
(3, 'Orthopedics', 'Building A, Floor 1'),
(4, 'Pediatrics', 'Building C, Floor 1'),
(5, 'Pathology', 'Building D, Floor 1'),
(6, 'General Medicine', 'Building A, Floor 2'),
(7, 'Emergency', 'Building E, Ground Floor'),
(8, 'Radiology', 'Building D, Floor 2');

-- Reset sequence for Department_ID
SELECT setval('department_department_id_seq', (SELECT MAX(Department_ID) FROM Department));

-- ==========================================================
-- 2. SPECIALIZATIONS
-- ==========================================================
INSERT INTO Specialization (Specialization_ID, Specialization_Name, Department_ID, Description) VALUES
(1, 'Cardiology', 1, 'Heart and cardiovascular system'),
(2, 'Interventional Cardiology', 1, 'Minimally invasive cardiac procedures'),
(3, 'Neurology', 2, 'Brain and nervous system disorders'),
(4, 'Neurosurgery', 2, 'Surgical treatment of neurological conditions'),
(5, 'Orthopedic Surgery', 3, 'Surgical treatment of musculoskeletal system'),
(6, 'Sports Medicine', 3, 'Treatment of sports-related injuries'),
(7, 'Pediatrics', 4, 'Medical care for infants, children, and adolescents'),
(8, 'Neonatology', 4, 'Care for newborns, especially premature infants'),
(9, 'Clinical Pathology', 5, 'Laboratory analysis and diagnostics'),
(10, 'General Medicine', 6, 'Primary care and internal medicine'),
(11, 'Emergency Medicine', 7, 'Acute care and emergency treatment'),
(12, 'Radiology', 8, 'Medical imaging and diagnostics');

-- Reset sequence
SELECT setval('specialization_specialization_id_seq', (SELECT MAX(Specialization_ID) FROM Specialization));

-- ==========================================================
-- 3. DOCTORS
-- ==========================================================
INSERT INTO Doctor (Doctor_ID, First_Name, Last_Name, Gender, Age, Qualification, Experience_Years, Consultation_Charges, Availability_Status, Contact_Number, Email, Specialization_ID) VALUES
(1, 'Anjali', 'Rao', 'Female', 42, 'MD, DM (Cardiology)', 15, 1500.00, 'Available', '+91-9876543201', 'anjali.rao@medisys.in', 1),
(2, 'Vikram', 'Gupta', 'Male', 38, 'MD (Dermatology)', 12, 1200.00, 'Available', '+91-9876543202', 'vikram.gupta@medisys.in', 10),
(3, 'Sneha', 'Reddy', 'Female', 35, 'MD (Pediatrics)', 10, 1000.00, 'Available', '+91-9876543203', 'sneha.reddy@medisys.in', 7),
(4, 'Rahul', 'Mehra', 'Male', 45, 'MD, DM (Neurology)', 18, 1800.00, 'Available', '+91-9876543204', 'rahul.mehra@medisys.in', 3),
(5, 'Priya', 'Sharma', 'Female', 40, 'MS (Orthopedics)', 14, 1400.00, 'Available', '+91-9876543205', 'priya.sharma@medisys.in', 5),
(6, 'Amit', 'Patel', 'Male', 33, 'MD (General Medicine)', 8, 800.00, 'Available', '+91-9876543206', 'amit.patel@medisys.in', 10),
(7, 'Neha', 'Chopra', 'Female', 36, 'MD (Emergency Medicine)', 11, 1100.00, 'Available', '+91-9876543207', 'neha.chopra@medisys.in', 11),
(8, 'Suresh', 'Kumar', 'Male', 50, 'MCh (Neurosurgery)', 22, 2500.00, 'Available', '+91-9876543208', 'suresh.kumar@medisys.in', 4);

-- Reset sequence
SELECT setval('doctor_doctor_id_seq', (SELECT MAX(Doctor_ID) FROM Doctor));

-- ==========================================================
-- 4. ADMINS
-- ==========================================================
INSERT INTO Admin (Admin_ID, First_Name, Last_Name, Role, Contact_Number, Email, Password_Hash, Permissions_Level) VALUES
(1, 'Rohan', 'Sharma', 'Admin', '+91-9876543211', 'admin@medisys.in', '$2a$10$YourHashedPasswordHere', 'Super'),
(2, 'Kavita', 'Singh', 'Admin', '+91-9876543212', 'kavita.singh@medisys.in', '$2a$10$YourHashedPasswordHere', 'Manager'),
(3, 'Arun', 'Verma', 'Admin', '+91-9876543213', 'arun.verma@medisys.in', '$2a$10$YourHashedPasswordHere', 'Standard');

-- Reset sequence
SELECT setval('admin_admin_id_seq', (SELECT MAX(Admin_ID) FROM Admin));

-- ==========================================================
-- 5. ADDRESSES
-- ==========================================================
INSERT INTO Address (Address_ID, Street, City, State, Pincode, Country) VALUES
(1, '12B, Linking Road', 'Mumbai', 'Maharashtra', '400050', 'India'),
(2, '45, MG Road', 'Bangalore', 'Karnataka', '560001', 'India'),
(3, '78, Connaught Place', 'New Delhi', 'Delhi', '110001', 'India'),
(4, '101, Park Street', 'Kolkata', 'West Bengal', '700016', 'India'),
(5, '23, Anna Salai', 'Chennai', 'Tamil Nadu', '600002', 'India'),
(6, '56, FC Road', 'Pune', 'Maharashtra', '411004', 'India'),
(7, '89, Residency Road', 'Bangalore', 'Karnataka', '560025', 'India'),
(8, '34, Brigade Road', 'Bangalore', 'Karnataka', '560001', 'India');

-- Reset sequence
SELECT setval('address_address_id_seq', (SELECT MAX(Address_ID) FROM Address));

-- ==========================================================
-- 6. PATIENTS
-- ==========================================================
INSERT INTO Patient (Patient_ID, First_Name, Last_Name, Gender, Age, DOB, Blood_Group, Contact_Number, Email, Emergency_Contact, Address_ID) VALUES
(1, 'Priya', 'Patel', 'Female', 34, '1990-05-15', 'O+', '+91-9876543210', 'priya.patel@email.com', '+91-9876543299', 1),
(2, 'Amit', 'Kumar', 'Male', 39, '1985-08-22', 'A+', '+91-9123456789', 'amit.kumar@email.com', '+91-9123456799', 2),
(3, 'Suresh', 'Singh', 'Male', 46, '1978-11-30', 'B+', '+91-8877665544', 'suresh.singh@email.com', '+91-8877665599', 3),
(4, 'Deepika', 'Verma', 'Female', 23, '2001-07-19', 'AB+', '+91-7766554433', 'deepika.verma@email.com', '+91-7766554499', 4),
(5, 'Rajesh', 'Nair', 'Male', 52, '1972-03-10', 'O-', '+91-9988776655', 'rajesh.nair@email.com', '+91-9988776699', 5),
(6, 'Lakshmi', 'Iyer', 'Female', 28, '1996-12-05', 'A-', '+91-8899001122', 'lakshmi.iyer@email.com', '+91-8899001199', 6),
(7, 'Arjun', 'Desai', 'Male', 41, '1983-09-18', 'B-', '+91-7788990011', 'arjun.desai@email.com', '+91-7788990099', 7),
(8, 'Meera', 'Chatterjee', 'Female', 35, '1989-02-28', 'AB-', '+91-6677889900', 'meera.chatterjee@email.com', '+91-6677889999', 8);

-- Reset sequence
SELECT setval('patient_patient_id_seq', (SELECT MAX(Patient_ID) FROM Patient));

-- ==========================================================
-- 7. DISEASES
-- ==========================================================
INSERT INTO Disease (Disease_ID, Disease_Name, Category, Description) VALUES
(1, 'Hypertension', 'Cardiovascular', 'High blood pressure condition'),
(2, 'Type 2 Diabetes', 'Metabolic', 'Chronic condition affecting blood sugar levels'),
(3, 'Asthma', 'Respiratory', 'Chronic inflammatory disease of airways'),
(4, 'Migraine', 'Neurological', 'Recurring headache disorder'),
(5, 'Osteoarthritis', 'Musculoskeletal', 'Degenerative joint disease'),
(6, 'Common Cold', 'Infectious', 'Viral infection of upper respiratory tract'),
(7, 'Influenza', 'Infectious', 'Viral infection causing fever and respiratory symptoms'),
(8, 'Gastritis', 'Gastrointestinal', 'Inflammation of stomach lining'),
(9, 'Anemia', 'Hematological', 'Deficiency of red blood cells or hemoglobin'),
(10, 'Thyroid Disorder', 'Endocrine', 'Disorder of thyroid gland function');

-- Reset sequence
SELECT setval('disease_disease_id_seq', (SELECT MAX(Disease_ID) FROM Disease));

-- ==========================================================
-- 8. PATIENT_DISEASE
-- ==========================================================
INSERT INTO Patient_Disease (Patient_ID, Disease_ID, Diagnosis_Date, Status, Notes) VALUES
(1, 1, '2023-01-15', 'Chronic', 'Well controlled with medication'),
(1, 2, '2023-03-20', 'Chronic', 'Monitoring blood sugar levels'),
(2, 5, '2024-02-10', 'Under Treatment', 'Physical therapy ongoing'),
(3, 1, '2022-11-05', 'Chronic', 'Medication adjusted recently'),
(4, 3, '2024-01-08', 'Active', 'Using inhaler as needed'),
(5, 4, '2023-06-15', 'Chronic', 'Preventive medication prescribed'),
(6, 9, '2024-05-20', 'Under Treatment', 'Iron supplements prescribed'),
(7, 8, '2024-06-01', 'Recovered', 'Completed treatment successfully'),
(8, 10, '2023-09-10', 'Chronic', 'Regular thyroid medication');

-- ==========================================================
-- 9. APPOINTMENTS
-- ==========================================================
INSERT INTO Appointment (Appointment_ID, Doctor_ID, Patient_ID, Appointment_Date, Appointment_Time, Status, Admin_ID, Notes) VALUES
(1, 1, 1, CURRENT_DATE + INTERVAL '4 days', '10:00:00', 'Scheduled', 1, 'Routine checkup for hypertension'),
(2, 2, 2, CURRENT_DATE + INTERVAL '5 days', '14:30:00', 'Scheduled', 1, 'Follow-up consultation'),
(3, 3, 4, CURRENT_DATE + INTERVAL '4 days', '11:00:00', 'Scheduled', 2, 'Asthma management'),
(4, 4, 5, CURRENT_DATE + INTERVAL '6 days', '09:00:00', 'Scheduled', 1, 'Migraine consultation'),
(5, 5, 2, CURRENT_DATE + INTERVAL '7 days', '15:00:00', 'Scheduled', 2, 'Orthopedic assessment'),
(6, 1, 1, CURRENT_DATE + INTERVAL '17 days', '10:00:00', 'Completed', 1, 'Previous checkup'),
(7, 3, 4, CURRENT_DATE + INTERVAL '42 days', '11:00:00', 'Completed', 1, 'Initial consultation'),
(8, 6, 6, CURRENT_DATE + INTERVAL '4 days', '16:00:00', 'Scheduled', 3, 'General health checkup'),
(9, 7, 3, CURRENT_DATE + INTERVAL '5 days', '10:30:00', 'Scheduled', 2, 'Emergency follow-up'),
(10, 8, 7, CURRENT_DATE + INTERVAL '8 days', '14:00:00', 'Scheduled', 1, 'Neurosurgery consultation');

-- Reset sequence
SELECT setval('appointment_appointment_id_seq', (SELECT MAX(Appointment_ID) FROM Appointment));

-- ==========================================================
-- 10. MEDICAL_RECORDS
-- ==========================================================
INSERT INTO Medical_Record (Patient_ID, Doctor_ID, Visit_Date, Diagnosis, Notes, Symptoms) VALUES
(1, 1, '2024-10-15', 'Controlled Hypertension', 'Blood pressure stable. Continue current medication.', 'None reported'),
(4, 3, '2024-09-20', 'Mild Asthma', 'Prescribed inhaler. Avoid allergens.', 'Shortness of breath, wheezing'),
(2, 5, '2024-08-10', 'Osteoarthritis - Knee', 'Recommended physiotherapy and pain management.', 'Knee pain, stiffness'),
(6, 6, '2024-07-05', 'Iron Deficiency Anemia', 'Prescribed iron supplements and dietary changes.', 'Fatigue, weakness'),
(7, 2, '2024-06-01', 'Gastritis', 'Prescribed antacids. Dietary modifications advised.', 'Stomach pain, acidity'),
(1, 1, '2024-05-20', 'Type 2 Diabetes - Early Stage', 'Lifestyle modifications and metformin prescribed.', 'Increased thirst, frequent urination'),
(5, 4, '2024-04-15', 'Chronic Migraine', 'Preventive medication prescribed.', 'Severe headache, sensitivity to light'),
(8, 6, '2024-03-10', 'Hypothyroidism', 'Thyroid hormone replacement therapy initiated.', 'Fatigue, weight gain, cold intolerance');

-- ==========================================================
-- 11. MEDICINES
-- ==========================================================
INSERT INTO Medicine (Medicine_ID, Medicine_Name, Manufacturer, Dosage_Form, Unit_Price, Stock_Quantity) VALUES
(1, 'Amlodipine 5mg', 'Cipla', 'Tablet', 2.50, 500),
(2, 'Metformin 500mg', 'Sun Pharma', 'Tablet', 1.50, 1000),
(3, 'Salbutamol Inhaler', 'GSK', 'Inhaler', 150.00, 50),
(4, 'Paracetamol 500mg', 'Micro Labs', 'Tablet', 0.50, 2000),
(5, 'Ibuprofen 400mg', 'Dr. Reddys', 'Tablet', 3.00, 800),
(6, 'Omeprazole 20mg', 'Lupin', 'Capsule', 5.00, 600),
(7, 'Levothyroxine 50mcg', 'Abbott', 'Tablet', 4.00, 400),
(8, 'Ferrous Sulfate 200mg', 'Alkem', 'Tablet', 2.00, 700),
(9, 'Atorvastatin 10mg', 'Ranbaxy', 'Tablet', 6.00, 500),
(10, 'Aspirin 75mg', 'Bayer', 'Tablet', 1.00, 1500),
(11, 'Sumatriptan 50mg', 'Zydus', 'Tablet', 25.00, 200),
(12, 'Diclofenac Gel', 'Novartis', 'Topical', 120.00, 100);

-- Reset sequence
SELECT setval('medicine_medicine_id_seq', (SELECT MAX(Medicine_ID) FROM Medicine));

-- ==========================================================
-- 12. PRESCRIPTIONS
-- ==========================================================
INSERT INTO Prescription (Prescription_ID, Doctor_ID, Patient_ID, Date_Issued, Remarks) VALUES
(1, 1, 1, '2024-10-15', 'Continue medication. Review in 3 months.'),
(2, 3, 4, '2024-09-20', 'Use inhaler as needed. Avoid triggers.'),
(3, 5, 2, '2024-08-10', 'Pain management and physiotherapy.'),
(4, 6, 6, '2024-07-05', 'Take iron supplements with food.'),
(5, 2, 7, '2024-06-01', 'Take before meals. Avoid spicy food.'),
(6, 1, 1, '2024-05-20', 'Diabetes management. Diet and exercise important.'),
(7, 4, 5, '2024-04-15', 'Preventive migraine treatment.'),
(8, 6, 8, '2024-03-10', 'Thyroid hormone replacement. Take on empty stomach.');

-- Reset sequence
SELECT setval('prescription_prescription_id_seq', (SELECT MAX(Prescription_ID) FROM Prescription));

-- ==========================================================
-- 13. PRESCRIPTION_MEDICINE
-- ==========================================================
INSERT INTO Prescription_Medicine (Prescription_ID, Medicine_ID, Dosage, Frequency, Duration, Quantity) VALUES
(1, 1, '5mg', 'Once daily', '3 months', 90),
(1, 10, '75mg', 'Once daily', '3 months', 90),
(2, 3, '2 puffs', 'As needed', '1 month', 1),
(3, 5, '400mg', 'Twice daily', '2 weeks', 28),
(3, 12, 'Apply', 'Thrice daily', '2 weeks', 1),
(4, 8, '200mg', 'Once daily', '3 months', 90),
(5, 6, '20mg', 'Once daily', '1 month', 30),
(6, 2, '500mg', 'Twice daily', '3 months', 180),
(6, 1, '5mg', 'Once daily', '3 months', 90),
(7, 11, '50mg', 'As needed', '1 month', 10),
(8, 7, '50mcg', 'Once daily', '3 months', 90);

-- ==========================================================
-- 14. ROOMS
-- ==========================================================
INSERT INTO Room (Room_ID, Room_Number, Type, Availability_Status, Charges_Per_Day) VALUES
(1, '101', 'Private', 'Available', 3000.00),
(2, '102', 'Private', 'Occupied', 3000.00),
(3, '103', 'Private', 'Available', 3000.00),
(4, '201', 'General Ward', 'Available', 1500.00),
(5, '202', 'General Ward', 'Available', 1500.00),
(6, '203', 'General Ward', 'Occupied', 1500.00),
(7, '301', 'ICU', 'Occupied', 8000.00),
(8, '302', 'ICU', 'Available', 8000.00),
(9, '401', 'Emergency', 'Available', 2000.00),
(10, '402', 'Emergency', 'Available', 2000.00);

-- Reset sequence
SELECT setval('room_room_id_seq', (SELECT MAX(Room_ID) FROM Room));

-- ==========================================================
-- 15. PATIENT_ROOM
-- ==========================================================
INSERT INTO Patient_Room (Patient_ID, Room_ID, Admission_Date, Discharge_Date) VALUES
(2, 2, CURRENT_DATE - INTERVAL '4 days', NULL),
(3, 6, CURRENT_DATE - INTERVAL '2 days', NULL),
(5, 7, CURRENT_DATE - INTERVAL '7 days', NULL),
(1, 1, CURRENT_DATE - INTERVAL '165 days', CURRENT_DATE - INTERVAL '160 days'),
(6, 4, CURRENT_DATE - INTERVAL '118 days', CURRENT_DATE - INTERVAL '115 days');

-- ==========================================================
-- 16. INSURANCE
-- ==========================================================
INSERT INTO Insurance (Patient_ID, Provider_Name, Policy_Number, Coverage_Percentage, Expiry_Date) VALUES
(1, 'Star Health Insurance', 'STAR2024001', 80.00, CURRENT_DATE + INTERVAL '14 months'),
(2, 'HDFC ERGO', 'HDFC2024002', 70.00, CURRENT_DATE + INTERVAL '7 months'),
(5, 'ICICI Lombard', 'ICICI2024003', 75.00, CURRENT_DATE + INTERVAL '16 months'),
(6, 'Bajaj Allianz', 'BAJAJ2024004', 60.00, CURRENT_DATE + INTERVAL '13 months'),
(8, 'Max Bupa', 'MAX2024005', 85.00, CURRENT_DATE + INTERVAL '22 months');

-- ==========================================================
-- 17. BILLING
-- ==========================================================
-- Note: Bills for completed Appointments (6 and 7) are auto-generated by trigger
-- Update those bills to set payment status and other details
UPDATE Billing SET Payment_Status = 'Paid', Payment_Date = '2024-10-15', Payment_Method = 'Insurance'
WHERE Appointment_ID = 6;

UPDATE Billing SET Payment_Status = 'Paid', Payment_Date = '2024-09-20', Payment_Method = 'Card'
WHERE Appointment_ID = 7;

-- Insert additional bills not tied to appointments
INSERT INTO Billing (Appointment_ID, Patient_ID, Total_Amount, Discount_Amount, Payment_Status, Payment_Date, Payment_Method) VALUES
(NULL, 2, 3500.00, 525.00, 'Pending', NULL, NULL),
(NULL, 6, 800.00, 0.00, 'Paid', '2024-07-05', 'UPI'),
(NULL, 7, 1200.00, 0.00, 'Paid', '2024-06-01', 'Cash'),
(NULL, 1, 2000.00, 1600.00, 'Paid', '2024-05-25', 'Insurance'),
(NULL, 5, 1800.00, 1350.00, 'Pending', NULL, NULL);

-- ==========================================================
-- 18. LAB_TESTS
-- ==========================================================
INSERT INTO Lab_Test (Patient_ID, Doctor_ID, Test_Name, Test_Date, Result, Status, Cost) VALUES
(1, 1, 'Complete Blood Count (CBC)', '2024-10-14', 'All values within normal range', 'Completed', 500.00),
(1, 1, 'Lipid Panel', '2024-10-14', 'Total Cholesterol: 190 mg/dL, LDL: 110 mg/dL', 'Completed', 700.00),
(4, 3, 'Pulmonary Function Test', '2024-09-19', 'Mild obstruction noted', 'Completed', 1200.00),
(6, 6, 'Iron Studies', '2024-07-04', 'Serum Iron: 40 mcg/dL (Low)', 'Completed', 600.00),
(8, 6, 'Thyroid Function Test', '2024-03-09', 'TSH: 8.5 mIU/L (High)', 'Completed', 800.00),
(1, 1, 'HbA1c', '2025-11-04', NULL, 'Pending', 600.00),
(3, 7, 'ECG', '2025-11-05', NULL, 'Pending', 400.00),
(5, 4, 'MRI Brain', '2025-11-06', NULL, 'In Progress', 5000.00);

-- ==========================================================
-- 19. USER_LOGIN
-- ==========================================================
INSERT INTO User_Login (Username, Password_Hash, Role, Reference_ID, Is_Active) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'Admin', 1, TRUE),
('dr.anjali', '$2a$10$YourHashedPasswordHere', 'Doctor', 1, TRUE),
('dr.vikram', '$2a$10$YourHashedPasswordHere', 'Doctor', 2, TRUE),
('dr.sneha', '$2a$10$YourHashedPasswordHere', 'Doctor', 3, TRUE),
('dr.rahul', '$2a$10$YourHashedPasswordHere', 'Doctor', 4, TRUE),
('patient001', '$2a$10$YourHashedPasswordHere', 'Patient', 1, TRUE),
('patient002', '$2a$10$YourHashedPasswordHere', 'Patient', 2, TRUE),
('patient003', '$2a$10$YourHashedPasswordHere', 'Patient', 3, TRUE);

-- ==========================================================
-- REFRESH ALL MATERIALIZED VIEWS
-- ==========================================================
SELECT refresh_all_materialized_views();
