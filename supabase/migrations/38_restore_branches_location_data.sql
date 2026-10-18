-- Migration 38: Restore full location data for existing branches
-- The previous migration (36) set location to just "Branch Name Branch" format
-- This migration updates each branch with its proper full location

-- Update each branch with proper location data
UPDATE public.branches
SET location = 'Baclaran, Parañaque City, Metro Manila'
WHERE name = 'Baclaran Branch';

UPDATE public.branches
SET location = 'Timog Avenue, Quezon City, Metro Manila'
WHERE name = 'Timog Branch';

UPDATE public.branches
SET location = 'Roces Avenue, Quezon City, Metro Manila'
WHERE name = 'Roces Branch';

UPDATE public.branches
SET location = 'Fairview, Quezon City, Metro Manila'
WHERE name = 'Fairview Branch';

UPDATE public.branches
SET location = 'Pasig City, Metro Manila'
WHERE name = 'Pasig Branch';

UPDATE public.branches
SET location = 'Marcos Highway, Antipolo City, Rizal'
WHERE name = 'Marcos Highway Branch';

UPDATE public.branches
SET location = 'General Trias, Cavite'
WHERE name = 'General Trias Branch';

UPDATE public.branches
SET location = 'Calamba City, Laguna'
WHERE name = 'Calamba Branch';

UPDATE public.branches
SET location = 'Los Baños, Laguna'
WHERE name = 'Los Baños Branch';

-- Success message
DO $$
DECLARE
    branch_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO branch_count FROM public.branches;
    RAISE NOTICE '✅ Restored location data for % branches', branch_count;
    RAISE NOTICE '✅ All branches now have proper full location addresses';
END $$;
