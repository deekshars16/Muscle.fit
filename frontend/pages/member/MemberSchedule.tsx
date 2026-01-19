import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, ChevronLeft, ChevronRight } from 'lucide-react'

const MemberSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 17))

  const sessions = [
    {
      time: '6:00 AM',
      name: 'Morning Yoga',
      type: 'Class',
      typeColor: 'blue',
      duration: '30 min',
      location: 'Studio A',
      isJoined: false,
    },
    {
      time: '9:30 AM',
      name: 'Full Body Training',
      type: 'Personal',
      typeColor: 'purple',
      duration: '45 min',
      location: 'Main Floor',
      isJoined: true,
      showJoinButton: true,
    },
    {
      time: '11:30 AM',
      name: 'Core Strength',
      type: 'Class',
      typeColor: 'blue',
      duration: '30 min',
      location: 'Studio B',
      isJoined: false,
    },
    {
      time: '2:00 PM',
      name: 'Cardio Session',
      type: 'Personal',
      typeColor: 'purple',
      duration: '40 min',
      location: 'Cardio Zone',
      isJoined: false,
    },
    {
      time: '5:00 PM',
      name: 'HIIT Training',
      type: 'Class',
      typeColor: 'blue',
      duration: '35 min',
      location: 'Main Floor',
      isJoined: false,
    },
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === 17 && currentDate.getMonth() === 0 && currentDate.getFullYear() === 2026
      days.push(
        <button
          key={day}
          className={`h-12 rounded-lg font-semibold text-sm transition-all ${
            isToday
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <MemberLayout>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workout Schedule</h1>
            <p className="text-gray-600 dark:text-gray-400">Plan and track your workout timing.</p>
          </div>

          {/* Calendar Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>

          {/* Day Schedule Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(currentDate)}</h2>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-5 rounded-lg border-l-4 transition-all ${
                    session.isJoined
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-l-purple-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700/30 border-l-gray-300 dark:border-l-gray-600'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className={`font-bold text-lg ${
                        session.isJoined ? 'text-purple-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {session.time}
                      </p>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{session.name}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        session.typeColor === 'blue'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      }`}>
                        {session.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {session.location}
                      </span>
                    </div>
                  </div>

                  {session.showJoinButton && (
                    <button className="ml-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-6 rounded-lg transition-all">
                      Join Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
    </MemberLayout>
  )
}

export default MemberSchedule
