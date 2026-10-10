-- =====================================================
-- REPLACE ALL MENU ITEMS WITH NEW DATA
-- Clear existing items and insert new menu with simplified schema
-- =====================================================

-- Delete all existing menu items
TRUNCATE TABLE public.menu_items CASCADE;

-- Insert new menu items (name, description, base_price only)
INSERT INTO public.menu_items (name, description, base_price, is_available) VALUES
('Heineken', 'Imported lager', 220.00, true),
('San Miguel Pale', 'Local pale ale', 180.00, true),
('Margarita', 'Tequila, lime, triple sec, salt rim', 280.00, true),
('Cappuccino', 'Espresso with steamed milk foam', 160.00, true),
('Beef Tenderloin', 'Premium beef with red wine reduction', 850.00, true),
('Calamaris', 'Golden fried squid rings with garlic aioli', 320.00, true),
('House Red', 'Glass of house red wine', 250.00, true),
('Mojito', 'White rum, mint, lime, soda', 280.00, true),
('Espresso', 'Single shot of premium espresso', 120.00, true),
('Spaghetti Carbonara', 'Classic carbonara with pancetta and egg', 450.00, true),
('Americano', 'Espresso with hot water', 150.00, true),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 280.00, true),
('Caesar Salad', 'Romaine, parmesan, croutons, classic Caesar', 280.00, true),
('Fresh Lemonade', 'Fresh-squeezed lemonade', 120.00, true),
('Buffalo Wings', 'Crispy chicken wings tossed in spicy buffalo sauce', 380.00, true),
('Grilled Salmon', 'Atlantic salmon with lemon butter sauce', 650.00, true),
('Chocolate Lava', 'Warm chocolate cake with molten center', 320.00, true),
('Iced Tea', 'House-brewed iced tea', 100.00, true),
('Fettuccine Alfredo', 'Creamy parmesan sauce with fettuccine', 460.00, true),
('Prosecco', 'Italian sparkling wine', 380.00, true)
ON CONFLICT (id) DO NOTHING;

-- Show statistics
DO $$
DECLARE
    total_items INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_items FROM public.menu_items;
    
    RAISE NOTICE 'Menu Items Replaced Successfully!';
    RAISE NOTICE '  Total items: %', total_items;
    RAISE NOTICE '  All items set to available';
END $$;
