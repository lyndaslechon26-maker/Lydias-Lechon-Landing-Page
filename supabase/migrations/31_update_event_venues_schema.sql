-- Migration: Update event_venues table schema
-- Description: Rename and add columns to match the manager UI expectations
-- Date: 2026-10-12

-- Step 1: Rename columns
ALTER TABLE public.event_venues 
  RENAME COLUMN base_price TO base_rate;

ALTER TABLE public.event_venues 
  RENAME COLUMN features TO amenities;

ALTER TABLE public.event_venues 
  RENAME COLUMN images TO photos;

-- Step 2: Add new columns for capacity range
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS capacity_min integer,
  ADD COLUMN IF NOT EXISTS capacity_max integer;

-- Step 3: Migrate existing capacity data
-- Set capacity_min to 50% of capacity and capacity_max to capacity
UPDATE public.event_venues 
SET 
  capacity_min = GREATEST(CAST(capacity * 0.5 AS integer), 10),
  capacity_max = capacity
WHERE capacity_min IS NULL;

-- Step 4: Add location column (for venue location/address)
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS location text;

-- Set location to a default if null (can be updated later)
UPDATE public.event_venues 
SET location = 'Main Location'
WHERE location IS NULL;

-- Step 5: Rename is_available to is_active for consistency
ALTER TABLE public.event_venues 
  RENAME COLUMN is_available TO is_active;

-- Step 6: Make new columns NOT NULL after data migration
ALTER TABLE public.event_venues 
  ALTER COLUMN capacity_min SET NOT NULL,
  ALTER COLUMN capacity_max SET NOT NULL,
  ALTER COLUMN location SET NOT NULL;

-- Step 7: Drop old capacity column (no longer needed)
ALTER TABLE public.event_venues 
  DROP COLUMN IF EXISTS capacity;

-- Step 8: Add check constraint for capacity range
ALTER TABLE public.event_venues
  ADD CONSTRAINT check_capacity_range 
  CHECK (capacity_max >= capacity_min);

-- Step 9: Update index
DROP INDEX IF EXISTS idx_event_venues_available;
CREATE INDEX IF NOT EXISTS idx_event_venues_active ON public.event_venues(is_active);

-- Step 10: Add comments
COMMENT ON COLUMN public.event_venues.base_rate IS 'Base rental rate for the venue';
COMMENT ON COLUMN public.event_venues.capacity_min IS 'Minimum guest capacity';
COMMENT ON COLUMN public.event_venues.capacity_max IS 'Maximum guest capacity';
COMMENT ON COLUMN public.event_venues.location IS 'Physical location or address of the venue';
COMMENT ON COLUMN public.event_venues.amenities IS 'Array of amenities/features (e.g., Air Conditioning, Stage, etc.)';
COMMENT ON COLUMN public.event_venues.photos IS 'Array of venue photos in base64 or URLs';
COMMENT ON COLUMN public.event_venues.is_active IS 'Whether the venue is active and available for booking';

-- Step 11: Update RLS policies (rename from is_available to is_active)
DROP POLICY IF EXISTS "Venues are publicly readable" ON public.event_venues;

CREATE POLICY "Venues are publicly readable"
  ON public.event_venues
  FOR SELECT
  USING (is_active = true);

-- Grant permissions (maintain existing GRANT setup)
GRANT ALL ON public.event_venues TO authenticated;
GRANT SELECT ON public.event_venues TO anon;
