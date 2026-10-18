-- Test query to check branches table data
-- Run this in Supabase SQL Editor to see what's in the table

-- 1. Check if table exists and see all columns
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'branches' 
ORDER BY ordinal_position;

-- 2. Count total branches
SELECT COUNT(*) as total_branches FROM public.branches;

-- 3. Count active branches
SELECT COUNT(*) as active_branches FROM public.branches WHERE is_active = true;

-- 4. See all branches data
SELECT 
    id,
    name,
    location,
    phone,
    hours,
    landmark,
    has_dine_in,
    has_takeout,
    has_delivery,
    has_catering,
    has_event_venue,
    is_active,
    sort_order
FROM public.branches
ORDER BY sort_order;

-- 5. Check RLS policies
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'branches';

-- 6. Check table permissions
SELECT 
    grantee,
    privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'branches';
