# Quick Start - Run These 2 Migrations

## You Have 2 Migrations to Run

Both are ready in your `supabase/migrations/` folder.

---

## Migration 23: Rename Columns

### Open This File:
```
supabase/migrations/23_rename_price_columns_to_bundle.sql
```

### Copy This SQL:
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

### Run It:
1. Go to Supabase SQL Editor
2. Paste SQL
3. Click Run
4. Wait for "Success"

---

## Migration 24: Rename Table

### Open This File:
```
supabase/migrations/24_rename_table_to_menu_packages.sql
```

### Copy This SQL:
```sql
-- Rename event_menu_packages table to menu_packages
-- This makes the table name cleaner and more accurate

-- Step 1: Rename the table
ALTER TABLE public.event_menu_packages 
RENAME TO menu_packages;

-- Step 2: Rename indexes to match new table name
ALTER INDEX IF EXISTS idx_event_menu_packages_category 
RENAME TO idx_menu_packages_category;

ALTER INDEX IF EXISTS idx_event_menu_packages_active 
RENAME TO idx_menu_packages_active;

-- Step 3: Rename the updated_at trigger function
ALTER FUNCTION update_event_menu_packages_updated_at() 
RENAME TO update_menu_packages_updated_at;

-- Step 4: Drop and recreate trigger with new name
DROP TRIGGER IF EXISTS update_event_menu_packages_updated_at ON public.menu_packages;

CREATE TRIGGER update_menu_packages_updated_at
    BEFORE UPDATE ON public.menu_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_packages_updated_at();

-- Step 5: Update column comments to reference new table name
COMMENT ON TABLE public.menu_packages IS 'Menu packages for catering (buffet, plated meals, drinks, desserts)';
COMMENT ON COLUMN public.menu_packages.bundle_price IS 'Total package/bundle price in pesos (not per person)';
COMMENT ON COLUMN public.menu_packages.serves_persons IS 'Number of persons this package can serve (capacity)';
COMMENT ON COLUMN public.menu_packages.items IS 'Menu items with quantity and details as JSONB array: [{"name": "...", "quantity": 1, "description": "...", "is_signature": false}]';

-- Step 6: Verify permissions are maintained
GRANT ALL ON public.menu_packages TO authenticated;
GRANT ALL ON public.menu_packages TO anon;
GRANT ALL ON public.menu_packages TO service_role;

-- Step 7: Handle sequence rename if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'event_menu_packages_id_seq') THEN
        ALTER SEQUENCE public.event_menu_packages_id_seq RENAME TO menu_packages_id_seq;
        
        -- Re-grant permissions on renamed sequence
        GRANT USAGE, SELECT ON SEQUENCE public.menu_packages_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE public.menu_packages_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE public.menu_packages_id_seq TO service_role;
    END IF;
END $$;
```

### Run It:
1. Still in Supabase SQL Editor
2. Click "New Query"
3. Paste SQL
4. Click Run
5. Wait for "Success"

---

## After Both Migrations

### 1. Verify Table Exists

Run this query:
```sql
SELECT * FROM menu_packages LIMIT 1;
```

If it returns data → Success! ✅

### 2. Hard Refresh Browser
```
Ctrl + Shift + R
```

### 3. Test Your App
1. Go to: http://localhost:3000/manager/menu-packages
2. Click "Edit" on any package
3. Change something
4. Click "Save"
5. If it saves → Success! ✅

---

## Done!

Just reply: **"success"** if everything worked!

Or share any errors if something failed.
