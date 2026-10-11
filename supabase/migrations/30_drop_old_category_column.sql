-- Drop the old category TEXT column since we now use category_id UUID foreign key
-- This migration completes the transition from TEXT category to category_id foreign key

-- Step 1: Drop dependent view first
DROP VIEW IF EXISTS public.menu_packages_readable CASCADE;

-- Step 2: Drop the old category column (it's no longer needed)
ALTER TABLE public.menu_packages 
DROP COLUMN IF EXISTS category CASCADE;

-- Step 3: Verify the change
COMMENT ON COLUMN public.menu_packages.category_id IS 'Foreign key to package_categories table (replaces old TEXT category column)';

