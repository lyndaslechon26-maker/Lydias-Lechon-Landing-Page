-- =====================================================
-- FIX MENU ITEMS AVAILABILITY
-- Set all existing menu items to available
-- =====================================================

-- Update all menu items to be available by default
UPDATE public.menu_items
SET is_available = true
WHERE is_available = false OR is_available IS NULL;

-- Ensure the column has a default value for future inserts
ALTER TABLE public.menu_items 
ALTER COLUMN is_available SET DEFAULT true;

-- Add comment
COMMENT ON COLUMN public.menu_items.is_available IS 
'Whether this menu item is currently available for ordering. Defaults to true.';
