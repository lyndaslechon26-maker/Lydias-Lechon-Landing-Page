-- Add is_best_selling column to menu_packages table
-- Similar to menu_items, but for packages

-- Step 1: Add the column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'menu_packages' 
        AND column_name = 'is_best_selling'
    ) THEN
        ALTER TABLE public.menu_packages 
        ADD COLUMN is_best_selling BOOLEAN DEFAULT false NOT NULL;
        
        COMMENT ON COLUMN public.menu_packages.is_best_selling IS 'Mark as best selling package (maximum 5 packages)';
    END IF;
END $$;

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_menu_packages_best_selling 
ON public.menu_packages(is_best_selling) 
WHERE is_best_selling = true;

-- Step 3: Create trigger function to enforce maximum 5 best selling packages
CREATE OR REPLACE FUNCTION check_menu_packages_best_selling_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INT;
BEGIN
    -- Only check if setting to true
    IF NEW.is_best_selling = true THEN
        -- Count current best selling packages (excluding current row if updating)
        SELECT COUNT(*) INTO current_count
        FROM menu_packages
        WHERE is_best_selling = true
        AND id != NEW.id;
        
        -- If already at limit, reject the change
        IF current_count >= 5 THEN
            RAISE EXCEPTION 'Maximum 5 best selling packages allowed. Please unmark another package first.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger
DROP TRIGGER IF EXISTS trigger_check_menu_packages_best_selling_limit ON public.menu_packages;

CREATE TRIGGER trigger_check_menu_packages_best_selling_limit
    BEFORE INSERT OR UPDATE OF is_best_selling
    ON public.menu_packages
    FOR EACH ROW
    EXECUTE FUNCTION check_menu_packages_best_selling_limit();
