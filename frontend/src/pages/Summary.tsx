import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download } from 'lucide-react'
import StatisticsCards from '../components/StatisticsCards'
import AttendanceTable from '../components/AttendanceTable'
import { attendanceAPI } from '../api/attendance'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const Summary: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  const handleMonthlyExport = async () => {
    try {
      toast.loading('Menggenerate laporan bulanan...', { duration: 1000 })
      
      const startDate = format(new Date(selectedYear, selectedMonth - 1, 1), 'yyyy-MM-dd')
      const endDate = format(new Date(selectedYear, selectedMonth, 0), 'yyyy-MM-dd')
      
      const blob = await attendanceAPI.exportToExcel(startDate, endDate)
      
      // Check if blob is valid
      if (!blob || blob.size === 0) {
        throw new Error('File Excel kosong atau tidak valid')
      }
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_${months.find(m => m.value === selectedMonth)?.label}_${selectedYear}.xlsx`
      
      // Force download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)
      
      toast.success('Laporan bulanan berhasil diunduh! 📊')
    } catch (error) {
      console.error('Error exporting monthly report:', error)
      toast.error('Gagal mengunduh laporan bulanan: ' + (error as Error).message)
    }
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
          Rekap Kehadiran
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Lihat ringkasan dan unduh laporan kehadiran
        </p>
      </div>

      {/* Month/Year Selector */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Pilih Periode
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMonthlyExport}
              className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 whitespace-nowrap text-sm py-2 px-4"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh Laporan</span>
              <span className="sm:hidden">Unduh</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics for Selected Month */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
          Statistik {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
        </h2>
        <StatisticsCards month={selectedMonth} year={selectedYear} />
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Analisis Kinerja
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Tingkat Kehadiran</span>
              <span className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">Excellent</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-gray-600 dark:text-gray-400">Konsistensi Waktu</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Good</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-gray-400">Produktivitas</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">High</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Target & Pencapaian
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Jam Kerja Bulanan</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Kehadiran</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Ketepatan Waktu</span>
                <span className="font-medium">90%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Data Detail Kehadiran
        </h2>
        <AttendanceTable />
      </motion.div>
    </motion.div>
  )
}

export default Summary