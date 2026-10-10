# 🎯 IMMEDIATE ACTION CHECKLIST

## Issues Found:
1. ❌ **CRITICAL:** Wrong Supabase anon key (using service_role instead of anon)
2. ❌ Duplicate menu items in database
3. ❌ Some items have NULL prices (showing NaN)
4. ⚠️ Foreign key constraint errors

---

## ✅ Step-by-Step Actions (Do in Order)

### 1️⃣ FIX SUPABASE ANON KEY (Most Important!)

**Go to:** https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/settings/api

**Find:** The **anon public** key (NOT the service_role key!)

**Look for this section in the dashboard:**
```
Project API keys
├─ anon public    ← COPY THIS ONE
└─ service_role   ← DON'T USE THIS FOR CLIENT
```

**Update your `.env.local` file:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...paste_the_anon_key_here...
```

**The correct key will have `"role":"anon"` NOT `"role":"service_role"` in the JWT**

**After updating:**
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

**Then hard refresh browser:** `Ctrl+Shift+R`

---

### 2️⃣ RUN DATABASE MIGRATIONS

**Go to:** https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/sql

#### Migration A: Fix Availability
```sql
-- Set all items to available
UPDATE public.menu_items
SET is_available = true
WHERE is_available = false OR is_available IS NULL;

ALTER TABLE public.menu_items 
ALTER COLUMN is_available SET DEFAULT true;
```
Click **RUN** ✅

---

#### Migration B: Fix Foreign Keys
```sql
-- Clean orphaned category references
UPDATE public.menu_items
SET category_id = NULL
WHERE category_id IS NOT NULL
  AND category_id NOT IN (SELECT id FROM public.food_categories);

-- Drop old constraint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'menu_items_category_id_fkey'
    ) THEN
        ALTER TABLE public.menu_items 
        DROP CONSTRAINT menu_items_category_id_fkey;
    END IF;
END $$;

-- Add proper constraint
ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES public.food_categories(id)
ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id 
ON public.menu_items(category_id);
```
Click **RUN** ✅

---

#### Migration C: Remove Duplicates
```sql
-- Delete duplicate items (keeps most recent)
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
Click **RUN** ✅

---

#### Migration D: Check and Fix Prices
```sql
-- Check for NULL or 0 prices
SELECT id, name, price, is_available
FROM public.menu_items
WHERE price IS NULL OR price = 0
ORDER BY name;
```

**If you find items with NULL price, update them:**
```sql
-- Update NULL prices to reasonable default
UPDATE public.menu_items
SET price = 150  -- Change to appropriate price
WHERE price IS NULL OR price = 0;
```
Click **RUN** ✅

---

### 3️⃣ VERIFY IT WORKS

**Open your menu page:** http://localhost:3000/manager/menu

**Open browser console (F12)** and check for:
- ✅ No 401 errors
- ✅ See: `Menu items fetch result: { itemsCount: XX, error: null }`
- ✅ All items display with correct prices
- ✅ No duplicates
- ✅ Categories show correct counts

---

### 4️⃣ FINAL CHECKS

**Run in Supabase SQL Editor to verify:**
```sql
-- Total items
SELECT COUNT(*) as total FROM public.menu_items;

-- Check for duplicates (should be 0)
SELECT LOWER(TRIM(name)) as name, COUNT(*) 
FROM public.menu_items
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1;

-- Check prices (should be 0)
SELECT COUNT(*) 
FROM public.menu_items 
WHERE price IS NULL OR price = 0;

-- Items by category
SELECT 
  COALESCE(c.name, 'Uncategorized') as category,
  COUNT(m.id) as items,
  SUM(CASE WHEN m.is_available THEN 1 ELSE 0 END) as available
FROM public.menu_items m
LEFT JOIN public.food_categories c ON c.id = m.category_id
GROUP BY c.name, c.sort_order
ORDER BY c.sort_order NULLS LAST;
```

---

## 📋 Quick Checklist

- [ ] Copy anon key from Supabase dashboard (NOT service_role!)
- [ ] Update `.env.local` 
- [ ] Restart dev server
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Run Migration A (availability)
- [ ] Run Migration B (foreign keys)
- [ ] Run Migration C (duplicates)
- [ ] Run Migration D (fix prices)
- [ ] Check console for errors
- [ ] Verify menu items display correctly
- [ ] Test category filtering
- [ ] Test availability toggle
- [ ] All prices show correctly (no NaN)

---

## 🆘 If Still Not Working

1. **Check browser console (F12)** - look for errors
2. **Check the anon key** - make sure it has `"role":"anon"` not `"role":"service_role"`
3. **Restart dev server again** - sometimes takes 2 restarts
4. **Clear browser cache completely** - Settings > Clear browsing data
5. **Check Supabase logs** - https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg/logs/explorer

---

## 📁 Complete Documentation

See `MENU_ITEMS_FIX_GUIDE.md` for detailed explanations and troubleshooting.

