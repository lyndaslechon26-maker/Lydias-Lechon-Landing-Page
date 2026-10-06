# Admin UI → Manager UI Complete Migration Plan

## Objective
Copy the complete Admin UI/UX design from main project to Landing Page Manager account.

## UI Elements to Migrate

### 1. Layout & Shell Component ✅
- [x] StaffShell component structure
- [ ] Sidebar design with sections
- [ ] Header/topbar with search
- [ ] Mobile responsive sheet
- [ ] Logout confirmation dialog
- [ ] Restaurant branding (logo + name)

### 2. Typography 📝
**From Admin Dashboard:**
- Headings: `text-base font-semibold`, `text-sm font-medium`
- Body: `text-sm`, `text-xs`
- Labels: `text-[0.65rem] font-semibold uppercase tracking-wider`
- Tabular numbers: `tabular-nums`
- Truncate: `truncate`
- Muted text: `text-muted-foreground`

### 3. Card Styles 🎴
**Shadow System:**
```css
/* Default card shadow */
shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]

/* Dark mode card shadow */
dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.1)_inset]
```

**Hover Effects:**
```css
transition-all duration-300
hover:-translate-y-2
hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset]
dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.2)_inset]
```

### 4. Badge Styles 🏷️
**Status Badges:**
- Pending: `bg-amber-500/10 text-amber-700 dark:text-amber-400`
- Confirmed: `bg-cyan-500/10 text-cyan-700 dark:text-cyan-400`
- Preparing: `bg-blue-500/10 text-blue-700 dark:text-blue-400`
- Ready: `bg-emerald-500/10 text-emerald-700 dark:text-emerald-400`
- Completed: `bg-zinc-500/10 text-zinc-700 dark:text-zinc-300`
- Cancelled: `bg-rose-500/10 text-rose-700 dark:text-rose-400`

**With Dots:**
```tsx
<span className="inline-flex items-center gap-1.5">
  <span className="size-1.5 rounded-full bg-emerald-500" />
  Status Text
</span>
```

### 5. Animations ✨
**Live Indicator:**
```tsx
<span className="relative flex size-2.5">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
</span>
```

**Hover Transitions:**
- Cards: `transition-all duration-300 hover:-translate-y-2`
- Icons: `transition-transform group-hover:scale-110`
- Arrows: `group-hover:-translate-y-0.5 group-hover:translate-x-0.5`

**Loading States:**
- Refresh button: `animate-spin` on icon when loading
- Skeleton loaders for data

### 6. Color Accents 🎨
- Emerald (revenue, success): `emerald-500`, `emerald-600`, `emerald-700`
- Blue (orders, info): `blue-500`, `blue-600`, `blue-700`
- Amber (warnings, pending): `amber-500`, `amber-600`, `amber-700`
- Purple (metrics): `purple-500`, `purple-600`, `purple-700`
- Rose (errors, cancelled): `rose-500`, `rose-600`, `rose-700`

### 7. Stat Cards 📊
**Component: StatCard**
- Label: small text
- Value: large bold text
- Icon: colored background circle
- Trend: with arrow up/down
- Subtitle: muted text

### 8. List Items 📋
**Order List Item Pattern:**
```tsx
<Link className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/40">
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
      #{number}
    </div>
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Title</span>
        <Badge>Status</Badge>
      </div>
      <div className="text-xs text-muted-foreground">Details</div>
    </div>
  </div>
  <div className="flex flex-col items-end gap-1.5">
    <span className="text-sm font-semibold tabular-nums">₱1,234</span>
    <Badge>Status</Badge>
  </div>
</Link>
```

### 9. Empty States 📭
```tsx
<div className="flex flex-col items-center justify-center py-10 text-center">
  <div className="mb-3 text-muted-foreground">
    <Icon className="size-8" />
  </div>
  <p className="text-sm font-medium">Title</p>
  <p className="mt-1 text-xs text-muted-foreground">Description</p>
</div>
```

