import React from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, CheckCircle, XCircle, Flame } from 'lucide-react'

const MemberAttendance: React.FC = () => {
  const attendanceRecords = [
    {
      date: 'Jan 17, 2026',
      workout: 'Full Body',
      status: 'Present',
      time: '10:00 AM',
      statusColor: 'green',
    },
    {
      date: 'Jan 16, 2026',
      workout: 'Core Training',
      status: 'Present',
      time: '9:30 AM',
      statusColor: 'green',
    },
    {
      date: 'Jan 15, 2026',
      workout: 'Upper Body',
      status: 'Present',
      time: '11:00 AM',
      statusColor: 'green',
    },
    {
      date: 'Jan 14, 2026',
      workout: 'Rest Day',
      status: 'Absent',
      time: '-',
      statusColor: 'red',
    },
    {
      date: 'Jan 13, 2026',
      workout: 'HIIT',
      status: 'Present',
      time: '10:30 AM',
      statusColor: 'green',
    },
    {
      date: 'Jan 12, 2026',
      workout: 'Full Body',
      status: 'Present',
      time: '9:00 AM',
      statusColor: 'green',
    },
    {
      date: 'Jan 11, 2026',
      workout: 'Cardio',
      status: 'Present',
      time: '10:00 AM',
      statusColor: 'green',
    },
    {
      date: 'Jan 10, 2026',
      workout: 'Missed',
      status: 'Absent',
      time: '-',
      statusColor: 'red',
    },
  ]

  return (
    <MemberLayout>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Attendance History</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your gym attendance and consistency.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Days Attended Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">6</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Days Attended</p>
            </div>

            {/* Attendance Rate Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rate</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">75%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
            </div>

            {/* Current Streak Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">3</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Streak <Flame className="w-4 h-4 inline text-orange-500 ml-1" />
              </p>
            </div>
          </div>

          {/* Recent Attendance Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Attendance</h2>
            </div>

            {/* Attendance Records */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {attendanceRecords.map((record, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-6 transition-all ${
                    record.statusColor === 'green'
                      ? 'bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20'
                      : 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      record.statusColor === 'green'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}>
                      {record.statusColor === 'green' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Record Info */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{record.workout}</p>
                    </div>
                  </div>

                  {/* Status and Time */}
                  <div className="text-right">
                    <p className={`font-semibold ${
                      record.statusColor === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {record.status}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </MemberLayout>
  )
}

export default MemberAttendance
