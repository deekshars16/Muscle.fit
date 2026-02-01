# Quick Start Guide - Global State Management

## 🚀 Get Started in 30 Seconds

### 1. The Setup (Already Done ✅)
```
✅ AppContext.tsx created
✅ useAppContext.ts hook created  
✅ App.tsx wrapped with provider
✅ All pages updated to use context
✅ localStorage persistence enabled
```

### 2. How to Use in Any Component

Copy-paste this template:

```tsx
import { useAppContext } from '../../hooks/useAppContext'

export const MyComponent: React.FC = () => {
  // Get everything you need
  const { 
    trainers, 
    members, 
    payments,
    addTrainer,
    addMember,
    addPayment,
    updateTrainer,
    updateMember,
    updatePayment,
    deleteTrainer,
    deleteMember,
    deletePayment,
  } = useAppContext()

  // Use the data
  return (
    <div>
      <h1>Total Trainers: {trainers.length}</h1>
      <h1>Total Members: {members.length}</h1>
      
      {trainers.map(trainer => (
        <div key={trainer.id}>
          {trainer.first_name} {trainer.last_name}
          <button onClick={() => deleteTrainer(trainer.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

### 3. Common Operations

#### Add Trainer
```tsx
const newTrainer = {
  id: Date.now(),
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '9876543210',
  specialty: 'Fitness Instructor',
  role: 'trainer',
  is_active: true,
  created_at: new Date().toISOString(),
}
addTrainer(newTrainer)  // ✅ Auto-persisted
```

#### Add Member
```tsx
const newMember = {
  id: Date.now(),
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
  phone: '9876543211',
  role: 'member',
  is_active: true,
  created_at: new Date().toISOString(),
}
addMember(newMember)  // ✅ Auto-persisted
```

#### Add Payment
```tsx
const newPayment = {
  id: `PAY${Date.now()}`,
  user_name: 'John Doe',
  user_role: 'trainer',
  amount: 5000,
  date: new Date().toISOString().split('T')[0],
  method: 'UPI',
  status: 'completed',
}
addPayment(newPayment)  // ✅ Auto-persisted
```

#### Update Trainer
```tsx
updateTrainer(trainerId, {
  first_name: 'Updated Name',
  specialty: 'Zumba Instructor',
})  // ✅ Auto-persisted
```

#### Delete Trainer
```tsx
deleteTrainer(trainerId)  // ✅ Auto-persisted
```

### 4. Access Data Anywhere

```tsx
// In Trainers Page
const { trainers } = useAppContext()
console.log(trainers.length)  // 5

// Navigate to Dashboard
const { trainers } = useAppContext()
console.log(trainers.length)  // Still 5! ✅

// In Members Page
const { trainers } = useAppContext()
console.log(trainers.length)  // Still 5! ✅
```

### 5. Verify It Works

Open DevTools and check localStorage:
```
1. Open DevTools (F12)
2. Go to Application tab
3. Expand localStorage
4. Look for:
   - app_trainers: [...]
   - app_members: [...]
   - app_payments: [...]
5. Refresh page (F5)
6. Check localStorage again
7. Data should still be there ✅
```

### 6. Test Persistence

```
Test 1: Add Data & Refresh
1. Add a trainer on Trainers page
2. Refresh page (F5)
3. ✅ Trainer should still be there

Test 2: Navigate Routes
1. Add trainer on Trainers page
2. Go to Dashboard
3. ✅ Trainer count should be 1
4. Go back to Trainers
5. ✅ Trainer should still be there

