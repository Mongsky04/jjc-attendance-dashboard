import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { attendanceAPI, AttendanceRecord } from '../api/attendance'
import { format } from 'date-fns'
import { TableSkeleton } from './Skeleton'
import toast from 'react-hot-toast'

interface AttendanceTableProps {
  refreshTrigger?: number
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ refreshTrigger }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAttendanceData()
  }, [pagination.page, refreshTrigger])

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      if (dateRange.startDate && dateRange.endDate) {
        const response = await attendanceAPI.getAttendanceByDateRange(
          dateRange.startDate, 
          dateRange.endDate
        )
        setRecords(response.data)
      } else {
        const response = await attendanceAPI.getAllAttendance(pagination.page, pagination.limit)
        setRecords(response.data)
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Gagal memuat data kehadiran')
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchAttendanceData()
  }

  const handleExportExcel = async () => {
    try {
      toast.loading('Menggenerate Excel...', { duration: 1000 })
      
      const blob = await attendanceAPI.exportToExcel(
        dateRange.startDate || undefined,
        dateRange.endDate || undefined
      )
      
      // Check if blob is valid
      if (!blob || blob.size === 0) {
        throw new Error('File Excel kosong atau tidak valid')
      }
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      
      // Force download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)
      
      toast.success('Excel berhasil diunduh! 📊')
    } catch (error) {
      console.error('Error exporting Excel:', error)
      toast.error('Gagal mengunduh Excel: ' + (error as Error).message)
    }
  }

  const filteredRecords = records.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`
      case 'checked-in':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'checked-in': return 'Aktif'
      default: return 'Belum'
    }
  }

  if (loading && records.length === 0) {
    return <TableSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Data Kehadiran
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportExcel}
            className="btn-secondary flex items-center justify-center space-x-2 whitespace-nowrap text-sm py-2 px-3"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </motion.button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          <Calendar className="w-5 h-5 text-gray-500 hidden sm:block" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <span className="text-gray-500 text-sm hidden sm:inline">s/d</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleDateRangeSearch}
          className="btn-primary whitespace-nowrap text-sm py-2 px-4"
        >
          Filter Data
        </button>
      </div>

      {/* Table - Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Karyawan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jam Kerja
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRecords.map((record, index) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {record.employeeName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {record.employeeId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {format(new Date(record.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '--:--'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '--:--'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {record.workingHours ? `${record.workingHours.toFixed(1)} jam` : '--'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(record.status)}>
                    {getStatusText(record.status)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data kehadiran'}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4">
        {filteredRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {record.employeeName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {record.employeeId}
                </p>
              </div>
              <span className={getStatusBadge(record.status)}>
                {getStatusText(record.status)}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Tanggal</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {format(new Date(record.date), 'dd/MM/yyyy')}
              </span>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-in</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '--:--'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-out</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '--:--'}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Jam Kerja</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {record.workingHours ? `${record.workingHours.toFixed(1)} jam` : '--'}
              </span>
            </div>
          </motion.div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data kehadiran'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!dateRange.startDate && !dateRange.endDate && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AttendanceTable