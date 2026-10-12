# Venue Dialog Update - Delete Button Repositioned

## Date: October 12, 2026

## Changes Made

### 1. Delete Button Moved to Footer (Left Side)
- **Location**: Bottom left of dialog footer (red rectangle area)
- **Visibility**: Only shows in EDIT mode (when `venueId` exists)
- **Position**: Left side of footer, opposite to Cancel/Save buttons
- **Styling**: Red outline with hover effect

### 2. Footer Layout Updated
- **Structure**: `justify-between` flex layout
- **Left Side**: Delete Venue button (edit mode only) or empty div (create mode)
- **Right Side**: Cancel + Save Changes buttons

### 3. Active/Inactive Toggle Switch
- **Location**: Active Status section, after Amenities
- **Type**: Custom sliding toggle button
- **Colors**: 
  - Active: Orange (`bg-orange-500`)
  - Inactive: Gray (`bg-gray-300`)
- **Animation**: White circle slides left/right
- **State**: Saves `is_active` field to database

## Component Structure

```tsx
<DialogFooter className="flex items-center justify-between">
  {/* LEFT: Delete Button (Edit Mode Only) */}
  {venueId ? (
    <Button variant="outline" onClick={...} className="border-red-500 text-red-500">
      <Trash2 /> Delete Venue
    </Button>
  ) : (
    <div></div>
  )}

  {/* RIGHT: Action Buttons */}
  <div className="flex gap-2">
    <Button variant="outline">Cancel</Button>
    <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
      <Save /> Save Changes
    </Button>
  </div>
</DialogFooter>
```

## Testing Checklist

- [x] Build successful (no errors)
- [ ] **CRITICAL**: Run migration 31 in Supabase SQL Editor
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Test CREATE mode: No delete button visible
- [ ] Test EDIT mode: Delete button visible on bottom left
- [ ] Test toggle switch: Visible and changes color
- [ ] Test delete functionality: Confirmation dialog appears
- [ ] Test save with toggle: Active/inactive state saves correctly

## Critical Next Step

**⚠️ MIGRATION 31 MUST BE RUN FIRST ⚠️**

Before testing venue create/edit:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run `supabase/migrations/31_update_event_venues_schema.sql`
4. This renames columns to match the code:
   - `base_price` → `base_rate`
   - `features` → `amenities`
   - `images` → `photos`
   - `is_available` → `is_active`
   - Splits `capacity` into `capacity_min` and `capacity_max`
   - Adds `location` column

## Files Modified

- `components/manager/edit-venue-dialog.tsx` - Updated footer layout with delete button

## Build Status

✅ Build successful - no errors
✅ TypeScript validation passed
✅ Ready for testing after migration

## User Instructions

1. **Run Migration**: Execute migration 31 in Supabase SQL Editor
2. **Hard Refresh**: Press `Ctrl+Shift+R` in browser
3. **Test Create**: Click "Add Venue" - no delete button should show
4. **Test Edit**: Click edit on existing venue - delete button shows on bottom left
5. **Test Toggle**: Toggle switch should be orange when active, gray when inactive
6. **Test Save**: Changes should save to database correctly
