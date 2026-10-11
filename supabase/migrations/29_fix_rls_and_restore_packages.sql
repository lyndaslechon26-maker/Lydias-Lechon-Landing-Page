-- Fix RLS issue and restore access to packages and categories
-- This migration ensures RLS is disabled and permissions are properly set

-- Step 1: DISABLE RLS on both tables (very important!)
ALTER TABLE public.menu_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_categories DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop any RLS policies that might exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.menu_packages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.menu_packages;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.menu_packages;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.menu_packages;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.package_categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.package_categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.package_categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.package_categories;

-- Step 3: Grant ALL permissions to everyone (no RLS)
GRANT ALL ON public.menu_packages TO authenticated;
GRANT ALL ON public.menu_packages TO anon;
GRANT ALL ON public.menu_packages TO service_role;

GRANT ALL ON public.package_categories TO authenticated;
GRANT ALL ON public.package_categories TO anon;
GRANT ALL ON public.package_categories TO service_role;

-- Step 4: Ensure the categories exist
INSERT INTO public.package_categories (name, description, sort_order, is_active) 
VALUES
('Buffet', 'Buffet-style catering packages', 1, true),
('Plated', 'Plated meal packages', 2, true),
('Drinks', 'Beverage packages', 3, true),
('Dessert', 'Dessert and sweets packages', 4, true)
ON CONFLICT DO NOTHING;

-- Step 5: Fix any NULL category_id values by mapping from old category column
UPDATE public.menu_packages mp
SET category_id = pc.id
FROM public.package_categories pc
WHERE mp.category_id IS NULL
  AND LOWER(mp.category) = LOWER(pc.name);

-- Step 6: For any remaining NULL values, set to first category
UPDATE public.menu_packages
SET category_id = (SELECT id FROM public.package_categories ORDER BY sort_order LIMIT 1)
WHERE category_id IS NULL;

-- Step 7: Verify data is accessible
-- This is just a comment - you can run this query to check:
-- SELECT * FROM public.menu_packages;
-- SELECT * FROM public.package_categories;

COMMENT ON TABLE public.menu_packages IS 'Menu packages for events - RLS DISABLED for full access';
COMMENT ON TABLE public.package_categories IS 'Package categories - RLS DISABLED for full access';
