import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import AuthModal from './AuthModal'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full mx-auto animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Memuat...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Akses Terbatas
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Anda perlu login terlebih dahulu untuk mengakses halaman ini.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Login Sekarang</span>
            </motion.button>
          </motion.div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute