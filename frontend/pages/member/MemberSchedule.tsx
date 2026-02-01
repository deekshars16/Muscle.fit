import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Calendar, Clock, Plus, X, Edit2, CheckCircle, AlertCircle } from 'lucide-react'

interface WorkoutSchedule {
  id: number
  name: string
  time: string
  duration: string
  status: 'Pending' | 'Completed'
}

interface ScheduleData {
  [key: string]: WorkoutSchedule[]
}

const MemberSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 1))
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    '2026-02-01': [
      { id: 1, name: 'Full Body Workout', time: '7:00 AM', duration: '45 min', status: 'Pending' },
      { id: 2, name: 'Core Strength', time: '6:00 PM', duration: '30 min', status: 'Completed' },
    ],
    '2026-02-02': [
      { id: 3, name: 'Upper Body Power', time: '8:00 AM', duration: '40 min', status: 'Pending' },
    ],
    '2026-02-05': [
      { id: 4, name: 'Full Body Workout', time: '7:00 AM', duration: '45 min', status: 'Pending' },
      { id: 5, name: 'Cardio Session', time: '5:30 PM', duration: '30 min', status: 'Pending' },
    ],
    '2026-02-08': [
      { id: 6, name: 'Core Strength', time: '6:00 AM', duration: '30 min', status: 'Completed' },
    ],
    '2026-02-10': [
      { id: 7, name: 'Upper Body Power', time: '9:00 AM', duration: '40 min', status: 'Pending' },
    ],
    '2026-02-15': [
      { id: 8, name: 'Full Body Workout', time: '7:00 AM', duration: '45 min', status: 'Completed' },
      { id: 9, name: 'Core Strength', time: '6:00 PM', duration: '30 min', status: 'Pending' },
    ],
  })

  const [formData, setFormData] = useState({
    workoutType: 'Full Body Workout',
    time: '7:00 AM',
    duration: '45 min',
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getWorkoutsForDate = (date: Date) => {
    const key = formatDateKey(date)
    return scheduleData[key] || []
  }

  const handleAddWorkout = () => {
    if (!selectedDate) return

    const nextId = Math.max(...Object.values(scheduleData).flat().map(w => w.id), 0) + 1
    const dateKey = formatDateKey(selectedDate)

    const newWorkout: WorkoutSchedule = {
      id: nextId,
      name: formData.workoutType,
      time: formData.time,
      duration: formData.duration,
      status: 'Pending',
    }

    setScheduleData(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newWorkout],
    }))

    setShowAddModal(false)
    setFormData({
      workoutType: 'Full Body Workout',
      time: '7:00 AM',
      duration: '45 min',
    })
  }

  const handleDeleteWorkout = (workoutId: number, date: Date) => {
    const dateKey = formatDateKey(date)
    setScheduleData(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(w => w.id !== workoutId),
    }))
  }

  const handleToggleStatus = (workoutId: number, date: Date) => {
    const dateKey = formatDateKey(date)
    setScheduleData(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(w =>
        w.id === workoutId
          ? { ...w, status: w.status === 'Pending' ? 'Completed' : 'Pending' }
          : w
      ),
    }))
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isSelected = selectedDate && formatDateKey(selectedDate) === formatDateKey(dayDate)
      const hasWorkouts = getWorkoutsForDate(dayDate).length > 0

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dayDate)}
          className={`relative h-12 rounded-lg font-semibold text-sm transition-all ${
            isSelected
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {day}
          {hasWorkouts && (
            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
              isSelected ? 'bg-white' : 'bg-purple-600'
            }`}></div>
          )}
        </button>
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const currentWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : []

  return (
    <MemberLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workout Schedule</h1>
        <p className="text-gray-600 dark:text-gray-400">Plan and track your workouts for the month.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
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

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Schedule Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedDate ? formatDisplayDate(selectedDate) : 'Select a date'}
                </h2>
              </div>
              {selectedDate && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Workout
                </button>
              )}
            </div>

            {/* Workouts List */}
            {selectedDate ? (
              <>
                {currentWorkouts.length > 0 ? (
                  <div className="space-y-4">
                    {currentWorkouts.map(workout => (
                      <div
                        key={workout.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                              {workout.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {workout.time}
                              </span>
                              <span>{workout.duration}</span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            workout.status === 'Completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {workout.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                            {workout.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                            {workout.status}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {workout.status === 'Pending' && (
                            <button
                              onClick={() => handleToggleStatus(workout.id, selectedDate)}
                              className="flex-1 text-sm py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-all"
                            >
                              Mark Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteWorkout(workout.id, selectedDate)}
                            className="flex-1 text-sm py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No workouts scheduled for this day</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Workout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">Select a date to view or add workouts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Workout</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Workout Type
                </label>
                <select
                  value={formData.workoutType}
                  onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option>Full Body Workout</option>
                  <option>Core Strength</option>
                  <option>Upper Body Power</option>
                  <option>Cardio Session</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g., 7:00 AM"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option>30 min</option>
                  <option>40 min</option>
                  <option>45 min</option>
                  <option>60 min</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWorkout}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Add Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  )
}

export default MemberSchedule
