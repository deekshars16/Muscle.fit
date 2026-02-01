import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { MessageCircle, X, AlertCircle } from 'lucide-react'

const MemberDashboard: React.FC = () => {
  // Mock data
  const mockSchedule = [
    { id: 1, name: 'Full Body', time: '9:30 AM', color: 'purple' },
    { id: 2, name: 'Core Training', time: '11:30 AM', color: 'gray' },
    { id: 3, name: 'Cardio', time: '2:00 PM', color: 'gray' }
  ]

  const mockAttendance = [
    { id: 1, date: 'Jan 17', attended: true },
    { id: 2, date: 'Jan 16', attended: true },
    { id: 3, date: 'Jan 15', attended: true }
  ]

  const trainerData = {
    first_name: 'Jason',
    last_name: 'Brooks',
    specialization: 'Strength & Conditioning',
    rating: 4.9,
    reviews: 127
  }

  const fullName = 'David Kim'

  // State management
  const [currentWeight, setCurrentWeight] = useState(162)
  const [targetWeight, setTargetWeight] = useState(155)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState('')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; timestamp: string }[]>([])
  const [attendance, setAttendance] = useState(mockAttendance)

  // Calculate progress percentage
  const totalProgress = 100 - Math.max(0, ((currentWeight - targetWeight) / (162 - targetWeight)) * 100)
  const weightLost = 162 - currentWeight
  const attendedCount = attendance.filter(a => a.attended).length

  // Handle message send
  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessageText('')

      // Simulate trainer response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          sender: 'Jason',
          text: 'Thanks for reaching out! I\'ll get back to you soon.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, response])
      }, 1000)
    }
  }

  // Toggle attendance
  const handleToggleAttendance = (id: number) => {
    setAttendance(attendance.map(item =>
      item.id === id ? { ...item, attended: !item.attended } : item
    ))
  }

  // Handle sidebar navigation
  const handleNavigation = (section: string) => {
    setCurrentPlaceholder(section)
    setShowPlaceholder(true)
  }

  // Render weight progress section
  const renderWeightProgress = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weight Progress</h2>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            {weightLost > 0 ? `-${weightLost} lbs` : `+${Math.abs(weightLost)} lbs`}
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-blue-600 font-semibold w-10">✓</span>
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.max(0, Math.min(100, totalProgress))}%`}}></div>
              </div>
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">{targetWeight} lbs</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{currentWeight} lbs</span>
            <span>Current</span>
            <span>Target</span>
          </div>
          <div className="pt-4 space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Weight: <span className="font-bold text-purple-600">{currentWeight} lbs</span></label>
              <input
                type="range"
                min="140"
                max="180"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Target Weight: <span className="font-bold text-purple-600">{targetWeight} lbs</span></label>
              <input
                type="range"
                min="140"
                max="180"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render payment modal
  const renderPaymentModal = () => {
    if (!showPaymentModal) return null
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Make Payment</h3>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-purple-700 dark:text-purple-300 font-semibold">Monthly Plan</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Expires: Feb 17, 2026</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-3">$49.99</p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Payment feature is coming soon! This will allow you to manage your subscription and billing.
          </p>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // Render message modal
  const renderMessageModal = () => {
    if (!showMessageModal) return null
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-lg max-h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Jason</h3>
            <button
              onClick={() => setShowMessageModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3 max-h-48">
            {messages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                Start a conversation with your trainer
              </p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'You'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'You' ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render placeholder modal
  const renderPlaceholderModal = () => {
    if (!showPlaceholder) return null
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentPlaceholder}</h3>
            </div>
            <button
              onClick={() => setShowPlaceholder(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This section is under development. Check back soon!
          </p>
          <button
            onClick={() => setShowPlaceholder(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {fullName}! 💪</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Track your fitness journey and stay motivated.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Current Weight */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Current Weight</p>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">⊙</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentWeight} lbs</p>
        </div>

        {/* Calories Burned */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Calories Burned</p>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-lg">🔥</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">870 cal</p>
        </div>

        {/* Workout Today */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Workout Today</p>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">⏱</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1 hour</p>
        </div>

        {/* Workouts This Week */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Workouts This Week</p>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">🔗</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Weight Progress */}
          {renderWeightProgress()}

          {/* Membership Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Membership Plan</h2>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">Monthly Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expires: Feb 17, 2026</p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition"
            >
              Make Payment
            </button>
          </div>

          {/* Assigned Trainer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Assigned Trainer</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                JB
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{trainerData.first_name} {trainerData.last_name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{trainerData.specialization}</p>
                <p className="text-sm text-yellow-500">⭐ {trainerData.rating} ({trainerData.reviews} reviews)</p>
              </div>
            </div>
            <button
              onClick={() => setShowMessageModal(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold py-2.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Message Jason
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-lg">🕐</span> Today's Schedule
            </h2>
            <div className="space-y-4">
              {mockSchedule.map((session) => (
                <div
                  key={session.id}
                  className={`border-l-4 ${session.color === 'purple' ? 'border-purple-500' : 'border-gray-300'} pl-4 py-2`}
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{session.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-lg">✓</span> {attendedCount} Attended
            </h2>
            <div className="space-y-2 text-sm">
              {attendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer transition"
                  onClick={() => handleToggleAttendance(record.id)}
                >
                  <span className="text-gray-600 dark:text-gray-400">{record.date}</span>
                  <span className={`${record.attended ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {record.attended ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderPaymentModal()}
      {renderMessageModal()}
      {renderPlaceholderModal()}
    </MemberLayout>
  )
}

export default MemberDashboard
