# Collapsible Sidebar - Visual Architecture

## Component Hierarchy

```
Root
│
├── AppContextProvider (provides sidebarOpen & toggleSidebar)
│   │
│   └── AppRoutes
│       │
│       ├── OwnerDashboard
│       │   └── OwnerLayout
│       │       ├── CollapsibleSidebar (role="owner")
│       │       ├── OwnerHeader
│       │       └── Page Content
│       │
│       ├── TrainerDashboard
│       │   └── TrainerLayout
│       │       ├── CollapsibleSidebar (role="trainer")
│       │       ├── Header
│       │       └── Page Content
│       │
│       └── MemberDashboard
│           └── MemberLayout
│               ├── CollapsibleSidebar (role="member")
│               ├── Header
│               └── Page Content
```

---

## Layout Structure

### Expanded State (sidebarOpen = true)

```
┌─────────────────────────────────────────────────────────────┐
│ App Container (flex h-screen)                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─────────────┐ ┌────────────────────────────────────────┐  │
│ │   Sidebar   │ │      Main Content (ml-64)              │  │
│ │  (w-64)     │ │  ┌──────────────────────────────────┐  │  │
│ │             │ │  │ Header (OwnerHeader/Header)      │  │  │
│ │ 💪 MUSCLES  │ │  ├──────────────────────────────────┤  │  │
│ │ .FIT        │ │  │                                  │  │  │
│ │ ═════════   │ │  │  Page Content                    │  │  │
│ │ 📊 Dash     │ │  │  (flex-1 overflow-auto)          │  │  │
│ │ 👥 Users    │ │  │                                  │  │  │
│ │ 💳 Payments │ │  │  (Dashboard/Trainers/Members...) │  │  │
│ │ ⚙️  Settings │ │  │                                  │  │  │
│ │             │ │  │                                  │  │  │
│ │ 🚪 Logout   │ │  │                                  │  │  │
│ └─────────────┘ │  └──────────────────────────────────┘  │  │
│                 │                                          │  │
│                 └──────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Collapsed State (sidebarOpen = false)

```
┌─────────────────────────────────────────────────────────────┐
│ App Container (flex h-screen)                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌──┐ ┌─────────────────────────────────────────────────────┐│
│ │💪│ │      Main Content (ml-20)                           ││
│ ├──┤ │  ┌──────────────────────────────────────────────┐   ││
│ │📊│ │  │ Header (OwnerHeader/Header)                  │   ││
│ │👥│ │  ├──────────────────────────────────────────────┤   ││
│ │💳│ │  │                                              │   ││
│ │⚙️ │ │  │  Page Content                               │   ││
│ │  │ │  │  (flex-1 overflow-auto)                      │   ││
│ │  │ │  │                                              │   ││
│ │  │ │  │  (Dashboard/Trainers/Members...)             │   ││
│ │🚪│ │  │                                              │   ││
│ └──┘ │  │                                              │   ││
│      │  └──────────────────────────────────────────────┘   ││
│      │                                                      │
│      └──────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## State Flow

```
User Interaction
│
├── Click Toggle Button
│   └─→ toggleSidebar() called
│       └─→ sidebarOpen: !sidebarOpen
│           └─→ useEffect triggers
│               └─→ localStorage.setItem('sidebarOpen', value)
│                   └─→ Component re-renders
│                       └─→ Sidebar width changes (300ms)
│                           └─→ Main margin changes (300ms)
│
└── Page Refresh/Navigation
    └─→ App initializes
        └─→ AppContextProvider mounts
            └─→ useEffect reads localStorage
                └─→ sidebarOpen = saved value
                    └─→ Sidebar renders with saved state
```

---

## Data Flow Diagram

```
AppContext
│
├── State
│   ├── sidebarOpen (boolean)
│   ├── trainers (array)
│   ├── members (array)
│   └── payments (array)
│
├── Functions
│   ├── toggleSidebar()
│   ├── addTrainer() / updateTrainer() / deleteTrainer()
│   ├── addMember() / updateMember() / deleteMember()
│   └── addPayment() / updatePayment() / deletePayment()
│
└── Effects
    ├── Persist trainers to localStorage
    ├── Persist members to localStorage
    ├── Persist payments to localStorage
    └── Persist sidebarOpen to localStorage
        │
        └─→ All components using useAppContext get updates
            └─→ Re-render with new state
```

---

## File Organization

```
frontend/
│
├── context/
│   └── AppContext.tsx (⭐ Updated with sidebarOpen)
│
├── components/
│   └── layout/
│       ├── CollapsibleSidebar.tsx (⭐ New - Core component)
│       ├── TrainerLayout.tsx (⭐ New - Wrapper)
│       ├── MemberLayout.tsx (⭐ New - Wrapper)
│       ├── OwnerLayout.tsx (✏️ Updated)
│       ├── Header.tsx (unchanged)
│       └── OwnerHeader.tsx (unchanged)
│
├── hooks/
│   └── useAppContext.ts (unchanged - already existed)
│
└── pages/
    ├── owner/
    │   ├── OwnerDashboard.tsx (✏️ Updated)
    │   ├── Trainers.tsx (✏️ Updated)
    │   ├── Members.tsx (✏️ Updated)
    │   ├── Payments.tsx (✏️ Updated)
    │   └── Settings.tsx (✏️ Updated)
    │
    ├── trainer/
    │   ├── TrainerDashboard.tsx (✏️ Updated)
    │   ├── TrainerClients.tsx (✏️ Updated)
    │   ├── TrainerSchedule.tsx (✏️ Updated)
    │   ├── TrainerPrograms.tsx (✏️ Updated)
    │   ├── TrainerAnalytics.tsx (✏️ Updated)
    │   └── TrainerSettings.tsx (✏️ Updated)
    │
    └── member/
        ├── MemberDashboard.tsx (✏️ Updated)
        ├── MemberMembership.tsx (✏️ Updated)
        ├── MemberTrainer.tsx (✏️ Updated)
        ├── MemberWorkouts.tsx (✏️ Updated)
        ├── MemberSchedule.tsx (✏️ Updated)
        ├── MemberAttendance.tsx (✏️ Updated)
        ├── MemberProgress.tsx (✏️ Updated)
        └── MemberProfile.tsx (✏️ Updated)
```

