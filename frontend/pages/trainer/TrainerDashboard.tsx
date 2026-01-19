import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'
import { useAppContext } from '../../hooks/useAppContext'

const TrainerDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 16))
  const [selectedDate, setSelectedDate] = useState<number | null>(16)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  // Chart data
  const chartData = [
    { day: 'Mon', clients: 40, sessions: 25 },
    { day: 'Tue', clients: 45, sessions: 28 },
    { day: 'Wed', clients: 38, sessions: 22 },
    { day: 'Thu', clients: 50, sessions: 28 },
    { day: 'Fri', clients: 52, sessions: 30 },
    { day: 'Sat', clients: 60, sessions: 32 },
    { day: 'Sun', clients: 35, sessions: 18 },
  ]

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userEmail')
    navigate('/auth/trainer-login', { replace: true })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`h-8 w-8 rounded-lg font-medium text-sm transition-colors ${
            isSelected 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <TrainerLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, John! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Here's what's happening with your clients today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-orange-400 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">Active Sessions</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">8</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-cyan-400 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">CLIENTS</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">24</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">+5 new</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-purple-400 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">EARNINGS</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">₹12,500</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">This month</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-red-400 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">TASKS</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">3</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">Pending</p>
            </div>
          </div>

          {/* Charts and Calendar Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Client Progress Chart */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm relative">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Weekly Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 
                {selectedDate ? ` - Selected: ${selectedDate}` : ' - Weekly overview'}
              </p>

              <svg viewBox="0 0 1000 350" className="w-full h-72">
                {/* Grid lines */}
                <line x1="80" y1="280" x2="950" y2="280" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="80" y1="210" x2="950" y2="210" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="80" y1="140" x2="950" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="80" y1="70" x2="950" y2="70" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />

                {/* Y-axis labels */}
                <text x="50" y="290" fontSize="14" fill="#999" textAnchor="end">0</text>
                <text x="50" y="220" fontSize="14" fill="#999" textAnchor="end">15</text>
                <text x="50" y="150" fontSize="14" fill="#999" textAnchor="end">30</text>
                <text x="50" y="80" fontSize="14" fill="#999" textAnchor="end">45</text>
                <text x="50" y="10" fontSize="14" fill="#999" textAnchor="end">60</text>

                {/* Active Clients area and line */}
                <path
                  d="M 150 135 Q 275 105 400 165 T 650 75 T 950 190 L 950 290 L 150 290 Z"
                  fill="#d8b4fe"
                  opacity="0.4"
                />
                <path
                  d="M 150 135 Q 275 105 400 165 T 650 75 T 950 190"
                  stroke="#a855f7"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Sessions area and line */}
                <path
                  d="M 150 215 Q 275 200 400 235 T 650 180 T 950 260 L 950 290 L 150 290 Z"
                  fill="#a1e4cb"
                  opacity="0.3"
                />
                <path
                  d="M 150 215 Q 275 200 400 235 T 650 180 T 950 260"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive hover areas and dots */}
                {chartData.map((data, index) => {
                  const xPositions = [150, 275, 400, 525, 650, 775, 950]
                  const clientYPositions = [135, 105, 165, 120, 75, 110, 190]
                  const sessionYPositions = [215, 200, 235, 205, 180, 195, 260]
                  const x = xPositions[index]
                  const clientY = clientYPositions[index]
                  const sessionY = sessionYPositions[index]

                  return (
                    <g key={index}>
                      {/* Invisible hover rect */}
                      <rect
                        x={x - 30}
                        y="0"
                        width="60"
                        height="300"
                        fill="transparent"
                        onMouseEnter={() => setHoveredDay(data.day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        style={{ cursor: 'pointer' }}
                      />
                      {/* Vertical line on hover */}
                      {hoveredDay === data.day && (
                        <line x1={x} y1="50" x2={x} y2="290" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
                      )}
                      {/* Active Clients dot */}
                      <circle cx={x} cy={clientY} r="5" fill="#a855f7" stroke="white" strokeWidth="2" />
                      {/* Sessions dot */}
                      <circle cx={x} cy={sessionY} r="5" fill="#22c55e" stroke="white" strokeWidth="2" />
                    </g>
                  )
                })}

                {/* X-axis labels */}
                <text x="150" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Mon</text>
                <text x="275" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Tue</text>
                <text x="400" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Wed</text>
                <text x="525" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Thu</text>
                <text x="650" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Fri</text>
                <text x="775" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Sat</text>
                <text x="950" y="320" fontSize="14" fill="#9ca3af" textAnchor="middle">Sun</text>
              </svg>

              {/* Tooltip */}
              {hoveredDay && (
                <div className="absolute bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 shadow-lg" 
                     style={{
                       left: hoveredDay === 'Wed' ? '35%' : hoveredDay === 'Sun' ? '85%' : '50%',
                       top: '160px',
                       transform: 'translateX(-50%)',
                       minWidth: '120px',
                     }}>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{hoveredDay}</p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">clients : {chartData.find(d => d.day === hoveredDay)?.clients}</p>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">sessions : {chartData.find(d => d.day === hoveredDay)?.sessions}</p>
                </div>
              )}

              <div className="flex gap-8 justify-center mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sessions</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors"
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
            </div>
          </div>

          {/* Active Clients and Recent Activity */}
          <div className="mt-8 grid grid-cols-3 gap-6">
            {/* Active Clients */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Clients</h2>
                <a href="#" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">View All</a>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Jennifer Wilson', program: 'Weight Loss', time: 'Today, 2:00 PM', progress: 75 },
                  { name: 'David Brown', program: 'Muscle Gain', time: 'Tomorrow, 10:00 AM', progress: 60 },
                  { name: 'Lisa Anderson', program: 'Flexibility', time: 'Today, 4:30 PM', progress: 90 },
                  { name: 'Robert Taylor', program: 'Cardio', time: 'Wed, 9:00 AM', progress: 45 },
                ].map((client, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{client.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{client.program} • {client.time}</p>
                        <div className="mt-2 w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600" style={{ width: `${client.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-4">{client.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Miller', action: 'Completed workout', type: 'Weight Loss Pro', time: '2 min ago', color: 'bg-green-100 dark:bg-green-900/30' },
                  { name: 'Mike Johnson', action: 'Started new program', type: 'Strength Building', time: '15 min ago', color: 'bg-blue-100 dark:bg-blue-900/30' },
                  { name: 'Emma Davis', action: 'Booked session', type: 'Personal Training', time: '1 hour ago', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
                  { name: 'Alex Chen', action: 'Achieved goal', type: 'Marathon Prep', time: '2 hours ago', color: 'bg-green-100 dark:bg-green-900/30' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className={`w-10 h-10 ${activity.color} rounded-full flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.name}</p>
                      <p className="text-xs text-gray-700 dark:text-gray-400">{activity.action} • {activity.type}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </TrainerLayout>
  )
}

export default TrainerDashboard
