-- Fix RLS policies for event_customers to allow public signup
-- The issue: RLS policies only allow managers to INSERT, blocking public signups

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Managers can create customers" ON public.event_customers;

-- Create new policies that allow public signup
CREATE POLICY "Anyone can create customer account"
    ON public.event_customers FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view own customer profile"
    ON public.event_customers FOR SELECT
    TO authenticated
    USING (auth_id = auth.uid() OR email = auth.email());

-- Allow users to update their own profile
CREATE POLICY "Users can update own customer profile"
    ON public.event_customers FOR UPDATE
    TO authenticated
    USING (auth_id = auth.uid())
    WITH CHECK (auth_id = auth.uid());

-- Keep manager policy for viewing all customers
-- (This policy already exists: "Managers can view all customers")

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Fixed RLS policies for event_customers table';
    RAISE NOTICE '✅ Public signup is now enabled';
    RAISE NOTICE '✅ Users can view and update their own profile';
END $$;
