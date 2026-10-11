-- =====================================================
-- ADD IMAGE_URL COLUMN TO MENU_ITEMS
-- Add image_url field to store menu item images
-- =====================================================

-- Add image_url column
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment
COMMENT ON COLUMN public.menu_items.image_url IS 'URL or base64 data URI for menu item image';

-- Show statistics
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Added image_url column to menu_items';
    RAISE NOTICE '========================================';
END $$;