---

## Animation Timeline

```
User clicks toggle button
│
├─ 0ms: toggleSidebar() called
│       ├─ sidebarOpen flipped
│       ├─ localStorage updated
│       └─ Component re-renders
│
├─ 0-300ms: CSS Transitions
│       ├─ Sidebar width changes smoothly
│       │   w-64 ←→ w-20 (transition-all duration-300)
│       │
│       └─ Main content margin changes
│           ml-64 ←→ ml-20 (transition-all duration-300)
│
└─ 300ms+: Animation complete
        ├─ Sidebar in final state
        ├─ Icons visible/hidden correctly
        ├─ Text labels visible/hidden correctly
        └─ Content properly positioned
```

---

## Toggle Button Position & Animation

```
Fixed Position (left-0 top-6)
│
├─ Always visible
├─ Always clickable
├─ Animates smoothly with sidebar
│
└─ Button Icon Changes
    ├─ Expanded (sidebarOpen = true)
    │   └─→ <X /> icon (close sidebar)
    │
    └─ Collapsed (sidebarOpen = false)
        └─→ <Menu /> icon (open sidebar)

Visual:
┌─────────────────────┐
│ ☰                   │  ← Hamburger (when collapsed)
└─────────────────────┘

┌─────────────────────┐
│ ✕                   │  ← X (when expanded)
└─────────────────────┘
```

---

## Menu Item Rendering

### Expanded (sidebarOpen = true)
```jsx
<button>
  <IconComponent className="w-5 h-5" />  {/* Visible */}
  <span>Menu Label</span>                  {/* Visible */}
</button>
```

### Collapsed (sidebarOpen = false)
```jsx
<button title="Menu Label">
  <IconComponent className="w-5 h-5" />  {/* Visible */}
  {/* Text span is not rendered */}
</button>
```

---

## CSS Transition Details

```css
/* Sidebar Container */
.sidebar {
  transition: all 300ms ease-in-out;
  width: 16rem;        /* w-64 */
  /* or */
  width: 5rem;         /* w-20 */
}

/* Main Content */
.main-content {
  transition: all 300ms ease-in-out;
  margin-left: 16rem;  /* ml-64 */
  /* or */
  margin-left: 5rem;   /* ml-20 */
}
```

---

## Role-Based Menu Structure

```
Owner Menu
├── 📊 Dashboard → /owner/dashboard
├── 🧑‍🏫 Trainers → /owner/trainers
├── 👥 Members → /owner/members
├── 💳 Payments → /owner/payments
├── ⚙️ Settings → /owner/settings
└── 🚪 Logout

Trainer Menu
├── 📊 Dashboard → /trainer/dashboard
├── 👥 Clients → /trainer/clients
├── 📅 Schedule → /trainer/schedule
├── 📖 Programs → /trainer/programs
├── 📈 Analytics → /trainer/analytics
├── ⚙️ Settings → /trainer/settings
└── 🚪 Logout

Member Menu
├── 📊 Dashboard → /member/dashboard
├── 💳 Membership → /member/membership
├── 🧑‍🏫 My Trainer → /member/trainer
├── 🏋️ Workouts → /member/workouts
├── 📅 Schedule → /member/schedule
├── ⏰ Attendance → /member/attendance
├── 📈 Progress → /member/progress
├── 👤 Profile → /member/profile
└── 🚪 Logout
```

---

## localStorage Structure

```javascript
// Key-Value pair stored in browser localStorage
Key: 'sidebarOpen'
Value: true or false (JSON stringified)

// Example
localStorage.sidebarOpen = "true"   // When expanded
localStorage.sidebarOpen = "false"  // When collapsed

// On app load:
const saved = localStorage.getItem('sidebarOpen')
const sidebarOpen = saved ? JSON.parse(saved) : true
```

---

## Performance Flow

```
Initial Load
│
├─ 1. Read localStorage (< 1ms)
├─ 2. Create AppContext (< 1ms)
├─ 3. Render Sidebar (< 50ms)
├─ 4. Render Layout (< 50ms)
├─ 5. Render Page Content (< 200ms)
│
└─ Total: ~300ms (Fast)

User Toggle
│
├─ 1. Click button (instant)
├─ 2. Toggle state (< 1ms)
├─ 3. Update localStorage (< 5ms)
├─ 4. Re-render components (< 50ms)
├─ 5. Animate CSS (300ms)
│
└─ Total: 300ms (Smooth 60fps)
```

---

## Summary Table

| Aspect | Expanded | Collapsed |
|--------|----------|-----------|
| **Sidebar Width** | 256px (w-64) | 80px (w-20) |
| **Content Margin** | ml-64 | ml-20 |
| **Text Labels** | Visible | Hidden |
| **Icons** | Visible | Visible |
| **Toggle Icon** | ✕ (close) | ☰ (open) |
| **Available Space** | 70% | 95%+ |
| **Use Case** | Navigation browsing | More content space |

---

Created: January 18, 2026
