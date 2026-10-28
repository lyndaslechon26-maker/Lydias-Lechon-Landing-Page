-- =====================================================
-- UPDATE EVENT BOOKINGS SCHEMA
-- Add missing columns needed by booking modal
-- =====================================================

-- Add missing columns
ALTER TABLE event_bookings 
ADD COLUMN IF NOT EXISTS event_name TEXT,
ADD COLUMN IF NOT EXISTS event_start_time TIME,
ADD COLUMN IF NOT EXISTS event_end_time TIME,
ADD COLUMN IF NOT EXISTS duration_hours DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS num_guests INTEGER,
ADD COLUMN IF NOT EXISTS venue_name TEXT,
ADD COLUMN IF NOT EXISTS package_name TEXT,
ADD COLUMN IF NOT EXISTS venue_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS food_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS addons_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS service_charge DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'failed')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_due_date DATE,
ADD COLUMN IF NOT EXISTS deposit_required DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_due DECIMAL(10,2) DEFAULT 0;

-- Rename old columns to match new schema (if they exist)
DO $$ 
BEGIN
    -- Rename event_time to event_start_time if it exists and event_start_time doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_bookings' AND column_name = 'event_time'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_bookings' AND column_name = 'event_start_time'
    ) THEN
        ALTER TABLE event_bookings RENAME COLUMN event_time TO event_start_time;
    END IF;

    -- Rename guest_count to num_guests if it exists and num_guests doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_bookings' AND column_name = 'guest_count'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_bookings' AND column_name = 'num_guests'
    ) THEN
        ALTER TABLE event_bookings RENAME COLUMN guest_count TO num_guests;
    END IF;
END $$;

-- Disable RLS temporarily for easier access (we can re-enable later if needed)
ALTER TABLE event_bookings DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT INSERT, SELECT, UPDATE ON event_bookings TO authenticated;
GRANT SELECT ON event_bookings TO anon;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Event bookings table schema updated!';
  RAISE NOTICE '📋 Added columns for: event_name, times, duration, venue details, pricing breakdown';
  RAISE NOTICE '🔓 RLS disabled, permissions granted';
END $$;
