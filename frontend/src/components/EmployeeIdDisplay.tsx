import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Copy, Download, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface EmployeeIdDisplayProps {
  isOpen: boolean
  onClose: () => void
  employeeId: string
  employeeName: string
}

const EmployeeIdDisplay: React.FC<EmployeeIdDisplayProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName
}) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(employeeId)
      setCopied(true)
      toast.success('Employee ID disalin ke clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Gagal menyalin ke clipboard')
    }
  }

  const downloadInfo = () => {
    const info = `JJC Attendance Dashboard - Informasi Akun

Nama: ${employeeName}
Employee ID: ${employeeId}
Tanggal Dibuat: ${new Date().toLocaleDateString('id-ID')}

Simpan informasi ini dengan aman!
Gunakan Employee ID untuk referensi dalam sistem absensi.

---
JJC Company
${new Date().getFullYear()}`

    const blob = new Blob([info], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `JJC-EmployeeInfo-${employeeId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Informasi akun berhasil diunduh!')
  }

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
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
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Registrasi Berhasil! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Akun Anda telah berhasil dibuat
            </p>
          </div>

          {/* Employee Info */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {employeeName}
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 border border-primary-200 dark:border-primary-700">
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Employee ID (Nomor Pegawai)
              </label>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-primary-900 dark:text-primary-100 font-mono tracking-wider">
                  {employeeId}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              📝 Informasi Penting
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Simpan Employee ID Anda dengan aman</li>
              <li>• Employee ID akan digunakan untuk referensi dalam sistem</li>
              <li>• Anda dapat melihat Employee ID kapan saja di profil Anda</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadInfo}
              className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Unduh Info</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <span>Lanjutkan ke Dashboard</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default EmployeeIdDisplay