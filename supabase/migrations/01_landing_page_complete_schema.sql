-- =====================================================
-- LYDIA'S LECHON - LANDING PAGE DATABASE
-- Complete standalone schema for landing page project
-- =====================================================

-- =====================================================
-- 1. ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id text PRIMARY KEY,
    label text NOT NULL,
    description text
);

INSERT INTO roles (id, label, description) VALUES
('landing_page_manager', 'Landing Page Manager', 'Manages website content, online orders, and event bookings'),
('customer', 'Customer', 'Customer account for online orders and bookings')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. PROFILES TABLE (for staff/managers)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    role text NOT NULL REFERENCES roles(id) DEFAULT 'landing_page_manager',
    phone text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- =====================================================
-- 3. EVENT CUSTOMERS TABLE (for customer accounts)
-- =====================================================
CREATE TABLE IF NOT EXISTS event_customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    phone text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_customers_email ON event_customers(email);
CREATE INDEX IF NOT EXISTS idx_event_customers_phone ON event_customers(phone);

-- =====================================================
-- 4. MENU CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Signature Dishes', 'Our most popular and beloved dishes', 1),
('Lechon', 'Traditional roasted pig dishes', 2),
('Appetizers', 'Perfect starters for your meal', 3),
('Main Courses', 'Hearty Filipino main dishes', 4),
('Desserts', 'Sweet endings', 5),
('Beverages', 'Drinks and refreshments', 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. MENU ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category_id uuid REFERENCES menu_categories(id),
    base_price decimal(10,2) NOT NULL,
    image_url text,
    is_available boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    dietary_tags text[], -- e.g., ['spicy', 'vegetarian', 'gluten-free']
    preparation_time integer, -- in minutes
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured);

-- =====================================================
-- 6. EVENT VENUES
-- =====================================================
CREATE TABLE IF NOT EXISTS event_venues (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    capacity integer NOT NULL,
    base_price decimal(10,2) NOT NULL,
    venue_type text, -- 'indoor', 'outdoor', 'semi-outdoor'
    features text[], -- ['air-conditioned', 'sound-system', 'projector']
    image_url text,
    images jsonb, -- array of image objects
    is_available boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_venues_available ON event_venues(is_available);

-- =====================================================
-- 7. EVENT PACKAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS event_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    base_price decimal(10,2) NOT NULL,
    min_guests integer NOT NULL,
    max_guests integer,
    inclusions text[], -- ['food', 'venue', 'decorations']
    features jsonb, -- detailed features object
    image_url text,
    is_available boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_packages_available ON event_packages(is_available);
CREATE INDEX IF NOT EXISTS idx_event_packages_featured ON event_packages(is_featured);

-- =====================================================
-- 8. EVENT BOOKINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS event_bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number text UNIQUE NOT NULL,
    
    -- Customer info
    customer_id uuid REFERENCES event_customers(id),
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    
    -- Event details
    event_type text NOT NULL, -- 'wedding', 'birthday', 'corporate', etc.
    event_date date NOT NULL,
    event_time time NOT NULL,
    guest_count integer NOT NULL,
    
    -- Selected services
    venue_id uuid REFERENCES event_venues(id),
    package_id uuid REFERENCES event_packages(id),
    
    -- Pricing
    subtotal decimal(10,2) NOT NULL,
    additional_charges decimal(10,2) DEFAULT 0,
    total_amount decimal(10,2) NOT NULL,
    
    -- Special requests
    special_requests text,
    dietary_restrictions text,
    
    -- Status tracking
    status text CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    
    -- Manager assignment
    assigned_to uuid REFERENCES profiles(id),
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    confirmed_at timestamptz,
    cancelled_at timestamptz,
    cancellation_reason text
);

CREATE INDEX IF NOT EXISTS idx_event_bookings_customer ON event_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_bookings_status ON event_bookings(status);
CREATE INDEX IF NOT EXISTS idx_event_bookings_date ON event_bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_event_bookings_created ON event_bookings(created_at DESC);

-- =====================================================
-- 9. ONLINE ORDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS online_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE NOT NULL,
    
    -- Customer Information
    customer_id uuid REFERENCES event_customers(id),
    customer_name text NOT NULL,
    customer_email text,
    customer_phone text NOT NULL,
    
    -- Order Details
    items jsonb NOT NULL, -- Array of {item_id, name, quantity, price, addons}
    subtotal decimal(10,2) NOT NULL,
    delivery_fee decimal(10,2) DEFAULT 0,
    total_amount decimal(10,2) NOT NULL,
    
    -- Delivery/Pickup
    order_type text CHECK (order_type IN ('delivery', 'pickup')) DEFAULT 'delivery',
    delivery_address text,
    delivery_notes text,
    scheduled_time timestamptz,
    
    -- Status
    status text CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')) DEFAULT 'pending',
    payment_status text CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    payment_method text CHECK (payment_method IN ('cash', 'gcash', 'card', 'bank_transfer')),
    
    -- Tracking
    confirmed_at timestamptz,
    completed_at timestamptz,
    cancelled_at timestamptz,
    cancellation_reason text,
    
    -- Manager Assignment
    assigned_to uuid REFERENCES profiles(id),
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_online_orders_customer ON online_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_online_orders_status ON online_orders(status);
CREATE INDEX IF NOT EXISTS idx_online_orders_created ON online_orders(created_at DESC);

