# 🚀 How to Run Migration 23 - Simple Guide

## What You Need to Do

Run a SQL script in Supabase to rename two database columns.

---

## Step-by-Step Instructions

### 1️⃣ Open Supabase Dashboard

Go to this URL:
```
https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg
```

Login if needed.

---

### 2️⃣ Open SQL Editor

Look at the left sidebar and click:
```
📊 SQL Editor
```

Then click the button:
```
➕ New Query
```

---

### 3️⃣ Copy the Migration SQL

Open this file on your computer:
```
supabase/migrations/23_rename_price_columns_to_bundle.sql
```

Select everything (Ctrl+A) and copy (Ctrl+C).

**Or copy this:**

```sql
-- Rename columns to reflect correct meaning:
-- price_per_person -> bundle_price (total package price, not per person)
-- min_guests -> serves_persons (capacity, not minimum requirement)

-- Rename price_per_person to bundle_price
ALTER TABLE public.event_menu_packages 
RENAME COLUMN price_per_person TO bundle_price;

-- Rename min_guests to serves_persons
ALTER TABLE public.event_menu_packages 
RENAME COLUMN min_guests TO serves_persons;

-- Update comments for clarity
COMMENT ON COLUMN public.event_menu_packages.bundle_price IS 'Total package/bundle price in pesos (not per person)';
COMMENT ON COLUMN public.event_menu_packages.serves_persons IS 'Number of persons this package can serve (capacity)';
```

---

### 4️⃣ Paste and Run

1. Paste (Ctrl+V) into the SQL Editor query box
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait a few seconds

---

### 5️⃣ Check for Success

You should see:
```
✓ Success. No rows returned
```

Or similar success message.

**If you see an error like:**
```
ERROR: column "bundle_price" already exists
```

That means the migration already ran! Skip to Step 6.

---

### 6️⃣ Verify It Worked

Create a **New Query** in SQL Editor and run this:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'event_menu_packages' 
  AND column_name IN ('bundle_price', 'serves_persons');
```

You should see 2 rows:
| column_name    | data_type |
|----------------|-----------|
| bundle_price   | numeric   |
| serves_persons | integer   |

If you see these two rows, **SUCCESS!** ✅

---

### 7️⃣ Refresh Your Browser

Go to your application (http://localhost:3000) and do a **hard refresh**:

**Windows:**
```
Press: Ctrl + Shift + R
```

**Mac:**
```
Press: Cmd + Shift + R
```

This clears the cache and loads the new code.

---

### 8️⃣ Test It

1. Go to: `http://localhost:3000/manager/menu-packages`
2. Click **"Edit"** on any package
3. You should see:
   - ✅ "Package Price (₱)" label
   - ✅ "Good for (persons)" label
   - ✅ All fields load correctly
4. Change some values
5. Click **"Save Changes"**
6. Modal should close (no errors)
7. Click **"Edit"** again to verify changes saved

---

## ✅ Done!

If editing works with no errors, you're all set!

---

## 🆘 If Something Goes Wrong

### Problem: Migration fails with error

**Take a screenshot of the error** and share it with me.

### Problem: Save button doesn't close modal

1. Press F12 to open browser console
2. Look for red error messages
3. Take a screenshot
4. Share with me

### Problem: "Cannot find column 'price_per_person'"

This means:
1. Migration didn't run successfully, OR
2. Browser cache not cleared

**Try:**
1. Run migration again in Supabase
2. Hard refresh browser (Ctrl+Shift+R)
3. Close browser completely and reopen
4. Try again

---

## 📝 Quick Report Back

After you finish, just reply with:

**If successful:**
```
"success"
```

**If there's a problem:**
```
"error: [describe what happened]"
```
Or share screenshots.

---

## 🎯 Summary

1. Open Supabase SQL Editor
2. Copy and paste the migration SQL
3. Click Run
4. Verify columns exist
5. Hard refresh browser (Ctrl+Shift+R)
6. Test editing a menu package
7. Report "success" or share errors

That's it! 🚀
