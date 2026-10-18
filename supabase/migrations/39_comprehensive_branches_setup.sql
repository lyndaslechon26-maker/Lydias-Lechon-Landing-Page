-- Migration 39: Comprehensive branches table setup
-- This migration ensures the branches table exists with correct schema and data

-- Drop table if exists and recreate (clean slate)
DROP TABLE IF EXISTS public.branches CASCADE;

-- Create branches table with correct schema
CREATE TABLE public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    hours TEXT NOT NULL DEFAULT '10:00 AM - 9:00 PM',
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

-- Add indexes
CREATE INDEX idx_branches_active ON public.branches(is_active, sort_order);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_branches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_branches_updated_at
    BEFORE UPDATE ON public.branches
    FOR EACH ROW
    EXECUTE FUNCTION update_branches_updated_at();

-- Disable RLS
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.branches TO anon, authenticated;
GRANT ALL ON public.branches TO authenticated, service_role;

-- Insert branch data
INSERT INTO public.branches (name, location, phone, landmark, google_maps_url, hours, is_active, sort_order) VALUES
('Baclaran Branch', 'Baclaran, Parañaque City, Metro Manila', '0917 820 2989', 'Near Baclaran Church', 'https://maps.google.com/?q=Lydia''s+Lechon+Baclaran', '10:00 AM - 9:00 PM', true, 1),
('Timog Branch', 'Timog Avenue, Quezon City, Metro Manila', '0997 643 6150', 'Timog Avenue Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Timog', '10:00 AM - 9:00 PM', true, 2),
('Roces Branch', 'Roces Avenue, Quezon City, Metro Manila', '0995 083 3532', 'Roces Avenue Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Roces', '10:00 AM - 9:00 PM', true, 3),
('Fairview Branch', 'Fairview, Quezon City, Metro Manila', '0927 676 5710', 'Fairview Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Fairview', '10:00 AM - 9:00 PM', true, 4),
('Pasig Branch', 'Pasig City, Metro Manila', '0936 979 1911', 'Pasig City Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Pasig', '10:00 AM - 9:00 PM', true, 5),
('Marcos Highway Branch', 'Marcos Highway, Antipolo City, Rizal', '0995 069 2281', 'Along Marcos Highway', 'https://maps.google.com/?q=Lydia''s+Lechon+Marcos+Highway', '10:00 AM - 9:00 PM', true, 6),
('General Trias Branch', 'General Trias, Cavite', '0917 887 2168', 'General Trias Area', 'https://maps.google.com/?q=Lydia''s+Lechon+General+Trias', '10:00 AM - 9:00 PM', true, 7),
('Calamba Branch', 'Calamba City, Laguna', '0960 200 8633', 'Calamba City Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Calamba', '10:00 AM - 9:00 PM', true, 8),
('Los Baños Branch', 'Los Baños, Laguna', '0921 200 4150', 'Los Baños Area', 'https://maps.google.com/?q=Lydia''s+Lechon+Los+Baños', '10:00 AM - 9:00 PM', true, 9);

-- Success message
DO $$
DECLARE
    branch_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO branch_count FROM public.branches;
    RAISE NOTICE '✅ Created branches table';
    RAISE NOTICE '✅ Inserted % branches', branch_count;
    RAISE NOTICE '✅ RLS disabled, permissions granted';
    RAISE NOTICE '✅ All branches are active and ready to display';
END $$;