Test 3: Close & Reopen
1. Add trainer, member, payment
2. Close browser completely
3. Reopen and go to app
4. ✅ All data should be there
```

### 7. Current Implementation

All pages already updated:

| Page | Status | Uses Context |
|------|--------|-------------|
| Trainers | ✅ Done | trainers, addTrainer, deleteTrainer, updateTrainer |
| Members | ✅ Done | members, addMember, deleteMember, updateMember |
| Payments | ✅ Done | payments, addPayment, deletePayment, updatePayment |
| Dashboard | ✅ Done | trainers, members, payments (for stats) |

### 8. What's Persistent?

✅ **Automatically saved to localStorage**:
- All trainers added
- All members added
- All payments added
- All edits to trainers/members
- All deletions

✅ **Survives**:
- Page refresh (F5)
- Route navigation
- Tab switch
- Browser close/reopen

❌ **Not saved**:
- Non-persisted data (use API calls for that)
- Session data (auth token is separate)

### 9. File Locations

```
frontend/
├── context/
│   └── AppContext.tsx ← Global state definition
├── hooks/
│   └── useAppContext.ts ← Hook to use context
├── pages/owner/
│   ├── Trainers.tsx ← Using context
│   ├── Members.tsx ← Using context
│   ├── Payments.tsx ← Using context
│   └── OwnerDashboard.tsx ← Using context
└── App.tsx ← Provider wrapper
```

### 10. Troubleshooting

**Issue**: Can't find useAppContext
```
✅ Solution: Make sure you're importing correctly
import { useAppContext } from '../../hooks/useAppContext'
```

**Issue**: Data doesn't persist after refresh
```
✅ Check: Did you use addTrainer()? Or did you use setTrainers()?
✅ Only context functions persist (addTrainer, not setTrainers)
```

**Issue**: localStorage shows undefined or error
```
✅ Check: Browser DevTools → Application → Storage → Cookies
✅ Check if 3rd party cookies are blocked
✅ Try incognito/private window
```

**Issue**: Multiple pages show different data
```
✅ Check: Are you using useAppContext() in all pages?
✅ If using local useState, it won't sync
```

## 📚 Full API Reference

### useAppContext() Returns

```typescript
{
  // State Arrays
  trainers: Trainer[],
  members: Member[],
  payments: Payment[],
  
  // Trainer Functions
  addTrainer: (trainer: Trainer) => void,
  updateTrainer: (id: number|string, data: Partial<Trainer>) => void,
  deleteTrainer: (id: number|string) => void,
  
  // Member Functions
  addMember: (member: Member) => void,
  updateMember: (id: number|string, data: Partial<Member>) => void,
  deleteMember: (id: number|string) => void,
  
  // Payment Functions
  addPayment: (payment: Payment) => void,
  updatePayment: (id: string, data: Partial<Payment>) => void,
  deletePayment: (id: string) => void,
}
```

### Trainer Interface
```tsx
{
  id: number | string
  username: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  specialty?: string
  role: string
  is_active: boolean
  created_at: string
  initials?: string  // Computed
  color?: string     // Computed
  members?: number   // Computed
  rating?: number    // Computed
}
```

### Member Interface
```tsx
{
  id: number | string
  username: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  is_active: boolean
  created_at: string
  initials?: string
  color?: string
  joinDate?: string
  expiryDate?: string
  status?: string
}
```

### Payment Interface
```tsx
{
  id: string
  user_name: string
  user_role: string
  amount: number
  date: string
  method: string
  status: string
  displayName?: string
  displayRole?: string
}
```

## ✅ Verification Checklist

- [ ] App starts without errors
- [ ] Can add trainer on Trainers page
- [ ] Trainer appears immediately
- [ ] Trainer persists after page refresh
- [ ] Can navigate away and back
- [ ] Trainer still there
- [ ] Dashboard shows correct trainer count
- [ ] Can add member and payment
- [ ] All data persists together
- [ ] localStorage shows data in DevTools
- [ ] Can delete items and they're gone
- [ ] Deleted items don't reappear on refresh

## 🎉 You're Done!

Your application now has:
- ✅ Persistent global state
- ✅ localStorage backup
- ✅ Automatic synchronization
- ✅ Single source of truth
- ✅ Type-safe context
- ✅ Production-ready code

**That's it! 🚀 No more lost data!**

