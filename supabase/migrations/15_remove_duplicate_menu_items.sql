-- =====================================================
-- REMOVE DUPLICATE MENU ITEMS
-- Keep only the most recent version of each duplicate
-- =====================================================

-- Step 1: Identify and delete duplicate menu items
-- Keep the item with the latest created_at timestamp
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

-- Step 2: Show statistics
DO $$
DECLARE
    total_items INTEGER;
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_items FROM public.menu_items;
    
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT LOWER(TRIM(name)), COUNT(*) as cnt
        FROM public.menu_items
        GROUP BY LOWER(TRIM(name))
        HAVING COUNT(*) > 1
    ) dups;
    
    RAISE NOTICE 'Cleanup Complete:';
    RAISE NOTICE '  Total items remaining: %', total_items;
    RAISE NOTICE '  Items with duplicates: %', duplicate_count;
END $$;
