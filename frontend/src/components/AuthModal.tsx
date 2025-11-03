import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus, Building } from 'lucide-react'
import toast from 'react-hot-toast'
import EmployeeIdDisplay from './EmployeeIdDisplay'
import { useAuth } from '../contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: User) => void
}

interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: 'employee' | 'admin'
  department?: string
}

interface AuthFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  department: string
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEmployeeIdModal, setShowEmployeeIdModal] = useState(false)
  const [newEmployeeData, setNewEmployeeData] = useState<{id: string, name: string} | null>(null)
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  })

  const departments = [
    'IT & Technology',
    'Human Resources', 
    'Finance & Accounting',
    'Marketing & Sales',
    'Operations',
    'Customer Service',
    'Legal & Compliance',
    'Research & Development'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.name || !formData.email || !formData.password || !formData.department) {
        toast.error('Semua field harus diisi')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Password konfirmasi tidak sama')
        return false
      }
      if (formData.password.length < 6) {
        toast.error('Password minimal 6 karakter')
        return false
      }
    } else {
      if (!formData.email || !formData.password) {
        toast.error('Email dan Password harus diisi')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const endpoint = isSignUp ? '/auth/register' : '/auth/login'
      const payload = isSignUp ? {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department
      } : {
        email: formData.email,
        password: formData.password
      }

      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        // Set authentication state first
        login(data.user, data.token)
        onSuccess(data.user)
        
        if (isSignUp) {
          // Show Employee ID modal for new registration
          setNewEmployeeData({
            id: data.user.employeeId,
            name: data.user.name
          })
          setShowEmployeeIdModal(true)
          onClose() // Close auth modal first
        } else {
          toast.success('Login berhasil! Selamat datang kembali!')
          onClose()
        }
      } else {
        toast.error(data.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: ''
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {isSignUp ? (
                <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              ) : (
                <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isSignUp ? 'Buat Akun Baru' : 'Masuk ke JJC'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isSignUp 
                ? 'Daftar untuk menggunakan sistem absensi' 
                : 'Masuk untuk melanjutkan ke dashboard'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@jjc.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            {/* Name (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}

            {/* Department (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none"
                    required={isSignUp}
                  >
                    <option value="">Pilih Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    required={isSignUp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  <span>{isSignUp ? 'Daftar Sekarang' : 'Masuk'}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button
                onClick={handleModeSwitch}
                className="ml-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                {isSignUp ? 'Masuk di sini' : 'Daftar di sini'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Employee ID Display Modal */}
      {newEmployeeData && (
        <EmployeeIdDisplay
          isOpen={showEmployeeIdModal}
          onClose={() => {
            setShowEmployeeIdModal(false)
            setNewEmployeeData(null)
          }}
          employeeId={newEmployeeData.id}
          employeeName={newEmployeeData.name}
        />
      )}
    </AnimatePresence>
  )
}

export default AuthModal