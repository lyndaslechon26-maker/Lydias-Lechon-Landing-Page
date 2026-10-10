# Menu Items Fix Guide - Complete Solution

## 🔴 CRITICAL: Fix Supabase Anon Key FIRST

### Problem
Your `.env.local` is using the **service_role** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This is wrong and a security risk!

### ⚡ Solution - Update .env.local

**Current (WRONG - service_role exposed to client):**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYndhdnFyeHdhZnRmYXR6a3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTYwNDI2MCwiZXhwIjoyMDk1MTgwMjYwfQ.9wjAWNcb-gXhJ8yzfJns49eO5ru0IQ2hhqoleIcXOnM
```

**Correct (Use ANON key):**
1. Go to: https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/settings/api
2. Copy the **anon public** key (NOT service_role)
3. Replace in `.env.local`:

```env
# Supabase Configuration (NEW PROJECT - NOT THE POS ONE!)
NEXT_PUBLIC_SUPABASE_URL=https://fnbwavqrxwaftfatzkyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYndhdnFyeHdhZnRmYXR6a3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDQyNjAsImV4cCI6MjA5NTE4MDI2MH0.[COPY_FROM_SUPABASE_DASHBOARD]
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYndhdnFyeHdhZnRmYXR6a3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTYwNDI2MCwiZXhwIjoyMDk1MTgwMjYwfQ.9wjAWNcb-gXhJ8yzfJns49eO5ru0IQ2hhqoleIcXOnM
```

**Important:** The anon key will have `"role":"anon"` in the JWT payload, NOT `"role":"service_role"`

4. **Stop and restart dev server:**
```bash
# Press Ctrl+C to stop
npm run dev
```

5. **Hard refresh browser:** `Ctrl+Shift+R`

---

## 🔧 Database Fixes - Run Migrations in Order

### Step 1: Fix Availability (Migration 13)
**File:** `supabase/migrations/13_fix_menu_items_availability.sql`

```sql
-- Update all menu items to be available by default
UPDATE public.menu_items
SET is_available = true
WHERE is_available = false OR is_available IS NULL;

-- Ensure the column has a default value for future inserts
ALTER TABLE public.menu_items 
ALTER COLUMN is_available SET DEFAULT true;
```

**Run in Supabase SQL Editor:**
1. Go to: https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/editor
2. Paste the SQL above
3. Click "Run"

---

### Step 2: Fix Foreign Keys (Migration 14)
**File:** `supabase/migrations/14_fix_menu_items_foreign_key.sql`

This fixes the error: `insert or update on table "menu_items" violates foreign key constraint`

```sql
-- Set orphaned category_id values to NULL
UPDATE public.menu_items
SET category_id = NULL
WHERE category_id IS NOT NULL
  AND category_id NOT IN (SELECT id FROM public.food_categories);

-- Drop existing foreign key constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'menu_items_category_id_fkey'
        AND table_name = 'menu_items'
    ) THEN
        ALTER TABLE public.menu_items 
        DROP CONSTRAINT menu_items_category_id_fkey;
    END IF;
END $$;

-- Add the proper foreign key constraint
ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES public.food_categories(id)
ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id 
ON public.menu_items(category_id);
```

**Run in Supabase SQL Editor**

---

### Step 3: Remove Duplicates (Migration 15)
**File:** `supabase/migrations/15_remove_duplicate_menu_items.sql`

This removes duplicate items with the same name (keeps most recent).

```sql
-- Delete duplicate menu items (keep newest)
DELETE FROM public.menu_items
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            name,
            ROW_NUMBER() OVER (
                PARTITION BY LOWER(TRIM(name)) 
                ORDER BY created_at DESC, id DESC
            ) as rn
        FROM public.menu_items
    ) t
    WHERE rn > 1
);
```

**Run in Supabase SQL Editor**

---

### Step 4: Fix NULL Prices

Run this in Supabase SQL Editor to check and fix prices:

```sql
-- Check items with NULL or 0 price
SELECT id, name, price, is_available
FROM public.menu_items
WHERE price IS NULL OR price = 0
ORDER BY name;

-- If you find items with NULL price, update them:
-- UPDATE public.menu_items
-- SET price = 100  -- Set a default price
-- WHERE price IS NULL OR price = 0;
```

---

## 🎯 Expected Results

After all fixes:

### Console Output (Browser F12):
```javascript
Menu items fetch result: { itemsCount: [should be <42 after deduplication], error: null }
MenuManager received: { 
  categoriesCount: 5, 
  itemsCount: [deduplicated count],
  itemsWithCategories: [categorized],
  itemsWithoutCategories: [uncategorized]
}
```

### Page Display:
- ✅ All menu items showing
- ✅ No duplicate items
- ✅ All prices display correctly (₱XXX)
- ✅ Categories show correct counts
- ✅ No 401 errors in console
- ✅ Items can be filtered by category
- ✅ Toggle availability works

---

## 🔍 Verify Each Step

### After fixing .env.local:
```bash
# Check console in browser (F12)
# Should see no 401 errors
# Should see menu items loaded
```

### After running migrations:
```sql
-- Check total items
SELECT COUNT(*) as total_items FROM public.menu_items;

-- Check duplicates (should return 0 rows)
SELECT LOWER(TRIM(name)) as name, COUNT(*) as count
FROM public.menu_items
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1;

-- Check prices
SELECT COUNT(*) as null_prices 
FROM public.menu_items 
WHERE price IS NULL OR price = 0;

-- Check availability
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN is_available THEN 1 ELSE 0 END) as available,
  SUM(CASE WHEN NOT is_available THEN 1 ELSE 0 END) as unavailable
FROM public.menu_items;

-- Check categories
SELECT 
  c.name as category,
  COUNT(m.id) as items
FROM public.food_categories c
LEFT JOIN public.menu_items m ON m.category_id = c.id
GROUP BY c.name
ORDER BY c.sort_order;
```

---

## 📝 Checklist

- [ ] Copy anon key from Supabase dashboard
- [ ] Update `.env.local` with correct anon key
- [ ] Restart dev server (`Ctrl+C` then `npm run dev`)
- [ ] Hard refresh browser (`Ctrl+Shift+R`)
- [ ] Run migration 13 (fix availability)
- [ ] Run migration 14 (fix foreign keys)
- [ ] Run migration 15 (remove duplicates)
- [ ] Fix NULL prices if any
- [ ] Verify menu items display correctly
- [ ] Test category filter
- [ ] Test availability toggle
- [ ] Run `npm run build` to check for errors
- [ ] Commit and push to GitHub

---

## ⚠️ Common Issues

### Issue: Still getting 401 errors
**Solution:** Make sure you copied the **anon** key, not service_role. Check the JWT payload contains `"role":"anon"`

### Issue: Items still not showing
**Solution:** Check browser console for errors. Make sure you restarted dev server and hard refreshed.

### Issue: Foreign key error persists
**Solution:** Make sure migration 14 completed successfully. Check that orphaned category_ids were set to NULL.

### Issue: Duplicates still showing
**Solution:** Make sure migration 15 ran. Check with the SQL query above.

---

## 🆘 Emergency Reset

If nothing works, run this to start fresh:

```sql
-- DANGER: This deletes all menu items!
-- Only use if you're okay losing all data
TRUNCATE public.menu_items CASCADE;

-- Then you can re-insert sample data
```

