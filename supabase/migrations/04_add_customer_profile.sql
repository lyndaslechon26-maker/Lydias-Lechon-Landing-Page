-- Add customer profile for aizenjhakerivera06@gmail.com
-- Run this migration after the user has signed up via auth

-- First, find the auth user ID (you'll need to replace this with actual UUID)
-- This is a template - you need to get the actual auth_id from Supabase auth.users table

-- Example INSERT (replace 'YOUR_AUTH_ID_HERE' with actual UUID from auth.users):
-- INSERT INTO event_customers (auth_id, full_name, email, phone, created_at, updated_at)
-- VALUES (
--   'YOUR_AUTH_ID_HERE',
--   'Your Name',
--   'aizenjhakerivera06@gmail.com',
--   '+639123456789',
--   now(),
--   now()
-- )
-- ON CONFLICT (auth_id) DO NOTHING;

-- To get your auth_id, run this query in Supabase SQL Editor:
-- SELECT id, email FROM auth.users WHERE email = 'aizenjhakerivera06@gmail.com';

-- Then replace YOUR_AUTH_ID_HERE above with the id value and run the INSERT
