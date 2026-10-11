-- Rename event_menu_packages table to menu_packages
-- This makes the table name cleaner and more accurate

-- Step 1: Rename the table
ALTER TABLE public.event_menu_packages 
RENAME TO menu_packages;

-- Step 2: Rename indexes to match new table name
ALTER INDEX IF EXISTS idx_event_menu_packages_category 
RENAME TO idx_menu_packages_category;

ALTER INDEX IF EXISTS idx_event_menu_packages_active 
RENAME TO idx_menu_packages_active;

-- Step 3: Rename the updated_at trigger function
ALTER FUNCTION update_event_menu_packages_updated_at() 
RENAME TO update_menu_packages_updated_at;

-- Step 4: Drop and recreate trigger with new name
DROP TRIGGER IF EXISTS update_event_menu_packages_updated_at ON public.menu_packages;

CREATE TRIGGER update_menu_packages_updated_at
    BEFORE UPDATE ON public.menu_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_packages_updated_at();

-- Step 5: Update column comments to reference new table name
COMMENT ON TABLE public.menu_packages IS 'Menu packages for catering (buffet, plated meals, drinks, desserts)';
COMMENT ON COLUMN public.menu_packages.bundle_price IS 'Total package/bundle price in pesos (not per person)';
COMMENT ON COLUMN public.menu_packages.serves_persons IS 'Number of persons this package can serve (capacity)';
COMMENT ON COLUMN public.menu_packages.items IS 'Menu items with quantity and details as JSONB array: [{"name": "...", "quantity": 1, "description": "...", "is_signature": false}]';

-- Step 6: Verify permissions are maintained
GRANT ALL ON public.menu_packages TO authenticated;
GRANT ALL ON public.menu_packages TO anon;
GRANT ALL ON public.menu_packages TO service_role;

-- Step 7: Handle sequence rename if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'event_menu_packages_id_seq') THEN
        ALTER SEQUENCE public.event_menu_packages_id_seq RENAME TO menu_packages_id_seq;
        
        -- Re-grant permissions on renamed sequence
        GRANT USAGE, SELECT ON SEQUENCE public.menu_packages_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE public.menu_packages_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE public.menu_packages_id_seq TO service_role;
    END IF;
END $$;
