import React, { useState, useRef } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Zap, Star, Crown, Check, X } from 'lucide-react'

const MemberMembership: React.FC = () => {
  // State management
  const [currentPlan, setCurrentPlan] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [expiryDate, setExpiryDate] = useState('Feb 17, 2026')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [selectedPlanName, setSelectedPlanName] = useState('')
  const [showCurrentPlanModal, setShowCurrentPlanModal] = useState(false)
  const pageTopRef = useRef<HTMLDivElement>(null)

  // Calculate expiry date based on plan duration
  const calculateExpiryDate = (plan: 'monthly' | 'quarterly' | 'yearly') => {
    const today = new Date()
    let daysToAdd = 30

    if (plan === 'quarterly') daysToAdd = 90
    else if (plan === 'yearly') daysToAdd = 365

    const expiryDateObj = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    return expiryDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Handle plan selection
  const handlePlanSelect = (planKey: 'monthly' | 'quarterly' | 'yearly', planName: string) => {
    if (currentPlan !== planKey) {
      // Update state
      setCurrentPlan(planKey)
      setSelectedPlanName(planName)
      const newExpiryDate = calculateExpiryDate(planKey)
      setExpiryDate(newExpiryDate)

      // Show modal
      setShowConfirmationModal(true)

      // Auto-hide and scroll after confirmation
      setTimeout(() => {
        setShowConfirmationModal(false)
        // Scroll to top to see updated Current Plan section
        if (pageTopRef.current) {
          pageTopRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 2000)
    }
  }

  // Handle upgrade plan button - scroll to plans
  const handleUpgradePlan = () => {
    const plansSection = document.getElementById('plans-section')
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const plans = [
    {
      key: 'monthly' as const,
      name: 'Monthly',
      price: '₹2,500',
      period: '/month',
      icon: Zap,
      features: [
        'Full gym access',
        '1 trainer session/month',
        'Locker access',
        'Basic workout plans',
      ],
    },
    {
      key: 'quarterly' as const,
      name: 'Quarterly',
      price: '₹6,000',
      period: '/3 months',
      icon: Star,
      features: [
        'Full gym access',
        '4 trainer sessions/month',
        'Locker access',
        'Custom workout plans',
        'Nutrition guidance',
      ],
    },
    {
      key: 'yearly' as const,
      name: 'Yearly',
      price: '₹20,000',
      period: '/year',
      icon: Crown,
      features: [
        'Full gym access',
        'Unlimited trainer sessions',
        'Premium locker',
        'Personal workout plans',
        'Diet consultation',
        'Free merchandise',
      ],
    },
  ]

  // Get current plan display name
  const getCurrentPlanName = () => {
    const plan = plans.find(p => p.key === currentPlan)
    return plan?.name || 'Monthly'
  }

  // Render confirmation modal
  const renderConfirmationModal = () => {
    if (!showConfirmationModal) return null
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Success!</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            You've successfully switched to the <span className="font-semibold text-purple-600 dark:text-purple-400">{selectedPlanName}</span> plan.
          </p>
        </div>
      </div>
    )
  }

  // Render current plan info modal
  const renderCurrentPlanModal = () => {
    if (!showCurrentPlanModal) return null
    const planDetails = plans.find(p => p.key === currentPlan)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">You're already on this plan</h3>
          
          <div className="mb-6">
            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Plan Name</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{planDetails?.name} Plan</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valid Until</p>
              <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{expiryDate}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Included Benefits</p>
            <ul className="space-y-2">
              {planDetails?.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setShowCurrentPlanModal(false)}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <MemberLayout>
      <div ref={pageTopRef} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Membership Plans</h1>
        <p className="text-gray-600 dark:text-gray-400">Choose the plan that fits your fitness goals.</p>
      </div>

      {/* Current Plan Section */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-700">
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">✓ Current Plan</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getCurrentPlanName()} Plan</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Valid until {expiryDate}</p>
      </div>

      {/* Plans Grid - Interactive */}
      <div id="plans-section" className="grid grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActive = currentPlan === plan.key
          const Icon = plan.icon

          return (
            <div
              key={plan.key}
              className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                isActive
                  ? 'border-purple-600 shadow-2xl transform scale-105 ring-2 ring-purple-400'
                  : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500'
              }`}
            >
              {/* Card Content */}
              <div
                className={`p-8 ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive
                        ? 'text-purple-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button - Show Modal on Active Plan */}
                <button
                  onClick={() => {
                    if (isActive) {
                      setShowCurrentPlanModal(true)
                    } else {
                      handlePlanSelect(plan.key, plan.name)
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 text-white opacity-100 hover:bg-purple-700 cursor-pointer'
                      : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-400 dark:hover:border-purple-500 transform hover:scale-105'
                  }`}
                >
                  {isActive ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation Modals */}
      {renderConfirmationModal()}
      {renderCurrentPlanModal()}
    </MemberLayout>
  )
}

export default MemberMembership
