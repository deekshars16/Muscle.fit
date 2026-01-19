import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, Play, ChevronRight, Flame, Zap } from 'lucide-react'

const MemberWorkouts: React.FC = () => {
  const [activeWorkout] = useState('full-body')

  const workoutPlans = [
    {
      id: 'full-body',
      name: 'Full Body Workout',
      duration: 45,
      calories: 350,
      exercises: 8,
      difficulty: 'Intermediate',
      difficultyColor: 'orange',
      isActive: true,
    },
    {
      id: 'core',
      name: 'Core Strength',
      duration: 30,
      calories: 200,
      exercises: 6,
      difficulty: 'Beginner',
      difficultyColor: 'green',
      isActive: false,
    },
    {
      id: 'upper',
      name: 'Upper Body Power',
      duration: 40,
      calories: 300,
      exercises: 7,
      difficulty: 'Advanced',
      difficultyColor: 'red',
      isActive: false,
    },
  ]

  const todayExercises = [
    {
      id: 1,
      name: 'Squats',
      sets: 3,
      reps: '10 Reps',
      icon: '💪',
      color: 'green',
    },
    {
      id: 2,
      name: 'Push-ups',
      sets: 3,
      reps: '15 Reps',
      icon: '💪',
      color: 'green',
    },
    {
      id: 3,
      name: 'Plank',
      sets: 3,
      reps: '1 Min Hold',
      icon: '🏋️',
      color: 'purple',
    },
    {
      id: 4,
      name: 'Lunges',
      sets: 3,
      reps: '12 Reps',
      icon: '🏋️',
      color: 'purple',
    },
    {
      id: 5,
      name: 'Deadlifts',
      sets: 3,
      reps: '8 Reps',
      icon: '🏋️',
      color: 'purple',
    },
    {
      id: 6,
      name: 'Burpees',
      sets: 3,
      reps: '10 Reps',
      icon: '🏋️',
      color: 'purple',
    },
  ]

  return (
    <MemberLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workout Plans</h1>
        <p className="text-gray-600 dark:text-gray-400">View and track your assigned workout routines.</p>
      </div>

          {/* Workout Plans Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {workoutPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                  plan.isActive
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-600 shadow-lg'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
                }`}
              >
                {plan.isActive && (
                  <div className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Active Plan
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{plan.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{plan.duration} min</span>
                    <span className="text-gray-400">•</span>
                    <Flame className="w-4 h-4" />
                    <span className="text-sm">{plan.calories} cal</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.exercises} exercises</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-300/50 dark:border-gray-600/50">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    plan.difficultyColor === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    plan.difficultyColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {plan.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Exercises Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Exercises</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Body Workout · 6 exercises</p>
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                <Play className="w-4 h-4" />
                Start Workout
              </button>
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              {todayExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    exercise.color === 'green'
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                      : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      exercise.color === 'green'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}>
                      <span className="text-xl">{exercise.icon}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{exercise.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets} Sets · {exercise.reps}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                </div>
              ))}
            </div>
          </div>
    </MemberLayout>
  )
}

export default MemberWorkouts
