import React from 'react'

const Contact: React.FC = () => {
  return (
    <section id="contact" className="bg-white dark:bg-black text-gray-900 dark:text-white py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-0 md:px-2">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">CONTACT US</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Let's Build Your Stronger Version</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Visit Our Gym */}
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <span className="text-2xl">📍</span> Visit Our Gym
              </h3>
              <div className="text-gray-700 dark:text-gray-300 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">MUSCLES.FIT</p>
                <p>1st Floor, M.G Road</p>
                <p>Bengaluru, Karnataka – 560001</p>
              </div>
            </div>

            {/* Call / WhatsApp */}
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <span className="text-2xl">📞</span> Call / WhatsApp
              </h3>
              <div className="text-gray-700 dark:text-gray-300 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">+91 90000 00001</p>
                <p className="text-sm">Available from 5:00 AM – 10:00 PM</p>
              </div>
            </div>

            {/* Email Us */}
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <span className="text-2xl">📧</span> Email Us
              </h3>
              <div className="text-gray-700 dark:text-gray-300 space-y-1">
                <p className="text-sm">support@muscle.fit</p>
                <p className="text-sm">info@muscle.fit</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Working Hours */}
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <span className="text-2xl">⏰</span> Working Hours
              </h3>
              <div className="text-gray-700 dark:text-gray-300 space-y-2">
                <p><span className="font-semibold">Monday – Saturday:</span> 5:00 AM – 10:00 PM</p>
                <p><span className="font-semibold">Sunday:</span> 6:00 AM – 12:00 PM</p>
              </div>
            </div>

            {/* Stay Connected */}
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <span className="text-2xl">🔗</span> Stay Connected
              </h3>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="space-x-2 mb-3">
                  <a href="#" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-400 font-semibold">Instagram</a>
                  <span>|</span>
                  <a href="#" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-400 font-semibold">Facebook</a>
                  <span>|</span>
                  <a href="#" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-400 font-semibold">YouTube</a>
                </p>
                <p className="text-purple-600 dark:text-purple-400 font-semibold">@muscle.fit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
