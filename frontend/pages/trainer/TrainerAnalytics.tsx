import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Download } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'

const TrainerAnalytics: React.FC = () => {
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Revenue', value: '$26,800', icon: '💵', change: '+18%', color: 'text-green-600 dark:text-green-400' },
    { label: 'Active Clients', value: '248', icon: '👥', change: '+12%', color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Sessions This Month', value: '186', icon: '📅', change: '+8%', color: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Goal Completion', value: '87%', icon: '🎯', change: '-2%', color: 'text-red-600 dark:text-red-400' },
  ]

  return (
    <TrainerLayout>
      <div className="p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Track your business performance</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                Last 30 Days
              </button>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Revenue Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue Overview</h2>
              <svg viewBox="0 0 600 300" className="w-full h-64">
                {/* Grid lines */}
                <line x1="60" y1="240" x2="580" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="60" y1="180" x2="580" y2="180" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="60" y1="120" x2="580" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="60" y1="60" x2="580" y2="60" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="5,5" />

                {/* Y-axis labels */}
                <text x="45" y="245" fontSize="12" fill="#999" textAnchor="end">0</text>
                <text x="45" y="185" fontSize="12" fill="#999" textAnchor="end">7000</text>
                <text x="45" y="125" fontSize="12" fill="#999" textAnchor="end">14000</text>
                <text x="45" y="65" fontSize="12" fill="#999" textAnchor="end">21000</text>
                <text x="45" y="10" fontSize="12" fill="#999" textAnchor="end">28000</text>

                {/* Area */}
                <path
                  d="M 80 160 Q 140 140 200 150 T 320 100 T 440 110 T 560 80 L 560 240 L 80 240 Z"
                  fill="#d8b4fe"
                  opacity="0.3"
                />
                {/* Line */}
                <path
                  d="M 80 160 Q 140 140 200 150 T 320 100 T 440 110 T 560 80"
                  stroke="#a855f7"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* X-axis labels */}
                <text x="80" y="260" fontSize="12" fill="#666" textAnchor="middle">Jan</text>
                <text x="200" y="260" fontSize="12" fill="#666" textAnchor="middle">Feb</text>
                <text x="320" y="260" fontSize="12" fill="#666" textAnchor="middle">Mar</text>
                <text x="440" y="260" fontSize="12" fill="#666" textAnchor="middle">Apr</text>
                <text x="560" y="260" fontSize="12" fill="#666" textAnchor="middle">May</text>
              </svg>
            </div>

            {/* Weekly Sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Sessions</h2>
              <div className="flex items-end justify-between gap-3 h-64">
                {[
                  { day: 'Mon', purple: 12, red: 2 },
                  { day: 'Tue', purple: 15, red: 1 },
                  { day: 'Wed', purple: 10, red: 3 },
                  { day: 'Thu', purple: 18, red: 1 },
                  { day: 'Fri', purple: 14, red: 2 },
                  { day: 'Sat', purple: 20, red: 2 },
                  { day: 'Sun', purple: 8, red: 1 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end gap-1 justify-center" style={{ height: '200px' }}>
                      <div
                        className="bg-purple-600 rounded-t"
                        style={{ width: '45%', height: `${(item.purple / 20) * 200}px` }}
                      ></div>
                      <div
                        className="bg-red-500 rounded-t"
                        style={{ width: '45%', height: `${(item.red / 20) * 200}px` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Program Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Program Distribution</h2>
              <div className="flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-48 h-48">
                  {/* Red segment - Weight Loss */}
                  <path
                    d="M 150 150 L 150 50 A 100 100 0 0 1 236.6 63.4 Z"
                    fill="#ef4444"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Purple segment - Muscle Gain */}
                  <path
                    d="M 150 150 L 236.6 63.4 A 100 100 0 0 1 213.4 236.6 Z"
                    fill="#a855f7"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Green segment - Cardio */}
                  <path
                    d="M 150 150 L 213.4 236.6 A 100 100 0 0 1 63.4 236.6 Z"
                    fill="#22c55e"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Orange segment - Flexibility */}
                  <path
                    d="M 150 150 L 63.4 236.6 A 100 100 0 0 1 150 50 Z"
                    fill="#f59e0b"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {[
                  { color: 'bg-red-500', label: 'Weight Loss' },
                  { color: 'bg-purple-600', label: 'Muscle Gain' },
                  { color: 'bg-green-500', label: 'Cardio' },
                  { color: 'bg-yellow-500', label: 'Flexibility' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Retention Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Client Retention Rate</h2>
              <svg viewBox="0 0 600 300" className="w-full h-56">
                {/* Grid lines */}
                <line x1="60" y1="240" x2="580" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="60" y1="190" x2="580" y2="190" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="60" y1="140" x2="580" y2="140" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="60" y1="90" x2="580" y2="90" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="5,5" />

                {/* Y-axis labels */}
                <text x="45" y="245" fontSize="11" fill="#999" textAnchor="end">0</text>
                <text x="45" y="195" fontSize="11" fill="#999" textAnchor="end">85</text>
                <text x="45" y="145" fontSize="11" fill="#999" textAnchor="end">89</text>
                <text x="45" y="95" fontSize="11" fill="#999" textAnchor="end">93</text>
                <text x="45" y="45" fontSize="11" fill="#999" textAnchor="end">100</text>

                {/* Line */}
                <path
                  d="M 100 140 L 180 110 L 260 130 L 340 100 L 420 120 L 500 105 L 560 80"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Dots */}
                {[100, 180, 260, 340, 420, 500, 560].map((x, i) => {
                  const yValues = [140, 110, 130, 100, 120, 105, 80]
                  return <circle key={i} cx={x} cy={yValues[i]} r="5" fill="#22c55e" stroke="white" strokeWidth="2" />
                })}

                {/* X-axis labels */}
                <text x="100" y="260" fontSize="11" fill="#666" textAnchor="middle">Jan</text>
                <text x="180" y="260" fontSize="11" fill="#666" textAnchor="middle">Feb</text>
                <text x="260" y="260" fontSize="11" fill="#666" textAnchor="middle">Mar</text>
                <text x="340" y="260" fontSize="11" fill="#666" textAnchor="middle">Apr</text>
                <text x="420" y="260" fontSize="11" fill="#666" textAnchor="middle">May</text>
                <text x="500" y="260" fontSize="11" fill="#666" textAnchor="middle">Jun</text>
              </svg>
            </div>
          </div>
      </div>
    </TrainerLayout>
  )
}

export default TrainerAnalytics
