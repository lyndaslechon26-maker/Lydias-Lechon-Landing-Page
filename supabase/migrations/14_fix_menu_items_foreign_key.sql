-- =====================================================
-- FIX MENU_ITEMS FOREIGN KEY RELATIONSHIP
-- Clean up orphaned references and add proper foreign key
-- =====================================================

-- Step 1: Set orphaned category_id values to NULL
-- (where category_id doesn't exist in food_categories)
UPDATE public.menu_items
SET category_id = NULL
WHERE category_id IS NOT NULL
  AND category_id NOT IN (SELECT id FROM public.food_categories);

-- Step 2: Drop existing foreign key constraint if it exists
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

-- Step 3: Add the proper foreign key constraint
ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES public.food_categories(id)
ON DELETE SET NULL;

-- Step 4: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id 
ON public.menu_items(category_id);

-- Step 5: Add comment
COMMENT ON COLUMN public.menu_items.category_id IS 
'Foreign key reference to food_categories table. NULL = uncategorized.';

-- Step 6: Show statistics
DO $$
DECLARE
    total_items INTEGER;
    categorized_items INTEGER;
    uncategorized_items INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_items FROM public.menu_items;
    SELECT COUNT(*) INTO categorized_items FROM public.menu_items WHERE category_id IS NOT NULL;
    SELECT COUNT(*) INTO uncategorized_items FROM public.menu_items WHERE category_id IS NULL;
    
    RAISE NOTICE 'Menu Items Statistics:';
    RAISE NOTICE '  Total items: %', total_items;
    RAISE NOTICE '  Categorized: %', categorized_items;
    RAISE NOTICE '  Uncategorized: %', uncategorized_items;
END $$;
