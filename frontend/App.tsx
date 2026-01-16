import React from 'react'
import Header from './components/layout/Header'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ActivityProvider } from './context/ActivityContext'
import { AppContextProvider } from './context/AppContext'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContextProvider>
          <ActivityProvider>
            <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
              <Header />
              <main>
                <AppRoutes />
              </main>
            </div>
          </ActivityProvider>
        </AppContextProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
