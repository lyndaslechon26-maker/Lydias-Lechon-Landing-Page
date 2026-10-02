# Lydia's Lechon - Customer Landing Page

A standalone customer-facing website for Lydia's Lechon, featuring online ordering, event bookings, and restaurant information.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 📦 What's Included

- ✅ Complete landing page with all sections
- ✅ Customer authentication
- ✅ Online ordering system
- ✅ Event booking system
- ✅ Manager dashboard
- ✅ Separate database (Supabase)

## 🗄️ Database

This project uses a **separate Supabase database** from the POS system.

### Setup:
1. Create new Supabase project
2. Run migrations in `/supabase/migrations/`
3. Copy `.env.example` to `.env.local`
4. Add your Supabase credentials

## 🎨 Features

### Landing Page:
- Hero section with CTAs
- Signature dishes carousel
- Food categories
- Event venues showcase
- Gallery with auto-scroll
- Testimonials
- FAQ
- Footer with social media links

### Customer Portal:
- User registration/login
- Profile management
- Order history
- Event bookings
- Loyalty points

### Manager Dashboard:
- Content management
- Order management
- Booking management
- Customer list
- Site settings

## 📁 Project Structure

```
Lydias-Landing-Page/
├─ app/                  # Next.js app router
├─ components/           # React components
├─ lib/                  # Utilities
├─ hooks/                # Custom hooks
├─ supabase/            # Database migrations
└─ public/              # Static assets
```

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🚢 Deployment

Deploy to Vercel:
```bash
vercel
```

Or Netlify:
```bash
netlify deploy --prod
```

## 📝 License

Private - Lydia's Lechon

---

**Last Updated:** October 2, 2026
