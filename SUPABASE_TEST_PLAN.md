# Supabase Testing Guide

## Current Status

### Migration 23: Column Rename
**File:** `supabase/migrations/23_rename_price_columns_to_bundle.sql`
**Status:** ⏳ **NEEDS TO BE RUN**

This migration renames columns in the `event_menu_packages` table:
- `price_per_person` → `bundle_price` (total package price, NOT per person)
- `min_guests` → `serves_persons` (how many the package serves)

---

## Step 1: Run Migration 23

### Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy Migration SQL**
   - Open: `supabase/migrations/23_rename_price_columns_to_bundle.sql`
   - Copy all contents

4. **Run Migration**
   - Paste SQL into Supabase SQL Editor
   - Click "Run" button
   - Wait for "Success" message

5. **Expected Result:**
   ```
   ✓ ALTER TABLE command succeeded
   ✓ Column renamed: price_per_person → bundle_price
   ✓ Column renamed: min_guests → serves_persons
   ✓ Comments added to columns
   ```

---

## Step 2: Verify Column Changes

### Test Query:

Run this in Supabase SQL Editor to verify columns exist:

```sql
-- Check columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'event_menu_packages' 
  AND column_name IN ('bundle_price', 'serves_persons');
```

**Expected Output:**
| column_name    | data_type        |
|----------------|------------------|
| bundle_price   | numeric          |
| serves_persons | integer          |

---

## Step 3: Check Existing Data

### Test Query:

```sql
-- View all menu packages with new column names
SELECT 
  id,
  name,
  category,
  bundle_price,
  serves_persons,
  is_active,
  items
FROM event_menu_packages
ORDER BY created_at DESC
LIMIT 5;
```

**What to Check:**
- ✅ `bundle_price` shows package prices (e.g., 500, 1000, 1500)
- ✅ `serves_persons` shows person count (e.g., 50, 100)
- ✅ `items` column shows JSONB format like: `[{"name":"...", "quantity":1, ...}]`
- ❌ If columns still show old names, migration didn't run

---

## Step 4: Test Frontend After Migration

### 4a. Hard Refresh Browser
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 4b. Open Menu Packages Manager
1. Navigate to: `http://localhost:3000/manager/menu-packages`
2. Click "Edit" on any package
3. **Check these fields load correctly:**
   - ✅ Package Name
   - ✅ Category
   - ✅ Description
   - ✅ Package Price (₱)
   - ✅ Good for (persons)
   - ✅ Menu Items with images and quantities
   - ✅ Active Status toggle

### 4c. Test Save Functionality
1. Change "Package Price" value
2. Change "Good for (persons)" value
3. Click "Save Changes"
4. **Expected:** Modal closes, no errors
5. Reopen same package
6. **Expected:** Changes are saved

### 4d. Test Add/Remove Menu Items
1. Click "+ Add Item Slot"
2. Select item from dropdown
3. Change quantity using +/- buttons
4. Click "Save Changes"
5. **Expected:** No errors, items saved correctly

---

## Step 5: Check Database After Save

### Test Query:

```sql
-- View the package you just edited
SELECT 
  name,
  bundle_price,
  serves_persons,
  items,
  updated_at
FROM event_menu_packages
WHERE name = 'YOUR_PACKAGE_NAME_HERE'
ORDER BY updated_at DESC
LIMIT 1;
```

**What to Check:**
- ✅ `bundle_price` updated with new value
- ✅ `serves_persons` updated with new value
- ✅ `items` is valid JSONB (not broken)
- ✅ `updated_at` shows recent timestamp

---

## Step 6: Test Landing Page Display

### 6a. Navigate to Events Page
```
http://localhost:3000/events/packages
```

### 6b. Check Package Display
- ✅ Package prices show correctly
- ✅ "Good for X persons" text displays
- ✅ Images load
- ✅ Menu items visible

