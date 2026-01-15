import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-0 md:px-2 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-8/12 md:pl-2">
          <p className="text-lg text-purple-500 dark:text-purple-400 font-medium">WELCOME TO</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight dark:text-white">Train smarter. Build strength. Become unstoppable. This is not a gym — it's a lifestyle.</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Join our programs and reach your fitness goals with tailored plans.</p>
          {/* Contact button intentionally removed per request */}
        </div>

        <div className="md:w-4/12 flex justify-end rounded-lg p-4 transition-colors duration-300 bg-white dark:bg-black">
          {/* The hero image: prefers /public/assets/hero.jpg but will use any uploaded asset (e.g., image.png) */}
          <img
            src="/assets/image.png"
            alt="Hero"
            className="w-full max-w-[420px] md:max-w-[640px] object-contain object-right rounded-lg shadow-sm"
            onError={(e) => {
              // fallback to svg placeholder if the uploaded image isn't found
              (e.currentTarget as HTMLImageElement).src = '/assets/hero.svg'
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
