import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Plus, Filter, MoreVertical } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'

const TrainerPrograms: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const programs = [
    {
      id: 1,
      name: 'Weight Loss Pro',
      description: '12 week intensive fat burning program with cardio and strength training',
      icon: '🔥',
      status: 'active',
      enrollments: 45,
      duration: '12 weeks',
      difficulty: 'Intermediate',
      progress: 78,
    },
    {
      id: 2,
      name: 'Muscle Building',
      description: 'Progressive strength training for muscle hypertrophy',
      icon: '💪',
      status: 'active',
      enrollments: 32,
      duration: '16 weeks',
      difficulty: 'Advanced',
      progress: 65,
    },
    {
      id: 3,
      name: 'Flexibility & Mobility',
      description: 'Improve range of motion and reduce injury risk',
      icon: '❤️',
      status: 'active',
      enrollments: 28,
      duration: '8 weeks',
      difficulty: 'Beginner',
      progress: 92,
    },
    {
      id: 4,
      name: 'Marathon Prep',
      description: 'Endurance training for long-distance running',
      icon: '🎯',
      status: 'active',
      enrollments: 18,
      duration: '20 weeks',
      difficulty: 'Advanced',
      progress: 45,
    },
    {
      id: 5,
      name: 'Strength Foundations',
      description: 'Learn proper form and build a solid strength base',
      icon: '💪',
      status: 'active',
      enrollments: 52,
      duration: '8 weeks',
      difficulty: 'Beginner',
      progress: 88,
    },
    {
      id: 6,
      name: 'HIIT Extreme',
      description: 'High-intensity interval training for maximum calorie burn',
      icon: '🔥',
      status: 'draft',
      enrollments: 38,
      duration: '6 weeks',
      difficulty: 'Advanced',
      progress: 0,
    },
  ]

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { label: 'Total Programs', value: '6', color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Active Programs', value: '5', color: 'text-green-600 dark:text-green-400' },
    { label: 'Total Enrollments', value: '213', color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Avg. Completion', value: '74%', color: 'text-purple-600 dark:text-purple-400' },
  ]

  return (
    <TrainerLayout>
      <div className="p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programs</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Create and manage training programs</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Program
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{program.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{program.name}</h3>
                      <span className={`inline-block text-xs font-medium mt-1 px-2 py-1 rounded ${
                        program.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{program.description}</p>

                {/* Info Row */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{program.enrollments}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>⏱️</span>
                    <span>{program.duration}</span>
                  </div>
                </div>

                {/* Difficulty and Progress */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{program.difficulty}</p>
                  {program.status === 'active' && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Avg. Progress</span>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{program.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 dark:bg-purple-500" style={{ width: `${program.progress}%` }}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredPrograms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No programs found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
      </div>
    </TrainerLayout>
  )
}

export default TrainerPrograms
