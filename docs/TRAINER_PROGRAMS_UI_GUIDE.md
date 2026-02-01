# Trainer Programs UI - User Guide

## Page Overview

### Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│  Programs                                   [Create Program] btn │
│  Create and manage training programs                            │
└─────────────────────────────────────────────────────────────────┘
```

### Statistics Cards
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total       │ │ Active      │ │ Total       │ │ Avg.        │
│ Programs    │ │ Programs    │ │ Enrollments │ │ Enrollments │
│             │ │             │ │             │ │             │
│      5      │ │      5      │ │      213    │ │      43     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Search Bar
```
┌──────────────────────────────┐  ┌─────────┐
│ 🔍 Search programs...        │  │ Filter  │
└──────────────────────────────┘  └─────────┘
```

## Program Cards Grid

### Single Program Card
```
┌────────────────────────────────┐
│ 💪 Weight Loss Pro    [⋯ menu] │  ← Header with icon, name, menu
│ ✓ active                        │  ← Status badge
├────────────────────────────────┤
│ 12 week intensive fat burning   │  ← Description
│ program with cardio and strength│
│ training                        │
├────────────────────────────────┤
│ [👥 45 members] [⏱️ 12 weeks] │  ← Info row
├────────────────────────────────┤
│ Intermediate                    │  ← Difficulty
│ Type: cardio                    │  ← Program type
│ Price: ₹2999                    │  ← Price
└────────────────────────────────┘
```

### Program Card Menu
```
When clicking three dots (⋯):

┌──────────────┐
│ ✏️  Edit     │ ← Opens edit modal
│ 📋 Duplicate │ ← Creates copy with (Copy) suffix
│ 🗑️  Delete   │ ← Removes with confirmation
└──────────────┘
```

## Modal Dialogs

### Create/Edit Program Modal
```
┌─────────────────────────────────────────┐
│ Create New Program               [✕]     │
├─────────────────────────────────────────┤
│ Program Name *                           │
│ [______________________________]          │
│                                          │
│ Program Type *                           │
│ [▼ Muscle Building ▼]                   │
│  • Cardio                                │
│  • Muscle Building                       │
│  • Yoga                                  │
│  • Strength Training                     │
│  • Flexibility                           │
│                                          │
│ Description *                            │
│ [_________________________________]      │
│ [_________________________________]      │
│ [_________________________________]      │
│                                          │
│ Duration (weeks) *   │  Difficulty *    │
│ [__________]         │  [▼ Intermediate]│
│                      │   • Beginner     │
│                      │   • Intermediate │
│                      │   • Advanced     │
│                                          │
│ Price (₹) *                             │
│ [______________________________]          │
│                                          │
│ ☑ Mark as active                        │
│                                          │
│         [Cancel]        [Create Program]│
└─────────────────────────────────────────┘
```

## Program Card States

### Active Program
```
┌────────────────────────────────┐
│ 💪 Program Name      [⋯]        │
│ ✓ active                        │  ← Green badge
│ [Standard card content]         │
└────────────────────────────────┘
```

### Inactive Program
```
┌────────────────────────────────┐
│ 💪 Program Name      [⋯]        │
│ ✗ inactive                      │  ← Gray badge
│ [Standard card content]         │
└────────────────────────────────┘
```

### Empty State
```
┌──────────────────────────────────────┐
│                                      │
│                📊                   │
│         No programs found            │
│                                      │
│  Create your first program button    │
│                                      │
└──────────────────────────────────────┘
```

## Loading State
```
┌──────────────────────────────────────┐
│                                      │
│            ◐ Loading...             │
│                                      │
│      Loading programs...            │
│                                      │
└──────────────────────────────────────┘
```

## Error State
```
┌──────────────────────────────────────┐
│ ⚠️  Failed to load programs          │
│                                      │
│                    [Dismiss]         │
└──────────────────────────────────────┘
```

## Desktop Grid Layout

### 3 Column Layout (lg screen)
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Program  │ │ Program  │ │ Program  │
│    1     │ │    2     │ │    3     │
└──────────┘ └──────────┘ └──────────┘
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Program  │ │ Program  │ │ Program  │
│    4     │ │    5     │ │    6     │
└──────────┘ └──────────┘ └──────────┘
```

