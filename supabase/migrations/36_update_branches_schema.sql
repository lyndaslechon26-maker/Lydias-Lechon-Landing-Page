-- Simple migration: Add location column to branches table
-- This assumes branches table exists but may have different columns

-- Add location column if it doesn't exist
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS location TEXT;

-- Set a default value for existing rows
UPDATE public.branches
SET location = name || ' Branch'
WHERE location IS NULL OR location = '';

-- Make location NOT NULL after setting defaults
ALTER TABLE public.branches ALTER COLUMN location SET NOT NULL;

-- Drop old columns if they exist (won't error if they don't)
ALTER TABLE public.branches DROP COLUMN IF EXISTS address;
ALTER TABLE public.branches DROP COLUMN IF EXISTS city;
ALTER TABLE public.branches DROP COLUMN IF EXISTS region;

-- Drop old index if exists
DROP INDEX IF EXISTS idx_branches_region;

-- Add comment
COMMENT ON COLUMN public.branches.location IS 'Full formatted location (address, city, region)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added location column to branches table';
    RAISE NOTICE '✅ Dropped old columns if they existed';
END $$;
