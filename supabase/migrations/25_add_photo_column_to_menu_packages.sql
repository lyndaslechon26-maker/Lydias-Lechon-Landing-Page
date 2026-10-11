-- Add photo column to menu_packages table
-- This stores base64 encoded images or image URLs

-- Add photo column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'menu_packages' 
        AND column_name = 'photo'
    ) THEN
        ALTER TABLE public.menu_packages 
        ADD COLUMN photo TEXT;
        
        COMMENT ON COLUMN public.menu_packages.photo IS 'Base64 encoded image or image URL for the menu package';
    END IF;
END $$;
