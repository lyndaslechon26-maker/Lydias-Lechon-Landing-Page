-- =====================================================
-- FIX EVENT_TIME COLUMN
-- Make it nullable so we can use event_start_time instead
-- =====================================================

-- Make event_time nullable
ALTER TABLE event_bookings 
ALTER COLUMN event_time DROP NOT NULL;

-- Also make guest_count nullable if it exists (we use num_guests now)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_bookings' AND column_name = 'guest_count'
    ) THEN
        ALTER TABLE event_bookings ALTER COLUMN guest_count DROP NOT NULL;
    END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Event bookings table updated!';
  RAISE NOTICE '📋 event_time is now nullable';
END $$;
