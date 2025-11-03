import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, User, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const AuthButton: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogin = () => {
    // Login is handled by AuthModal using context
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  if (!isAuthenticated) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAuthModal(true)}
          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <User className="w-4 h-4" />
          <span>Masuk</span>
        </motion.button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLogin}
        />
      </>
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user?.employeeId}
          </div>
        </div>
      </motion.button>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50"
        >
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  ID: {user?.employeeId}
                </div>
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400">Role:</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {user?.role}
              </span>
            </div>
            {user?.department && (
              <div className="flex items-center space-x-2 text-sm mt-1">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-400">Dept:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.department}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-2">
            <motion.button
              whileHover={{ backgroundColor: 'rgb(239 68 68)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 text-red-600 hover:text-white hover:bg-red-500 rounded-lg py-2 px-3 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Click outside to close */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  )
}

export default AuthButton