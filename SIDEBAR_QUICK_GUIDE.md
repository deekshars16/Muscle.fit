# Collapsible Sidebar - Quick Guide

## 🎯 What's New

A collapsible (drawer) sidebar has been added to all Owner, Trainer, and Member dashboards with:
- ✅ Toggle button (hamburger icon)
- ✅ Smooth open/close animations
- ✅ Collapsed view shows only icons
- ✅ Expanded view shows icons + labels
- ✅ State persists across page navigation
- ✅ Role-based menu items
- ✅ Global state management via AppContext

---

## 📁 Files Created/Modified

### New Files
```
frontend/components/layout/
├── CollapsibleSidebar.tsx       (New - Reusable component)
├── TrainerLayout.tsx             (New - Layout wrapper)
└── MemberLayout.tsx              (New - Layout wrapper)
```

### Modified Files
```
frontend/
├── context/AppContext.tsx        (Added sidebarOpen state)
├── components/layout/OwnerLayout.tsx (Updated to use CollapsibleSidebar)
└── pages/
    ├── trainer/
    │   ├── TrainerDashboard.tsx
    │   ├── TrainerClients.tsx
    │   ├── TrainerSchedule.tsx
    │   ├── TrainerPrograms.tsx
    │   ├── TrainerAnalytics.tsx
    │   └── TrainerSettings.tsx
    └── member/
        ├── MemberDashboard.tsx
        ├── MemberMembership.tsx
        ├── MemberTrainer.tsx
        ├── MemberWorkouts.tsx
        ├── MemberSchedule.tsx
        ├── MemberAttendance.tsx
        ├── MemberProgress.tsx
        └── MemberProfile.tsx
```

---

## 🎨 Sidebar Behavior

### Expanded State (default)
```
┌─────────────────────────────────────────┐
│  💪 MUSCLES.FIT                         │
├─────────────────────────────────────────┤
│ 📊 Dashboard                            │
│ 👥 Trainers/Clients                     │
│ 💳 Payments/Membership                  │
│ ⚙️  Settings                            │
│                                          │
│                                          │
│ 🚪 Logout                              │
└─────────────────────────────────────────┘
(Width: w-64)
```

### Collapsed State
```
┌──────────┐
│💪        │
├──────────┤
│📊        │
│👥        │
│💳        │
│⚙️        │
│          │
│          │
│🚪        │
└──────────┘
(Width: w-20)
```

---

## 🔧 How to Use

### In a Page Component
```tsx
import TrainerLayout from '../../components/layout/TrainerLayout'

const TrainerDashboard: React.FC = () => {
  return (
    <TrainerLayout>
      {/* Your page content */}
      <h1>Dashboard Content</h1>
    </TrainerLayout>
  )
}
```

### To Toggle Sidebar Programmatically
```tsx
import { useAppContext } from '../../hooks/useAppContext'

const MyComponent: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext()
  
  return (
    <button onClick={toggleSidebar}>
      {sidebarOpen ? 'Collapse' : 'Expand'}
    </button>
  )
}
```

---

## 🎭 Role-Based Menus

### Owner Menu Items
- Dashboard
- Trainers
- Members
- Payments
- Settings
- Logout

### Trainer Menu Items
- Dashboard
- Clients
- Schedule
- Programs
- Analytics
- Settings
- Logout

### Member Menu Items
- Dashboard
- Membership
- My Trainer
- Workouts
- Schedule
- Attendance
- Progress
- Profile
- Logout

---

## 💾 State Persistence

The sidebar state is automatically saved to localStorage:
```javascript
localStorage.setItem('sidebarOpen', JSON.stringify(true/false))
```

This means:
- ✅ State persists when switching pages
- ✅ State persists on page refresh
- ✅ State is loaded when app starts
- ✅ State is independent of user authentication

---

## 🎬 Animations

All transitions use smooth CSS animations:
- Sidebar width change: 300ms
- Main content margin change: 300ms
- Easing: ease-in-out
- No janky behavior

---

## 🔍 Feature Details

| Feature | Details |
|---------|---------|
| **Collapsed Width** | 80px (w-20) |
| **Expanded Width** | 256px (w-64) |
| **Animation Duration** | 300ms |
| **State Storage** | localStorage |
| **Role Support** | owner, trainer, member |
| **Dark Mode** | Full support |
| **Icons** | Lucide React |

---

## 🚀 Key Components

### CollapsibleSidebar
- Handles all sidebar logic
- Manages menu items based on role
- Handles logout functionality
- Shows/hides text labels based on state

### OwnerLayout / TrainerLayout / MemberLayout
- Wraps CollapsibleSidebar
- Wraps Header component
- Adjusts main content margin dynamically
- Provides consistent layout structure

### AppContext
- Stores `sidebarOpen` boolean
- Provides `toggleSidebar()` function
- Persists state in localStorage

---

## 📱 Responsive Design

The sidebar is fixed and works on all screen sizes:
- Desktop: Full functionality
- Tablet: Works as expected
- Mobile: Sidebar takes full width when expanded

---

## ✨ Notes

- All page content was properly refactored to work with new layouts
- No functionality was lost during migration
- All routes still work correctly
- AppContext now available to all components
- Logout removes auth but keeps sidebar state

---

## 🐛 Troubleshooting

**Issue**: Sidebar not persisting state
- **Solution**: Check localStorage in browser DevTools

**Issue**: Sidebar icons not showing
- **Solution**: Ensure lucide-react is installed

**Issue**: Layout shifted when sidebar collapses
- **Solution**: Check that ml-64/ml-20 classes are applied correctly

---

## 🎓 Learning Resources

- React Context API: Managing global state
- Tailwind CSS: Dynamic class names with conditions
- localStorage: Browser persistent storage
- CSS Transitions: Smooth animations
- React Router: Navigation without state loss

---

Created: January 18, 2026
