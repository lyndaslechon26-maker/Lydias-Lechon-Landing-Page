-- Migration: Add duration column to event_venues
-- Description: Add duration field for venue booking (Hourly, Half Day, Full Day)
-- Date: 2026-10-12

-- Add duration column
ALTER TABLE public.event_venues 
  ADD COLUMN IF NOT EXISTS duration text DEFAULT 'Full Day';

-- Add check constraint for valid duration values
ALTER TABLE public.event_venues
  DROP CONSTRAINT IF EXISTS check_duration_values;

ALTER TABLE public.event_venues
  ADD CONSTRAINT check_duration_values 
  CHECK (duration IN ('Hourly', 'Half Day', 'Full Day'));

-- Set default for existing rows
UPDATE public.event_venues 
SET duration = 'Full Day'
WHERE duration IS NULL;

-- Make column NOT NULL
ALTER TABLE public.event_venues 
  ALTER COLUMN duration SET NOT NULL;

-- Add comment
COMMENT ON COLUMN public.event_venues.duration IS 'Booking duration type: Hourly, Half Day, or Full Day';
