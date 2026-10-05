# 🔧 Fix Login Issue - Step by Step Instructions

## Problem
Getting "Database error: permission denied for schema public" when trying to log in.

## Root Cause
The `profiles` table either doesn't exist or doesn't have proper permissions in your Supabase project.

---

## ✅ SOLUTION - Follow These Steps in Order

### Step 1: Verify Database Schema Exists
1. Go to your Supabase Dashboard: https://fnbwavqrxwaftfatzkyg.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Run migration `01_landing_page_complete_schema.sql` (if not done yet)

### Step 2: Fix Permissions
1. In **SQL Editor**, open `supabase/migrations/05_add_profiles_rls_policies.sql`
2. Copy the entire content
3. Click **Run** 
4. You should see: ✅ Profiles table permissions granted

### Step 3: Get Your Auth User ID
1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Find your account: `aizenjhakerivera06@gmail.com`
3. Click on the email to open user details
4. **COPY the UUID** (looks like: `12345678-1234-1234-1234-123456789abc`)

### Step 4: Create Your Profile
1. Open `supabase/migrations/06_add_manager_profile.sql`
2. Find this line:
   ```sql
   'REPLACE-WITH-YOUR-AUTH-USER-ID'::uuid,  -- ⚠️ REPLACE THIS
   ```
3. Replace `REPLACE-WITH-YOUR-AUTH-USER-ID` with the UUID you copied
4. Example:
   ```sql
   '8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d'::uuid,  -- Your actual UUID
   ```
5. Copy the entire SQL from this file
6. Go to **SQL Editor** in Supabase
7. Paste and click **Run**
8. You should see: ✅ Manager profile created/updated successfully!

### Step 5: Test Login
1. Go to http://localhost:3000/events/login
2. Login with:
   - Email: `aizenjhakerivera06@gmail.com`
   - Password: (your password)
3. You should be redirected to `/manager` dashboard

---

## 🎯 Quick Alternative (If Above Doesn't Work)

Run this SQL directly in Supabase SQL Editor (replace UUID):

```sql
-- 1. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- 2. Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Insert your profile (REPLACE THE UUID!)
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES (
    'YOUR-AUTH-USER-ID-HERE'::uuid,
    'aizenjhakerivera06@gmail.com',
    'Aizen Jhake Rivera',
    'landing_page_manager',
    true
)
ON CONFLICT (id) DO UPDATE SET
    role = 'landing_page_manager',
    updated_at = now();
```

---

## 🔍 Verify It Worked

Run this in SQL Editor to check:

```sql
SELECT id, email, role, is_active 
FROM profiles 
WHERE email = 'aizenjhakerivera06@gmail.com';
```

You should see 1 row with:
- ✅ `role` = `landing_page_manager`
- ✅ `is_active` = `true`

---

## 📝 After Login Works

Once you can successfully login, we can re-enable RLS with proper policies for security.

---

## ❓ Common Issues

### Issue: "relation profiles does not exist"
**Solution:** Run migration `01_landing_page_complete_schema.sql` first

### Issue: "duplicate key value violates unique constraint"
**Solution:** Your profile already exists. Just run an UPDATE instead:
```sql
UPDATE profiles 
SET role = 'landing_page_manager', is_active = true 
WHERE email = 'aizenjhakerivera06@gmail.com';
```

### Issue: Still getting permission denied
**Solution:** Make sure you're using the correct Supabase project:
- Project: `fnbwavqrxwaftfatzkyg`
- URL: `https://fnbwavqrxwaftfatzkyg.supabase.co`
- Check `.env.local` to confirm

---

## 🆘 Need Help?

Share a screenshot of:
1. The error message
2. Your Supabase SQL Editor after running the queries
3. Result of the "Verify It Worked" query
