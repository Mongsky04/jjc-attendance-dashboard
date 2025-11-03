import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle, User, Camera } from 'lucide-react'
import { attendanceAPI, AttendanceRecord } from '../api/attendance'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import CameraCapture from './CameraCapture'

interface AttendanceCardProps {
  onAttendanceChange?: () => void
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ 
  onAttendanceChange 
}) => {
  const { user, isAuthenticated } = useAuth()
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState<File | null>(null)
  const [pendingAction, setPendingAction] = useState<'checkin' | 'checkout' | null>(null)

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
      >
        <div className="text-gray-500 dark:text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4" />
          <p>Silakan login terlebih dahulu untuk menggunakan sistem absensi.</p>
        </div>
      </motion.div>
    )
  }

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch today's attendance record
  useEffect(() => {
    if (user?.employeeId) {
      fetchTodayAttendance()
    }
  }, [user?.employeeId])

  const fetchTodayAttendance = async () => {
    if (!user?.employeeId) return
    
    try {
      const response = await attendanceAPI.getTodayAttendance()
      const userRecord = response.data.find(record => record.employeeId === user.employeeId)
      setTodayRecord(userRecord || null)
    } catch (error) {
      console.error('Error fetching today attendance:', error)
    }
  }

  const handleCheckIn = async () => {
    setPendingAction('checkin')
    setShowCamera(true)
  }

  const handleCheckOut = async () => {
    setPendingAction('checkout')
    setShowCamera(true)
  }

  const handleImageCapture = (imageFile: File) => {
    setCapturedImage(imageFile)
    processAttendance(imageFile)
  }

  const processAttendance = async (imageFile: File) => {
    if (!user?.employeeId || !user?.name || !capturedImage) return
    
    setLoading(true)
    try {
      // Convert image to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(imageFile)
      })
      
      const base64Image = await base64Promise
      
      if (pendingAction === 'checkin') {
        await attendanceAPI.checkIn(user.employeeId, user.name, base64Image)
        toast.success('Berhasil check-in! Selamat bekerja! 🎉')
      } else if (pendingAction === 'checkout') {
        await attendanceAPI.checkOut(user.employeeId, base64Image)
        toast.success('Berhasil check-out! Terima kasih atas kerja kerasnya! 👏')
      }
      
      await fetchTodayAttendance()
      onAttendanceChange?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memproses absensi')
    } finally {
      setLoading(false)
      setShowCamera(false)
      setPendingAction(null)
    }
  }

  const handleCameraClose = () => {
    setShowCamera(false)
    setPendingAction(null)
    setCapturedImage(null)
  }

  const getStatusColor = () => {
    if (!todayRecord) return 'text-gray-500'
    if (todayRecord.status === 'completed') return 'text-green-500'
    if (todayRecord.status === 'checked-in') return 'text-blue-500'
    return 'text-gray-500'
  }

  const getStatusIcon = () => {
    if (!todayRecord) return <Clock className="w-5 h-5" />
    if (todayRecord.status === 'completed') return <CheckCircle className="w-5 h-5" />
    if (todayRecord.status === 'checked-in') return <Clock className="w-5 h-5" />
    return <XCircle className="w-5 h-5" />
  }

  const getStatusText = () => {
    if (!todayRecord) return 'Belum check-in'
    if (todayRecord.status === 'completed') return 'Sudah check-out'
    if (todayRecord.status === 'checked-in') return 'Sedang bekerja'
    return 'Belum check-in'
  }

  const canCheckIn = !todayRecord
  const canCheckOut = todayRecord && todayRecord.status === 'checked-in'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ID: {user.employeeId}
            </p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 ${getStatusColor()} justify-center sm:justify-start`}>
          {getStatusIcon()}
          <span className="text-xs sm:text-sm font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Current Time */}
      <div className="text-center mb-6">
        <motion.div
          key={currentTime.getMinutes()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
        >
          {format(currentTime, 'HH:mm:ss')}
        </motion.div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {format(currentTime, 'EEEE, dd MMMM yyyy')}
        </p>
      </div>

      {/* Attendance Times */}
      {todayRecord && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
              Check-in
            </p>
            <p className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-300">
              {todayRecord.checkInTime 
                ? format(new Date(todayRecord.checkInTime), 'HH:mm')
                : '--:--'
              }
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
              Check-out
            </p>
            <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">
              {todayRecord.checkOutTime 
                ? format(new Date(todayRecord.checkOutTime), 'HH:mm')
                : '--:--'
              }
            </p>
          </div>
        </div>
      )}

      {/* Working Hours */}
      {todayRecord?.workingHours && (
        <div className="text-center mb-6 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
            Total Jam Kerja
          </p>
          <p className="text-sm sm:text-lg font-bold text-blue-700 dark:text-blue-300">
            {todayRecord.workingHours.toFixed(1)} jam
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {canCheckIn && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>{loading ? 'Memproses...' : 'Check-in + Selfie'}</span>
          </motion.button>
        )}

        {canCheckOut && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckOut}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>{loading ? 'Memproses...' : 'Check-out + Selfie'}</span>
          </motion.button>
        )}

        {todayRecord?.status === 'completed' && (
          <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
              ✅ Kerja hari ini sudah selesai!
            </p>
          </div>
        )}
      </div>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={showCamera}
        onImageCapture={handleImageCapture}
        onClose={handleCameraClose}
      />
    </motion.div>
  )
}

export default AttendanceCard