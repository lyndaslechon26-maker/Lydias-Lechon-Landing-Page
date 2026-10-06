-- Fix permissions for event_menu_packages table
-- Disable RLS and add proper GRANT permissions to avoid permission denied errors

-- Disable RLS (same approach as profiles table)
ALTER TABLE public.event_menu_packages DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active menu packages" ON public.event_menu_packages;
DROP POLICY IF EXISTS "Managers can manage menu packages" ON public.event_menu_packages;

-- Grant permissions to authenticated users
GRANT ALL ON public.event_menu_packages TO authenticated;
GRANT ALL ON public.event_menu_packages TO anon;
GRANT ALL ON public.event_menu_packages TO service_role;

-- Grant usage on sequence if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'event_menu_packages_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE public.event_menu_packages_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE public.event_menu_packages_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE public.event_menu_packages_id_seq TO service_role;
    END IF;
END $$;
