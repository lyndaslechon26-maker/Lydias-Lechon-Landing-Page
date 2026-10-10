-- =====================================================
-- RESTORE COMPLETE MENU DATA
-- Restore both categories and menu items
-- =====================================================

-- First, remove all category references from menu items
UPDATE public.menu_items SET category_id = NULL WHERE category_id IS NOT NULL;

-- Delete all existing data
DELETE FROM public.menu_items;
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
('Promo Deals', 'Special promotional bundles and limited-time offers. Check our current deals and save on your favorites.', 17, true);

-- Insert new menu items (20 items)
INSERT INTO public.menu_items (name, description, base_price, is_available, is_alcoholic) VALUES
('Heineken', 'Imported lager', 220.00, true, true),
('San Miguel Pale', 'Local pale ale', 180.00, true, true),
('Margarita', 'Tequila, lime, triple sec, salt rim', 280.00, true, true),
('Cappuccino', 'Espresso with steamed milk foam', 160.00, true, false),
('Beef Tenderloin', 'Premium beef with red wine reduction', 850.00, true, false),
('Calamaris', 'Golden fried squid rings with garlic aioli', 320.00, true, false),
('House Red', 'Glass of house red wine', 250.00, true, true),
('Mojito', 'White rum, mint, lime, soda', 280.00, true, true),
('Espresso', 'Single shot of premium espresso', 120.00, true, false),
('Spaghetti Carbonara', 'Classic carbonara with pancetta and egg', 450.00, true, false),
('Americano', 'Espresso with hot water', 150.00, true, false),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 280.00, true, false),
('Caesar Salad', 'Romaine, parmesan, croutons, classic Caesar', 280.00, true, false),
('Fresh Lemonade', 'Fresh-squeezed lemonade', 120.00, true, false),
('Buffalo Wings', 'Crispy chicken wings tossed in spicy buffalo sauce', 380.00, true, false),
('Grilled Salmon', 'Atlantic salmon with lemon butter sauce', 650.00, true, false),
('Chocolate Lava', 'Warm chocolate cake with molten center', 320.00, true, false),
('Iced Tea', 'House-brewed iced tea', 100.00, true, false),
('Fettuccine Alfredo', 'Creamy parmesan sauce with fettuccine', 460.00, true, false),
('Prosecco', 'Italian sparkling wine', 380.00, true, true);

-- Show statistics
DO $$
DECLARE
    total_categories INTEGER;
    total_items INTEGER;
    alcoholic_items INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_categories FROM public.food_categories;
    SELECT COUNT(*) INTO total_items FROM public.menu_items;
    SELECT COUNT(*) INTO alcoholic_items FROM public.menu_items WHERE is_alcoholic = true;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Complete Menu Data Restored Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Categories: %', total_categories;
    RAISE NOTICE 'Menu Items: %', total_items;
    RAISE NOTICE '  - Alcoholic: %', alcoholic_items;
    RAISE NOTICE '  - Non-alcoholic: %', total_items - alcoholic_items;
    RAISE NOTICE '========================================';
END $$;
