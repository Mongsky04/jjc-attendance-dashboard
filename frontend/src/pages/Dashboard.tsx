import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AttendanceCard from '../components/AttendanceCard'
import AttendanceTable from '../components/AttendanceTable'
import StatisticsCards from '../components/StatisticsCards'

const Dashboard: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAttendanceChange = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Kehadiran
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Kelola kehadiran harian Anda dengan mudah
        </p>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Check-in/out Card */}
        <div className="lg:col-span-1">
          <AttendanceCard
            onAttendanceChange={handleAttendanceChange}
          />
        </div>

        {/* Quick Stats or Additional Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card text-center"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Hari Ini
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {new Date().getDate()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card text-center"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Status
              </h3>
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✅ Sistem Aktif
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Siap untuk check-in
              </p>
            </motion.div>
          </div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💡 Tips Hari Ini
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <li>• Jangan lupa check-in saat tiba di kantor</li>
              <li>• Check-out sebelum meninggalkan kantor</li>
              <li>• Lihat rekap kehadiran di menu "Rekap"</li>
              <li>• Unduh laporan Excel untuk arsip pribadi</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Attendance Table */}
      <AttendanceTable refreshTrigger={refreshTrigger} />
    </motion.div>
  )
}

export default Dashboard