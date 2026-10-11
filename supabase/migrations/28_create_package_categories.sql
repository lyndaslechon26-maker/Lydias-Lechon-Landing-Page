-- Create package_categories table (similar to food_categories)
-- This allows dynamic management of menu package categories

-- Step 1: Create the package_categories table
CREATE TABLE IF NOT EXISTS public.package_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Add indexes
CREATE INDEX IF NOT EXISTS idx_package_categories_sort_order ON public.package_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_package_categories_active ON public.package_categories(is_active);

-- Step 3: Insert default categories based on existing enum values
INSERT INTO public.package_categories (name, description, sort_order, is_active) VALUES
('Buffet', 'Buffet-style catering packages', 1, true),
('Plated', 'Plated meal packages', 2, true),
('Drinks', 'Beverage packages', 3, true),
('Dessert', 'Dessert and sweets packages', 4, true);

-- Step 4: Add category_id column to menu_packages table (as UUID foreign key)
ALTER TABLE public.menu_packages 
ADD COLUMN category_id UUID REFERENCES public.package_categories(id);

-- Step 5: Migrate existing category data from TEXT to UUID
-- Map existing text categories to new category IDs
UPDATE public.menu_packages mp
SET category_id = pc.id
FROM public.package_categories pc
WHERE LOWER(mp.category) = LOWER(pc.name);

-- Step 6: Make category_id NOT NULL after migration
ALTER TABLE public.menu_packages 
ALTER COLUMN category_id SET NOT NULL;

-- Step 7: Keep old category column for now (we can drop it later after verification)
-- ALTER TABLE public.menu_packages DROP COLUMN category;

-- Step 8: Add updated_at trigger for package_categories
CREATE OR REPLACE FUNCTION update_package_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_package_categories_updated_at ON public.package_categories;

CREATE TRIGGER update_package_categories_updated_at
    BEFORE UPDATE ON public.package_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_package_categories_updated_at();

-- Step 9: Grant permissions
GRANT ALL ON public.package_categories TO authenticated;
GRANT ALL ON public.package_categories TO anon;
GRANT ALL ON public.package_categories TO service_role;

-- Step 10: Add foreign key index for performance
CREATE INDEX IF NOT EXISTS idx_menu_packages_category_id ON public.menu_packages(category_id);

-- Step 11: Add comments
COMMENT ON TABLE public.package_categories IS 'Categories for menu packages (buffet, plated, drinks, dessert, etc.)';
COMMENT ON COLUMN public.menu_packages.category_id IS 'Foreign key to package_categories table';
