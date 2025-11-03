import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { User } from 'lucide-react'
import { useDarkMode } from './hooks/useDarkMode'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Summary from './pages/Summary'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'

const AppContent: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Router>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        >
          <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
            {isAuthenticated ? (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/summary" element={<Summary />} />
              </Routes>
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
                >
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Selamat Datang di JJC
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Silakan login atau daftar untuk menggunakan sistem absensi.
                  </p>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Gunakan tombol "Masuk" di pojok kanan atas untuk memulai.
                  </div>
                </motion.div>
              </div>
            )}
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
                borderRadius: '8px',
                border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
              },
            }}
          />
        </motion.div>
      </Router>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App