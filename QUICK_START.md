# Quick Start - Lydia's Landing Page

## 🚀 Fastest Way to Get Running

### Step 1: Run the Copy Script

From the **main project** directory (Restobar-Management-System):

```powershell
.\COPY_TO_LANDING_PAGE.ps1
```

This will automatically copy ALL required files to `Lydias-Landing-Page/`

### Step 2: Install Dependencies

```bash
cd Lydias-Landing-Page
npm install
```

### Step 3: Setup Environment

```bash
# Copy example env file
copy .env.example .env.local

# Edit .env.local and add your NEW Supabase project credentials
```

### Step 4: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: "Lydias-Landing-Page"  
4. Save credentials to `.env.local`

### Step 5: Run Migrations

In Supabase SQL Editor, run:
```sql
-- Copy from: supabase/migrations/create_landing_page_manager.sql
-- Paste and execute in SQL Editor
```

### Step 6: Start Dev Server

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ What You Should See

Landing page with:
- ✅ Hero section with "60 Years of Legendary Lechon"
- ✅ Features grid
- ✅ Signature dishes carousel (5 cards, auto-scroll)
- ✅ Food categories
- ✅ Our story section
- ✅ Events venue showcase
- ✅ Gallery (10 images, infinite scroll)
- ✅ Value section
- ✅ Testimonials
- ✅ FAQ
- ✅ Footer with 6 social media links

## 🔧 If Something's Wrong

### Files not copied:
```powershell
# Re-run the script
.\COPY_TO_LANDING_PAGE.ps1
```

### Missing dependencies:
```bash
rm -rf node_modules
npm install
```

### Database errors:
- Check `.env.local` has correct Supabase URL and keys
- Verify migrations ran successfully in Supabase
- Check Supabase logs for errors

### Images not showing:
- Verify `public/` folder has all images
- Check browser console for 404 errors

## 📞 Need Help?

Check `SETUP_COMPLETE.md` for detailed troubleshooting.

---

**Estimated Setup Time:** 10-15 minutes
