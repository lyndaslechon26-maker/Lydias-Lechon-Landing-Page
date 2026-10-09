-- =====================================================
-- EVENT GALLERY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.event_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_gallery_active ON public.event_gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_event_gallery_category ON public.event_gallery(category);
CREATE INDEX IF NOT EXISTS idx_event_gallery_sort_order ON public.event_gallery(sort_order);

-- Disable RLS and grant permissions (following project pattern)
ALTER TABLE public.event_gallery DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.event_gallery TO authenticated;
GRANT ALL ON public.event_gallery TO anon;
GRANT ALL ON public.event_gallery TO service_role;

-- =====================================================
-- ADD UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_event_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_gallery_updated_at ON public.event_gallery;

CREATE TRIGGER update_event_gallery_updated_at
    BEFORE UPDATE ON public.event_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_event_gallery_updated_at();

-- =====================================================
-- INSERT SAMPLE GALLERY IMAGES
-- =====================================================
INSERT INTO public.event_gallery (title, description, image_url, category, is_active, sort_order) VALUES
('Wedding Reception', 'Beautiful wedding setup with elegant decorations', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'weddings', true, 1),
('Corporate Event', 'Professional corporate gathering with lechon centerpiece', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'corporate', true, 2),
('Birthday Celebration', 'Colorful birthday party with delicious lechon', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'birthdays', true, 3),
('Fiesta Setup', 'Traditional Filipino fiesta with lechon as main attraction', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'fiestas', true, 4),
('Baptism Party', 'Intimate baptism celebration with family', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'baptisms', true, 5),
('Anniversary Dinner', 'Romantic anniversary dinner setup', 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=800', 'anniversaries', true, 6),
('Graduation Party', 'Festive graduation celebration', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800', 'graduations', true, 7),
('Christmas Party', 'Holiday celebration with festive decorations', 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800', 'holidays', true, 8)
ON CONFLICT (id) DO NOTHING;
