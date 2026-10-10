-- =====================================================
-- CREATE STORAGE BUCKETS FOR IMAGES
-- Set up public buckets for menu items and profile images
-- =====================================================

-- Create restaurant-images bucket (for menu items, venues, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'restaurant-images',
  'restaurant-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Create profile-images bucket (for user profiles)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Set up RLS policies for restaurant-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for restaurant images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload restaurant images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update restaurant images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete restaurant images" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for restaurant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'restaurant-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload restaurant images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'restaurant-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update restaurant images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'restaurant-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete restaurant images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'restaurant-images');

-- Set up RLS policies for profile-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete profile images" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');

-- Show success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Storage Buckets Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Buckets created:';
    RAISE NOTICE '  1. restaurant-images (5MB limit, public)';
    RAISE NOTICE '  2. profile-images (2MB limit, public)';
    RAISE NOTICE '';
    RAISE NOTICE 'Permissions:';
    RAISE NOTICE '  - Public: Read access';
    RAISE NOTICE '  - Authenticated: Upload, update, delete';
    RAISE NOTICE '========================================';
END $$;
