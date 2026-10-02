-- =====================================================
-- CREATE FIRST MANAGER ACCOUNT
-- Run this AFTER creating a user in Supabase Auth
-- =====================================================

-- Instructions:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create a new user with:
--    - Email: your-email@example.com
--    - Password: (your password)
--    - Auto Confirm User: YES
-- 3. Copy the user ID from the dashboard
-- 4. Replace 'YOUR-USER-ID-HERE' below with the actual user ID
-- 5. Run this migration

-- Insert manager profile
-- IMPORTANT: Replace 'YOUR-USER-ID-HERE' with actual user ID from Supabase Auth
INSERT INTO profiles (id, email, full_name, role, phone, is_active)
VALUES (
    'YOUR-USER-ID-HERE'::uuid,  -- Replace with actual user ID
    'manager@lydiaslechon.com',  -- Replace with actual email
    'Landing Page Manager',      -- Replace with actual name
    'landing_page_manager',
    '+63 XXX XXX XXXX',         -- Replace with actual phone
    true
)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    updated_at = now();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Manager profile created!';
    RAISE NOTICE '📧 You can now login with your Supabase Auth credentials';
    RAISE NOTICE '🎯 Role: landing_page_manager';
END $$;
