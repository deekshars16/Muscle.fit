import React from 'react'
import { useLocation } from 'react-router-dom'

const Register: React.FC = () => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const role = params.get('role') || 'member'

  return (
    <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Register as {role}</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Registration placeholder for {role}</p>
      </div>
    </section>
  )
}

export default Register
