# Hospital Management System - DBMS Project

A comprehensive Hospital Management System built with Next.js 15, Supabase (PostgreSQL), and TypeScript. This system includes complete CRUD operations, stored procedures, triggers, materialized views, and a modern UI.

## Features

### Core Functionality
- **Doctor Management**: Complete doctor profiles with specializations and availability
- **Patient Management**: Patient registration, medical history, and disease tracking
- **Appointment System**: Book, cancel, and manage appointments with conflict prevention
- **Billing & Insurance**: Automated billing with insurance claim processing
- **Lab Tests**: Request and manage laboratory tests
- **Room Management**: Hospital room allocation and discharge management
- **Medical Records**: Comprehensive patient medical history tracking
- **Prescription Management**: Digital prescriptions with medicine inventory tracking

### Advanced Database Features
- **Stored Procedures**: 10+ procedures for complex operations
- **Triggers**: 10+ triggers for data integrity and automation
- **Materialized Views**: 10 views for analytics and reporting
- **Normalized Schema**: Fully normalized database (3NF)
- **Audit Logging**: Complete audit trail for critical operations
- **Role-Based Access**: Doctor, Patient, and Admin roles

### Reports & Analytics
- Doctor Performance Reports
- Patient Visit Summaries
- Department Statistics
- Revenue Reports
- Room Occupancy Analysis
- Disease Prevalence Tracking
- Medicine Inventory Status
- Insurance Claims Summary

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL 15)
- **UI Components**: Radix UI, Tailwind CSS
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
DBMS-Project/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Dashboard routes
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   ├── admin/
│   │   │   ├── appointments/
│   │   │   ├── billing/
│   │   │   ├── lab-tests/
│   │   │   ├── rooms/
│   │   │   └── reports/
│   │   └── api/                  # API routes
│   │       ├── doctors/
│   │       ├── patients/
│   │       ├── appointments/
│   │       ├── billing/
│   │       ├── lab-tests/
│   │       ├── rooms/
│   │       └── reports/
│   ├── components/               # React components
│   ├── lib/
│   │   ├── supabase/            # Supabase client and API
│   │   ├── types.ts             # TypeScript types
│   │   └── utils.ts
│   └── context/                 # React Context
├── supabase/                    # Database files
│   ├── schema.sql              # Complete database schema
│   ├── procedures.sql          # Stored procedures
│   ├── triggers.sql            # Database triggers
│   ├── views.sql               # Materialized views
│   └── seed.sql                # Sample data
└── public/
```

## Database Schema

### Core Tables (20 Tables)
1. **Department** - Hospital departments
2. **Specialization** - Medical specializations
3. **Doctor** - Doctor information
4. **Admin** - Administrative staff
5. **Address** - Address details (normalized)
6. **Patient** - Patient information
7. **Disease** - Disease catalog
8. **Patient_Disease** - Patient-disease mapping (M:N)
9. **Appointment** - Appointment records
10. **Medical_Record** - Medical history
11. **Prescription** - Prescription records
12. **Medicine** - Medicine inventory
13. **Prescription_Medicine** - Prescription-medicine mapping (M:N)
14. **Billing** - Billing records
15. **Insurance** - Insurance information
16. **Room** - Hospital rooms
17. **Patient_Room** - Room allocation
18. **User_Login** - User authentication
19. **Audit_Log** - Audit trail
20. **Lab_Test** - Laboratory tests

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm/bun
- Supabase account (free tier works)
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd DBMS-Project
```

### Step 2: Install Dependencies
```bash
npm install
# or
bun install
```

### Step 3: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Run Database Setup**
   - Open Supabase SQL Editor
   - Run the following files in order:
     1. `supabase/schema.sql` - Creates all tables
     2. `supabase/procedures.sql` - Creates stored procedures
     3. `supabase/triggers.sql` - Creates triggers
     4. `supabase/views.sql` - Creates materialized views
     5. `supabase/seed.sql` - Inserts sample data

   **Important**: Run each file completely before moving to the next one.

3. **Get Supabase Credentials**
   - Go to Project Settings > API
   - Copy the following:
     - Project URL
     - `anon` public key
     - `service_role` key (for server-side operations)

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 5: Run the Development Server
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Step 6: Login

The system comes with pre-seeded users:

- **Admin**:
  - Email: `admin@medisys.in`
  - Password: `admin`

- **Doctor**:
  - Email: `anjali.rao@medisys.in`
  - Password: `doctor`

- **Patient**:
  - Email: `priya.patel@email.com`
  - Password: `patient`

## Database Features Explained

### Stored Procedures

1. **book_appointment()** - Books appointments with validation
2. **generate_bill()** - Auto-generates bills with insurance calculation
3. **get_patient_history()** - Retrieves complete patient history
4. **assign_room()** - Assigns available rooms to patients
5. **discharge_patient()** - Handles patient discharge and billing
6. **cancel_appointment()** - Cancels appointments with logging
7. **get_available_doctors()** - Lists available doctors by specialty
8. **create_prescription()** - Creates prescriptions with medicines
9. **get_doctor_schedule()** - Returns doctor's schedule
10. **search_patients()** - Searches patients by various criteria

### Triggers

1. **check_doctor_availability** - Prevents double booking
2. **generate_bill_auto** - Auto-generates bills on appointment completion
3. **update_room_status** - Updates room status on admission/discharge
4. **log_admin_actions** - Logs all admin actions for audit
5. **update_inventory** - Updates medicine stock on prescription
6. **validate_appointment_date** - Validates appointment dates
7. **update_patient_age** - Auto-calculates age from DOB
8. **log_critical_changes** - Logs changes to critical tables
9. **prevent_appointment_deletion** - Prevents deletion of active appointments
10. **update_payment_date** - Auto-sets payment date on bill payment

### Materialized Views

1. **mv_doctor_performance** - Doctor performance metrics
2. **mv_patient_visit_summary** - Patient visit statistics
3. **mv_department_statistics** - Department-wise analytics
4. **mv_revenue_report** - Monthly revenue reports
5. **mv_room_occupancy** - Room utilization stats
6. **mv_disease_prevalence** - Disease occurrence tracking
7. **mv_lab_test_report** - Lab test statistics
8. **mv_appointment_trends** - Appointment trend analysis
9. **mv_medicine_inventory** - Medicine stock status
10. **mv_insurance_summary** - Insurance claims summary

### Regular Views

- **v_patient_complete_info** - Complete patient information
- **v_doctor_details** - Doctor details with specialization
- **v_upcoming_appointments** - Upcoming appointments list
- **v_pending_bills** - Pending bills summary

## API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors?available=true` - Get available doctors
- `POST /api/doctors` - Create new doctor

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients?search=term` - Search patients
- `POST /api/patients` - Create new patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments?patientId=1` - Get patient appointments
- `POST /api/appointments` - Book appointment

### Billing
- `GET /api/billing` - Get all bills
- `GET /api/billing?patientId=1` - Get patient bills
- `POST /api/billing` - Generate bill

### Lab Tests
- `GET /api/lab-tests` - Get all lab tests
- `POST /api/lab-tests` - Create lab test

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms?available=true` - Get available rooms

### Reports
- `GET /api/reports?type=doctor-performance` - Doctor performance
- `GET /api/reports?type=revenue` - Revenue report
- `GET /api/reports?type=disease-prevalence` - Disease prevalence

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

## Running Queries and Reports

### Refresh Materialized Views

After making significant data changes, refresh the materialized views:

```sql
SELECT refresh_all_materialized_views();
```

### Example Queries

**Get doctor schedule for a week:**
```sql
SELECT * FROM get_doctor_schedule(1, '2025-11-01', '2025-11-07');
```

**Book an appointment:**
```sql
SELECT * FROM book_appointment(1, 1, '2025-11-10', '10:00:00', 1, 'Regular checkup');
```

**Generate a bill:**
```sql
SELECT * FROM generate_bill(
    p_patient_id := 1,
    p_appointment_id := 1,
    p_consultation_charges := 1500,
    p_medicine_charges := 500,
    p_lab_charges := 800
);
```

## Project Evaluation Features

This project includes all requirements for DBMS evaluation:

### ✅ Normalized Database
- All tables are in 3rd Normal Form (3NF)
- No redundant data
- Proper use of foreign keys

### ✅ Stored Procedures
- 10+ procedures for complex operations
- Parameter validation
- Error handling

### ✅ Triggers
- 10+ triggers for data integrity
- Audit logging
- Automatic calculations

### ✅ Materialized Views
- 10 materialized views for reporting
- Optimized for performance
- Regular refresh capability

### ✅ CRUD Operations
- Complete Create, Read, Update, Delete
- All operations through API
- Connected to frontend

### ✅ Backup & Restoration
- Audit log table for tracking changes
- Trigger-based logging
- Complete history of modifications

### ✅ Frontend Integration
- Modern UI with Next.js
- Role-based dashboards
- Real-time data updates

### ✅ Business Logic
- Appointment conflict prevention
- Automatic billing generation
- Insurance claim processing
- Room allocation system
- Medicine inventory management

## Contributing

This is a college DBMS project. Feel free to use as reference.

## License

MIT License - Free to use for educational purposes.

## Support

For issues or questions about setup:
1. Check that all SQL files ran successfully in Supabase
2. Verify environment variables are correct
3. Ensure you're using Node.js 18+
4. Check Supabase project is active

## Acknowledgments

- Built for DBMS Course Project
- Uses Supabase for PostgreSQL hosting
- UI components from Radix UI and Tailwind CSS

---

**Note**: This is a demonstration project for educational purposes. In production, additional security measures, authentication enhancements, and error handling would be required. 
