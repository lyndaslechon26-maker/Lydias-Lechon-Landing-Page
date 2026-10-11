-- Convert items column from TEXT[] to JSONB to support objects with quantity
-- This migration handles existing TEXT[] data by converting each string to an object

-- Step 1: Add temporary JSONB column
ALTER TABLE public.event_menu_packages 
ADD COLUMN items_jsonb JSONB DEFAULT '[]'::jsonb;

-- Step 2: Transform existing TEXT[] data to JSONB format
-- Each string item becomes {"name": "item", "quantity": 1, "description": "", "is_signature": false}
UPDATE public.event_menu_packages
SET items_jsonb = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', item_name,
      'quantity', 1,
      'description', '',
      'is_signature', false
    )
  )
  FROM unnest(items) AS item_name
)
WHERE items IS NOT NULL AND array_length(items, 1) > 0;

-- Step 3: Handle empty or null arrays
UPDATE public.event_menu_packages
SET items_jsonb = '[]'::jsonb
WHERE items IS NULL OR array_length(items, 1) IS NULL;

-- Step 4: Drop the old TEXT[] column
ALTER TABLE public.event_menu_packages 
DROP COLUMN items;

-- Step 5: Rename the new JSONB column to 'items'
ALTER TABLE public.event_menu_packages 
RENAME COLUMN items_jsonb TO items;

-- Step 6: Add NOT NULL constraint if needed (optional, keep flexible for now)
-- ALTER TABLE public.event_menu_packages ALTER COLUMN items SET NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN public.event_menu_packages.items IS 'Menu items with quantity and details as JSONB array: [{"name": "...", "quantity": 1, "description": "...", "is_signature": false}]';
