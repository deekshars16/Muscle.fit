import React from 'react'
import Hero from './Hero'
import CardStrip from './CardStrip'
import Contact from './Contact'

const Landing: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <Hero />
      <CardStrip />

      {/* Training Programs Section */}
      <section className="py-20 bg-white dark:bg-black transition-colors duration-300" id="programs">
        <div className="max-w-7xl mx-auto px-0 md:px-2">
          {/* Spacing before heading */}
          <div className="mb-12"></div>
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900 dark:text-white">Our Training Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Cardio</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contrary to popular belief, Lorem ipsum is not simply random text. It has a place of classical Lorem Ipsumare form</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Muscle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contrary to popular belief, Lorem ipsum is not simply random text. It has a place of classical Lorem Ipsumare form</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1v2.5" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Yoga</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contrary to popular belief, Lorem ipsum is not simply random text. It has a place of classical Lorem Ipsumare form</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  )
}

export default Landing
