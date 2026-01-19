import React from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, Zap, Star, Crown, Check } from 'lucide-react'

const MemberMembership: React.FC = () => {
  const plans = [
    {
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
      button: 'Choose Plan',
      isPopular: false,
      isCurrent: false,
    },
    {
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
      button: 'Get Started',
      isPopular: true,
      isCurrent: false,
    },
    {
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
      button: 'Choose Plan',
      isPopular: false,
      isCurrent: false,
    },
  ]

  return (
    <MemberLayout>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Membership Plans</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose the plan that fits your fitness goals.</p>
          </div>

          {/* Current Plan Section */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-700">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Current Plan</p>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Plan</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Valid until Feb 17, 2026</p>
              </div>
              <button className="px-6 py-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                  plan.isPopular
                    ? 'border-purple-600 shadow-xl transform scale-105'
                    : 'border-gray-200 dark:border-gray-700 shadow-sm'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Card Content */}
                <div className={`p-8 ${plan.isPopular ? 'bg-white dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    plan.isPopular
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.isPopular
                        ? 'text-purple-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
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

                  {/* Button */}
                  <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md'
                      : 'border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
    </MemberLayout>
  )
}

export default MemberMembership
