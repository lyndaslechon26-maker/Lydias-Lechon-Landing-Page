-- Add missing columns to event_customers table
ALTER TABLE public.event_customers 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for auth_id
CREATE INDEX IF NOT EXISTS idx_event_customers_auth_id ON public.event_customers(auth_id);

-- Add comments
COMMENT ON COLUMN public.event_customers.address IS 'Customer address for delivery/event bookings';
COMMENT ON COLUMN public.event_customers.auth_id IS 'Link to Supabase Auth user';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added address and auth_id columns to event_customers table';
END $$;
