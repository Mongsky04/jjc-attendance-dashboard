import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useDarkMode } from './hooks/useDarkMode'
import Dashboard from './pages/Dashboard'
import Summary from './pages/Summary'
import Layout from './components/Layout'

function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode()

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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f9fafb' : '#111827',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
              },
            }}
          />
        </motion.div>
      </Router>
    </div>
  )
}

export default App