-- ==========================================================
-- DATABASE: Hospital Management System (Fully Normalized)
-- ==========================================================
-- This schema creates all tables, procedures, triggers, and views
-- for a complete Hospital Management System
-- ==========================================================

-- ==========================================================
-- 1. DEPARTMENT
-- ==========================================================
CREATE TABLE IF NOT EXISTS Department (
    Department_ID SERIAL PRIMARY KEY,
    Department_Name VARCHAR(100) NOT NULL UNIQUE,
    Location VARCHAR(100),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 2. SPECIALIZATION
-- ==========================================================
CREATE TABLE IF NOT EXISTS Specialization (
    Specialization_ID SERIAL PRIMARY KEY,
    Specialization_Name VARCHAR(100) NOT NULL UNIQUE,
    Department_ID INT,
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Department_ID) REFERENCES Department(Department_ID) ON DELETE SET NULL
);

-- ==========================================================
-- 3. DOCTOR
-- ==========================================================
CREATE TABLE IF NOT EXISTS Doctor (
    Doctor_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Gender VARCHAR(10) CHECK (Gender IN ('Male', 'Female', 'Other')),
    Age INT CHECK (Age >= 23 AND Age <= 100),
    Qualification VARCHAR(100),
    Experience_Years INT CHECK (Experience_Years >= 0),
    Consultation_Charges DECIMAL(10,2) CHECK (Consultation_Charges >= 0),
    Availability_Status VARCHAR(20) DEFAULT 'Available' CHECK (Availability_Status IN ('Available', 'Unavailable', 'On Leave')),
    Contact_Number VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Specialization_ID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Specialization_ID) REFERENCES Specialization(Specialization_ID) ON DELETE SET NULL
);

-- ==========================================================
-- 4. ADMIN
-- ==========================================================
CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Role VARCHAR(50) DEFAULT 'Admin',
    Contact_Number VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    Permissions_Level VARCHAR(20) DEFAULT 'Standard' CHECK (Permissions_Level IN ('Standard', 'Manager', 'Super')),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 5. ADDRESS
-- ==========================================================
CREATE TABLE IF NOT EXISTS Address (
    Address_ID SERIAL PRIMARY KEY,
    Street VARCHAR(100),
    City VARCHAR(50) NOT NULL,
    State VARCHAR(50) NOT NULL,
    Pincode VARCHAR(10),
    Country VARCHAR(50) DEFAULT 'India',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 6. PATIENT
-- ==========================================================
CREATE TABLE IF NOT EXISTS Patient (
    Patient_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Gender VARCHAR(10) CHECK (Gender IN ('Male', 'Female', 'Other')),
    Age INT CHECK (Age >= 0 AND Age <= 150),
    DOB DATE,
    Blood_Group VARCHAR(5) CHECK (Blood_Group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    Contact_Number VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Emergency_Contact VARCHAR(15),
    Address_ID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Address_ID) REFERENCES Address(Address_ID) ON DELETE SET NULL
);

-- ==========================================================
-- 7. DISEASE
-- ==========================================================
CREATE TABLE IF NOT EXISTS Disease (
    Disease_ID SERIAL PRIMARY KEY,
    Disease_Name VARCHAR(100) NOT NULL UNIQUE,
    Category VARCHAR(100),
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 8. PATIENT_DISEASE (M:N Junction)
-- ==========================================================
CREATE TABLE IF NOT EXISTS Patient_Disease (
    Patient_ID INT NOT NULL,
    Disease_ID INT NOT NULL,
    Diagnosis_Date DATE NOT NULL DEFAULT CURRENT_DATE,
    Status VARCHAR(20) DEFAULT 'Active' CHECK (Status IN ('Active', 'Recovered', 'Chronic', 'Under Treatment')),
    Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Patient_ID, Disease_ID, Diagnosis_Date),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    FOREIGN KEY (Disease_ID) REFERENCES Disease(Disease_ID) ON DELETE CASCADE
);

-- ==========================================================
-- 9. APPOINTMENT
-- ==========================================================
CREATE TABLE IF NOT EXISTS Appointment (
    Appointment_ID SERIAL PRIMARY KEY,
    Doctor_ID INT NOT NULL,
    Patient_ID INT NOT NULL,
    Appointment_Date DATE NOT NULL,
    Appointment_Time TIME NOT NULL,
    Status VARCHAR(20) DEFAULT 'Scheduled' CHECK (Status IN ('Scheduled', 'Completed', 'Cancelled', 'No-Show')),
    Admin_ID INT,
    Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE SET NULL,
    UNIQUE (Doctor_ID, Appointment_Date, Appointment_Time)
);

-- ==========================================================
-- 10. MEDICAL_RECORD
-- ==========================================================
CREATE TABLE IF NOT EXISTS Medical_Record (
    Record_ID SERIAL PRIMARY KEY,
    Patient_ID INT NOT NULL,
    Doctor_ID INT NOT NULL,
    Visit_Date DATE NOT NULL DEFAULT CURRENT_DATE,
    Diagnosis TEXT,
    Notes TEXT,
    Symptoms TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID) ON DELETE SET NULL
);

