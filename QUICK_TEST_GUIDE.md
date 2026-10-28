# Quick Test Guide - Booking Dashboard Fix

## The Fix
✅ Bookings now properly link to customer accounts via `customer_id`

## How to Test (5 minutes)

### 1️⃣ Refresh Browser
```
Press: Ctrl + Shift + R
```

### 2️⃣ Login to Customer Account
- Go to: `/events/login`
- Use your existing customer credentials

### 3️⃣ Go to Venues Page
- Navigate to: `/events` (landing page)
- Scroll to "Our Venues" section
- Click "Book This Venue" on any venue
- **OR** go directly to: `/events/venues/[venue-id]`

### 4️⃣ Create Test Booking
Complete the 5-step booking process:

**Step 1: Event Details**
- Event Type: Birthday Party
- Event Date: Any future date
- Start Time: 10:00 AM
- End Time: 4:00 PM
- Number of Guests: 50

**Step 2: Event Package**
- Select any package OR skip (click "No Package")

**Step 3: Services**
- Optional - can skip

**Step 4: Contact Info**
- Should auto-fill from your profile
- Verify fields are correct

**Step 5: Review & Confirm**
- Review total amount
- Click "Confirm Booking"

### 5️⃣ Check Dashboard
- Navigate to: `/events/dashboard`
- Look at "Venue Bookings" section (left column, blue header)
- ✅ **Your booking should appear here!**

## Expected Result

### ✅ Success Indicators:
1. Booking appears in dashboard immediately
2. Shows booking details: event type, date, venue, amount
3. Status badge shows "pending"
4. Clicking booking opens detail page

### ❌ If Booking Still Missing:
1. Check browser console for errors (F12)
2. Verify you're logged in (check top-right corner)
3. Go to `/events/dashboard/bookings` to see full list
4. Check Supabase Table Editor → `event_bookings`:
   - Find your booking by booking_number
   - Verify `customer_id` column is populated (not NULL)

## Database Verification (Optional)

### Supabase Dashboard Check:
1. Go to Supabase Dashboard
2. Table Editor → `event_bookings`
3. Find latest booking (sort by created_at DESC)
4. Verify these columns:
   - ✅ `customer_id` - should have UUID value
   - ✅ `customer_email` - your email
   - ✅ `booking_number` - format: BK-YYYYMMDD-XXXX
   - ✅ `status` - "pending"
   - ✅ `venue_id` - UUID of venue

## Troubleshooting

### "Booking created but not showing"
- Clear browser cache and cookies
- Hard refresh: `Ctrl + Shift + R`
- Log out and log back in

### "Error creating booking"
- Check browser console (F12) for error messages
- Share error message with developer

### "customer_id is NULL in database"
- Issue with customer profile
- Run query: `SELECT * FROM event_customers WHERE auth_id = 'your-auth-id'`
- Verify customer record exists

## What Changed
Before: Bookings created without `customer_id` → couldn't be queried by customer
After: Bookings created with `customer_id` → dashboard query works correctly

---

**Last Updated:** October 29, 2026
**Status:** Ready for testing