### 10. Quick Action Cards 🚀
```tsx
<Link className="group flex items-start gap-3 rounded-lg border p-4 transition-all duration-300 hover:-translate-y-2 hover:border-foreground/20">
  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
    <Icon className="size-5" />
  </div>
  <div className="min-w-0 flex-1">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold">Title</h4>
      <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </div>
    <p className="mt-0.5 text-xs text-muted-foreground">Description</p>
  </div>
</Link>
```

## Components to Create/Update

### Phase 1: Foundation Components
1. **`components/staff-shell.tsx`** - Main layout shell
2. **`components/stat-card.tsx`** - KPI stat cards
3. **`components/page-header.tsx`** - Page headers with breadcrumbs
4. **`components/brand.tsx`** - Restaurant branding component

### Phase 2: Manager-Specific Components
1. **`app/manager/layout.tsx`** - Update to use StaffShell
2. **`app/manager/page.tsx`** - Dashboard with complete styling
3. **All manager page components** - Apply card styles and animations

### Phase 3: Utility Components
1. Badge variations
2. Empty states
3. Loading skeletons
4. Alert/notification cards

## Migration Steps

### Step 1: Copy Base Components ✅
- [ ] Copy `staff-shell.tsx` → adapt for manager
- [ ] Copy `stat-card.tsx`
- [ ] Copy `page-header.tsx`
- [ ] Copy `brand.tsx`

### Step 2: Update Manager Layout
- [ ] Replace current manager layout with StaffShell
- [ ] Add navigation items
- [ ] Configure restaurant branding
- [ ] Add logout dialog

### Step 3: Update Manager Dashboard
- [ ] Create manager-dashboard-client.tsx
- [ ] Add stat cards (bookings, orders, revenue, customers)
- [ ] Add live booking feed
- [ ] Add quick action cards
- [ ] Add empty states

### Step 4: Update All Manager Pages
- [ ] Bookings page
- [ ] Orders page
- [ ] Customers page
- [ ] Menu page
- [ ] Venues page
- [ ] Packages page
- [ ] Gallery page
- [ ] Reviews page
- [ ] Settings page

### Step 5: Polish & Testing
- [ ] Test all animations
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Test mobile sheet navigation
- [ ] Verify all colors match
- [ ] Verify all fonts match

## Files to Copy from Main Project

```
Main Project → Landing Page
components/staff-shell.tsx → components/staff-shell.tsx
components/stat-card.tsx → components/stat-card.tsx
components/page-header.tsx → components/page-header.tsx
components/brand.tsx → components/brand.tsx
components/theme-toggle.tsx → components/theme-toggle.tsx
app/admin/layout.tsx → app/manager/layout.tsx (adapted)
components/dashboard/admin-dashboard-client.tsx → components/dashboard/manager-dashboard-client.tsx (adapted)
```

## Design System Summary

**Spacing:** Tailwind default (px-3, py-2, gap-3, etc.)
**Borders:** `border`, `border-border`, `rounded-lg`, `rounded-md`
**Transitions:** `transition-all duration-300`
**Shadows:** Complex layered shadows with inset highlights
**Hover:** Lift effect with `hover:-translate-y-2`
**Icons:** Lucide React, size-4 to size-5 typically
**Badges:** Colored backgrounds with `/10` opacity, colored text
**Buttons:** Primary, outline, ghost variants
**Cards:** White bg with shadow, hover lift effect

## Expected Result

Landing Page Manager UI should be **identical** to Main Project Admin UI:
- ✅ Same sidebar style
- ✅ Same card shadows and hover effects
- ✅ Same typography (font sizes, weights, colors)
- ✅ Same animations and transitions
- ✅ Same badge styles
- ✅ Same stat cards
- ✅ Same quick action cards
- ✅ Same empty states
- ✅ Same responsive behavior
- ✅ Same dark mode support

---

**Status:** Ready to implement
**Estimated Time:** 2-3 hours for complete migration
**Priority:** High - Complete UI/UX consistency
