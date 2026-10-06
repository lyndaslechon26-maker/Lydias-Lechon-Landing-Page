-- Create Menu Management Tables
-- Only create food_categories table since menu_items already exists

-- =====================================================
-- 1. FOOD CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.food_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_food_categories_active ON public.food_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_food_categories_sort_order ON public.food_categories(sort_order);

-- Disable RLS and grant permissions
ALTER TABLE public.food_categories DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.food_categories TO authenticated;
GRANT ALL ON public.food_categories TO anon;
GRANT ALL ON public.food_categories TO service_role;

-- =====================================================
-- 2. INSERT SAMPLE CATEGORIES
-- =====================================================
INSERT INTO public.food_categories (name, description, sort_order, is_active) VALUES
('Appetizers', 'Start your meal with these delicious starters', 1, true),
('Main Course', 'Our signature main dishes', 2, true),
('Lechon Specialties', 'Our famous roasted pork dishes', 3, true),
('Desserts', 'Sweet endings to your meal', 4, true),
('Beverages', 'Refreshing drinks', 5, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. ADD UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_food_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_food_categories_updated_at ON public.food_categories;

CREATE TRIGGER update_food_categories_updated_at
    BEFORE UPDATE ON public.food_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_food_categories_updated_at();

-- =====================================================
-- 4. FIX MENU_ITEMS TABLE PERMISSIONS (if exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_items') THEN
        ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
        GRANT ALL ON public.menu_items TO authenticated;
        GRANT ALL ON public.menu_items TO anon;
        GRANT ALL ON public.menu_items TO service_role;
    END IF;
END $$;