-- ==========================================================
-- 11. PRESCRIPTION
-- ==========================================================
CREATE TABLE IF NOT EXISTS Prescription (
    Prescription_ID SERIAL PRIMARY KEY,
    Doctor_ID INT NOT NULL,
    Patient_ID INT NOT NULL,
    Date_Issued DATE NOT NULL DEFAULT CURRENT_DATE,
    Remarks TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE
);

-- ==========================================================
-- 12. MEDICINE
-- ==========================================================
CREATE TABLE IF NOT EXISTS Medicine (
    Medicine_ID SERIAL PRIMARY KEY,
    Medicine_Name VARCHAR(100) NOT NULL UNIQUE,
    Manufacturer VARCHAR(100),
    Dosage_Form VARCHAR(50),
    Unit_Price DECIMAL(10,2) CHECK (Unit_Price >= 0),
    Stock_Quantity INT DEFAULT 0 CHECK (Stock_Quantity >= 0),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 13. PRESCRIPTION_MEDICINE (M:N Junction)
-- ==========================================================
CREATE TABLE IF NOT EXISTS Prescription_Medicine (
    Prescription_ID INT NOT NULL,
    Medicine_ID INT NOT NULL,
    Dosage VARCHAR(50),
    Frequency VARCHAR(50),
    Duration VARCHAR(50),
    Quantity INT DEFAULT 1 CHECK (Quantity > 0),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Prescription_ID, Medicine_ID),
    FOREIGN KEY (Prescription_ID) REFERENCES Prescription(Prescription_ID) ON DELETE CASCADE,
    FOREIGN KEY (Medicine_ID) REFERENCES Medicine(Medicine_ID) ON DELETE CASCADE
);

-- ==========================================================
-- 14. BILLING
-- ==========================================================
CREATE TABLE IF NOT EXISTS Billing (
    Bill_ID SERIAL PRIMARY KEY,
    Appointment_ID INT,
    Patient_ID INT NOT NULL,
    Total_Amount DECIMAL(10,2) NOT NULL CHECK (Total_Amount >= 0),
    Discount_Amount DECIMAL(10,2) DEFAULT 0 CHECK (Discount_Amount >= 0),
    Final_Amount DECIMAL(10,2) GENERATED ALWAYS AS (Total_Amount - Discount_Amount) STORED,
    Payment_Status VARCHAR(20) DEFAULT 'Pending' CHECK (Payment_Status IN ('Pending', 'Paid', 'Partial', 'Cancelled')),
    Payment_Date DATE,
    Payment_Method VARCHAR(20) CHECK (Payment_Method IN ('Cash', 'Card', 'UPI', 'Insurance', 'Bank Transfer')),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Appointment_ID) REFERENCES Appointment(Appointment_ID) ON DELETE SET NULL,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE
);

-- ==========================================================
-- 15. INSURANCE
-- ==========================================================
CREATE TABLE IF NOT EXISTS Insurance (
    Insurance_ID SERIAL PRIMARY KEY,
    Patient_ID INT NOT NULL,
    Provider_Name VARCHAR(100) NOT NULL,
    Policy_Number VARCHAR(50) NOT NULL UNIQUE,
    Coverage_Percentage DECIMAL(5,2) CHECK (Coverage_Percentage >= 0 AND Coverage_Percentage <= 100),
    Expiry_Date DATE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE
);

