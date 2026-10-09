# Card Spacing Standards - Manager Dashboard

## Design System Spacing Tokens

### Core Spacing Values
```css
--card-spacing: 16px  /* Base card padding */
--title-subtitle-gap: 4px  /* CardTitle to CardDescription */
--header-content-gap: 24px  /* CardHeader to CardContent */
--card-gap: 24px  /* Space between cards in grids */
```

### Tailwind Classes
```tsx
pb-4   = 16px   /* CardHeader bottom padding */
pt-6   = 24px   /* CardContent top padding */
mt-1   = 4px    /* CardDescription top margin */
p-6    = 24px   /* Custom card content padding */
gap-6  = 24px   /* Grid gap between cards */
```

---

## Standard Card Layouts

### **1. Basic Card with Title**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <div>
      <CardTitle className="text-base font-semibold">
        Card Title
      </CardTitle>
      <CardDescription className="mt-1">
        Card subtitle or description
      </CardDescription>
    </div>
  </CardHeader>
  <CardContent className="pt-6">
    {/* Content here */}
  </CardContent>
</Card>
```

**Spacing Breakdown:**
- Top padding: 16px (from Card py-(--card-spacing))
- Left/Right padding: 16px (from CardHeader px-(--card-spacing))
- Title to Description: 4px (mt-1)
- Header to Content: 16px bottom + 24px top = 40px total
- Bottom padding: 16px (from Card py-(--card-spacing))

---

### **2. Card with Actions**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <div>
      <CardTitle className="text-base font-semibold">Card Title</CardTitle>
      <CardDescription className="mt-1">Description</CardDescription>
    </div>
    <Button variant="ghost" size="sm">
      View all
    </Button>
  </CardHeader>
  <CardContent className="pt-6">
    {/* Content */}
  </CardContent>
</Card>
```

**Key Points:**
- Actions aligned to right using `justify-between`
- Maintains consistent spacing on both sides
- Button doesn't affect padding

---

### **3. Card with Icon + Title**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <div>
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <Icon className="size-5 text-blue-600" />
        Card Title with Icon
      </CardTitle>
      <CardDescription className="mt-1">Description</CardDescription>
    </div>
  </CardHeader>
  <CardContent className="pt-6">
    {/* Content */}
  </CardContent>
</Card>
```

**Key Points:**
- Icon integrated into CardTitle
- Maintains text alignment
- 8px gap between icon and text

---

### **4. Card with Badge**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <div>
      <CardTitle className="text-base font-semibold">Card Title</CardTitle>
      <CardDescription className="mt-1">Description</CardDescription>
    </div>
    <Badge variant="outline" className="gap-1.5">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      Live
    </Badge>
  </CardHeader>
  <CardContent className="pt-6">
    {/* Content */}
  </CardContent>
</Card>
```

**Key Points:**
- Badge acts as status indicator
- Positioned at header level
- Doesn't disrupt title spacing

---

### **5. Simple Card (No Header)**
```tsx
<Card>
  <CardContent className="p-4">
    {/* Direct content without header */}
  </CardContent>
</Card>
```

**Key Points:**
- Used for operational strips or inline content
- Uniform 16px padding all sides
- No title separation needed

---

### **6. Filter/Search Card**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <div className="flex items-center gap-2">
      <Filter className="size-5 text-purple-600" />
      <CardTitle className="text-base font-semibold">Filters</CardTitle>
    </div>
    <Button variant="ghost" size="sm">
      Reset All
    </Button>
  </CardHeader>
  <CardContent className="pt-6">
    {/* Filter inputs */}
  </CardContent>
</Card>
```

**Key Points:**
- Icon before title for context
- Action button for clearing filters
- Proper spacing for form elements inside

---

### **7. Table Card**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <div>
      <CardTitle className="text-base font-semibold">All Items</CardTitle>
      <CardDescription className="mt-1">
        {count} items found
      </CardDescription>
    </div>
  </CardHeader>
  <CardContent className="pt-6">
    <Table>
      {/* Table content */}
    </Table>
  </CardContent>
</Card>
```

**Key Points:**
- Count in description for context
- Table starts with proper top padding
- No additional padding needed around table

---

### **8. Empty State Card**
```tsx
<Card>
  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
    <Icon className="mb-4 size-8 text-muted-foreground" />
    <h3 className="text-base font-semibold mb-2">No items yet</h3>
    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
      Description text
    </p>
    {action && <Button>{action}</Button>}
  </CardContent>
</Card>
```

**Key Points:**
- Centered content with generous padding
- Icon → Title → Description → Action flow
- Consistent 16px spacing between elements

---

## Grid Layouts

