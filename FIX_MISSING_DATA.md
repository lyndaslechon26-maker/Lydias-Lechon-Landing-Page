# 🔧 FIX: Missing Menu Cards, Packages, and Venue Data

## 🐛 Problem

When you deployed the landing page, these sections were empty:
- ❌ **Menu section** - No dish cards showing
- ❌ **Packages section** - No packages displaying  
- ❌ **Venues section** - "No venues available" message
- ❌ **Our Story section** - No image
- ❌ **Digital Partners** - No icons showing

## 💡 Root Cause

The landing page components fetch data from your Supabase database, but the database was **empty** (no data seeded yet). The tables exist but have no rows.

---

## ✅ SOLUTION: Run Migration #3

I've created a migration file that will populate your database with sample data.

### Step 1: Go to Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar

### Step 2: Open the Seed Data Migration

1. In your project, open this file:
   ```
   supabase/migrations/03_seed_sample_data.sql
   ```

2. **Copy ALL the contents** of that file

### Step 3: Run the Migration

1. In Supabase SQL Editor, click **"New Query"**
2. **Paste** the migration SQL
3. Click **"Run"** (or press F5)

### Step 4: Verify Success

You should see success messages:
```
✅ Sample data seeded successfully!
📋 Added:
   - 4 menu categories
   - 10 menu items
   - 4 event venues
   - 4 event packages
🎉 Your landing page now has data to display!
```

### Step 5: Refresh Your Landing Page

Hard refresh your deployed site (Ctrl+F5 or Cmd+Shift+R)

---

## 📊 What Data Was Added

### Menu Items (10 items)
1. **Whole Lechon** - ₱12,000 (Featured)
2. **Lechon Belly (Per Kilo)** - ₱850 (Featured)
3. **Lechon Kawali** - ₱450 (Featured)
4. **Boneless Lechon** - ₱950
5. **Crispy Pata** - ₱850
6. **Lumpia Shanghai** - ₱350
7. **Sisig** - ₱380
8. **Kare-Kare** - ₱520
9. **Leche Flan** - ₱180
10. **Ube Halaya** - ₱150

### Event Venues (4 venues)
1. **Grand Ballroom** - 200 capacity, ₱25,000
2. **Garden Pavilion** - 150 capacity, ₱18,000
3. **Rooftop Deck** - 100 capacity, ₱22,000
4. **Function Room A** - 50 capacity, ₱12,000

### Event Packages (4 packages)
1. **Wedding Package - Platinum** - ₱150,000 (Featured)
2. **Birthday Celebration Package** - ₱35,000 (Featured)
3. **Corporate Event Package** - ₱45,000
4. **Intimate Gathering Package** - ₱20,000

---

## 🎯 After Running Migration

Your landing page will now show:

✅ **Menu Section** → 10 delicious dishes with images and prices
✅ **Packages Section** → 4 event packages to choose from
✅ **Venues Section** → 4 beautiful venues with photos and capacity
✅ **Everything working properly!**

---

## 🖼️ Note About Images

The sample data uses placeholder images from Unsplash. Later, you can replace these with actual photos of your dishes and venues by:

1. Going to Manager Dashboard
2. Navigating to **Menu Management** or **Venue Management**
3. Clicking **Edit** on any item
4. Uploading your own images

---

## 🔄 For Future Updates

To add more menu items, venues, or packages:

### Option 1: Use Manager Dashboard (Recommended)
1. Login to `/manager`
2. Navigate to Menu/Venues/Packages section
3. Click **"Add New"**
4. Fill in details and upload images
5. Click **Save**

### Option 2: Manual SQL Insert
Write your own INSERT statements in Supabase SQL Editor.

---

## 🆘 Still Having Issues?

### Issue: "relation does not exist"
**Solution**: Run migration `01_landing_page_complete_schema.sql` first to create the tables.

### Issue: Menu still empty after migration
**Solution**: 
1. Check Supabase SQL Editor for errors
2. Verify data was inserted:
   ```sql
   SELECT COUNT(*) FROM menu_items;
   SELECT COUNT(*) FROM event_venues;
   SELECT COUNT(*) FROM event_packages;
   ```
3. Make sure numbers are greater than 0

### Issue: Images not loading
**Solution**: Images use Unsplash placeholders. Check your browser console (F12) for any image loading errors. If needed, replace with your own images via Manager Dashboard.

---

## ✅ Quick Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Copied contents of `03_seed_sample_data.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] Saw success message
- [ ] Refreshed landing page (Ctrl+F5)
- [ ] Menu cards now showing
- [ ] Packages section populated
- [ ] Venues displaying correctly

---

## 🎉 Done!

Your landing page should now be fully populated with data and looking great!

**Remember**: This is sample data. Replace it with your actual menu items, venues, and packages through the Manager Dashboard.

---

**File created**: Just now
**Migration file**: `supabase/migrations/03_seed_sample_data.sql`
**GitHub**: Already pushed to repository
