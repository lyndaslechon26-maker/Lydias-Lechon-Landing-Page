-- Migration 40: Create table_reservations table for restaurant table bookings
-- This is separate from event_bookings (which is for venue bookings)

-- Create table_reservations table
CREATE TABLE IF NOT EXISTS public.table_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer info (linked to event_customers)
    customer_id UUID NOT NULL REFERENCES public.event_customers(id) ON DELETE CASCADE,
    
    -- Reservation details
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    num_guests INTEGER NOT NULL CHECK (num_guests >= 1 AND num_guests <= 20),
    special_requests TEXT,
    
    -- Branch (optional - can add later)
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    
    -- Contact info (denormalized for quick access)
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT
);

-- Add indexes
CREATE INDEX idx_table_reservations_customer ON public.table_reservations(customer_id);
CREATE INDEX idx_table_reservations_date ON public.table_reservations(reservation_date);
CREATE INDEX idx_table_reservations_status ON public.table_reservations(status);
CREATE INDEX idx_table_reservations_branch ON public.table_reservations(branch_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_table_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_table_reservations_updated_at
    BEFORE UPDATE ON public.table_reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_table_reservations_updated_at();

-- Disable RLS, use GRANT permissions
ALTER TABLE public.table_reservations DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.table_reservations TO anon, authenticated;
GRANT ALL ON public.table_reservations TO authenticated, service_role;

-- Add comments
COMMENT ON TABLE public.table_reservations IS 'Restaurant table reservations (dine-in bookings)';
COMMENT ON COLUMN public.table_reservations.status IS 'Reservation status: pending, confirmed, cancelled, completed, no_show';
COMMENT ON COLUMN public.table_reservations.num_guests IS 'Number of guests (1-20)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Created table_reservations table';
    RAISE NOTICE '✅ Added indexes and triggers';
    RAISE NOTICE '✅ Granted permissions (RLS disabled)';
    RAISE NOTICE '✅ Ready for table booking feature';
END $$;
