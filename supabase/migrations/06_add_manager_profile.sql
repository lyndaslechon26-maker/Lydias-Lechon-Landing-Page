-- =====================================================
-- ADD MANAGER PROFILE FOR aizenjhakerivera06@gmail.com
-- =====================================================

-- IMPORTANT INSTRUCTIONS:
-- 1. First, get your auth user ID from Supabase Dashboard:
--    - Go to: https://fnbwavqrxwaftfatzkyg.supabase.co/project/fnbwavqrxwaftfatzkyg/auth/users
--    - Find user: aizenjhakerivera06@gmail.com
--    - Copy the UUID (looks like: 12345678-1234-1234-1234-123456789abc)
-- 
-- 2. Replace 'REPLACE-WITH-YOUR-AUTH-USER-ID' below with that UUID
--
-- 3. Run this migration in Supabase SQL Editor

-- Insert or update manager profile
-- Replace the UUID below with your actual auth user ID
INSERT INTO profiles (id, email, full_name, role, phone, is_active)
VALUES (
    'REPLACE-WITH-YOUR-AUTH-USER-ID'::uuid,  -- ⚠️ REPLACE THIS
    'aizenjhakerivera06@gmail.com',
    'Aizen Jhake Rivera',
    'landing_page_manager',
    NULL,  -- Add phone if needed
    true
)
ON CONFLICT (id) DO UPDATE SET
    role = 'landing_page_manager',
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_active = true,
    updated_at = now();

-- Verify the profile was created
DO $$
DECLARE
    profile_count integer;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM profiles
    WHERE email = 'aizenjhakerivera06@gmail.com';
    
    IF profile_count > 0 THEN
        RAISE NOTICE '✅ Manager profile created/updated successfully!';
        RAISE NOTICE '📧 Email: aizenjhakerivera06@gmail.com';
        RAISE NOTICE '👤 Role: landing_page_manager';
        RAISE NOTICE '🔐 You can now login at: /events/login';
    ELSE
        RAISE EXCEPTION '❌ Profile was not created. Check if you replaced the UUID correctly.';
    END IF;
END $$;
