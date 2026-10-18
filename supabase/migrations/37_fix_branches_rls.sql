-- Fix RLS policies for branches table
-- Allow authenticated users (managers) to manage branches

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON public.branches;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.branches;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.branches;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.branches;

-- Disable RLS and use GRANT permissions instead (like other tables)
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.branches TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.branches TO authenticated;

-- Add comment
COMMENT ON TABLE public.branches IS 'Branch locations - RLS disabled, uses GRANT permissions';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Fixed branches RLS policies';
    RAISE NOTICE '✅ Disabled RLS, using GRANT permissions';
END $$;