**NOTE:** Landing page still uses `event_packages` table (different from `event_menu_packages`), so migration doesn't affect it.

---

## Common Issues & Solutions

### Issue 1: Migration Fails - Column Already Exists
**Error:** `column "bundle_price" of relation "event_menu_packages" already exists`

**Solution:** Migration already ran. Skip to Step 2 to verify.

### Issue 2: Save Button Doesn't Close Modal
**Symptoms:** 
- Click "Save Changes"
- Page refreshes but modal stays open
- No error message

**Check Console for Errors:**
1. Press F12 to open browser console
2. Look for red error messages
3. Common errors:
   - `Could not find the 'price_per_person' column` → Migration not run
   - `Could not find the 'min_guests' column` → Migration not run
   - `invalid input syntax for type jsonb` → Items data format issue

**Solution:** Run migration, then hard refresh browser.

### Issue 3: Menu Items Display Wrong After Edit
**Symptoms:**
- Items show correctly first time
- After save + reopen, items are wrong/missing
- Or duplicates appear

**Solution:** This was fixed in the code. If still happening:
1. Check browser console for errors
2. Check `items` column in database is JSONB type
3. Verify migration 22 ran (converts items to JSONB)

### Issue 4: Toggle Switch Not Saving
**Symptoms:**
- Change Active/Inactive status
- Save changes
- Reopen package, status didn't change

**Solution:** 
1. Check console for save errors
2. Verify `is_active` is boolean type in database
3. Hard refresh browser after save

---

## Database Column Reference

### event_menu_packages Table (AFTER Migration 23)

| Column Name     | Type     | Description                                    |
|----------------|----------|------------------------------------------------|
| id             | uuid     | Primary key                                    |
| name           | text     | Package name                                   |
| category       | text     | buffet, plated, drinks, dessert                |
| description    | text     | Package description                            |
| **bundle_price**   | numeric  | **Total package price (NOT per person)**       |
| **serves_persons** | integer  | **Number of persons package can serve**        |
| items          | jsonb    | Array of menu item objects with quantity       |
| photo          | text     | Base64 image (not saved to DB yet)             |
| is_active      | boolean  | Visibility status                              |
| sort_order     | integer  | Display order                                  |
| created_at     | timestamp| Creation time                                  |
| updated_at     | timestamp| Last update time                               |

---

## Migration History

| #  | File                                  | Status | Description                      |
|----|---------------------------------------|--------|----------------------------------|
| 21 | add_image_url_to_menu_items.sql      | ✅ Ran | Added image_url to menu_items    |
| 22 | convert_items_to_jsonb.sql           | ✅ Ran | Convert items from TEXT[] to JSONB |
| 23 | rename_price_columns_to_bundle.sql   | ⏳ **Run This** | Rename price_per_person → bundle_price, min_guests → serves_persons |

---

## Contact Kiro If:

1. ❌ Migration fails with unexpected error
2. ❌ Data is corrupted after migration
3. ❌ Frontend still shows errors after hard refresh
4. ❌ Items not saving correctly
5. ❌ Any other database or code issues

---

## Quick Test Checklist

After running migration 23:

- [ ] Migration ran successfully in Supabase SQL Editor
- [ ] Columns verified: `bundle_price` and `serves_persons` exist
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Opened menu package editor modal
- [ ] All fields load correctly
- [ ] Changed price and persons values
- [ ] Clicked "Save Changes"
- [ ] Modal closed without errors
- [ ] Reopened same package
- [ ] Changes are persisted
- [ ] Added/removed menu items
- [ ] Quantity buttons work
- [ ] Active toggle works
- [ ] No console errors

---

## Summary

**Your Task:**
1. Run migration 23 in Supabase SQL Editor
2. Hard refresh browser
3. Test editing a menu package
4. Report back: "success" or share any errors

**Expected Outcome:**
✅ All menu package editing works perfectly with new column names
✅ No more column errors in console
✅ Data saves and loads correctly
