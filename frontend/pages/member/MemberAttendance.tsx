import React, { useState, useMemo } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Calendar, TrendingUp, Flame, CheckCircle, XCircle, Clock, Plus, Trash2 } from 'lucide-react'

interface AttendanceRecord {
  date: string
  workoutType: string
  status: 'Present' | 'Absent' | 'Rest Day'
  time: string
  notes?: string
}

const MemberAttendance: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)) // February 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 1))
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: AttendanceRecord }>({
    '2026-02-01': { date: '2026-02-01', workoutType: 'Full Body', status: 'Present', time: '7:00 AM', notes: 'Good energy' },
    '2026-02-02': { date: '2026-02-02', workoutType: 'Core Strength', status: 'Present', time: '6:30 AM', notes: '' },
    '2026-02-03': { date: '2026-02-03', workoutType: 'Rest Day', status: 'Rest Day', time: '-', notes: '' },
    '2026-02-04': { date: '2026-02-04', workoutType: 'Upper Body', status: 'Present', time: '8:00 AM', notes: '' },
    '2026-02-05': { date: '2026-02-05', workoutType: 'Cardio', status: 'Present', time: '6:00 AM', notes: '' },
    '2026-02-06': { date: '2026-02-06', workoutType: 'Full Body', status: 'Absent', time: '-', notes: 'Skipped' },
    '2026-02-07': { date: '2026-02-07', workoutType: 'Core Strength', status: 'Present', time: '7:30 AM', notes: '' },
    '2026-02-08': { date: '2026-02-08', workoutType: 'Rest Day', status: 'Rest Day', time: '-', notes: '' },
    '2026-02-09': { date: '2026-02-09', workoutType: 'Upper Body', status: 'Present', time: '7:00 AM', notes: '' },
    '2026-02-10': { date: '2026-02-10', workoutType: 'Cardio', status: 'Present', time: '6:00 AM', notes: '' },
    '2026-02-11': { date: '2026-02-11', workoutType: 'Full Body', status: 'Present', time: '7:00 AM', notes: '' },
    '2026-02-12': { date: '2026-02-12', workoutType: 'Core Strength', status: 'Present', time: '6:30 AM', notes: '' },
  })

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Calculate stats
  const stats = useMemo(() => {
    const thisMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
    const thisMonthRecords = Object.entries(attendanceData).filter(([key]) => key.startsWith(thisMonthKey))
    
    const daysAttended = thisMonthRecords.filter(([_, record]) => record.status === 'Present').length
    const totalScheduledDays = thisMonthRecords.filter(([_, record]) => record.status !== 'Rest Day').length
    const attendanceRate = totalScheduledDays > 0 ? Math.round((daysAttended / totalScheduledDays) * 100) : 0

    // Current streak (consecutive present days)
    let streak = 0
    const today = new Date()
    let currentDate = new Date(today)
    
    while (true) {
      const key = formatDateKey(currentDate)
      const record = attendanceData[key]
      if (record && record.status === 'Present') {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return { daysAttended, attendanceRate, streak }
  }, [attendanceData, currentMonth])

  // Get recent attendance (last 10 days)
  const recentAttendance = useMemo(() => {
    const today = new Date(2026, 1, 12) // Feb 12, 2026
    const recent: [string, AttendanceRecord][] = []
    const current = new Date(today)

    for (let i = 0; i < 10; i++) {
      const key = formatDateKey(current)
      if (attendanceData[key]) {
        recent.push([key, attendanceData[key]])
      }
      current.setDate(current.getDate() - 1)
    }

    return recent
  }, [attendanceData])

  const handleStatusChange = (status: 'Present' | 'Absent' | 'Rest Day') => {
    if (!selectedDate) return

    const key = formatDateKey(selectedDate)
    const workoutTypes = ['Full Body', 'Core Strength', 'Upper Body', 'Cardio']
    
    setAttendanceData(prev => ({
      ...prev,
      [key]: {
        date: key,
        workoutType: status === 'Rest Day' ? 'Rest Day' : prev[key]?.workoutType || workoutTypes[Math.floor(Math.random() * workoutTypes.length)],
        status,
        time: status === 'Present' ? (prev[key]?.time || '7:00 AM') : (status === 'Rest Day' ? '-' : '-'),
        notes: '',
      },
    }))
  }

  const getAttendanceForDate = (date: Date) => {
    const key = formatDateKey(date)
    return attendanceData[key]
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>)
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = selectedDate && formatDateKey(selectedDate) === formatDateKey(date)
      const attendance = getAttendanceForDate(date)

      let statusColor = 'gray'
      if (attendance) {
        if (attendance.status === 'Present') statusColor = 'green'
        else if (attendance.status === 'Absent') statusColor = 'red'
        else statusColor = 'gray'
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`relative h-12 rounded-lg font-semibold text-sm transition-all ${
            isSelected
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {day}
          {attendance && (
            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
              isSelected ? 'bg-white' : 
              statusColor === 'green' ? 'bg-green-500' :
              statusColor === 'red' ? 'bg-red-500' :
              'bg-gray-400'
            }`}></div>
          )}
        </button>
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDeleteAttendance = (date: Date) => {
    const key = formatDateKey(date)
    setAttendanceData(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const handleResetMonth = () => {
    if (window.confirm(`Reset all attendance records for ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}? This cannot be undone.`)) {
      const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
      setAttendanceData(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(key => {
          if (key.startsWith(monthKey)) {
            delete updated[key]
          }
        })
        return updated
      })
      setSelectedDate(null)
    }
  }

  const handleResetAll = () => {
    if (window.confirm('Reset all attendance records? This cannot be undone.')) {
      setAttendanceData({})
      setSelectedDate(null)
    }
  }

  const selectedDateAttendance = selectedDate ? getAttendanceForDate(selectedDate) : null
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <MemberLayout>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Attendance History</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your gym attendance and build your streak.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResetMonth}
            className="px-4 py-2 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-all font-medium"
          >
            Reset Month
          </button>
          <button
            onClick={handleResetAll}
            className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all font-medium"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Days Attended */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.daysAttended}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Days Attended</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rate</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.attendanceRate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
        </div>

        {/* Current Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.streak}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Days in a Row</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-gray-600 dark:text-gray-400">Rest Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Details Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              {selectedDate ? `Attendance for ${formatDisplayDate(selectedDate)}` : 'Select a date'}
            </h3>

            {!selectedDate ? (
              // No date selected
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">Select a date to view or mark attendance</p>
              </div>
            ) : selectedDateAttendance ? (
              // Date has attendance data
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Workout Type</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedDateAttendance.workoutType}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
                      selectedDateAttendance.status === 'Present'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : selectedDateAttendance.status === 'Absent'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    }`}>
                      {selectedDateAttendance.status === 'Present' && <CheckCircle className="w-4 h-4" />}
                      {selectedDateAttendance.status === 'Absent' && <XCircle className="w-4 h-4" />}
                      {selectedDateAttendance.status}
                    </span>
                  </div>
                </div>

                {selectedDateAttendance.status === 'Present' && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Time</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedDateAttendance.time}</p>
                  </div>
                )}

                {selectedDateAttendance.notes && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                    <p className="text-gray-700 dark:text-gray-300">{selectedDateAttendance.notes}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">Update Attendance</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange('Present')}
                      className={`py-3 px-3 rounded-lg font-semibold transition-all text-sm ${
                        selectedDateAttendance.status === 'Present'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mx-auto mb-1" />
                      Present
                    </button>
                    <button
                      onClick={() => handleStatusChange('Absent')}
                      className={`py-3 px-3 rounded-lg font-semibold transition-all text-sm ${
                        selectedDateAttendance.status === 'Absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                      }`}
                    >
                      <XCircle className="w-4 h-4 mx-auto mb-1" />
                      Absent
                    </button>
                    <button
                      onClick={() => handleStatusChange('Rest Day')}
                      className={`py-3 px-3 rounded-lg font-semibold transition-all text-sm ${
                        selectedDateAttendance.status === 'Rest Day'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      Rest Day
                    </button>
                  </div>
                  <button
                    onClick={() => selectedDate && handleDeleteAttendance(selectedDate)}
                    className="w-full mt-4 py-2 px-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/30 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Attendance
                  </button>
                </div>
              </div>
            ) : (
              // Date selected but no attendance data - show Mark Attendance card
              <div className="py-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Mark Attendance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">No attendance marked for this date</p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleStatusChange('Present')}
                      className="py-4 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex flex-col items-center justify-center"
                    >
                      <CheckCircle className="w-6 h-6 mb-2" />
                      <span className="text-sm">Mark Present</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange('Absent')}
                      className="py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex flex-col items-center justify-center"
                    >
                      <XCircle className="w-6 h-6 mb-2" />
                      <span className="text-sm">Mark Absent</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange('Rest Day')}
                      className="py-4 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex flex-col items-center justify-center"
                    >
                      <Clock className="w-6 h-6 mb-2" />
                      <span className="text-sm">Rest Day</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Attendance List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Attendance</h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentAttendance.length > 0 ? (
            recentAttendance.map(([key, record]) => (
              <button
                key={key}
                onClick={() => {
                  const [year, month, day] = key.split('-').map(Number)
                  setSelectedDate(new Date(year, month - 1, day))
                }}
                className={`w-full flex items-center justify-between p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left ${
                  record.status === 'Present'
                    ? 'bg-green-50 dark:bg-green-900/10'
                    : record.status === 'Absent'
                    ? 'bg-red-50 dark:bg-red-900/10'
                    : 'bg-gray-50 dark:bg-gray-700/20'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    record.status === 'Present'
                      ? 'bg-green-500'
                      : record.status === 'Absent'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
                  }`}>
                    {record.status === 'Present' && <CheckCircle className="w-6 h-6 text-white" />}
                    {record.status === 'Absent' && <XCircle className="w-6 h-6 text-white" />}
                    {record.status === 'Rest Day' && <Clock className="w-6 h-6 text-white" />}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.workoutType}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    record.status === 'Present'
                      ? 'text-green-600 dark:text-green-400'
                      : record.status === 'Absent'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {record.status}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{record.time}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No attendance records yet</p>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  )
}

export default MemberAttendance
