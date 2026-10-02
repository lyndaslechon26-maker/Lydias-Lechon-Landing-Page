-- =====================================================
-- SEED SAMPLE DATA FOR LANDING PAGE
-- Run this to populate initial data for development/testing
-- =====================================================

-- Insert Sample Menu Categories
INSERT INTO menu_categories (name, description, display_order, is_active) VALUES
('Lechon Specialties', 'Our signature roasted pig dishes', 1, true),
('Appetizers', 'Perfect starters for your meal', 2, true),
('Main Courses', 'Hearty Filipino main dishes', 3, true),
('Desserts', 'Sweet endings to your meal', 4, true)
ON CONFLICT DO NOTHING;

-- Insert Sample Menu Items
INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, is_featured, display_order)
SELECT 
  'Whole Lechon',
  'Our legendary crispy-skinned lechon, perfectly roasted for 4-5 hours. Serves 15-20 people.',
  c.id,
  12000.00,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  true,
  true,
  1
FROM menu_categories c WHERE c.name = 'Lechon Specialties'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, is_featured, display_order)
SELECT 
  'Lechon Belly (Per Kilo)',
  'The crispiest, most flavorful part - pure belly goodness',
  c.id,
  850.00,
  'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
  true,
  true,
  2
FROM menu_categories c WHERE c.name = 'Lechon Specialties'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, is_featured, display_order)
SELECT 
  'Lechon Kawali',
  'Deep-fried pork belly with ultra-crispy skin',
  c.id,
  450.00,
  'https://images.unsplash.com/photo-1625937297-573f9ca1b80c?w=800&q=80',
  true,
  true,
  3
FROM menu_categories c WHERE c.name = 'Lechon Specialties'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, is_featured, display_order)
SELECT 
  'Boneless Lechon',
  'Easier to serve and eat - perfect for parties',
  c.id,
  950.00,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
  true,
  false,
  4
FROM menu_categories c WHERE c.name = 'Lechon Specialties'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, display_order)
SELECT 
  'Crispy Pata',
  'Deep-fried pork leg with crispy skin and tender meat',
  c.id,
  850.00,
  'https://images.unsplash.com/photo-1603073363-e04e9b0ca9f5?w=800&q=80',
  true,
  5
FROM menu_categories c WHERE c.name = 'Appetizers'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, display_order)
SELECT 
  'Lumpia Shanghai',
  'Filipino spring rolls filled with savory pork',
  c.id,
  350.00,
  'https://images.unsplash.com/photo-1625938145744-507033b1ddb5?w=800&q=80',
  true,
  6
FROM menu_categories c WHERE c.name = 'Appetizers'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, display_order)
SELECT 
  'Sisig',
  'Sizzling pork sisig with onions and chili',
  c.id,
  380.00,
  'https://images.unsplash.com/photo-1616847220575-1e5c4789ab74?w=800&q=80',
  true,
  7
FROM menu_categories c WHERE c.name = 'Main Courses'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, display_order)
SELECT 
  'Kare-Kare',
  'Oxtail and vegetables in rich peanut sauce',
  c.id,
  520.00,
  'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80',
  true,
  8
FROM menu_categories c WHERE c.name = 'Main Courses'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, display_order)
SELECT 
  'Leche Flan',
  'Creamy Filipino caramel custard',
  c.id,
  180.00,
  'https://images.unsplash.com/photo-1586040140378-b5d93a3949ff?w=800&q=80',
  true,
  9
FROM menu_categories c WHERE c.name = 'Desserts'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, category_id, base_price, image_url, is_available, display_order)
SELECT 
  'Ube Halaya',
  'Purple yam jam - a Filipino favorite',
  c.id,
  150.00,
  'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80',
  true,
  10
FROM menu_categories c WHERE c.name = 'Desserts'
ON CONFLICT DO NOTHING;

-- Insert Sample Event Venues
INSERT INTO event_venues (name, description, capacity, base_price, venue_type, features, image_url, is_available, display_order)
VALUES 
(
  'Grand Ballroom',
  'Our spacious ballroom perfect for weddings, corporate events, and grand celebrations',
  200,
  25000.00,
  'indoor',
  ARRAY['Air-conditioned', 'Sound system', 'LED projector', 'Stage', 'Bridal room', 'Catering kitchen'],
  'https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=800&q=80',
  true,
  1
),
(
  'Garden Pavilion',
  'Beautiful outdoor venue with lush greenery and natural ambiance',
  150,
  18000.00,
  'outdoor',
  ARRAY['Garden setting', 'String lights', 'Wooden tables', 'Open-air setup', 'Photo spots'],
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
  true,
  2
),
(
  'Rooftop Deck',
  'Modern rooftop venue with stunning city views',
  100,
  22000.00,
  'semi-outdoor',
  ARRAY['City view', 'Retractable roof', 'Modern fixtures', 'Bar counter', 'Lounge area'],
  'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80',
  true,
  3
),
(
  'Function Room A',
  'Intimate space perfect for small gatherings and birthday parties',
  50,
  12000.00,
  'indoor',
  ARRAY['Air-conditioned', 'TV screen', 'Mini sound system', 'Flexible setup'],
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  true,
  4
)
ON CONFLICT DO NOTHING;

-- Insert Sample Event Packages
INSERT INTO event_packages (name, description, base_price, min_guests, max_guests, inclusions, is_available, is_featured, display_order)
VALUES
(
  'Wedding Package - Platinum',
  'Our most comprehensive wedding package for your special day',
  150000.00,
  100,
  200,
  ARRAY['Whole Lechon', 'Full course meal', 'Drinks and beverages', 'Venue decoration', 'Sound system', 'Event coordinator', 'Tables and chairs setup'],
  true,
  true,
  1
),
(
  'Birthday Celebration Package',
  'Perfect for milestone birthdays and celebrations',
  35000.00,
  50,
  100,
  ARRAY['Lechon Belly', 'Filipino buffet spread', 'Birthday cake', 'Basic decorations', 'Sound system', 'Tables and chairs'],
  true,
  true,
  2
),
(
  'Corporate Event Package',
  'Professional setup for business meetings and seminars',
  45000.00,
  50,
  150,
  ARRAY['Buffet lunch/dinner', 'Meeting equipment', 'Projector and screen', 'Whiteboard', 'Notepads and pens', 'Coffee break'],
  true,
  false,
  3
),
(
  'Intimate Gathering Package',
  'For small family reunions and private parties',
  20000.00,
  20,
  50,
  ARRAY['Lechon (5kg)', 'Appetizers', 'Main course', 'Dessert', 'Beverages', 'Basic setup'],
  true,
  false,
  4
)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Sample data seeded successfully!';
    RAISE NOTICE '📋 Added:';
    RAISE NOTICE '   - 4 menu categories';
    RAISE NOTICE '   - 10 menu items';
    RAISE NOTICE '   - 4 event venues';
    RAISE NOTICE '   - 4 event packages';
    RAISE NOTICE '🎉 Your landing page now has data to display!';
END $$;
