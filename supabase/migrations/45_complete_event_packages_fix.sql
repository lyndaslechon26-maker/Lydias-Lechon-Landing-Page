-- =====================================================
-- COMPLETE EVENT PACKAGES FIX
-- Add columns, seed data, and fix RLS
-- =====================================================

-- Step 1: Add missing columns if they don't exist
ALTER TABLE event_packages 
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS price_per_person DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Step 2: Disable RLS for public access
ALTER TABLE event_packages DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant permissions
GRANT SELECT ON event_packages TO anon;
GRANT SELECT ON event_packages TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Clear existing data
TRUNCATE TABLE event_packages CASCADE;

-- Step 5: Insert event packages data
INSERT INTO event_packages (
  name, 
  description, 
  short_description,
  base_price, 
  price_per_person,
  min_guests, 
  max_guests, 
  duration_hours,
  inclusions, 
  event_type,
  featured_image,
  image_url,
  slug,
  is_available,
  is_active,
  is_featured,
  display_order
) VALUES
-- Wedding Packages
(
  'Classic Wedding Package',
  'A beautiful traditional wedding celebration with all the essentials including our signature lechon, elegant venue setup, and professional coordination. Perfect for couples seeking timeless elegance.',
  'Beautiful traditional wedding with signature lechon',
  150000.00,
  1200.00,
  100,
  200,
  8,
  ARRAY['Whole Lechon', 'Full Buffet Setup', 'Venue Decoration', 'Tables & Chairs', 'Sound System', 'Coordination'],
  'wedding',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
  'classic-wedding-package',
  true,
  true,
  true,
  1
),
(
  'Grand Wedding Package',
  'An unforgettable luxury wedding experience featuring premium menu selections, exquisite decorations, live entertainment, and full event coordination. Make your special day truly spectacular.',
  'Luxury wedding with premium menu and entertainment',
  300000.00,
  2500.00,
  150,
  300,
  10,
  ARRAY['Premium Lechon', 'Gourmet Buffet', 'Premium Decorations', 'Live Band', 'Photo & Video', 'Full Coordination'],
  'wedding',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
  'grand-wedding-package',
  true,
  true,
  true,
  2
),
-- Birthday Packages
(
  'Kids Birthday Bash',
  'A fun-filled birthday celebration for children featuring kid-friendly menu, colorful decorations, entertainment, and party games. Create magical memories for your little ones.',
  'Fun kids party with entertainment and games',
  25000.00,
  450.00,
  30,
  80,
  4,
  ARRAY['Lechon Kawali', 'Kids Menu', 'Balloons & Decorations', 'Clown/Magician', 'Party Games', 'Cake'],
  'birthday',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
  'kids-birthday-bash',
  true,
  true,
  false,
  3
),
(
  'Adult Birthday Celebration',
  'Sophisticated birthday party package featuring delicious food, elegant setup, and entertainment. Perfect for milestone celebrations and adult gatherings.',
  'Elegant adult birthday party',
  50000.00,
  800.00,
  50,
  120,
  5,
  ARRAY['Whole Lechon', 'Complete Buffet', 'Elegant Setup', 'Sound System', 'Party Host', 'Cake'],
  'birthday',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
  'adult-birthday-celebration',
  true,
  true,
  false,
  4
),
-- Corporate Packages
(
  'Corporate Event Package',
  'Professional corporate event setup perfect for company gatherings, team building, and business celebrations. Includes complete catering and venue coordination.',
  'Professional corporate event with catering',
  80000.00,
  850.00,
  80,
  200,
  6,
  ARRAY['Lechon', 'Business Buffet', 'Professional Setup', 'AV Equipment', 'WiFi', 'Coordination'],
  'corporate',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
  'corporate-event-package',
  true,
  true,
  true,
  5
),
(
  'Executive Conference Package',
  'Premium corporate package for high-level meetings and conferences. Features executive menu, professional AV setup, and dedicated event coordination.',
  'Premium executive conference setup',
  120000.00,
  1200.00,
  50,
  150,
  8,
  ARRAY['Premium Menu', 'Conference Setup', 'Full AV System', 'High-Speed WiFi', 'Secretary Services'],
  'corporate',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
  'executive-conference-package',
  true,
  true,
  false,
  6
),
-- Baptism Packages
(
  'Baptism Celebration Package',
  'Intimate baptism celebration with traditional Filipino food and elegant decorations. Perfect for this special spiritual milestone.',
  'Traditional baptism celebration',
  35000.00,
  600.00,
  40,
  100,
  4,
  ARRAY['Lechon', 'Traditional Buffet', 'Church Coordination', 'Decorations', 'Photo Coverage'],
  'baptism',
  'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=800',
  'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=800',
  'baptism-celebration-package',
  true,
  true,
  false,
  7
),
-- Fiesta Packages
(
  'Barangay Fiesta Package',
  'Grand community fiesta celebration featuring our signature lechon and traditional Filipino favorites. Perfect for large gatherings and community events.',
  'Grand fiesta for community celebrations',
  100000.00,
  500.00,
  200,
  500,
  6,
  ARRAY['Multiple Lechon', 'Fiesta Buffet', 'Stage & Sound', 'Tables & Chairs', 'Community Setup'],
  'fiesta',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  'barangay-fiesta-package',
  true,
  true,
  false,
  8
);

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_packages_event_type ON event_packages(event_type);
CREATE INDEX IF NOT EXISTS idx_event_packages_slug ON event_packages(slug);
CREATE INDEX IF NOT EXISTS idx_event_packages_is_active ON event_packages(is_active);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Event packages table updated and seeded successfully!';
  RAISE NOTICE '📦 8 event packages added';
  RAISE NOTICE '🔓 RLS disabled for public access';
END $$;
