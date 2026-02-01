import React, { useState, useEffect } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Clock, Check, Play, Pause, RotateCcw, X, ChevronDown } from 'lucide-react'

interface Exercise {
  id: number
  name: string
  duration: string
  reps: string
  description: string
}

interface WorkoutPlan {
  id: string
  name: string
  difficulty: string
  difficultyColor: string
  exercises: Exercise[]
}

const MemberWorkouts: React.FC = () => {
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [workoutCompletedIds, setWorkoutCompletedIds] = useState<Set<string>>(new Set())
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completedWorkoutName, setCompletedWorkoutName] = useState('')

  // Get current workout to access exercises
  const getCurrentWorkout = (workoutId: string | null) => {
    if (!workoutId) return null
    return workoutPlans.find(w => w.id === workoutId)
  }

  // Countdown timer effect
  useEffect(() => {
    if (!activeWorkoutId || isPaused) return

    const currentWorkout = getCurrentWorkout(activeWorkoutId)
    if (!currentWorkout) return

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1

        // If time runs out, advance to next exercise
        if (newTime <= 0) {
          setCurrentExerciseIndex(currentIndex => {
            const nextIndex = currentIndex + 1
            
            // Check if we've completed all exercises
            if (nextIndex >= currentWorkout.exercises.length) {
              // Workout complete!
              setRemainingTime(0)
              setWorkoutCompletedIds(prev => new Set([...prev, activeWorkoutId]))
              setCompletedWorkoutName(currentWorkout.name)
              setShowCompletionModal(true)
              setActiveWorkoutId(null)
              setTimeout(() => setShowCompletionModal(false), 2500)
              return nextIndex
            }

            // Move to next exercise
            const nextExercise = currentWorkout.exercises[nextIndex]
            const durationInSeconds = parseInt(nextExercise.duration)
            setRemainingTime(durationInSeconds)
            return nextIndex
          })
          return 0
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeWorkoutId, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const workoutPlans: WorkoutPlan[] = [
    {
      id: 'full-body',
      name: 'Full Body Workout',
      difficulty: 'Intermediate',
      difficultyColor: 'orange',
      exercises: [
        { id: 1, name: 'Squats', duration: '45 sec', reps: '12 reps', description: 'Stand with feet shoulder-width apart, lower your body by bending knees and hips.' },
        { id: 2, name: 'Push-ups', duration: '40 sec', reps: '10 reps', description: 'Keep your body straight and lower yourself until chest nearly touches the floor.' },
        { id: 3, name: 'Lunges', duration: '45 sec', reps: '10 each leg', description: 'Step forward and lower your hips until both knees are at 90-degree angles.' },
        { id: 4, name: 'Burpees', duration: '30 sec', reps: '15 reps', description: 'Start in standing position, drop to plank, do push-up, jump back to stand and jump up.' },
        { id: 5, name: 'Deadlifts', duration: '40 sec', reps: '8 reps', description: 'Lift weight from ground by extending hips and knees, keeping back straight.' },
        { id: 6, name: 'Plank', duration: '60 sec', reps: 'hold', description: 'Hold a straight line from head to heels, engaging your core muscles.' },
        { id: 7, name: 'Jumping Jacks', duration: '45 sec', reps: '20 reps', description: 'Jump while spreading your legs and raising arms overhead, then return to standing.' },
        { id: 8, name: 'Mountain Climbers', duration: '40 sec', reps: '20 reps', description: 'In plank position, alternate bringing knees toward chest in a running motion.' },
      ],
    },
    {
      id: 'core',
      name: 'Core Strength',
      difficulty: 'Beginner',
      difficultyColor: 'green',
      exercises: [
        { id: 1, name: 'Plank', duration: '60 sec', reps: 'hold', description: 'Hold a straight line from head to heels, engaging your core muscles.' },
        { id: 2, name: 'Bicycle Crunches', duration: '45 sec', reps: '20 reps', description: 'Lie on back, bring opposite elbow to knee in a pedaling motion.' },
        { id: 3, name: 'Leg Raises', duration: '45 sec', reps: '12 reps', description: 'Lie on back, raise straight legs to 90 degrees, lower without touching floor.' },
        { id: 4, name: 'Russian Twists', duration: '45 sec', reps: '20 reps', description: 'Sit with knees bent, lean back slightly, twist torso side to side with arms crossed.' },
        { id: 5, name: 'Flutter Kicks', duration: '45 sec', reps: '30 kicks', description: 'Lie on back with legs straight, alternate kicking legs up and down.' },
        { id: 6, name: 'Hollow Hold', duration: '60 sec', reps: 'hold', description: 'Engage abs and glutes to create hollow body position, hold tension throughout.' },
      ],
    },
    {
      id: 'upper',
      name: 'Upper Body Power',
      difficulty: 'Advanced',
      difficultyColor: 'red',
      exercises: [
        { id: 1, name: 'Push-ups', duration: '45 sec', reps: '15 reps', description: 'Keep your body straight and lower yourself until chest nearly touches the floor.' },
        { id: 2, name: 'Pull-ups', duration: '45 sec', reps: '8 reps', description: 'Hang from bar with overhand grip, pull body up until chin clears bar.' },
        { id: 3, name: 'Shoulder Press', duration: '45 sec', reps: '12 reps', description: 'Hold dumbbells at shoulder height, press them overhead until arms are fully extended.' },
        { id: 4, name: 'Bench Press', duration: '45 sec', reps: '10 reps', description: 'Lie on bench, lower barbell to chest, press back up to starting position.' },
        { id: 5, name: 'Bicep Curls', duration: '40 sec', reps: '12 reps', description: 'Hold dumbbells at sides, curl them up to shoulder height keeping elbows fixed.' },
        { id: 6, name: 'Tricep Dips', duration: '40 sec', reps: '10 reps', description: 'Using bench or bars, lower body by bending elbows, press back up to starting position.' },
        { id: 7, name: 'Lateral Raises', duration: '40 sec', reps: '15 reps', description: 'Hold dumbbells at sides, raise arms out to sides until shoulder height.' },
      ],
    },
  ]

  const calculateTotalDuration = (exercises: Exercise[]) => {
    return exercises.reduce((total, ex) => total + parseInt(ex.duration), 0)
  }

  const handleStartWorkout = (workoutId: string) => {
    const workout = getCurrentWorkout(workoutId)
    if (!workout) return

    const firstExerciseDuration = parseInt(workout.exercises[0].duration)
    setActiveWorkoutId(workoutId)
    setCurrentExerciseIndex(0)
    setRemainingTime(firstExerciseDuration)
    setIsPaused(false)
  }

  const handlePauseToggle = () => {
    setIsPaused(prev => !prev)
  }

  const handleRestartWorkout = () => {
    if (!activeWorkoutId) return
    const workout = getCurrentWorkout(activeWorkoutId)
    if (!workout) return

    const firstExerciseDuration = parseInt(workout.exercises[0].duration)
    setCurrentExerciseIndex(0)
    setRemainingTime(firstExerciseDuration)
    setIsPaused(false)
  }

  const handleCompleteWorkout = () => {
    if (!activeWorkoutId) return
    const workout = getCurrentWorkout(activeWorkoutId)
    if (!workout) return

    setWorkoutCompletedIds(prev => new Set([...prev, activeWorkoutId]))
    setCompletedWorkoutName(workout.name)
    setShowCompletionModal(true)
    setActiveWorkoutId(null)
    setTimeout(() => setShowCompletionModal(false), 2500)
  }

  const handleCloseWorkout = () => {
    setActiveWorkoutId(null)
    setCurrentExerciseIndex(0)
    setRemainingTime(0)
    setIsPaused(false)
  }

  const currentWorkout = getCurrentWorkout(activeWorkoutId)
  const currentExercise = currentWorkout ? currentWorkout.exercises[currentExerciseIndex] : null
  const isWorkoutCompleted = activeWorkoutId ? workoutCompletedIds.has(activeWorkoutId) : false

  return (
    <MemberLayout>
      {/* Focused Workout View */}
      {activeWorkoutId && currentWorkout && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentWorkout.name}</h2>
              <button
                onClick={handleCloseWorkout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Current Exercise Display */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl p-8 mb-6">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{currentExercise?.name}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{currentExercise?.description}</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{currentExercise?.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reps/Sets</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{currentExercise?.reps}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-8 mb-6 text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-semibold">Time Remaining</p>
              <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {formatTime(remainingTime)}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}</p>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              {!isPaused ? (
                <>
                  <button
                    onClick={handlePauseToggle}
                    className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause Workout
                  </button>
                  <button
                    onClick={handleCompleteWorkout}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Complete Workout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePauseToggle}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Resume Workout
                  </button>
                  <button
                    onClick={handleRestartWorkout}
                    className="w-full py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Restart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workouts</h1>
        <p className="text-gray-600 dark:text-gray-400">Get fit with our curated workout plans</p>
      </div>

      {/* Compact Workout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutPlans.map((plan) => {
          const isCompleted = workoutCompletedIds.has(plan.id)
          const totalDuration = calculateTotalDuration(plan.exercises)

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border-2 transition-all shadow-sm hover:shadow-lg ${
                isCompleted
                  ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-500 dark:border-green-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {totalDuration} min • {plan.exercises.length} exercises
                  </p>
                </div>
                {isCompleted && <Check className="w-6 h-6 text-green-600 flex-shrink-0" />}
              </div>

              <div className="mb-6">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  plan.difficultyColor === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  plan.difficultyColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {plan.difficulty}
                </span>
              </div>

              <button
                onClick={() => handleStartWorkout(plan.id)}
                disabled={isCompleted}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isCompleted
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Play className="w-4 h-4" />
                {isCompleted ? 'Completed' : 'Start Workout'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Awesome!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You completed <span className="font-semibold text-green-600 dark:text-green-400">{completedWorkoutName}</span>
            </p>
          </div>
        </div>
      )}
    </MemberLayout>
  )
}

export default MemberWorkouts
