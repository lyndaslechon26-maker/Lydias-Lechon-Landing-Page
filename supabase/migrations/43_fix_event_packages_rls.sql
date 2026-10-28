-- =====================================================
-- FIX EVENT PACKAGES RLS FOR PUBLIC ACCESS
-- =====================================================

-- Disable RLS entirely for event_packages (since it's public data)
ALTER TABLE event_packages DISABLE ROW LEVEL SECURITY;

-- Grant SELECT permission to all users
GRANT SELECT ON event_packages TO anon;
GRANT SELECT ON event_packages TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Also ensure menu_packages has public read access
ALTER TABLE menu_packages DISABLE ROW LEVEL SECURITY;

GRANT SELECT ON menu_packages TO anon;
GRANT SELECT ON menu_packages TO authenticated;

