# Testing Guide - Hospital Management System

## Complete Testing Checklist

This guide helps you verify that all features work correctly.

---

## 1. Database Setup Verification

### Check Tables
```sql
-- Should return 20
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Tables** (20):
- Address
- Admin
- Appointment
- Audit_Log
- Billing
- Department
- Disease
- Doctor
- Insurance
- Lab_Test
- Medical_Record
- Medicine
- Patient
- Patient_Disease
- Patient_Room
- Prescription
- Prescription_Medicine
- Room
- Specialization
- User_Login

### Check Procedures
```sql
-- List all procedures
SELECT routine_name
FROM information_schema.routines
WHERE routine_type = 'FUNCTION'
AND routine_schema = 'public'
ORDER BY routine_name;
```

**Expected Procedures** (10+):
- assign_room
- book_appointment
- cancel_appointment
- create_prescription
- discharge_patient
- generate_bill
- get_available_doctors
- get_doctor_schedule
- get_patient_history
- search_patients
- refresh_all_materialized_views

### Check Triggers
```sql
-- List all triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
```

**Expected Triggers** (10+):
- check_doctor_availability
- generate_bill_on_completion
- update_room_status
- log_admin_changes
- update_medicine_inventory
- validate_appointment_date
- update_patient_age
- log_billing_changes
- prevent_appointment_deletion
- update_payment_date

### Check Views
```sql
-- List materialized views
SELECT matviewname FROM pg_matviews;

-- List regular views
SELECT viewname FROM pg_views WHERE schemaname = 'public';
```

**Expected Materialized Views** (10):
- mv_appointment_trends
- mv_department_statistics
- mv_disease_prevalence
- mv_doctor_performance
- mv_insurance_summary
- mv_lab_test_report
- mv_medicine_inventory
- mv_patient_visit_summary
- mv_revenue_report
- mv_room_occupancy

**Expected Regular Views** (4):
- v_doctor_details
- v_patient_complete_info
- v_pending_bills
- v_upcoming_appointments

---

## 2. Test Stored Procedures

### Test book_appointment()
```sql
-- Book a valid appointment
SELECT * FROM book_appointment(
    p_doctor_id := 1,
    p_patient_id := 1,
    p_appointment_date := CURRENT_DATE + INTERVAL '7 days',
    p_appointment_time := '10:00:00',
    p_admin_id := 1,
    p_notes := 'Regular checkup'
);

-- Expected: success = true, message = 'Appointment booked successfully'
```

### Test generate_bill()
```sql
-- Generate a bill
SELECT * FROM generate_bill(
    p_patient_id := 1,
    p_consultation_charges := 1500,
    p_medicine_charges := 500,
    p_lab_charges := 800
);

-- Expected: success = true, bill created with insurance discount
```

### Test get_patient_history()
```sql
SELECT * FROM get_patient_history(1);

-- Expected: Complete patient statistics
```

### Test assign_room()
```sql
-- Assign a private room
SELECT * FROM assign_room(
    p_patient_id := 2,
    p_room_type := 'Private'
);

-- Expected: success = true, room assigned
```

### Test get_available_doctors()
```sql
-- Get all available doctors
SELECT * FROM get_available_doctors();

-- Get doctors by specialization
SELECT * FROM get_available_doctors('Cardiology');

-- Expected: List of available doctors
```

### Test search_patients()
```sql
-- Search by name
SELECT * FROM search_patients('Priya');

-- Search by phone
SELECT * FROM search_patients('9876');

-- Expected: Matching patient records
```

---

## 3. Test Triggers

### Test Double Booking Prevention
```sql
-- Try to book at same time (should fail)
SELECT * FROM book_appointment(
    p_doctor_id := 1,
    p_patient_id := 2,
    p_appointment_date := CURRENT_DATE + INTERVAL '7 days',
    p_appointment_time := '10:00:00'  -- Same time as earlier
);

-- Expected: Error - "Doctor already has an appointment at this time"
```

### Test Auto-Billing
```sql
-- Complete an appointment (should auto-generate bill)
UPDATE Appointment
SET Status = 'Completed'
WHERE Appointment_ID = 1;

-- Check if bill was created
SELECT * FROM Billing
WHERE Appointment_ID = 1;

-- Expected: Bill automatically created
```

### Test Room Status Update
```sql
-- Check room status before admission
SELECT Room_Number, Availability_Status
FROM Room
WHERE Room_ID = 1;

-- Admit patient
INSERT INTO Patient_Room (Patient_ID, Room_ID, Admission_Date)
VALUES (3, 1, CURRENT_DATE);

