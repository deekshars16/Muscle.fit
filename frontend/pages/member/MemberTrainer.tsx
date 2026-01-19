import React from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, MessageCircle, Phone, Mail, Award, Users2, Zap } from 'lucide-react'

const MemberTrainer: React.FC = () => {
  const specializations = [
    'Strength Training',
    'Weight Loss',
    'Muscle Building',
    'HIIT',
    'Functional Fitness',
    'Nutrition Planning',
  ]

  return (
    <MemberLayout>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Trainer</h1>
            <p className="text-gray-600 dark:text-gray-400">Connect with your assigned fitness trainer.</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Trainer Profile */}
            <div className="col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                    <img 
                      src="https://via.placeholder.com/128"
                      alt="Jason Brooks"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Trainer Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Jason Brooks</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Strength & Conditioning</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold text-gray-900 dark:text-white">4.9</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">(127 reviews)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                    <Phone className="w-4 h-4" />
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Trainer Details */}
            <div className="col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">📚</span>
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">👥</span>
                    <Users2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">250+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Clients Trained</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">⏱️</span>
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5000+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Jason Brooks is a certified personal trainer with over 8 years of experience in strength and conditioning. He specializes in helping clients achieve their fitness goals through personalized workout plans and nutrition guidance. Jason holds certifications from ACE and NASM, and has worked with athletes from various sports backgrounds.
                </p>
              </div>

              {/* Specializations Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-3">
                  {specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">jason.brooks@musclesfit.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </MemberLayout>
  )
}

export default MemberTrainer
