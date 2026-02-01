import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'

const TrainerSchedule: React.FC = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 16))

  // Schedule data (fetched from backend)
  const [sessions, setSessions] = useState<Array<any>>([])
  const [loadingSessions, setLoadingSessions] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingSessions(true)
      try {
        const resp = await (await import('../../services/api')).default.get('/programs/sessions/')
        if (!mounted) return
        // map backend sessions into UI-friendly shape
        const data = resp.data.map((s: any) => ({
          id: s.id,
          date: new Date(s.scheduled_date).getDate(),
          client: s.client_name || `${s.client}`,
          time: new Date(s.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: s.session_type === 'virtual' ? 'Virtual' : 'In-Person',
          raw: s,
        }))
        setSessions(data)
      } catch (err) {
        console.error('Failed to load sessions', err)
      } finally {
        setLoadingSessions(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const todaySessions = sessions.filter(s => s.date === new Date().getDate())

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
      const isToday = day === 16
      const daySession = sessions.filter(s => s.date === day)
      
      days.push(
        <div
          key={day}
          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
            isToday
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-purple-400'
          }`}
        >
          <p className="font-semibold text-sm mb-2">{day}</p>
          <div className="space-y-1">
            {daySession.map((session, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 rounded ${
                  isToday
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                }`}
              >
                <p className="font-medium">{session.client.split(' ')[0]}</p>
                <p className="text-xs opacity-75">{session.time}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <TrainerLayout>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your training sessions</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Session
            </button>
          </div>

          {/* Calendar and Sessions Grid */}
          <div className="grid grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
            </div>

            {/* Today's Sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Sessions</h2>
              <div className="space-y-4">
                {todaySessions.length > 0 ? (
                  todaySessions.map((session, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {session.client.split(' ')[0][0]}{session.client.split(' ')[1][0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{session.client}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <span>🕐</span> {session.time}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <span>📍</span> {session.type === 'Virtual' ? 'Zoom' : 'Gym Floor A'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions scheduled for today</p>
                )}
              </div>
            </div>
          </div>
    </TrainerLayout>
  )
}
  
export default TrainerSchedule
