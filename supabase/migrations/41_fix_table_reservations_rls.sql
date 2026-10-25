-- Migration 41: Fix table_reservations RLS - ensure it's fully disabled
-- This fixes the "new row violates row level security policy" error

-- First, drop any existing RLS policies (if any)
DROP POLICY IF EXISTS table_reservations_select_policy ON public.table_reservations;
DROP POLICY IF EXISTS table_reservations_insert_policy ON public.table_reservations;
DROP POLICY IF EXISTS table_reservations_update_policy ON public.table_reservations;
DROP POLICY IF EXISTS table_reservations_delete_policy ON public.table_reservations;

-- Disable RLS completely
ALTER TABLE public.table_reservations DISABLE ROW LEVEL SECURITY;

-- Ensure proper grants
GRANT SELECT ON public.table_reservations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.table_reservations TO authenticated, service_role;
GRANT ALL ON public.table_reservations TO service_role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Disabled RLS on table_reservations';
    RAISE NOTICE '✅ Granted full permissions';
    RAISE NOTICE '✅ Table reservations should work now';
END $$;
