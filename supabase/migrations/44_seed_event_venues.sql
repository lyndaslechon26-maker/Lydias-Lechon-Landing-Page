-- =====================================================
-- SEED EVENT VENUES DATA
-- =====================================================

-- Clear existing venues if any
TRUNCATE TABLE event_venues CASCADE;

-- Insert 4 beautiful event venues
INSERT INTO event_venues (
  name,
  location,
  description,
  capacity_min,
  capacity_max,
  base_rate,
  duration,
  photos,
  amenities,
  is_active,
  sort_order
) VALUES
(
  'Grand Ballroom',
  'Main Building, Ground Floor',
  'Our most spacious and elegant venue, perfect for grand weddings, corporate galas, and large celebrations. Features high ceilings, crystal chandeliers, and a dedicated stage area.',
  100,
  200,
  25000,
  'Full Day',
  ARRAY[
    'https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80'
  ],
  ARRAY[
    'Air-conditioned',
    'Professional sound system',
    '4K LED projector',
    'Stage with lighting',
    'Bridal room',
    'Full catering kitchen',
    'Elegant chandeliers',
    'Dance floor'
  ],
  true,
  1
),
(
  'Garden Pavilion',
  'Outdoor Garden Area',
  'Beautiful al fresco venue surrounded by lush greenery and natural ambiance. Ideal for garden weddings, intimate celebrations, and daytime events.',
  75,
  150,
  18000,
  'Full Day',
  ARRAY[
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80'
  ],
  ARRAY[
    'Garden setting',
    'String lights & lanterns',
    'Wooden tables & chairs',
    'Open-air pavilion',
    'Photo wall backdrops',
    'Garden bar counter',
    'Acoustic sound system'
  ],
  true,
  2
),
(
  'Rooftop Deck',
  'Rooftop Level',
  'Modern and stylish rooftop venue with stunning city skyline views. Perfect for cocktail parties, corporate events, and trendy celebrations.',
  50,
  100,
  22000,
  'Half Day',
  ARRAY[
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80',
    'https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80'
  ],
  ARRAY[
    'City skyline view',
    'Retractable awning',
    'Modern lounge furniture',
    'Bar counter with stools',
    'LED mood lighting',
    'Bluetooth sound system',
    'Heaters for cooler evenings'
  ],
  true,
  3
),
(
  'Function Room A',
  'Second Floor',
  'Versatile and intimate space perfect for birthday parties, small gatherings, corporate meetings, and family celebrations. Fully air-conditioned with flexible setup options.',
  40,
  80,
  12000,
  'Hourly',
  ARRAY[
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
    'https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80'
  ],
  ARRAY[
    'Air-conditioned',
    'Smart TV with HDMI',
    'Quality sound system',
    'Flexible table arrangements',
    'Free WiFi',
    'Whiteboard & projector screen',
    'Private entrance'
  ],
  true,
  4
);

-- Grant permissions
GRANT SELECT ON event_venues TO anon;
GRANT SELECT ON event_venues TO authenticated;
