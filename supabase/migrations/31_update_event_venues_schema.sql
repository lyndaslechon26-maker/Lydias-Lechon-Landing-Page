-- Migration: Update event_venues table schema
-- Description: Rename and add columns to match the manager UI expectations
-- Date: 2026-10-12
-- NOTE: This migration checks for column existence before attempting operations

-- =====================================================
-- STEP 1: Rename columns (only if they exist)
-- =====================================================

-- Rename base_price to base_rate (if base_price exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_venues' 
        AND column_name = 'base_price'
    ) THEN
        ALTER TABLE public.event_venues RENAME COLUMN base_price TO base_rate;
    END IF;
END $$;

-- Rename features to amenities (if features exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_venues' 
        AND column_name = 'features'
    ) THEN
        ALTER TABLE public.event_venues RENAME COLUMN features TO amenities;
    END IF;
END $$;

-- Rename is_available to is_active (if is_available exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_venues' 
        AND column_name = 'is_available'
    ) THEN
        ALTER TABLE public.event_venues RENAME COLUMN is_available TO is_active;
    END IF;
END $$;

-- =====================================================
-- STEP 2: Add missing columns
-- =====================================================

-- Add base_rate if it doesn't exist
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS base_rate decimal(10,2) DEFAULT 15000;

-- Add amenities if it doesn't exist
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}';

-- Add is_active if it doesn't exist
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add photos column (TEXT ARRAY)
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

-- Add capacity_min and capacity_max
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS capacity_min integer;
  
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS capacity_max integer;

-- Add location column
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS location text;

-- =====================================================
-- STEP 3: Migrate data
-- =====================================================

-- Migrate images jsonb to photos text array (if images column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_venues' 
        AND column_name = 'images'
    ) THEN
        -- Try to extract URLs from jsonb array
        UPDATE public.event_venues 
        SET photos = ARRAY(
          SELECT jsonb_array_elements_text(images)
        )
        WHERE images IS NOT NULL 
        AND jsonb_typeof(images) = 'array' 
        AND (photos IS NULL OR photos = '{}' OR cardinality(photos) = 0);
    END IF;
END $$;

-- Migrate image_url to photos array (if image_url column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_venues' 
        AND column_name = 'image_url'
    ) THEN
        UPDATE public.event_venues 
        SET photos = ARRAY[image_url]
        WHERE image_url IS NOT NULL 
        AND (photos IS NULL OR photos = '{}' OR cardinality(photos) = 0);
    END IF;
END $$;

-- Migrate capacity to capacity_min and capacity_max (if capacity column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_venues' 
        AND column_name = 'capacity'
    ) THEN
        UPDATE public.event_venues 
        SET 
          capacity_min = GREATEST(CAST(capacity * 0.5 AS integer), 10),
          capacity_max = capacity
        WHERE capacity_min IS NULL;
    END IF;
END $$;

-- Set default location if null
UPDATE public.event_venues 
SET location = COALESCE(name || ' - Main Location', 'Main Location')
WHERE location IS NULL;

-- =====================================================
-- STEP 4: Make columns NOT NULL
-- =====================================================

ALTER TABLE public.event_venues 
  ALTER COLUMN base_rate SET NOT NULL;

ALTER TABLE public.event_venues 
  ALTER COLUMN capacity_min SET NOT NULL;
  
ALTER TABLE public.event_venues 
  ALTER COLUMN capacity_max SET NOT NULL;
  
ALTER TABLE public.event_venues 
  ALTER COLUMN location SET NOT NULL;

-- =====================================================
-- STEP 5: Drop old columns (only if they exist)
-- =====================================================

ALTER TABLE public.event_venues 
  DROP COLUMN IF EXISTS capacity;
  
ALTER TABLE public.event_venues 
  DROP COLUMN IF EXISTS images;
  
ALTER TABLE public.event_venues 
  DROP COLUMN IF EXISTS image_url;

-- =====================================================
-- STEP 6: Add constraints
-- =====================================================

-- Drop existing constraint if exists
ALTER TABLE public.event_venues
  DROP CONSTRAINT IF EXISTS check_capacity_range;

-- Add capacity range check
ALTER TABLE public.event_venues
  ADD CONSTRAINT check_capacity_range 
  CHECK (capacity_max >= capacity_min);

-- =====================================================
-- STEP 7: Update indexes
-- =====================================================

DROP INDEX IF EXISTS idx_event_venues_available;
CREATE INDEX IF NOT EXISTS idx_event_venues_active ON public.event_venues(is_active);

-- =====================================================
-- STEP 8: Add column comments
-- =====================================================

COMMENT ON COLUMN public.event_venues.base_rate IS 'Base rental rate for the venue per day';
COMMENT ON COLUMN public.event_venues.capacity_min IS 'Minimum guest capacity';
COMMENT ON COLUMN public.event_venues.capacity_max IS 'Maximum guest capacity';
COMMENT ON COLUMN public.event_venues.location IS 'Physical location or address of the venue';
COMMENT ON COLUMN public.event_venues.amenities IS 'Array of amenities/features (e.g., Air Conditioning, Stage, etc.)';
COMMENT ON COLUMN public.event_venues.photos IS 'Array of venue photos in base64 or URLs';
COMMENT ON COLUMN public.event_venues.is_active IS 'Whether the venue is active and available for booking';

-- =====================================================
-- STEP 9: Update RLS policies
-- =====================================================

DROP POLICY IF EXISTS "Venues are publicly readable" ON public.event_venues;

CREATE POLICY "Venues are publicly readable"
  ON public.event_venues
  FOR SELECT
  USING (is_active = true);

-- =====================================================
-- STEP 10: Grant permissions
-- =====================================================

GRANT ALL ON public.event_venues TO authenticated;
GRANT SELECT ON public.event_venues TO anon;