-- ==========================================================
-- 16. ROOM
-- ==========================================================
CREATE TABLE IF NOT EXISTS Room (
    Room_ID SERIAL PRIMARY KEY,
    Room_Number VARCHAR(20) NOT NULL UNIQUE,
    Type VARCHAR(50) CHECK (Type IN ('General Ward', 'Private', 'ICU', 'Emergency', 'Isolation')),
    Availability_Status VARCHAR(20) DEFAULT 'Available' CHECK (Availability_Status IN ('Available', 'Occupied', 'Maintenance', 'Reserved')),
    Charges_Per_Day DECIMAL(10,2) CHECK (Charges_Per_Day >= 0),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 17. PATIENT_ROOM (Room Allocation)
-- ==========================================================
CREATE TABLE IF NOT EXISTS Patient_Room (
    Patient_ID INT NOT NULL,
    Room_ID INT NOT NULL,
    Admission_Date DATE NOT NULL DEFAULT CURRENT_DATE,
    Discharge_Date DATE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Patient_ID, Room_ID, Admission_Date),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID) ON DELETE CASCADE,
    CHECK (Discharge_Date IS NULL OR Discharge_Date >= Admission_Date)
);

-- ==========================================================
-- 18. USER_LOGIN
-- ==========================================================
CREATE TABLE IF NOT EXISTS User_Login (
    User_ID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password_Hash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('Doctor', 'Patient', 'Admin')),
    Reference_ID INT NOT NULL,
    Last_Login TIMESTAMP,
    Is_Active BOOLEAN DEFAULT TRUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 19. AUDIT_LOG
-- ==========================================================
CREATE TABLE IF NOT EXISTS Audit_Log (
    Log_ID SERIAL PRIMARY KEY,
    User_ID INT,
    Action_Type VARCHAR(50) NOT NULL,
    Table_Affected VARCHAR(50),
    Record_ID INT,
    Old_Values JSONB,
    New_Values JSONB,
    Action_Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User_Login(User_ID) ON DELETE SET NULL
);

-- ==========================================================
-- 20. LAB_TEST
-- ==========================================================
CREATE TABLE IF NOT EXISTS Lab_Test (
    Test_ID SERIAL PRIMARY KEY,
    Patient_ID INT NOT NULL,
    Doctor_ID INT,
    Test_Name VARCHAR(100) NOT NULL,
    Test_Date DATE NOT NULL DEFAULT CURRENT_DATE,
    Result TEXT,
    Status VARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    Cost DECIMAL(10,2) CHECK (Cost >= 0),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID) ON DELETE SET NULL
);

-- ==========================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==========================================================
CREATE INDEX idx_doctor_specialization ON Doctor(Specialization_ID);
CREATE INDEX idx_patient_address ON Patient(Address_ID);
CREATE INDEX idx_appointment_doctor ON Appointment(Doctor_ID);
CREATE INDEX idx_appointment_patient ON Appointment(Patient_ID);
CREATE INDEX idx_appointment_date ON Appointment(Appointment_Date);
CREATE INDEX idx_medical_record_patient ON Medical_Record(Patient_ID);
CREATE INDEX idx_billing_patient ON Billing(Patient_ID);
CREATE INDEX idx_billing_status ON Billing(Payment_Status);
CREATE INDEX idx_lab_test_patient ON Lab_Test(Patient_ID);
CREATE INDEX idx_user_login_role ON User_Login(Role, Reference_ID);

-- ==========================================================
-- UPDATE TIMESTAMP TRIGGER FUNCTION
-- ==========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Updated_At = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables
CREATE TRIGGER update_department_timestamp BEFORE UPDATE ON Department FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_specialization_timestamp BEFORE UPDATE ON Specialization FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctor_timestamp BEFORE UPDATE ON Doctor FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_timestamp BEFORE UPDATE ON Admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_address_timestamp BEFORE UPDATE ON Address FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_timestamp BEFORE UPDATE ON Patient FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disease_timestamp BEFORE UPDATE ON Disease FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointment_timestamp BEFORE UPDATE ON Appointment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_record_timestamp BEFORE UPDATE ON Medical_Record FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prescription_timestamp BEFORE UPDATE ON Prescription FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_timestamp BEFORE UPDATE ON Medicine FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_timestamp BEFORE UPDATE ON Billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_timestamp BEFORE UPDATE ON Insurance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_timestamp BEFORE UPDATE ON Room FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_login_timestamp BEFORE UPDATE ON User_Login FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_test_timestamp BEFORE UPDATE ON Lab_Test FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