### 2 Column Layout (md screen)
```
┌──────────────┐ ┌──────────────┐
│   Program    │ │   Program    │
│      1       │ │      2       │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│   Program    │ │   Program    │
│      3       │ │      4       │
└──────────────┘ └──────────────┘
```

### 1 Column Layout (sm screen)
```
┌────────────────────────────┐
│      Program 1             │
├────────────────────────────┤
│      Program 2             │
├────────────────────────────┤
│      Program 3             │
├────────────────────────────┤
│      Program 4             │
└────────────────────────────┘
```

## User Workflows

### Creating a Program
```
1. Click [Create Program] button
   ↓
2. Modal opens with empty form
   ↓
3. Fill in all required fields:
   - Name
   - Type
   - Description
   - Duration
   - Difficulty
   - Price
   - Active status (checkbox)
   ↓
4. Click [Create Program]
   ↓
5. Program appears in grid (at top, newest first)
```

### Editing a Program
```
1. Click [⋯] menu on program card
   ↓
2. Click "Edit"
   ↓
3. Modal opens with existing values
   ↓
4. Modify desired fields
   ↓
5. Click [Update Program]
   ↓
6. Card updates immediately
```

### Duplicating a Program
```
1. Click [⋯] menu on program card
   ↓
2. Click "Duplicate"
   ↓
3. New program created:
   - Same details as original
   - Name: "[Original Name] (Copy)"
   - Appears at top of grid
```

### Deleting a Program
```
1. Click [⋯] menu on program card
   ↓
2. Click "Delete"
   ↓
3. Confirmation dialog:
   "Are you sure you want to delete this program?"
   ↓
4. Click "OK" to confirm
   ↓
5. Program removed from grid
```

### Searching Programs
```
1. Type in search box
   ↓
2. Grid updates in real-time
   ↓
3. Shows only programs matching:
   - Name contains search term
   - Description contains search term
   ↓
4. Clear search to see all
```

## Data Display

### Program Information Shown
- **Name** - Program title
- **Status** - Active/Inactive badge
- **Description** - Full program description
- **Type** - Program category (cardio, muscle, etc.)
- **Duration** - How many weeks the program lasts
- **Difficulty** - Beginner, Intermediate, or Advanced
- **Price** - Cost in rupees (₹)
- **Members** - Number of members assigned
- **Created** - Timestamp in database

### Statistics Shown
- **Total Programs** - Count of all user's programs
- **Active Programs** - Count of programs with is_active=true
- **Total Enrollments** - Sum of all members assigned to all programs
- **Average Enrollments** - Total enrollments ÷ Total programs

## Dark Mode Support

All components support dark mode:
- Light mode: White backgrounds, dark text
- Dark mode: Dark backgrounds, light text
- Smooth transitions between modes
- Proper contrast ratios maintained

## Responsive Behavior

- **Mobile** (< 768px): Single column, full width
- **Tablet** (768px - 1024px): 2 columns
- **Desktop** (> 1024px): 3 columns
- **Search bar**: Full width on all sizes
- **Stats cards**: Stack on mobile, grid on larger screens

## Animation & Interactions

- **Hover Effects**: Cards show shadow on hover
- **Modal Animation**: Smooth fade in/out
- **Button States**: Hover and active states
- **Loading**: Spinner animation during operations
- **Transitions**: Smooth color and opacity changes

## Accessibility Features

- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ ARIA labels where needed
- ✅ Color contrast compliance
- ✅ Focus indicators on interactive elements
- ✅ Form field labels with proper associations
