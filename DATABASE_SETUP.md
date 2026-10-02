# 🗄️ Database Setup Guide for Landing Page

This guide will help you setup a **NEW** Supabase project for the landing page.

## ⚠️ IMPORTANT
**This is a SEPARATE database from your POS system!**
- Different Supabase project
- Different database
- Different credentials
- Only contains landing page tables

---

## Step 1: Create New Supabase Project

1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `Lydias Landing Page`
   - **Database Password**: (save this somewhere safe!)
   - **Region**: Choose closest to Philippines (Singapore recommended)
4. Wait 2-3 minutes for project to be created

---

## Step 2: Get Your Credentials

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

---

## Step 3: Update .env.local

1. In your `Lydias-Landing-Page` folder, copy `.env.example` to `.env.local`:
   ```powershell
   copy .env.example .env.local
   ```

2. Edit `.env.local` and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
   ```

---

## Step 4: Run Database Migrations

1. Go to Supabase Dashboard → **SQL Editor**

2. Click **"New Query"**

3. **Copy and paste** the contents of:
   ```
   supabase/migrations/01_landing_page_complete_schema.sql
   ```

4. Click **"Run"** (or press F5)

5. You should see success messages:
   ```
   ✅ Landing page database schema created successfully!
   📋 Tables created: profiles, event_customers, menu_items...
   ```

---

## Step 5: Create Manager Account

1. In Supabase Dashboard → **Authentication** → **Users**

2. Click **"Add User"** (or "Invite User")

3. Fill in:
   - **Email**: `your-email@example.com` (your actual email)
   - **Password**: `your-secure-password`
   - **Auto Confirm User**: ✅ **CHECK THIS!**

4. Click **"Create User"**

5. **COPY THE USER ID** (looks like: `a1b2c3d4-...`)

6. Go back to **SQL Editor**

7. Open `supabase/migrations/02_create_first_manager.sql`

8. **Replace** `'YOUR-USER-ID-HERE'` with your actual user ID

9. **Replace** email, name, and phone with your details

10. Click **"Run"**

---

## Step 6: Verify Setup

Run this query in SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if your profile was created
SELECT * FROM profiles;
```

You should see:
- ✅ All tables listed (profiles, event_customers, menu_items, etc.)
- ✅ Your manager profile in the profiles table

---

## Step 7: Test Login

1. Start your development server:
   ```powershell
   npm run dev
   ```

2. Go to: http://localhost:3000/manager

3. Login with:
   - Email: (the email you created in Step 5)
   - Password: (the password you set in Step 5)

4. You should see the Landing Page Manager dashboard! 🎉

---

## 📋 Tables Created

Your new database has these tables:

| Table | Purpose |
|-------|---------|
| `roles` | User roles (landing_page_manager, customer) |
| `profiles` | Manager/staff accounts |
| `event_customers` | Customer accounts |
| `menu_categories` | Food categories |
| `menu_items` | Menu items/dishes |
| `event_venues` | Event venues for booking |
| `event_packages` | Event packages |
| `event_bookings` | Customer event bookings |
| `online_orders` | Customer food orders |
| `landing_page_settings` | Website settings |
| `customer_reviews` | Customer reviews |
| `content_updates_log` | Audit log |

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Public can only read available menu items, venues, packages
- ✅ Only managers can create/update/delete
- ✅ Customers can only see their own orders
- ✅ All sensitive operations logged

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
- Make sure you ran migration `01_landing_page_complete_schema.sql`

### Error: "permission denied"
- Check RLS policies are enabled
- Make sure your user has a profile in `profiles` table with role `landing_page_manager`

### Can't login to manager dashboard
- Verify user exists in Supabase Auth
- Verify profile exists in `profiles` table
- Check email and password are correct
- Make sure "Auto Confirm User" was checked

### Wrong credentials error
- Double-check your `.env.local` file
- Make sure you're using the NEW project's credentials, not the POS one!

---

## ✅ Next Steps

Once database is setup:

1. ✅ Run `npm install` (if not done yet)
2. ✅ Run `npm run dev`
3. ✅ Visit http://localhost:3000 (landing page)
4. ✅ Visit http://localhost:3000/manager (manager dashboard)
5. ✅ Add menu items, venues, packages through manager dashboard
6. ✅ Test booking and ordering features

---

## 🚀 Ready to Deploy?

When ready to deploy to production:

1. Create production Supabase project
2. Run same migrations
3. Update production environment variables
4. Deploy to Vercel/Cloudflare/Netlify

---

**Need help?** Check the error messages carefully - they usually tell you exactly what's wrong! 🔍
