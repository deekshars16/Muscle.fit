import React from 'react'

const ProgramsPage: React.FC = () => {
  return (
    <section className="py-16" id="programs">
      <div className="max-w-7xl mx-auto px-0 md:px-2">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">Our Training Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cardio</h3>
            <p className="text-sm text-gray-600">Improve heart health and burn calories with high-energy cardio workouts.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Muscle</h3>
            <p className="text-sm text-gray-600">Gain strength and build lean muscle through structured training programs.</p>



          </div>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1v2.5" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Yoga</h3>
            <p className="text-sm text-gray-600">Enhance flexibility, balance, and mental focus with guided yoga sessions.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProgramsPage
