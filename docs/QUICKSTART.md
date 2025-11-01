# 🚀 QUICKSTART - Get Running in 10 Minutes

## What You'll Build
A complete Hospital Management System with:
- ✅ 20 normalized database tables
- ✅ 10 stored procedures
- ✅ 10 triggers
- ✅ 10 materialized views
- ✅ Working Next.js frontend
- ✅ Real-time data from PostgreSQL

---

## Setup (3 Steps)

### Step 1: Setup Supabase Database (5 min)

1. **Create Project**
   - Go to https://supabase.com
   - Sign up/Login
   - Click "New Project"
   - Name: `Hospital-Management-System`
   - Create strong password (save it!)
   - Choose region closest to you
   - Click "Create"
   - Wait 2-3 minutes

2. **Run SQL Files** (in Supabase SQL Editor)
   - Click "SQL Editor" in left sidebar
   - For each file below, click "New query", copy file contents, paste, click "Run"

   **Run in this EXACT order**:
   1. `supabase/schema.sql` ✅ Creates tables
   2. `supabase/procedures.sql` ✅ Creates functions
   3. `supabase/triggers.sql` ✅ Creates automation
   4. `supabase/views.sql` ✅ Creates reports
   5. `supabase/seed.sql` ✅ Adds sample data

   **Verify**: Check "Table Editor" - you should see 20 tables with data

3. **Get API Keys**
   - Click "Settings" (gear icon)
   - Click "API"
   - Copy these 3 values (you'll need them next):
     - Project URL
     - `anon` `public` key
     - `service_role` key (click "Reveal")

### Step 2: Configure Project (2 min)

1. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Setup Environment**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```

3. **Edit .env.local** (paste your Supabase keys from Step 1)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

### Step 3: Run! (1 min)

```bash
npm run dev
# or
bun dev
```

Open http://localhost:9002

---

## Login Credentials

Try all 3 roles:

| Role | Email | Password |
|------|-------|----------|
| 👨‍⚕️ Doctor | `anjali.rao@medisys.in` | `doctor` |
| 🏥 Patient | `priya.patel@email.com` | `patient` |
| 👔 Admin | `admin@medisys.in` | `admin` |

---

## Quick Test Checklist

After setup, verify these work:

### In Supabase SQL Editor:
```sql
-- Should return 8
SELECT COUNT(*) FROM Patient;

-- Should return list of doctors
SELECT * FROM get_available_doctors();

-- Should return performance metrics
SELECT * FROM mv_doctor_performance LIMIT 3;
```

### In Frontend (http://localhost:9002):
- [ ] Can login as all 3 roles
- [ ] Patient can view appointments
- [ ] Doctor can see patient list
- [ ] Admin can access reports
- [ ] No console errors

---

## What's Included

### Database Features
- **Normalized Schema**: All tables in 3NF
- **Stored Procedures**: Book appointments, generate bills, assign rooms, etc.
- **Triggers**: Auto-billing, inventory updates, audit logging
- **Materialized Views**: Doctor performance, revenue reports, disease tracking
- **Sample Data**: 100+ realistic records ready for testing

### Frontend Features
- **Role-Based Dashboards**: Different UI for Doctor/Patient/Admin
- **Appointment System**: Book, view, cancel appointments
- **Billing**: Auto-generate bills with insurance calculations
- **Medical Records**: Complete patient history tracking
- **Reports**: Analytics dashboards with charts
- **Room Management**: Assign and track hospital rooms

---

## File Structure

```
DBMS-Project/
├── supabase/              # Database files (run these first!)
│   ├── schema.sql         # 1. Tables
│   ├── procedures.sql     # 2. Functions
│   ├── triggers.sql       # 3. Automation
│   ├── views.sql          # 4. Reports
│   └── seed.sql           # 5. Data
├── src/
│   ├── lib/supabase/      # Database connection
│   ├── app/api/           # API endpoints
│   └── app/(dashboard)/   # Frontend pages
├── .env.local             # Your Supabase keys (create this!)
└── README.md              # Full documentation
```

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists
- Check you copied `.env.example` correctly
- Verify all 3 environment variables are set
- Restart dev server: `npm run dev`

### "relation does not exist"
- You didn't run `schema.sql` or it failed
- Re-run all SQL files in order

### "function does not exist"
- You didn't run `procedures.sql`
- Re-run it in SQL Editor

### No data showing
- Run `seed.sql` again
- Check for errors in Supabase SQL Editor

### Can't login
- Make sure you ran `seed.sql` (creates users)
- Check browser console for errors
- Verify API keys in `.env.local`

---

## Next Steps

Once running:

1. **Explore the Database**
   - Open Supabase Table Editor
   - View the 20 tables and relationships
   - Try the SQL queries in TESTING_GUIDE.md

2. **Test Features**
   - Book an appointment as Patient
   - View patient list as Doctor
   - Check reports as Admin

3. **Read Documentation**
   - `README.md` - Complete overview
   - `SETUP_GUIDE.md` - Detailed setup
   - `TESTING_GUIDE.md` - Testing checklist
   - `PROJECT_SUMMARY.md` - Architecture details

---

## For DBMS Evaluation

This project demonstrates:

✅ **Normalized Database** - All tables in 3NF
✅ **10+ Stored Procedures** - Complex business logic
✅ **10+ Triggers** - Automation and integrity
✅ **10+ Materialized Views** - Reporting and analytics
✅ **Complete CRUD** - All operations working
✅ **Backup/Audit System** - Audit_Log table with triggers
✅ **Frontend Integration** - Real-time data display
✅ **Sample Data** - Ready for demonstration

**Evaluation Demo Script**: See TESTING_GUIDE.md section "Demonstration Script"

---

## Common SQL Queries for Demo

```sql
-- Show all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- Test appointment booking
SELECT * FROM book_appointment(1, 1, CURRENT_DATE + 5, '10:00:00');

-- Generate a bill
SELECT * FROM generate_bill(
    p_patient_id := 1,
    p_consultation_charges := 1500
);

-- View doctor performance
SELECT * FROM mv_doctor_performance;

-- Check audit log
SELECT * FROM Audit_Log ORDER BY Action_Timestamp DESC LIMIT 5;
```

---

## Help & Support

- **Setup Issues**: See SETUP_GUIDE.md
- **Database Errors**: Check Supabase SQL Editor for error messages
- **Testing**: Use TESTING_GUIDE.md checklist
- **Architecture**: Read PROJECT_SUMMARY.md

---

## That's It! 🎉

You now have a fully functional Hospital Management System with:
- Production-ready database design
- Complex stored procedures and triggers
- Analytics via materialized views
- Modern Next.js frontend
- Complete documentation

**Total setup time**: ~10 minutes
**Files created**: 20+
**Lines of code**: 5000+
**Features**: 40+

Ready for evaluation! 🚀
