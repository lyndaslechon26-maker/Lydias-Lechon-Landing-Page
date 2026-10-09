# Gallery Page Migration Instructions

## Issue
Gallery page shows error: **"Could not find the table 'public.event_gallery' in the schema cache"**

## Solution
The migration SQL has been created and is ready to run in your Supabase database.

---

## Steps to Fix

### 1. Open Supabase Dashboard
Go to: **https://supabase.com/dashboard/project/fnbwavqrxwaftfatzkyg**

### 2. Navigate to SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"** button (top right)

### 3. Copy the Migration SQL
Open the file: `supabase/migrations/11_create_event_gallery.sql`

**Or copy from here:**

```sql
-- =====================================================
-- EVENT GALLERY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.event_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_gallery_active ON public.event_gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_event_gallery_category ON public.event_gallery(category);
CREATE INDEX IF NOT EXISTS idx_event_gallery_sort_order ON public.event_gallery(sort_order);

-- Disable RLS and grant permissions (following project pattern)
ALTER TABLE public.event_gallery DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.event_gallery TO authenticated;
GRANT ALL ON public.event_gallery TO anon;
GRANT ALL ON public.event_gallery TO service_role;

-- =====================================================
-- ADD UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_event_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_gallery_updated_at ON public.event_gallery;

CREATE TRIGGER update_event_gallery_updated_at
    BEFORE UPDATE ON public.event_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_event_gallery_updated_at();

-- =====================================================
-- INSERT SAMPLE GALLERY IMAGES
-- =====================================================
INSERT INTO public.event_gallery (title, description, image_url, category, is_active, sort_order) VALUES
('Wedding Reception', 'Beautiful wedding setup with elegant decorations', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'weddings', true, 1),
('Corporate Event', 'Professional corporate gathering with lechon centerpiece', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'corporate', true, 2),
('Birthday Celebration', 'Colorful birthday party with delicious lechon', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'birthdays', true, 3),
('Fiesta Setup', 'Traditional Filipino fiesta with lechon as main attraction', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'fiestas', true, 4),
('Baptism Party', 'Intimate baptism celebration with family', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'baptisms', true, 5),
('Anniversary Dinner', 'Romantic anniversary dinner setup', 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=800', 'anniversaries', true, 6),
('Graduation Party', 'Festive graduation celebration', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800', 'graduations', true, 7),
('Christmas Party', 'Holiday celebration with festive decorations', 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800', 'holidays', true, 8)
ON CONFLICT (id) DO NOTHING;
```

### 4. Run the SQL
- Paste the SQL into the query editor
- Click **"Run"** button (or press `Ctrl+Enter`)

### 5. Verify Success
You should see:
- ✅ Table created successfully
- ✅ 8 sample images inserted
- ✅ Success message in the results panel

### 6. Test the Gallery Page
1. Go back to your localhost: **http://localhost:3000/manager/gallery**
2. Press `Ctrl+Shift+R` to hard refresh
3. You should now see:
   - 3 stat cards showing: **8 Total Images**, **8 Active Images**, **8 Categories**
   - Gallery grid with 8 sample event images
   - No more error message

---

## What This Migration Does

### Creates Table Structure
- **id**: Unique identifier (UUID)
- **title**: Image title (required)
- **description**: Optional description
- **image_url**: Image URL (required)
- **category**: Event category (weddings, corporate, birthdays, etc.)
- **is_active**: Show/hide toggle
- **sort_order**: Display order
- **created_at** & **updated_at**: Timestamps

### Adds Performance Indexes
- Fast filtering by `is_active` status
- Fast filtering by `category`
- Fast sorting by `sort_order`

### Sets Permissions
- **Disables RLS** (Row Level Security)
- **Grants full access** to authenticated, anon, and service_role users
- Follows the same pattern as other tables in your project

### Adds Auto-Update Trigger
- Automatically updates `updated_at` timestamp when records are modified

### Inserts 8 Sample Images
- Variety of event types: weddings, corporate, birthdays, fiestas, baptisms, anniversaries, graduations, holidays
- Uses high-quality Unsplash images
- All active and properly ordered

---

## Troubleshooting

### Error: "function update_updated_at_column() does not exist"
**Solution:** The migration now creates its own trigger function `update_event_gallery_updated_at()` so this error should not occur.

### Error: "permission denied"
**Solution:** Make sure you're logged in as the Supabase project owner/admin when running the SQL.

### Images Not Displaying
**Possible causes:**
1. Unsplash images might be blocked (check browser console)
2. Image URLs might need updating
3. Content Security Policy might need adjustment

**Solution:** Check the browser console (F12) for any image loading errors.

### Still Shows Error After Running Migration
**Steps:**
1. Verify the table was created: Go to **Table Editor** in Supabase, look for `event_gallery`
2. Check if data was inserted: Click on the table to see the 8 rows
3. Hard refresh your browser: `Ctrl+Shift+R`
4. Check your `.env.local` has correct Supabase credentials

---

## Migration File Location
`supabase/migrations/11_create_event_gallery.sql`

## Related Files
- Gallery page component: `app/manager/gallery/page.tsx`
- Gallery grid component: `components/manager/gallery-grid.tsx` (if exists)

---

## Migration Pattern
This migration follows the project's standard pattern:
- ✅ No RLS policies (disabled)
- ✅ GRANT permissions to all roles
- ✅ Custom trigger function for updated_at
- ✅ Sample data included
- ✅ Performance indexes added
- ✅ ON CONFLICT handling for safety

Same pattern as:
- `food_categories` table
- `menu_items` table
- Other manager tables

---

## Need Help?
If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your Supabase credentials in `.env.local`
3. Check browser console for errors (F12)
4. Confirm you're using the correct project ID: `fnbwavqrxwaftfatzkyg`

---

**Status:** Ready to run ✅  
**Last Updated:** October 10, 2026  
**Committed & Pushed:** Yes (commit b668c73)
