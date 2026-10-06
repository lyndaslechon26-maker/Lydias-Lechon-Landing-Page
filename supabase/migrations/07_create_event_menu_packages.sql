-- Create event_menu_packages table
-- This table stores menu package options for catering (buffet, plated meals, drinks, desserts)

CREATE TABLE IF NOT EXISTS public.event_menu_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('buffet', 'plated', 'drinks', 'dessert')),
    price_per_person DECIMAL(10, 2) NOT NULL,
    min_guests INTEGER DEFAULT 50,
    items TEXT[] DEFAULT '{}', -- Array of menu items included
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_menu_packages_category ON public.event_menu_packages(category);
CREATE INDEX IF NOT EXISTS idx_event_menu_packages_active ON public.event_menu_packages(is_active);

-- Add RLS policies
ALTER TABLE public.event_menu_packages ENABLE ROW LEVEL SECURITY;

-- Public can read active packages
CREATE POLICY "Anyone can view active menu packages"
    ON public.event_menu_packages
    FOR SELECT
    USING (is_active = true);

-- Managers can do everything
CREATE POLICY "Managers can manage menu packages"
    ON public.event_menu_packages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'landing_page_manager')
        )
    );

-- Add some sample menu packages
INSERT INTO public.event_menu_packages (name, description, category, price_per_person, min_guests, items, is_active, sort_order) VALUES
('Classic Lechon Buffet', 'Traditional Filipino buffet featuring our signature lechon with classic side dishes', 'buffet', 850.00, 50, ARRAY['Whole Lechon', 'Pancit Canton', 'Lumpia Shanghai', 'Chicken Adobo', 'Steamed Rice', 'Fresh Fruit Platter'], true, 1),
('Premium Seafood Buffet', 'Deluxe buffet spread with fresh seafood and premium dishes', 'buffet', 1200.00, 50, ARRAY['Grilled Prawns', 'Fish Fillet', 'Crab Legs', 'Squid', 'Steamed Rice', 'Mixed Vegetables', 'Dessert Table'], true, 2),
('Fiesta Package', 'Complete Filipino celebration buffet with all the favorites', 'buffet', 950.00, 50, ARRAY['Lechon Kawali', 'Kare-Kare', 'Crispy Pata', 'Sisig', 'Pancit', 'Steamed Rice', 'Leche Flan'], true, 3),

('Lechon Plated Meal', 'Individual plated serving with lechon as the main course', 'plated', 550.00, 20, ARRAY['Lechon (250g)', 'Garlic Rice', 'Mixed Vegetables', 'Soup', 'Dessert'], true, 1),
('Chicken Combo Plated', 'Plated meal featuring chicken specialty', 'plated', 450.00, 20, ARRAY['Chicken Inasal', 'Java Rice', 'Atchara', 'Soup', 'Fruit Cup'], true, 2),
('Seafood Plated Meal', 'Individual plated seafood serving', 'plated', 650.00, 20, ARRAY['Grilled Fish Fillet', 'Garlic Butter Prawns', 'Steamed Rice', 'Vegetables', 'Dessert'], true, 3),

('Refreshment Package', 'Complete beverage package for your event', 'drinks', 80.00, 30, ARRAY['Iced Tea', 'Lemonade', 'Bottled Water', 'Ice'], true, 1),
('Premium Beverage Package', 'Deluxe drink selection with fresh juices', 'drinks', 150.00, 30, ARRAY['Fresh Orange Juice', 'Mango Shake', 'Iced Coffee', 'Soda', 'Bottled Water'], true, 2),
('Bar Service Package', 'Full bar service for adult celebrations', 'drinks', 250.00, 50, ARRAY['House Wine', 'Beer Selection', 'Mixed Drinks', 'Soft Drinks', 'Bartender Service'], true, 3),

('Classic Dessert Table', 'Traditional Filipino desserts', 'dessert', 120.00, 30, ARRAY['Leche Flan', 'Buko Pandan', 'Halo-Halo Station', 'Cassava Cake', 'Fresh Fruits'], true, 1),
('Premium Sweets Station', 'Gourmet dessert selection', 'dessert', 200.00, 30, ARRAY['Chocolate Fountain', 'Assorted Cakes', 'Pastries', 'Ice Cream Bar', 'Candy Station'], true, 2),
('Wedding Cake Package', 'Beautiful wedding cake with dessert table', 'dessert', 350.00, 50, ARRAY['3-Tier Wedding Cake', 'Cupcake Tower', 'Macarons', 'Chocolate Truffles', 'Petit Fours'], true, 3)
ON CONFLICT (id) DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_event_menu_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_menu_packages_updated_at ON public.event_menu_packages;

CREATE TRIGGER update_event_menu_packages_updated_at
    BEFORE UPDATE ON public.event_menu_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_event_menu_packages_updated_at();
