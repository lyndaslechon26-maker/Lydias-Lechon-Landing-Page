-- Rename columns to reflect correct meaning:
-- price_per_person -> bundle_price (total package price, not per person)
-- min_guests -> serves_persons (capacity, not minimum requirement)

-- Rename price_per_person to bundle_price
ALTER TABLE public.event_menu_packages 
RENAME COLUMN price_per_person TO bundle_price;

-- Rename min_guests to serves_persons
ALTER TABLE public.event_menu_packages 
RENAME COLUMN min_guests TO serves_persons;

-- Update comments for clarity
COMMENT ON COLUMN public.event_menu_packages.bundle_price IS 'Total package/bundle price in pesos (not per person)';
COMMENT ON COLUMN public.event_menu_packages.serves_persons IS 'Number of persons this package can serve (capacity)';