### **Standard Grid Pattern**
```tsx
<div className="grid gap-6 lg:grid-cols-2">
  <Card>{/* Card 1 */}</Card>
  <Card>{/* Card 2 */}</Card>
</div>
```

**Spacing:**
- gap-6 = 24px between cards
- Responsive: Single column mobile, 2 cols desktop

### **4-Column Grid (Stats)**
```tsx
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</div>
```

**Spacing:**
- gap-4 = 16px between stat cards (tighter for density)
- Responsive: 1 → 2 → 4 columns

---

## Hover Effects

### **Standard Card Hover**
```tsx
className="transition-all duration-300 
  hover:-translate-y-2 
  hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] 
  shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]"
```

**Effect:**
- Subtle lift (-8px translate)
- Enhanced shadow on hover
- Smooth 300ms transition
- Maintains spacing during animation

---

## Common Mistakes to Avoid

### ❌ **Wrong: No Bottom Padding**
```tsx
<CardHeader className="flex flex-row items-center justify-between space-y-0">
  {/* Title touching content */}
</CardHeader>
```

### ✅ **Correct: Proper Bottom Padding**
```tsx
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
  {/* Proper spacing */}
</CardHeader>
```

---

### ❌ **Wrong: No Title-Description Spacing**
```tsx
<CardTitle>Title</CardTitle>
<CardDescription>Description</CardDescription>
{/* Too close together */}
```

### ✅ **Correct: Add Top Margin**
```tsx
<CardTitle>Title</CardTitle>
<CardDescription className="mt-1">Description</CardDescription>
{/* Proper separation */}
```

---

### ❌ **Wrong: Inconsistent Content Padding**
```tsx
<CardContent>
  {/* No top padding specified */}
</CardContent>
```

### ✅ **Correct: Consistent Content Padding**
```tsx
<CardContent className="pt-6">
  {/* Proper top padding when header has actions/badges */}
</CardContent>
```

---

### ❌ **Wrong: Custom Padding Override**
```tsx
<CardHeader className="p-2">
  {/* Breaks design system */}
</CardHeader>
```

### ✅ **Correct: Use Design System Classes**
```tsx
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
  {/* Follows standards */}
</CardHeader>
```

---

## Responsive Behavior

### **Mobile (<640px)**
- Single column layout
- Maintains card padding
- Actions may stack vertically
- Smaller card gaps (gap-4)

### **Tablet (640px - 1024px)**
- 2 column grid for most cards
- Maintains full padding
- Side-by-side actions
- Standard gaps (gap-6)

### **Desktop (>1024px)**
- 3-4 column grids available
- Full spacing preserved
- Maximum content density
- Enhanced hover effects

---

## Accessibility Considerations

### **Touch Targets**
- Buttons min 44x44px
- Proper spacing between interactive elements
- No overlapping click zones

### **Visual Hierarchy**
- Title size: text-base (16px) font-semibold
- Description: text-sm (14px) text-muted-foreground
- Clear contrast ratios maintained

### **Focus States**
- All interactive elements have focus rings
- Keyboard navigation supported
- Proper tab order maintained

---

## Implementation Checklist

When creating a new card:

- [ ] Use Card component (not custom div)
- [ ] Add pb-4 to CardHeader if using flex-row layout
- [ ] Add mt-1 to CardDescription
- [ ] Add pt-6 to CardContent if header has actions
- [ ] Include hover effects for interactive cards
- [ ] Test mobile/tablet/desktop layouts
- [ ] Verify dark mode appearance
- [ ] Check keyboard navigation
- [ ] Ensure proper touch targets

---

## Related Components

### **StatCard**
- Uses custom padding: `p-6`
- Consistent with design system
- Already properly spaced

### **PageHeader**
- Not a card component
- Uses own spacing system
- `space-y-6` from page container

### **SettingsTabs**
- Tab content uses cards internally
- Follows same spacing standards
- Additional tab-specific padding

---

## Questions & Answers

**Q: Why pb-4 instead of pb-6?**  
A: 16px bottom padding + 24px top padding in CardContent = 40px total gap, which provides proper visual separation without excessive whitespace.

**Q: Can I use custom padding?**  
A: Avoid custom padding unless absolutely necessary. Use design system tokens for consistency.

**Q: What about nested cards?**  
A: Reduce padding to prevent double-spacing. Use `p-4` instead of `p-6` for nested cards.

**Q: Should all cards have hover effects?**  
A: Only interactive/clickable cards. Static content cards can omit hover effects.

**Q: How to handle very long titles?**  
A: Use `line-clamp-1` or `line-clamp-2` with proper overflow handling. Maintain spacing regardless of content length.

---

**Last Updated:** October 9, 2026  
**Version:** 1.0  
**Maintained by:** Development Team
