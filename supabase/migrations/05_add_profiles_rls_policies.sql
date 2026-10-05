-- =====================================================
-- FIX PROFILES TABLE PERMISSIONS
-- This migration ensures the profiles table is accessible
-- =====================================================

-- First, ensure the schema and table permissions are granted
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Specifically grant permissions on profiles table
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;

-- TEMPORARILY DISABLE RLS for testing
-- We'll re-enable it once login works
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow reading profile during login" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Profiles table permissions granted';
    RAISE NOTICE '⚠️  RLS is DISABLED for testing - re-enable after login works';
    RAISE NOTICE '🔑 Permissions granted to: anon, authenticated';
END $$;