-- Check room status after admission
SELECT Room_Number, Availability_Status
FROM Room
WHERE Room_ID = 1;

-- Expected: Status changed to 'Occupied'
```

### Test Medicine Inventory Update
```sql
-- Check medicine stock before
SELECT Medicine_Name, Stock_Quantity
FROM Medicine
WHERE Medicine_ID = 1;

-- Add prescription medicine
INSERT INTO Prescription_Medicine
(Prescription_ID, Medicine_ID, Dosage, Frequency, Duration, Quantity)
VALUES (1, 1, '5mg', 'Once daily', '30 days', 30);

-- Check stock after
SELECT Medicine_Name, Stock_Quantity
FROM Medicine
WHERE Medicine_ID = 1;

-- Expected: Stock decreased by 30
```

### Test Age Auto-Calculation
```sql
-- Insert patient with DOB (age should auto-calculate)
INSERT INTO Patient (First_Name, Last_Name, DOB, Gender, Contact_Number)
VALUES ('Test', 'Patient', '1990-01-01', 'Male', '+91-9999999999');

SELECT First_Name, Last_Name, DOB, Age
FROM Patient
WHERE Contact_Number = '+91-9999999999';

-- Expected: Age = 34 (or current age from 1990)
```

---

## 4. Test Views

### Test Doctor Performance View
```sql
SELECT * FROM mv_doctor_performance
ORDER BY Total_Revenue_Generated DESC
LIMIT 5;

-- Expected: Top 5 doctors by revenue
```

### Test Patient Visit Summary
```sql
SELECT * FROM mv_patient_visit_summary
WHERE Total_Visits > 0
LIMIT 5;

-- Expected: Patient statistics
```

### Test Revenue Report
```sql
SELECT * FROM mv_revenue_report
ORDER BY Month DESC
LIMIT 3;

-- Expected: Last 3 months revenue
```

### Test Room Occupancy
```sql
SELECT * FROM mv_room_occupancy
ORDER BY Total_Revenue DESC;

-- Expected: Room utilization stats
```

### Test Disease Prevalence
```sql
SELECT * FROM mv_disease_prevalence
ORDER BY Total_Patients DESC
LIMIT 5;

-- Expected: Top 5 diseases
```

---

## 5. Test Views Refresh

```sql
-- Refresh all materialized views
SELECT refresh_all_materialized_views();

-- Expected: All views refreshed successfully
```

---

## 6. Frontend Testing

### Login Test
1. Go to http://localhost:9002/login
2. Try each role:
   - **Patient**: `priya.patel@email.com` / `patient`
   - **Doctor**: `anjali.rao@medisys.in` / `doctor`
   - **Admin**: `admin@medisys.in` / `admin`

**Expected**: Successfully login and redirect to respective dashboard

### Patient Dashboard Test
1. Login as patient
2. Check:
   - [ ] Dashboard shows stats
   - [ ] Can view appointments
   - [ ] Can book new appointment
   - [ ] Can view medical history
   - [ ] Can view bills

### Doctor Dashboard Test
1. Login as doctor
2. Check:
   - [ ] Dashboard shows today's appointments
   - [ ] Can view patient list
   - [ ] Can view appointment history
   - [ ] Can add medical records

### Admin Dashboard Test
1. Login as admin
2. Check:
   - [ ] Can view all patients
   - [ ] Can view all doctors
   - [ ] Can manage appointments
   - [ ] Can view billing
   - [ ] Can access reports

---

## 7. API Testing

### Test Doctor API
```bash
# Get all doctors
curl http://localhost:9002/api/doctors

# Get available doctors
curl http://localhost:9002/api/doctors?available=true
```

### Test Patient API
```bash
# Get all patients
curl http://localhost:9002/api/patients

# Search patients
curl http://localhost:9002/api/patients?search=Priya
```

### Test Appointments API
```bash
# Get all appointments
curl http://localhost:9002/api/appointments

# Get patient appointments
curl http://localhost:9002/api/appointments?patientId=1
```

### Test Dashboard Stats
```bash
curl http://localhost:9002/api/dashboard/stats
```

**Expected**: All APIs return JSON data

---

## 8. Edge Cases Testing

### Test Invalid Data
```sql
-- Try to insert patient with invalid blood group (should fail)
INSERT INTO Patient (First_Name, Last_Name, Blood_Group, Contact_Number)
VALUES ('Test', 'Invalid', 'XY+', '+91-8888888888');

