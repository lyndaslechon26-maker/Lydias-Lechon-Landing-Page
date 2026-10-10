-- =====================================================
-- REPLACE FOOD CATEGORIES WITH NEW DATA
-- Clear existing categories and insert new ones
-- Note: Removes category assignments from menu items
-- =====================================================

-- First, set all menu items category_id to NULL to preserve them
UPDATE public.menu_items SET category_id = NULL;

-- Delete all existing categories (safe now because no items reference them)
DELETE FROM public.food_categories;

-- Insert new food categories
INSERT INTO public.food_categories (name, description, sort_order, is_active) VALUES
('Desserts', 'Sweet endings', 1, true),
('Bento Box', 'Japanese-inspired individual meal boxes with a Filipino twist. Perfect for solo diners or small groups.', 2, true),
('Party Trays', 'Large serving trays of Filipino dishes good for parties and gatherings. Choose from our variety of viands.', 3, true),
('Main Course', 'Signature entrees', 4, true),
('Lydia''s Family Boxes', 'Complete meal packages for families. Includes viands, rice, and sides - perfect for 4-6 persons.', 5, true),
('Lechon', 'Our signature crispy lechon - perfect for celebrations and gatherings. Available in whole, half, or quarter sizes.', 6, true),
('Wine', 'Red, white, sparkling', 7, true),
('Beer', 'Local & imported', 8, true),
('Pasta', 'Italian favorites', 9, true),
('Lechon-In-A-Box', 'Convenient single-serving lechon boxes with rice and sides. Perfect for events and office gatherings.', 10, true),
('Quick Meals', 'Ready-to-eat Filipino favorites perfect for small groups. No preparation needed, just heat and serve.', 11, true),
('Salads', 'Fresh garden salads', 12, true),
('Appetizers', 'Starters and small bites', 13, true),
('Coffee', 'Hot & cold coffee drinks', 14, true),
('Cocktails', 'Signature cocktails', 15, true),
('Drinks', 'Non-alcoholic beverages', 16, true),
('Promo Deals', 'Special promotional bundles and limited-time offers. Check our current deals and save on your favorites.', 17, true)
ON CONFLICT (id) DO NOTHING;

-- Show statistics
DO $$
DECLARE
    total_categories INTEGER;
    total_items INTEGER;
    uncategorized_items INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_categories FROM public.food_categories;
    SELECT COUNT(*) INTO total_items FROM public.menu_items;
    SELECT COUNT(*) INTO uncategorized_items FROM public.menu_items WHERE category_id IS NULL;
    
    RAISE NOTICE 'Food Categories Replaced Successfully!';
    RAISE NOTICE '  Total categories: %', total_categories;
    RAISE NOTICE '  Total menu items: %', total_items;
    RAISE NOTICE '  Uncategorized items: % (you can assign categories in the UI)', uncategorized_items;
END $$;
