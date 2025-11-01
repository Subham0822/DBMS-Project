# Supabase Database Setup

## Execution Order (IMPORTANT!)

Run these SQL files in **EXACT ORDER** in the Supabase SQL Editor:

### 1️⃣ schema.sql
**What it does**: Creates all 20 tables with constraints and indexes

**Run time**: ~5-10 seconds

**Verify**: Check Table Editor - should see 20 tables

### 2️⃣ procedures.sql
**What it does**: Creates 10 stored procedures/functions

**Run time**: ~3-5 seconds

**Verify**: Run this query:
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';
```
Should return 10+ functions

### 3️⃣ triggers.sql
**What it does**: Creates 10 triggers for automation

**Run time**: ~3-5 seconds

**Verify**: Run this query:
```sql
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_schema = 'public';
```
Should return 10+ triggers

### 4️⃣ views.sql
**What it does**: Creates 10 materialized views and 4 regular views

**Run time**: ~5-10 seconds

**Verify**: Run this query:
```sql
SELECT matviewname FROM pg_matviews;
```
Should return 10 materialized views

### 5️⃣ seed.sql
**What it does**: Inserts sample data (100+ rows)

**Run time**: ~5-10 seconds

**Verify**: Run this query:
```sql
SELECT COUNT(*) FROM Patient;
```
Should return 8

---

## Complete Setup Script

Copy and paste into Supabase SQL Editor:

```sql
-- Step 1: Verify all tables exist
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public';
-- Expected: 20

-- Step 2: Verify all procedures exist
SELECT COUNT(*) as procedure_count FROM information_schema.routines
WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';
-- Expected: 10+

-- Step 3: Verify all triggers exist
SELECT COUNT(*) as trigger_count FROM information_schema.triggers
WHERE trigger_schema = 'public';
-- Expected: 10+

-- Step 4: Verify all materialized views exist
SELECT COUNT(*) as mv_count FROM pg_matviews;
-- Expected: 10

-- Step 5: Verify data loaded
SELECT
    (SELECT COUNT(*) FROM Department) as departments,
    (SELECT COUNT(*) FROM Doctor) as doctors,
    (SELECT COUNT(*) FROM Patient) as patients,
    (SELECT COUNT(*) FROM Appointment) as appointments;
-- Expected: 8, 8, 8, 10
```

---

## Quick Test

After running all files, test with:

```sql
-- Test a stored procedure
SELECT * FROM get_available_doctors();

-- Test a materialized view
SELECT * FROM mv_doctor_performance LIMIT 5;

-- Test a regular view
SELECT * FROM v_patient_complete_info LIMIT 5;
```

All queries should work without errors!

---

## Troubleshooting

### Error: "relation already exists"
**Solution**: Tables already created. Either skip schema.sql or drop all tables first:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
Then re-run all files.

### Error: "function already exists"
**Solution**: Drop and recreate:
```sql
DROP FUNCTION IF EXISTS book_appointment CASCADE;
-- Then re-run procedures.sql
```

### Error: "Appointment date cannot be in the past"
**Solution**: This is FIXED in the current seed.sql. The file now uses dynamic dates (CURRENT_DATE + INTERVAL).

### Error: "materialized view ... does not exist"
**Solution**: Run views.sql again

---

## Important Notes

1. **Order Matters**: Always run files in order 1→2→3→4→5
2. **Wait for Success**: Each file must complete successfully before running next
3. **Dynamic Dates**: seed.sql uses `CURRENT_DATE + INTERVAL` so appointments are always in the future
4. **Refresh Views**: After adding data, refresh materialized views:
   ```sql
   SELECT refresh_all_materialized_views();
   ```

---

## File Summary

| File | Tables | Procedures | Triggers | Views | Data Rows |
|------|--------|------------|----------|-------|-----------|
| schema.sql | 20 | 0 | 16* | 0 | 0 |
| procedures.sql | 0 | 10 | 0 | 0 | 0 |
| triggers.sql | 0 | 0 | 10 | 0 | 0 |
| views.sql | 0 | 1** | 0 | 14 | 0 |
| seed.sql | 0 | 0 | 0 | 0 | 100+ |

*16 update timestamp triggers (one per table)
**refresh_all_materialized_views() function

---

## Next Steps

After database setup:
1. Get your Supabase API credentials (Project Settings > API)
2. Update `.env.local` in your Next.js project
3. Run `npm run dev`
4. Access http://localhost:9002

Ready to go! 🚀