-- Expected: Error - violates check constraint
```

### Test Past Appointment
```sql
-- Try to book appointment in past (should fail)
SELECT * FROM book_appointment(
    p_doctor_id := 1,
    p_patient_id := 1,
    p_appointment_date := CURRENT_DATE - INTERVAL '1 day',
    p_appointment_time := '10:00:00'
);

-- Expected: Error - "Appointment date cannot be in the past"
```

### Test Negative Price
```sql
-- Try to create medicine with negative price (should fail)
INSERT INTO Medicine (Medicine_Name, Unit_Price)
VALUES ('Test Medicine', -100);

-- Expected: Error - violates check constraint
```

---

## 9. Audit Log Testing

```sql
-- Make some changes
UPDATE Admin SET Role = 'Manager' WHERE Admin_ID = 1;
INSERT INTO Billing (Patient_ID, Total_Amount) VALUES (1, 1000);
DELETE FROM Disease WHERE Disease_ID = 100;  -- if exists

-- Check audit log
SELECT * FROM Audit_Log
ORDER BY Action_Timestamp DESC
LIMIT 10;

-- Expected: All changes logged with old and new values
```

---

## 10. Performance Testing

### Test Index Usage
```sql
-- Explain query plan (should use index)
EXPLAIN SELECT * FROM Appointment WHERE Doctor_ID = 1;

-- Expected: Shows index scan, not sequential scan
```

### Test View Performance
```sql
-- Time a complex query
EXPLAIN ANALYZE
SELECT * FROM mv_doctor_performance
WHERE Total_Appointments > 5;

-- Expected: Fast execution (<10ms for small dataset)
```

---

## Success Criteria

### Database ✅
- [ ] All 20 tables created
- [ ] All 10+ procedures working
- [ ] All 10+ triggers functioning
- [ ] All 10 materialized views created
- [ ] All 4 regular views working
- [ ] Sample data loaded (100+ rows)
- [ ] Indexes created
- [ ] Constraints enforced

### Functionality ✅
- [ ] Can book appointments
- [ ] Can generate bills
- [ ] Can assign rooms
- [ ] Can search patients
- [ ] Can create prescriptions
- [ ] Double booking prevented
- [ ] Auto-billing works
- [ ] Inventory updates automatically
- [ ] Audit logging active

### Frontend ✅
- [ ] All pages load
- [ ] Can login with all roles
- [ ] Dashboards display correctly
- [ ] Forms work
- [ ] Data displays from database
- [ ] No console errors

### API ✅
- [ ] All endpoints respond
- [ ] Data returned correctly
- [ ] Error handling works
- [ ] Type safety maintained

---

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Run schema.sql again

### Issue: "function does not exist"
**Solution**: Run procedures.sql

### Issue: No data in tables
**Solution**: Run seed.sql

### Issue: Views not refreshing
**Solution**: Run `SELECT refresh_all_materialized_views();`

### Issue: Cannot connect from frontend
**Solution**: Check .env.local has correct Supabase credentials

---

## Final Validation

Run this complete test:

```sql
-- 1. Check counts
SELECT
    (SELECT COUNT(*) FROM Department) as departments,
    (SELECT COUNT(*) FROM Doctor) as doctors,
    (SELECT COUNT(*) FROM Patient) as patients,
    (SELECT COUNT(*) FROM Appointment) as appointments,
    (SELECT COUNT(*) FROM Billing) as bills,
    (SELECT COUNT(*) FROM Lab_Test) as lab_tests;

-- 2. Test a procedure
SELECT * FROM get_available_doctors() LIMIT 1;

-- 3. Check a materialized view
SELECT COUNT(*) FROM mv_doctor_performance;

-- 4. Verify audit log
SELECT COUNT(*) FROM Audit_Log;
```

**All queries should return data without errors.**

---

## Demonstration Script

For evaluation, demonstrate in this order:

1. **Show Database Structure**
   - Show all 20 tables in Supabase
   - Show stored procedures list
   - Show triggers list
   - Show materialized views

2. **Demonstrate Normalization**
   - Explain patient-address relationship
   - Show patient-disease M:N junction
   - Explain prescription-medicine junction

3. **Run Stored Procedures**
   - Book appointment
   - Generate bill
   - Assign room

4. **Trigger in Action**
   - Complete appointment → auto-bill
   - Add prescription → inventory update
   - Admit patient → room status change

5. **Show Materialized Views**
   - Doctor performance report
   - Revenue report
   - Room occupancy

6. **Frontend Demo**
   - Login as each role
   - Book appointment from UI
   - View reports

7. **Audit Trail**
   - Show audit log entries
   - Explain backup/restoration capability

**Total Demo Time**: 10-15 minutes

---

This testing guide ensures 100% functionality verification!
