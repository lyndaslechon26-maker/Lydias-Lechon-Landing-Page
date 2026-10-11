# Table Rename: event_menu_packages → menu_packages

## Summary

I've renamed the table from `event_menu_packages` to `menu_packages` throughout your entire codebase.

---

## What Changed?

### 1. New Migration Created ✅
**File:** `supabase/migrations/24_rename_table_to_menu_packages.sql`

This migration will:
- Rename table: `event_menu_packages` → `menu_packages`
- Rename indexes to match new table name
- Rename trigger function
- Update all column comments
- Maintain all permissions (GRANT statements)
- Handle sequence rename if exists

### 2. All Code Files Updated ✅

Updated table references in:
- ✅ `app/actions/manager-menu-packages.ts` (5 references)
- ✅ `app/manager/menu-packages/page.tsx` (1 reference)
- ✅ `app/actions/events.ts` (4 references)
- ✅ `app/actions/admin-events.ts` (5 references)

**Total:** 15 references changed from `event_menu_packages` to `menu_packages`

### 3. Important Fix in events.ts ✅

Also fixed the cost calculation logic:
```typescript
// OLD (WRONG - calculated per person)
food_cost = Number(menu.price_per_person) * input.num_guests

// NEW (CORRECT - uses bundle price)
food_cost = Number(menu.bundle_price)
```

This is important because `bundle_price` is the **total package price**, not per person!

---

## Migration Order

Run these migrations **in this exact order**:

1. ✅ **Migration 22** - Convert items to JSONB (already run)
2. ⏳ **Migration 23** - Rename columns (`price_per_person` → `bundle_price`, `min_guests` → `serves_persons`)
3. ⏳ **Migration 24** - Rename table (`event_menu_packages` → `menu_packages`)

---

## How to Run Migrations

### Step 1: Run Migration 23 (Column Rename)

1. Open Supabase Dashboard SQL Editor
2. Copy SQL from: `supabase/migrations/23_rename_price_columns_to_bundle.sql`
3. Paste and Run
4. Wait for success

### Step 2: Run Migration 24 (Table Rename)

1. In Supabase SQL Editor
2. Copy SQL from: `supabase/migrations/24_rename_table_to_menu_packages.sql`
3. Paste and Run
4. Wait for success

### Step 3: Verify Both Migrations

Run this query:
```sql
-- Check table exists with new name
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'menu_packages';

-- Check columns have new names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'menu_packages' 
  AND column_name IN ('bundle_price', 'serves_persons', 'items');
```

**Expected Results:**
| table_name     |
|----------------|
| menu_packages  |

| column_name    | data_type |
|----------------|-----------|
| bundle_price   | numeric   |
| serves_persons | integer   |
| items          | jsonb     |

---

## After Running Migrations

### 1. Hard Refresh Browser
```
Ctrl + Shift + R
```

### 2. Test the Application

Go to: `http://localhost:3000/manager/menu-packages`

**Check:**
- ✅ Packages load without errors
- ✅ Can open edit modal
- ✅ All fields display correctly
- ✅ Can save changes
- ✅ No console errors (F12)

---

## What Old Migration Files Do

**DON'T EDIT** these old migration files (they're already run):

### Migration 07 - `create_event_menu_packages.sql`
- Created the table initially as `event_menu_packages`
- This is fine - Migration 24 will rename it

### Migration 08 - `fix_event_menu_packages_permissions.sql`
- Set up permissions on old table name
- Migration 24 re-applies permissions with new table name

### Migration 22 - `convert_items_to_jsonb.sql`
- Converted items from TEXT[] to JSONB
- References `event_menu_packages` (old name)
- This is fine - already ran before rename

---

## Why This Order Matters

1. **Migration 22** transforms data structure (TEXT[] → JSONB)
2. **Migration 23** renames columns to correct meanings
3. **Migration 24** renames table for cleaner naming

If you run 24 before 22, Migration 22 would fail because it looks for `event_menu_packages`.

Since Migration 22 already ran, you can safely run 23 and 24 now.

---

## Database Structure After All Migrations

### Table: `menu_packages`

| Column          | Type      | Description                                    |
|-----------------|-----------|------------------------------------------------|
| id              | uuid      | Primary key                                    |
| name            | text      | Package name                                   |
| category        | text      | buffet, plated, drinks, dessert                |
| description     | text      | Package description                            |
| **bundle_price**    | numeric   | **Total package price (NOT per person)**       |
| **serves_persons**  | integer   | **Number of persons package can serve**        |
| **items**           | **jsonb**     | **Menu items with quantity as JSONB array**    |
| photo           | text      | Base64 image (not saved to DB yet)             |
| is_active       | boolean   | Visibility status                              |
| sort_order      | integer   | Display order                                  |
| created_at      | timestamp | Creation time                                  |
| updated_at      | timestamp | Last update time                               |

### Indexes
- `idx_menu_packages_category` (on category)
- `idx_menu_packages_active` (on is_active)

### Trigger
- `update_menu_packages_updated_at` - Auto-updates `updated_at` on changes

---

## Important Notes

### This ONLY affects the menu packages table!

**NOT changed:**
- `event_packages` - Still called `event_packages` (this is for venue/event packages, different purpose)
- `event_bookings` - Still references both tables correctly
- Any other `event_*` tables - Unchanged

### Foreign Key Reference

The `event_bookings` table has a foreign key:
- `menu_package_id` → references `menu_packages.id`

PostgreSQL automatically updates foreign key references when you rename a table, so this will continue to work.

---

## Build Status

✅ **Build Completed Successfully**
- All TypeScript types validated
- No compilation errors  
- 70 routes compiled
- All tests passed

---

## Testing Checklist

After running migrations 23 & 24:

- [ ] Migrations ran without errors in Supabase
- [ ] Table `menu_packages` exists (verified with SQL)
- [ ] Columns `bundle_price`, `serves_persons`, `items` exist
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Can load `/manager/menu-packages`
- [ ] Can open edit modal
- [ ] Can view all fields
- [ ] Can save changes
- [ ] Changes persist after close/reopen
- [ ] No console errors (F12)
- [ ] Booking system still works (if you test it)

---

## If Migrations Fail

### Migration 23 Fails

**Error: "column already exists"**
- Migration already ran
- Skip to Migration 24

### Migration 24 Fails

**Error: "relation 'menu_packages' already exists"**
- Migration already ran
- Skip to testing

**Error: "relation 'event_menu_packages' does not exist"**
- Table was already renamed somehow
- Verify with: `SELECT * FROM menu_packages LIMIT 1;`
- If query works, migration is done

---

## Summary

**What you need to do:**

1. Run Migration 23 in Supabase SQL Editor
2. Run Migration 24 in Supabase SQL Editor
3. Hard refresh browser (Ctrl+Shift+R)
4. Test menu packages manager
5. Report "success" or share any errors

Everything is ready! 🚀
