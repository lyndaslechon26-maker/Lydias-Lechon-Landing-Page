-- Add is_best_selling column to menu_items table
-- Maximum of 5 items can be marked as best selling
-- These items will be displayed on the landing page

-- Add the column
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS is_best_selling BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN public.menu_items.is_best_selling IS 'Mark as best selling item (max 5 items can be marked)';

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_menu_items_best_selling 
ON public.menu_items(is_best_selling) 
WHERE is_best_selling = TRUE;

-- Add constraint check function to limit to 5 best selling items
CREATE OR REPLACE FUNCTION check_best_selling_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_best_selling = TRUE THEN
        IF (SELECT COUNT(*) FROM menu_items WHERE is_best_selling = TRUE AND id != NEW.id) >= 5 THEN
            RAISE EXCEPTION 'Maximum of 5 items can be marked as best selling';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the limit
DROP TRIGGER IF EXISTS enforce_best_selling_limit ON public.menu_items;
CREATE TRIGGER enforce_best_selling_limit
    BEFORE INSERT OR UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION check_best_selling_limit();
