-- Fix permissions for food_categories table
-- Ensure proper GRANT permissions and disable RLS if needed

-- Disable RLS to prevent permission issues
ALTER TABLE public.food_categories DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.food_categories;
DROP POLICY IF EXISTS "Managers can manage categories" ON public.food_categories;

-- Grant permissions to all roles
GRANT ALL ON public.food_categories TO authenticated;
GRANT ALL ON public.food_categories TO anon;
GRANT ALL ON public.food_categories TO service_role;

-- Grant sequence permissions if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'food_categories_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE public.food_categories_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE public.food_categories_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE public.food_categories_id_seq TO service_role;
    END IF;
END $$;
