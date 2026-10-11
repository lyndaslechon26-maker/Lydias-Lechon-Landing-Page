# How to Test Your Supabase Connection

## Quick Supabase Health Check

### Method 1: Check in Dashboard

1. Go to: https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg
2. Look at the top bar - if you see your project, **Supabase is working** ✅

### Method 2: Test with SQL Query

1. Open SQL Editor in Supabase Dashboard
2. Run this simple query:
```sql
SELECT NOW();
```
3. If it returns current time, **Supabase is working** ✅

### Method 3: Check Tables

Run this to see all your tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see tables like:
- `event_menu_packages`
- `event_packages`
- `event_bookings`
- `menu_items`
- `food_categories`
- etc.

---

## Test Your Application's Connection

### Test 1: Load Menu Packages Page

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/manager/menu-packages`
3. If packages load, **connection works** ✅

### Test 2: Check Browser Console

1. Open any manager page
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for errors

**Good signs:**
- No red errors about Supabase
- No "Failed to fetch" errors
- Pages load normally

**Bad signs:**
- Red errors mentioning Supabase
- "Invalid API key"
- "Failed to establish connection"

### Test 3: Try Editing Data

1. Go to Menu Packages manager
2. Click Edit on any package
3. Change something
4. Click Save
5. If it saves, **full connection works** ✅

---

## Check Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fnbwavqrxwaftfatzkyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**To verify:**
1. Open `.env.local` file
2. Check URL matches your project ID
3. Check anon key is present (long string starting with "eyJ...")

---

## Common Supabase Issues

### Issue: "Invalid API key"

**Cause:** Wrong or missing anon key in `.env.local`

**Fix:**
1. Go to Supabase Dashboard
2. Click Settings → API
3. Copy "anon" key (under "Project API keys")
4. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
5. Restart dev server

### Issue: "Failed to fetch"

**Cause:** Network issue or Supabase is down

**Fix:**
1. Check internet connection
2. Visit https://status.supabase.com/ to check Supabase status
3. Try again in a few minutes

### Issue: "Row Level Security policy violation"

**Cause:** RLS is enabled but no policies set

**Fix:** You disabled RLS, so this shouldn't happen. But if it does:
```sql
-- Disable RLS on table
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON table_name TO anon;
GRANT ALL ON table_name TO authenticated;
```

---

## Verify Migration History

Check which migrations have run:

```sql
SELECT version, name 
FROM supabase_migrations.schema_migrations 
ORDER BY version;
```

**If this fails with "relation does not exist":**
Supabase might not track migrations automatically. That's okay - just check tables directly.

---

## Test Specific Features

### Test Menu Items Loading

```sql
SELECT id, name, base_price, is_available, image_url
FROM menu_items
WHERE is_available = true
LIMIT 5;
```

### Test Menu Packages Loading

```sql
SELECT id, name, category, bundle_price, serves_persons, is_active
FROM event_menu_packages
WHERE is_active = true
LIMIT 5;
```

### Test Items Column Format (should be JSONB)

```sql
SELECT 
  name,
  pg_typeof(items) as items_type,
  items
FROM event_menu_packages
LIMIT 3;
```

Expected: `items_type` should be `jsonb`

---

## Connection String Check

Your project uses this format:
```
https://fnbwavqrxwaftfatzkyg.supabase.co
```

**Parts:**
- `fnbwavqrxwaftfatzkyg` = Your Project Reference ID
- `.supabase.co` = Supabase domain

---

## Quick Tests Summary

Run these in order:

### 1. Dashboard Access
- [ ] Can login to Supabase Dashboard
- [ ] Project shows up
- [ ] Can navigate to SQL Editor

### 2. SQL Queries
- [ ] `SELECT NOW();` works
- [ ] Can see tables with `information_schema` query
- [ ] Can query `event_menu_packages` table

### 3. Application Connection
- [ ] Dev server starts (`npm run dev`)
- [ ] Manager pages load
- [ ] No Supabase errors in console (F12)

### 4. Data Operations
- [ ] Can view menu packages
- [ ] Can edit a package
- [ ] Changes save successfully
- [ ] Changes persist after refresh

---

## If Everything Works

You should be able to:
1. ✅ Open Supabase Dashboard
2. ✅ Run SQL queries
3. ✅ Load manager pages in your app
4. ✅ Edit and save data
5. ✅ See changes in database

If all 5 work, **your Supabase is fully functional!**

---

## Advanced: Check Table Structure

To see exact structure of event_menu_packages:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'event_menu_packages'
ORDER BY ordinal_position;
```

This shows every column, its type, and whether it allows NULL values.

---

## Need Help?

If something doesn't work:
1. Note which test failed
2. Copy any error messages
3. Take screenshots if needed
4. Share with me

Include:
- What you were trying to do
- What happened
- Any error messages
- Screenshots (if relevant)

---

## Quick Checklist

Before asking for help, verify:
- [ ] `.env.local` file exists and has correct values
- [ ] Dev server is running (`npm run dev`)
- [ ] Internet connection is working
- [ ] Supabase Dashboard is accessible
- [ ] You're logged into correct Supabase account

---

## Summary

**To test your Supabase:**
1. Login to Dashboard (https://supabase.com/dashboard)
2. Run `SELECT NOW();` in SQL Editor
3. Load a manager page in your app
4. Try editing something
5. If all work → Supabase is good ✅

**Most common issue:** Missing or wrong API key in `.env.local`
