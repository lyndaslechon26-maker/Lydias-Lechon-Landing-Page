-- =====================================================
-- ADD IS_ALCOHOLIC COLUMN TO MENU_ITEMS
-- Add missing column for tracking alcoholic beverages
-- =====================================================

-- Add is_alcoholic column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'menu_items' 
        AND column_name = 'is_alcoholic'
    ) THEN
        ALTER TABLE public.menu_items 
        ADD COLUMN is_alcoholic BOOLEAN DEFAULT false NOT NULL;
    END IF;
END $$;

-- Add comment
COMMENT ON COLUMN public.menu_items.is_alcoholic IS 
'Whether this menu item contains alcohol. Defaults to false.';

-- Add index for filtering alcoholic items
CREATE INDEX IF NOT EXISTS idx_menu_items_is_alcoholic 
ON public.menu_items(is_alcoholic) 
WHERE is_alcoholic = true;

-- Show statistics
DO $$
DECLARE
    total_items INTEGER;
    alcoholic_items INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_items FROM public.menu_items;
    SELECT COUNT(*) INTO alcoholic_items FROM public.menu_items WHERE is_alcoholic = true;
    
    RAISE NOTICE 'Menu Items Statistics:';
    RAISE NOTICE '  Total items: %', total_items;
    RAISE NOTICE '  Alcoholic items: %', alcoholic_items;
    RAISE NOTICE '  Non-alcoholic items: %', total_items - alcoholic_items;
END $$;
