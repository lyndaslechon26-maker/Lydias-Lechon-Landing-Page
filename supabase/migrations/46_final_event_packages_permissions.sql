-- =====================================================
-- FINAL EVENT PACKAGES PERMISSIONS FIX
-- Ensure event_packages can be read by everyone
-- =====================================================

-- Disable RLS completely
ALTER TABLE event_packages DISABLE ROW LEVEL SECURITY;

-- Remove any existing policies
DROP POLICY IF EXISTS "event_packages_select_policy" ON event_packages;
DROP POLICY IF EXISTS "Packages are publicly readable" ON event_packages;
DROP POLICY IF EXISTS "Managers can manage packages" ON event_packages;

-- Grant full permissions to read
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON event_packages TO anon;
GRANT SELECT ON event_packages TO authenticated;

-- Verify the table is accessible
DO $$
BEGIN
  RAISE NOTICE '✅ Event packages permissions set!';
  RAISE NOTICE '📊 RLS disabled - public read access enabled';
END $$;
