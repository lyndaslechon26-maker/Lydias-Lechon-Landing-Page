# Complete Setup Instructions

## Step-by-Step Guide to Copy All Landing Page Files

Since this project requires hundreds of files from the main project, follow these steps carefully.

### Method 1: PowerShell Script (Recommended)

Save this as `copy-files.ps1` and run it:

```powershell
# Navigate to main project
cd "C:\Users\Administrator\Desktop\GITHUB PROJECTS\Restobar-Management-System"

# Copy app routes
Copy-Item -Path "app\events" -Destination "Lydias-Landing-Page\app" -Recurse -Force
Copy-Item -Path "app\manager" -Destination "Lydias-Landing-Page\app" -Recurse -Force
Copy-Item -Path "app\globals.css" -Destination "Lydias-Landing-Page\app" -Force
Copy-Item -Path "app\layout.tsx" -Destination "Lydias-Landing-Page\app" -Force

# Copy components
Copy-Item -Path "components\events" -Destination "Lydias-Landing-Page\components" -Recurse -Force
Copy-Item -Path "components\restaurant" -Destination "Lydias-Landing-Page\components" -Recurse -Force
Copy-Item -Path "components\ui" -Destination "Lydias-Landing-Page\components" -Recurse -Force

# Copy actions (landing page related only)
New-Item -ItemType Directory -Path "Lydias-Landing-Page\app\actions" -Force
Copy-Item -Path "app\actions\manager-orders.ts" -Destination "Lydias-Landing-Page\app\actions" -Force
Copy-Item -Path "app\actions\manager-bookings.ts" -Destination "Lydias-Landing-Page\app\actions" -Force
Copy-Item -Path "app\actions\manager-settings.ts" -Destination "Lydias-Landing-Page\app\actions" -Force
Copy-Item -Path "app\actions\customer-orders.ts" -Destination "Lydias-Landing-Page\app\actions" -Force
Copy-Item -Path "app\actions\events.ts" -Destination "Lydias-Landing-Page\app\actions" -Force
Copy-Item -Path "app\actions\admin-events.ts" -Destination "Lydias-Landing-Page\app\actions" -Force

# Copy lib
Copy-Item -Path "lib" -Destination "Lydias-Landing-Page" -Recurse -Force

# Copy hooks
Copy-Item -Path "hooks" -Destination "Lydias-Landing-Page" -Recurse -Force

# Copy public assets
Copy-Item -Path "public\LydiasBG*.png" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\C*.jpg" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\esquire.png" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\philstar.png" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\rappler.png" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\spot.png" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\sunstar.png" -Destination "Lydias-Landing-Page\public" -Force
Copy-Item -Path "public\tatler.png" -Destination "Lydias-Landing-Page\public" -Force

# Copy config files
Copy-Item -Path "next.config.js" -Destination "Lydias-Landing-Page" -Force
Copy-Item -Path "tailwind.config.ts" -Destination "Lydias-Landing-Page" -Force
Copy-Item -Path "tsconfig.json" -Destination "Lydias-Landing-Page" -Force
Copy-Item -Path "postcss.config.mjs" -Destination "Lydias-Landing-Page" -Force
Copy-Item -Path ".gitignore" -Destination "Lydias-Landing-Page" -Force
Copy-Item -Path "components.json" -Destination "Lydias-Landing-Page" -Force

Write-Host "✅ Files copied successfully!"
```

### Method 2: Manual Copy (If script doesn't work)

1. **App Routes** - Copy these folders:
   ```
   app/events/ → Lydias-Landing-Page/app/
   app/manager/ → Lydias-Landing-Page/app/
   ```

2. **Components** - Copy these folders:
   ```
   components/events/ → Lydias-Landing-Page/components/
   components/restaurant/ → Lydias-Landing-Page/components/
   components/ui/ → Lydias-Landing-Page/components/
   ```

3. **Actions** - Create `app/actions` folder and copy:
   - manager-orders.ts
   - manager-bookings.ts  
   - manager-settings.ts
   - customer-orders.ts
   - events.ts
   - admin-events.ts

4. **Library** - Copy entire `lib/` folder

5. **Hooks** - Copy entire `hooks/` folder

6. **Public Assets** - Copy these images:
   - LydiasBG*.png (all background images)
   - C1.jpg through C10.jpg
   - All media partner logos (esquire, philstar, rappler, spot, sunstar, tatler)

7. **Config Files** - Copy:
   - next.config.js
   - tailwind.config.ts
   - tsconfig.json
   - postcss.config.mjs
   - .gitignore
   - components.json

8. **Root Files** - Copy:
   - app/globals.css
   - app/layout.tsx

### After Copying Files:

1. **Update app/layout.tsx** - Remove POS-related imports:
   ```typescript
   // Remove these imports:
   // - ThemeProvider
   // - Sidebar navigation
   // - Staff-related components
   
   // Keep only:
   - Metadata
   - Font imports
   - Basic HTML structure
   ```

2. **Create .env.local**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Install Dependencies**:
   ```bash
   cd Lydias-Landing-Page
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Database Setup

### Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: "Lydias-Landing-Page"
4. Choose region
5. Generate strong password
6. Wait for setup to complete

### Run Migrations

Copy migration files from main project:
```
supabase/create_landing_page_manager.sql
```

Then in Supabase SQL Editor, run in order:
1. Landing page database schema
2. Customer profiles
3. Online orders
4. Event bookings
5. RLS policies

## Verification Checklist

After setup, verify:

- [ ] Landing page loads at `http://localhost:3000`
- [ ] All sections visible (hero, features, menu, gallery, footer)
- [ ] Scroll animations work
- [ ] Gallery auto-scrolls
- [ ] Navigation smooth scrolls to sections
- [ ] Footer social links present
- [ ] Images load correctly
- [ ] No console errors
- [ ] Manager dashboard accessible at `/manager`
- [ ] Database connection works

## Troubleshooting

### "Module not found" errors:
```bash
npm install
```

### Images not loading:
- Check `public/` folder has all images
- Verify image paths in components

### Database errors:
- Verify `.env.local` has correct Supabase credentials
- Check migrations ran successfully
- Verify RLS policies are enabled

### Build errors:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

## Next Steps

1. ✅ Customize branding
2. ✅ Add real content
3. ✅ Configure email
4. ✅ Set up payments
5. ✅ Deploy to production

---

**Need Help?** Check console errors and Supabase logs first.
