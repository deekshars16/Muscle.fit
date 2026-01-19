import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, MessageCircle, Star } from 'lucide-react'

const MemberDashboard: React.FC = () => {
  const [userName] = useState('David Kim')
  const [userInitial] = useState('DK')

  const todaySchedule = [
    { name: 'Full Body', time: '9:30 AM' },
    { name: 'Core Training', time: '11:30 AM' },
    { name: 'Cardio', time: '2:00 PM' },
  ]

  const attendanceHistory = [
    { date: 'Jan 17', time: '10:00 AM', status: 'attended' },
    { date: 'Jan 16', time: '9:30 AM', status: 'attended' },
    { date: 'Jan 15', time: '11:00 AM', status: 'attended' },
    { date: 'Jan 14', time: '-', status: 'absent' },
  ]

  const workoutExercises = [
    { name: 'Squats', sets: 3, reps: '10 Reps' },
    { name: 'Push-ups', sets: 3, reps: '15 Reps' },
    { name: 'Plank', sets: 3, reps: '1 Min' },
    { name: 'Lunges', sets: 3, reps: '12 Reps' },
  ]

  return (
    <MemberLayout>
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, David! 💪</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Track your fitness journey and stay motivated.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Current Weight</p>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⭕</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">162 lbs</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Calories Burned</p>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">870 cal</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Workout Today</p>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">1 hour</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Workouts This Week</p>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
          </div>

          {/* Weight Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weight Progress</h2>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">-13 lbs</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">✓ 162 lbs</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Current</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">155 lbs</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Target</p>
              </div>
            </div>
          </div>

          {/* Left Section - Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Column (Left 2/3) */}
            <div className="col-span-2 space-y-6">
              {/* Membership Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Membership Plan</h2>
                </div>
                
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">Monthly Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  📅 Expires: Feb 17, 2026
                </p>

                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-md">
                  Make Payment
                </button>
              </div>

              {/* Assigned Trainer */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Assigned Trainer</h2>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    JB
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Jason Brooks</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Strength & Conditioning</p>
                    
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">4.9</span>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold py-2.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Message Jason
                </button>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
                </div>

                <div className="space-y-3">
                  {todaySchedule.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{session.name}</span>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{session.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workout Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workout Plan</h2>
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Full Body Workout</h3>

                <div className="grid grid-cols-2 gap-4">
                  {workoutExercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{exercise.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {exercise.sets} Sets · {exercise.reps}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Sidebar Info */}
            <div className="space-y-6">
              {/* Attendance History */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance History</h2>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">✓ 3 Attended</span>
                </div>

                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          record.status === 'attended' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          <span className={`text-sm font-bold ${
                            record.status === 'attended' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {record.status === 'attended' ? '✓' : '✕'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{record.date}</span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{record.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Progress Tracking</h2>
                
                <div className="mb-6">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Weight · This week</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">162</p>
                    <span className="text-sm text-gray-600 dark:text-gray-400">lbs</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 ml-auto">↓3 lbs</span>
                  </div>
                </div>

                {/* Simple Line Chart */}
                <svg viewBox="0 0 280 100" className="w-full h-32">
                  {/* Grid background */}
                  <rect width="280" height="100" fill="transparent" />
                  
                  {/* Chart line - weight progress curve */}
                  <polyline
                    points="20,30 50,35 80,40 110,38 140,45 170,50 210,48 250,55"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  
                  {/* Day labels */}
                  <text x="20" y="95" fontSize="10" fill="#999" textAnchor="middle">Tue</text>
                  <text x="80" y="95" fontSize="10" fill="#999" textAnchor="middle">Wed</text>
                  <text x="140" y="95" fontSize="10" fill="#999" textAnchor="middle">Thu</text>
                  <text x="200" y="95" fontSize="10" fill="#999" textAnchor="middle">Fri</text>
                  <text x="260" y="95" fontSize="10" fill="#999" textAnchor="middle">Sat</text>
                </svg>
                
                <div className="flex justify-around mt-4 text-xs text-gray-600 dark:text-gray-400">
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
            </div>
          </div>
    </MemberLayout>
  )
}

export default MemberDashboard
