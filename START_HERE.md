# 🚀 Lydia's Lechon - Landing Page Project

Welcome! This is a **standalone landing page** project for Lydia's Lechon, completely separate from the POS system.

---

## 📁 What's Included

This project contains:

✅ **Complete Landing Page**
- Hero section with animations
- Menu showcase
- Event venues display
- Package offerings
- Image gallery
- Contact section
- Social media links

✅ **Manager Dashboard** (`/manager`)
- Manage menu items
- Handle event bookings
- Process online orders
- Update website content
- View analytics

✅ **Customer Features**
- Browse menu
- Book events
- Place online orders
- Submit reviews

✅ **Separate Database**
- Own Supabase project
- No connection to POS system
- Clean, focused schema

---

## 🎯 Quick Start (3 Steps!)

### 1️⃣ Install Dependencies
```powershell
npm install
```

### 2️⃣ Setup Database
Follow the guide: **[DATABASE_SETUP.md](./DATABASE_SETUP.md)**

This will help you:
- Create new Supabase project
- Run database migrations
- Create manager account

### 3️⃣ Start Development Server
```powershell
npm run dev
```

Visit: http://localhost:3000

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `DATABASE_SETUP.md` | **START HERE** - Complete database setup guide |
| `SETUP_COMPLETE.md` | Detailed technical documentation |
| `QUICK_START.md` | Quick reference guide |
| `.env.example` | Environment variables template |
| `supabase/migrations/` | Database schema files |

---

## 🗺️ Project Structure

```
Lydias-Landing-Page/
├── app/
│   ├── events/          # Landing page (homepage)
│   ├── manager/         # Manager dashboard
│   └── actions/         # Server actions
├── components/
│   ├── events/          # Landing page components
│   ├── restaurant/      # Shared restaurant components
│   └── ui/              # Reusable UI components
├── lib/                 # Utilities (Supabase client, etc.)
├── hooks/               # Custom React hooks
├── public/              # Images and static files
└── supabase/
    └── migrations/      # Database setup files
```

---

## 🌐 Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` or `/events` | Main landing page | Public |
| `/manager` | Manager dashboard | Requires login |
| `/manager/bookings` | Event bookings management | Manager only |
| `/manager/orders` | Online orders management | Manager only |
| `/manager/content` | Website content management | Manager only |

---

## 🔑 Default Login

After setting up database (see DATABASE_SETUP.md):

- **URL**: http://localhost:3000/manager
- **Email**: (the email you created in Supabase Auth)
- **Password**: (the password you set)

---

## 🎨 Features

### Landing Page
- ✅ Scroll animations
- ✅ Wave dividers between sections
- ✅ Smooth navigation
- ✅ Responsive design
- ✅ Image gallery with infinite scroll
- ✅ Social media integration
- ✅ Contact form

### Manager Dashboard
- ✅ Event bookings management
- ✅ Online orders tracking
- ✅ Menu management
- ✅ Venue management
- ✅ Package management
- ✅ Customer reviews moderation
- ✅ Content management

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

---

## 🔐 Environment Variables

Required in `.env.local`:

```env
# Supabase (NEW PROJECT - NOT POS!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Lydia's Lechon"
```

---

## 🚨 Important Notes

### ⚠️ This is SEPARATE from POS System

| Landing Page Project | POS System |
|---------------------|------------|
| Different codebase | Different codebase |
| Different database | Different database |
| Different Supabase project | Different Supabase project |
| Customer-facing | Staff-facing |
| Public website | Internal operations |

**DO NOT** use POS database credentials here!

---

## 📖 Step-by-Step Setup

### First Time Setup

1. ✅ **You are here!** Files copied successfully
2. ⬜ Install dependencies: `npm install`
3. ⬜ Read **DATABASE_SETUP.md**
4. ⬜ Create new Supabase project
5. ⬜ Run migrations
6. ⬜ Create manager account
7. ⬜ Setup `.env.local`
8. ⬜ Start dev server: `npm run dev`
9. ⬜ Test landing page: http://localhost:3000
10. ⬜ Test manager login: http://localhost:3000/manager

---

## 🆘 Need Help?

### Common Issues

**"Module not found" errors**
```powershell
npm install
```

**"Database error" / "relation does not exist"**
- Did you run the migrations? Check DATABASE_SETUP.md

**Can't login to manager dashboard**
- Did you create a user in Supabase Auth?
- Did you run migration `02_create_first_manager.sql`?
- Are your credentials in `.env.local` correct?

**Page shows errors**
- Check browser console (F12)
- Check terminal for error messages
- Verify `.env.local` has correct Supabase URL and keys

---

## 📱 What to Do After Setup

1. **Add Menu Items**
   - Login to manager dashboard
   - Go to Menu Management
   - Add your dishes with images and prices

2. **Add Event Venues**
   - Go to Venue Management
   - Add venues with capacity and pricing

3. **Add Event Packages**
   - Go to Package Management
   - Create attractive packages

4. **Test Booking Flow**
   - Visit landing page
   - Try booking an event
   - Check manager dashboard for the booking

5. **Customize Content**
   - Update business hours
   - Add social media links
   - Update contact information

---

## 🚀 Ready to Deploy?

When ready for production:

1. Create production Supabase project
2. Run migrations on production database
3. Deploy to Vercel/Cloudflare/Netlify
4. Update environment variables in deployment platform
5. Test thoroughly!

---

## ✅ Success Checklist

- [ ] `npm install` completed
- [ ] New Supabase project created
- [ ] Database migrations run successfully
- [ ] Manager account created
- [ ] `.env.local` configured
- [ ] Dev server running (`npm run dev`)
- [ ] Landing page loads at localhost:3000
- [ ] Can login to manager dashboard
- [ ] All images loading correctly

---

## 📞 Contact & Social Media

The landing page includes links to:
- Facebook: Lydia's Lechon Restaurant
- Instagram: @lydiaslechon
- TikTok: @lydias_lechon
- YouTube: @lydias_lechon
- LinkedIn: Lydia's Lechon
- Google Business

---

**🎉 You're all set! Start with DATABASE_SETUP.md and you'll be running in 10 minutes!**
