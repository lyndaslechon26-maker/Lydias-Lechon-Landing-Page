# Fix Supabase Authentication Issue

## Problem
Getting 401 Unauthorized error when fetching menu items because the `NEXT_PUBLIC_SUPABASE_ANON_KEY` is incorrect.

## Solution

### Step 1: Get Your Correct Anon Key

1. Go to: https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/settings/api

2. Under **Project API keys**, find the **anon/public** key

3. It should look like this (long JWT token):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYndhdnFyeHdhZnRmYXR6a3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDQyNjAsImV4cCI6MjA5NTE4MDI2MH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Step 2: Update `.env.local`

Replace the incorrect key in your `.env.local` file:

**Current (WRONG):**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_LltNzsrj8APcKsEJGNCxWw_0OBVIDFt
```

**Should be (with your actual anon key from Supabase dashboard):**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYndhdnFyeHdhZnRmYXR6a3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDQyNjAsImV4cCI6MjA5NTE4MDI2MH0.[YOUR_ACTUAL_KEY_HERE]
```

### Step 3: Restart Dev Server

After updating `.env.local`:

```bash
# Stop the dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Hard Refresh Browser

Press `Ctrl+Shift+R` to clear cache and reload

---

## Why This Happened

The key `sb_publishable_LltNzsrj8APcKsEJGNCxWw_0OBVIDFt` is not a valid Supabase anon key format. 

Supabase keys should be JWT tokens (JSON Web Tokens) that start with `eyJ` and contain three parts separated by dots (`.`).

Valid format: `eyJ...header...eyJ...payload...signature`

---

## After Fixing

You should see:
- ✅ No more 401 errors in console
- ✅ All 42 menu items displayed
- ✅ Categories showing correct item counts

---

## Verify It Works

1. Open browser console (F12)
2. Go to Menu Items page
3. You should see:
   ```
   Menu items fetch result: { itemsCount: 42, error: null }
   MenuManager received: { categoriesCount: 5, itemsCount: 42 }
   ```

---

**Quick Check:** Your correct anon key is on this page:
https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/settings/api

Look for the **anon public** key (NOT the service_role key, use the anon one).