-- =====================================================
-- 10. LANDING PAGE SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS landing_page_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Business Information
    business_name text DEFAULT 'Lydia''s Lechon',
    tagline text DEFAULT '60 Years of Bringing Filipino Flavors to Life',
    about_text text,
    
    -- Contact Information
    phone text,
    email text,
    address text,
    
    -- Business Hours
    business_hours jsonb DEFAULT '{
        "monday": {"open": "10:00", "close": "22:00", "closed": false},
        "tuesday": {"open": "10:00", "close": "22:00", "closed": false},
        "wednesday": {"open": "10:00", "close": "22:00", "closed": false},
        "thursday": {"open": "10:00", "close": "22:00", "closed": false},
        "friday": {"open": "10:00", "close": "22:00", "closed": false},
        "saturday": {"open": "10:00", "close": "23:00", "closed": false},
        "sunday": {"open": "10:00", "close": "21:00", "closed": false}
    }'::jsonb,
    
    -- Social Media Links
    facebook_url text,
    instagram_url text,
    twitter_url text,
    youtube_url text,
    tiktok_url text,
    linkedin_url text,
    
    -- Hero Section
    hero_title text,
    hero_subtitle text,
    hero_image_url text,
    hero_video_url text,
    
    -- Features Toggle
    enable_online_ordering boolean DEFAULT true,
    enable_event_booking boolean DEFAULT true,
    enable_table_reservation boolean DEFAULT true,
    
    -- SEO
    meta_title text,
    meta_description text,
    meta_keywords text[],
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO landing_page_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 11. CUSTOMER REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer
    customer_id uuid REFERENCES event_customers(id),
    customer_name text NOT NULL,
    
    -- Review Details
    rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text text,
    
    -- Related Order (optional)
    order_id uuid REFERENCES online_orders(id),
    
    -- Moderation
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    is_featured boolean DEFAULT false,
    
    -- Response
    admin_response text,
    responded_at timestamptz,
    responded_by uuid REFERENCES profiles(id),
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_rating ON customer_reviews(rating);

-- =====================================================
-- 12. CONTENT UPDATES LOG
-- =====================================================
CREATE TABLE IF NOT EXISTS content_updates_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What was changed
    content_type text NOT NULL, -- 'menu_item', 'venue', 'package', 'settings', etc.
    content_id uuid,
    action text CHECK (action IN ('create', 'update', 'delete')) NOT NULL,
    
    -- Changes
    old_data jsonb,
    new_data jsonb,
    
    -- Who changed it
    changed_by uuid REFERENCES profiles(id) NOT NULL,
    
    -- Timestamp
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_log_type ON content_updates_log(content_type);
CREATE INDEX IF NOT EXISTS idx_content_log_user ON content_updates_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_content_log_created ON content_updates_log(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS text AS $$
DECLARE
    new_number text;
    counter integer;
BEGIN
    SELECT COUNT(*) + 1 INTO counter
    FROM event_bookings
    WHERE DATE(created_at) = CURRENT_DATE;
    
    new_number := 'BK-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::text, 4, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
    new_number text;
    counter integer;
BEGIN
    SELECT COUNT(*) + 1 INTO counter
    FROM online_orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    new_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::text, 4, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_customers_updated_at BEFORE UPDATE ON event_customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_venues_updated_at BEFORE UPDATE ON event_venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_packages_updated_at BEFORE UPDATE ON event_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_bookings_updated_at BEFORE UPDATE ON event_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_online_orders_updated_at BEFORE UPDATE ON online_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Event Customers
ALTER TABLE event_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view all customers"
    ON event_customers FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

CREATE POLICY "Managers can create customers"
    ON event_customers FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Menu Items (Public read)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are publicly readable"
    ON menu_items FOR SELECT
    TO anon, authenticated
    USING (is_available = true);

CREATE POLICY "Managers can manage menu items"
    ON menu_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Event Venues (Public read)
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venues are publicly readable"
    ON event_venues FOR SELECT
    TO anon, authenticated
    USING (is_available = true);

CREATE POLICY "Managers can manage venues"
    ON event_venues FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Event Packages (Public read)
ALTER TABLE event_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packages are publicly readable"
    ON event_packages FOR SELECT
    TO anon, authenticated
    USING (is_available = true);

CREATE POLICY "Managers can manage packages"
    ON event_packages FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Event Bookings
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view all bookings"
    ON event_bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

CREATE POLICY "Managers can manage bookings"
    ON event_bookings FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Online Orders
ALTER TABLE online_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view all orders"
    ON online_orders FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

CREATE POLICY "Managers can manage orders"
    ON online_orders FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Landing Page Settings
ALTER TABLE landing_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are publicly readable"
    ON landing_page_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Managers can update settings"
    ON landing_page_settings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Customer Reviews
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are publicly readable"
    ON customer_reviews FOR SELECT
    TO anon, authenticated
    USING (status = 'approved');

CREATE POLICY "Managers can manage reviews"
    ON customer_reviews FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- Content Updates Log
ALTER TABLE content_updates_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view content logs"
    ON content_updates_log FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'landing_page_manager'
        )
    );

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Landing page database schema created successfully!';
    RAISE NOTICE '📋 Tables created: profiles, event_customers, menu_items, event_venues, event_packages, event_bookings, online_orders, landing_page_settings, customer_reviews';
    RAISE NOTICE '🔐 RLS policies enabled for all tables';
    RAISE NOTICE '⚡ Next: Create your first manager account';
END $$;
