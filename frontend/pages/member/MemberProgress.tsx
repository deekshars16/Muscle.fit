import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, Target, Zap, Heart } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProgressMetric {
  label: string
  value: string | number
  unit: string
  change: string
  trend: number
  icon: React.ReactNode
  color: string
}

interface WeightData {
  week: string
  weight: number
}

interface GoalData {
  name: string
  current: number
  target: number
  percentage: number
  color: string
}

const MemberProgress: React.FC = () => {

  // Mock data for weight progress
  const weightData: WeightData[] = [
    { week: 'Week 1', weight: 175 },
    { week: 'Week 2', weight: 173 },
    { week: 'Week 3', weight: 171 },
    { week: 'Week 4', weight: 169 },
    { week: 'Week 5', weight: 167 },
    { week: 'Week 6', weight: 164 },
    { week: 'Week 7', weight: 162 },
  ]

  // Progress metrics
  const metrics: ProgressMetric[] = [
    {
      label: 'Weight',
      value: 162,
      unit: 'lbs',
      change: '-13 lbs',
      trend: -7.4,
      icon: <div className="text-2xl">⚖️</div>,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'BMI',
      value: 24.2,
      unit: '',
      change: '-2.1',
      trend: -8.0,
      icon: <div className="text-2xl">📊</div>,
      color: 'from-purple-400 to-purple-600',
    },
    {
      label: 'Body Fat',
      value: 18,
      unit: '%',
      change: '-4%',
      trend: -18.2,
      icon: <div className="text-2xl">🎯</div>,
      color: 'from-orange-400 to-orange-600',
    },
    {
      label: 'Muscle Mass',
      value: 45,
      unit: 'kg',
      change: '-3 kg',
      trend: -6.3,
      icon: <div className="text-2xl">💪</div>,
      color: 'from-green-400 to-green-600',
    },
  ]

  // Fitness goals
  const goals: GoalData[] = [
    {
      name: 'Weight Goal',
      current: 162,
      target: 155,
      percentage: (162 / 155) * 100 - 100,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      name: 'Monthly Workouts',
      current: 18,
      target: 20,
      percentage: (18 / 20) * 100,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      name: 'Cardio Minutes',
      current: 280,
      target: 400,
      percentage: (280 / 400) * 100,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
  ]

  return (
    <MemberLayout>
          <div className="space-y-8">
            {/* Progress Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>{metric.icon}</div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      ↗ {metric.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400">{metric.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weight Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Weight Progress</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your weight journey over time</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">162 lbs</p>
                  <p className="text-sm text-green-600 dark:text-green-400">↗ -13 lbs</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[160, 176]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fill="#a855f722"
                    dot={{ fill: '#a855f7', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Fitness Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Fitness Goals</h2>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {goal.name}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {goal.current} / {goal.target} {goal.name === 'Weight Goal' ? 'lbs' : goal.name === 'Monthly Workouts' ? 'sessions' : 'min'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${goal.color}`}
                        style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {goal.percentage.toFixed(0)}% Complete
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </MemberLayout>
  )
}

export default MemberProgress
