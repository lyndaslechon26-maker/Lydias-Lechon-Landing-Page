-- =====================================================
-- ADD MISSING COLUMNS TO EVENT_PACKAGES
-- =====================================================

-- Add event_type column if it doesn't exist
ALTER TABLE public.event_packages 
ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Add additional columns expected by the application
ALTER TABLE public.event_packages 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS price_per_person DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_packages_event_type 
ON public.event_packages(event_type);

CREATE INDEX IF NOT EXISTS idx_event_packages_slug 
ON public.event_packages(slug);

CREATE INDEX IF NOT EXISTS idx_event_packages_is_active 
ON public.event_packages(is_active);

-- Update existing packages to have defaults for new columns
UPDATE public.event_packages 
SET 
  event_type = COALESCE(event_type, 'general'),
  featured_image = COALESCE(featured_image, image_url),
  short_description = COALESCE(short_description, LEFT(description, 100)),
  duration_hours = COALESCE(duration_hours, 4),
  slug = COALESCE(slug, LOWER(REPLACE(name, ' ', '-'))),
  is_active = COALESCE(is_active, is_available)
WHERE event_type IS NULL 
   OR featured_image IS NULL 
   OR short_description IS NULL 
   OR slug IS NULL 
   OR is_active IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.event_packages.event_type IS 
'Type of event this package is designed for: wedding, birthday, corporate, baptism, etc.';

COMMENT ON COLUMN public.event_packages.featured_image IS 
'URL of the featured/hero image for this package';

COMMENT ON COLUMN public.event_packages.short_description IS 
'Brief description shown in card previews';

COMMENT ON COLUMN public.event_packages.duration_hours IS 
'Standard duration of this package in hours';

COMMENT ON COLUMN public.event_packages.price_per_person IS 
'Per-person pricing (if applicable, alternative to base_price)';

COMMENT ON COLUMN public.event_packages.slug IS 
'URL-friendly slug for public package pages';

COMMENT ON COLUMN public.event_packages.is_active IS 
'Whether this package is actively available for booking';

-- =====================================================
-- INSERT SAMPLE EVENT PACKAGES (if table is empty)
-- =====================================================
INSERT INTO public.event_packages (
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
  'barangay-fiesta-package',
  true,
  true,
  false,
  8
)
ON CONFLICT (id) DO NOTHING;

