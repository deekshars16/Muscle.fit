# Member Membership Page - Interactive Plan Selection

## Overview
The Membership page now features fully interactive plan selection using **frontend-only state management**. Users can select plans with visual feedback and dynamic expiry date calculations.

## ✨ Interactive Features Implemented

### 1. **Current Plan Section** 📋
- **Dynamic Plan Display**: Shows currently selected plan name
- **Dynamic Expiry Date**: Calculates and displays expiry date based on selected plan
  - Monthly → +30 days
  - Quarterly → +90 days
  - Yearly → +365 days
- **Upgrade Plan Button**: Smooth scroll to plans section for easy navigation

**Location**: Top section, highlighted in purple gradient

### 2. **Plan Selection Logic** 🎯
- **Three Plans Available**:
  - Monthly (₹2,500/month)
  - Quarterly (₹6,000/3 months) - Most Popular
  - Yearly (₹20,000/year)

- **Click Behavior**:
  - Clicking "Choose Plan" or "Get Started" updates the current plan
  - Expiry date recalculates based on new plan duration
  - Confirmation toast appears for 3 seconds
  - Plan card scales up and highlights

### 3. **Visual Feedback** ✨
- **Active Plan Card**:
  - Glowing purple ring around selected plan
  - Green "Current Plan" badge at top
  - Gradient background
  - Button disabled and shows "Current Plan" text
  - Scale slightly larger for emphasis

- **Popular Plan Card** (when not selected):
  - Purple badge "Most Popular"
  - Slightly scaled up visually
  - Purple-gradient button "Get Started"

- **Other Plans**:
  - Hoverable with hover effects
  - Border highlights on hover
  - Plain "Choose Plan" button

### 4. **Upgrade Plan Button** ⬆️
- **Smooth Scroll**: Scrolls page to plans section for easy upgrade experience
- **Uses useRef**: References plans container for smooth scrolling
- **Responsive**: Works on all screen sizes

### 5. **Confirmation Toast** 🍞
- **Auto-appearing**: Shows when plan is successfully selected
- **Auto-hiding**: Disappears after 3 seconds
- **Green success color**: Clear visual confirmation
- **Animated**: Bounce animation for attention

**Format**: "Plan updated to [Plan Name] successfully!"

## 📝 State Management

```typescript
// Current plan type
const [currentPlan, setCurrentPlan] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')

// Expiry date display
const [expiryDate, setExpiryDate] = useState('Feb 17, 2026')

// Confirmation toast visibility
const [showConfirmation, setShowConfirmation] = useState(false)

// Selected plan name for toast
const [selectedPlanName, setSelectedPlanName] = useState('')

// Reference to plans section for smooth scroll
const plansRef = useRef<HTMLDivElement>(null)
```

## 🧮 Core Functions

### `calculateExpiryDate(plan)`
Calculates expiry date based on plan type:
```typescript
const calculateExpiryDate = (plan: 'monthly' | 'quarterly' | 'yearly') => {
  const today = new Date()
  let daysToAdd = 30 // default monthly
  if (plan === 'quarterly') daysToAdd = 90
  else if (plan === 'yearly') daysToAdd = 365
  
  const expiryDateObj = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
  return expiryDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
```

### `handlePlanSelect(planKey, planName)`
Updates plan and triggers confirmation:
```typescript
const handlePlanSelect = (planKey, planName) => {
  if (currentPlan !== planKey) {
    setCurrentPlan(planKey)
    setSelectedPlanName(planName)
    const newExpiryDate = calculateExpiryDate(planKey)
    setExpiryDate(newExpiryDate)
    setShowConfirmation(true)
    
    // Auto-hide after 3 seconds
    setTimeout(() => setShowConfirmation(false), 3000)
  }
}
```

### `handleUpgradePlan()`
Scrolls to plans section:
```typescript
const handleUpgradePlan = () => {
  if (plansRef.current) {
    plansRef.current.scrollIntoView({ behavior: 'smooth' })
  }
}
```

### `renderConfirmationToast()`
Renders success toast notification:
```typescript
const renderConfirmationToast = () => {
  if (!showConfirmation) return null
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white ...">
      <Check className="w-5 h-5" />
      <span>Plan updated to {selectedPlanName} successfully!</span>
    </div>
  )
}
```

## 🎨 Plan Card Features

### Static Card Props
```typescript
const plans = [
  {
    key: 'monthly',
    name: 'Monthly',
    price: '₹2,500',
    period: '/month',
    icon: Zap,
    features: [...],
    isPopular: false,
  },
  {
    key: 'quarterly',
    name: 'Quarterly',
    price: '₹6,000',
    period: '/3 months',
    icon: Star,
    features: [...],
    isPopular: true,
  },
  {
    key: 'yearly',
    name: 'Yearly',
    price: '₹20,000',
    period: '/year',
    icon: Crown,
    features: [...],
    isPopular: false,
  },
]
```

### Dynamic Features per Plan
- **Monthly**: 1 trainer session/month
- **Quarterly**: 4 trainer sessions/month + Nutrition guidance
- **Yearly**: Unlimited trainer sessions + Premium locker + Free merchandise

## 🔄 User Flow

1. **Page Load**: Monthly plan is selected by default
   - Expiry date: Today + 30 days
   - Current Plan section shows "Monthly Plan"

2. **Click "Get Started" on Quarterly**:
   - Plan updates to Quarterly
   - Expiry date recalculates: Today + 90 days
   - Card highlights with green badge
   - Toast: "Plan updated to Quarterly successfully!"
   - Button changes to "Current Plan" (disabled)

3. **Click "Choose Plan" on Yearly**:
   - Plan updates to Yearly
   - Expiry date recalculates: Today + 365 days
   - Quarterly card reverts, Yearly card highlights
   - Toast appears with new message
   - Quarterly button re-enables

4. **Click "Upgrade Plan"**:
   - Smooth scroll to plans section
   - User can select different plan

## ✅ All Requirements Met

✓ **Local state for currentPlan and expiryDate**
✓ **Current Plan Section reflects selection dynamically**
✓ **Expiry date updates based on plan duration**
✓ **Plan cards highlight on selection**
✓ **Button disables for active plan**
✓ **Confirmation toast appears on selection**
✓ **Active plan shows "Current Plan" button text**
✓ **Upgrade Plan button scrolls to plans**
✓ **Visual feedback for all states**
✓ **All data mocked inside component**
✓ **Existing layout and styles maintained**
✓ **Frontend-only, no backend calls**
✓ **No database storage**
✓ **No authentication changes**

## 📊 Visual States

### Active Plan Card
- Green "Current Plan" badge
- Purple ring (ring-2 ring-purple-400)
- Gradient purple background
- Scale 105% (slightly larger)
- Button: Gray, disabled, text "Current Plan"

### Popular Plan Card (not selected)
- Purple "Most Popular" badge
- Purple border
- Scale 105% (larger than normal)
- Button: Purple gradient, "Get Started"

### Normal Plan Card
- Gray border
- No badge
- Scale 100%
- Button: Border style, "Choose Plan"
- Hover effects with color transitions

## 🎯 Enhancements for Production

1. Connect to real payment gateway
2. Store plan selection in database
3. Implement actual billing cycle
4. Add plan downgrade restrictions
5. Email notifications for plan changes
6. Payment method integration
7. Proration calculations for mid-cycle changes

---

**File**: [MemberMembership.tsx](../pages/member/MemberMembership.tsx)  
**Status**: ✅ Complete - Fully interactive plan selection  
**Last Updated**: February 1, 2026
