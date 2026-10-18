-- Create branches table for dynamic branch management
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL, -- 'Metro Manila', 'Rizal', 'Cavite', 'Laguna'
    phone TEXT NOT NULL,
    hours TEXT NOT NULL DEFAULT '9:00 AM - 9:00 PM (Daily)',
    landmark TEXT,
    image_url TEXT,
    google_maps_url TEXT,
    
    -- Services flags
    has_dine_in BOOLEAN DEFAULT true,
    has_takeout BOOLEAN DEFAULT true,
    has_delivery BOOLEAN DEFAULT true,
    has_catering BOOLEAN DEFAULT true,
    has_event_venue BOOLEAN DEFAULT false,
    
    -- Status and ordering
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for active branches
CREATE INDEX IF NOT EXISTS idx_branches_active ON public.branches(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_branches_region ON public.branches(region);

-- Add updated_at trigger
CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON public.branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert existing branches data
INSERT INTO public.branches (name, address, city, region, phone, landmark, google_maps_url, sort_order) VALUES
('Baclaran Branch', 'Baclaran, Parañaque City, Metro Manila', 'Parañaque', 'Metro Manila', '0917 820 2989', 'Near Baclaran Church', 'https://maps.google.com/?q=Lydia''s+Lechon+Baclaran', 1),
('Timog Branch', 'Timog Avenue, Quezon City, Metro Manila', 'Quezon City', 'Metro Manila', '0997 643 6150', 'Timog Avenue Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Timog', 2),
('Roces Branch', 'Roces Avenue, Quezon City, Metro Manila', 'Quezon City', 'Metro Manila', '0995 083 3532', 'Roces Avenue Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Roces', 3),
('Fairview Branch', 'Fairview, Quezon City, Metro Manila', 'Quezon City', 'Metro Manila', '0927 676 5710', 'Fairview Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Fairview', 4),
('Pasig Branch', 'Pasig City, Metro Manila', 'Pasig', 'Metro Manila', '0936 979 1911', 'Pasig City Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Pasig', 5),
('Marcos Highway Branch', 'Marcos Highway, Antipolo City, Rizal', 'Antipolo', 'Rizal', '0995 069 2281', 'Along Marcos Highway', 'https://maps.google.com/?q=Lydia''s+Lechon+Marcos+Highway', 6),
('General Trias Branch', 'General Trias, Cavite', 'General Trias', 'Cavite', '0917 887 2168', 'General Trias Area', 'https://maps.google.com/?q=Lydia''s+Lechon+General+Trias', 7),
('Calamba Branch', 'Calamba City, Laguna', 'Calamba', 'Laguna', '0960 200 8633', 'Calamba City Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Calamba', 8),
('Los Baños Branch', 'Los Baños, Laguna', 'Los Baños', 'Laguna', '0921 200 4150', 'Los Baños Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Los+Baños', 9)
ON CONFLICT DO NOTHING;

-- Grant permissions (RLS disabled, use permissions)
GRANT SELECT ON public.branches TO anon, authenticated;
GRANT ALL ON public.branches TO authenticated;

-- Add comments
COMMENT ON TABLE public.branches IS 'Branch locations for Lydia''s Lechon';
COMMENT ON COLUMN public.branches.region IS 'Geographic region: Metro Manila, Rizal, Cavite, or Laguna';
COMMENT ON COLUMN public.branches.sort_order IS 'Display order on public pages';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Created branches table with 9 initial branches';
    RAISE NOTICE '✅ Added indexes and triggers';
    RAISE NOTICE '✅ Granted permissions';
END $$;
