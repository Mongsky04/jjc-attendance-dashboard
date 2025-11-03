import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, RotateCcw, Check, AlertCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

interface CameraCaptureProps {
  onImageCapture: (imageFile: File) => void
  onClose: () => void
  isOpen: boolean
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, onClose, isOpen }) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCamera, setIsCamera] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [showCameraHelp, setShowCameraHelp] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isInitializing, setIsInitializing] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    // Prevent multiple simultaneous camera access attempts
    if (loading || isInitializing || stream) {
      return
    }

    try {
      setLoading(true)
      setIsInitializing(true)
      setCameraError(null)
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser')
      }

      // Try different camera configurations
      const constraints = [
        // Try front camera first
        { 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Fallback to any camera
        {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Minimal constraints
        {
          video: true
        }
      ]

      let mediaStream: MediaStream | null = null
      let lastError: Error | null = null

      for (const constraint of constraints) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraint)
          break
        } catch (err) {
          lastError = err as Error
          console.warn('Camera constraint failed:', constraint, err)
        }
      }

      if (!mediaStream) {
        throw lastError || new Error('Cannot access camera')
      }

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      toast.success('Kamera berhasil diakses!')
      
    } catch (error) {
      console.error('Error accessing camera:', error)
      const errorMessage = getCameraErrorMessage(error as Error)
      setCameraError(errorMessage)
      toast.error(errorMessage)
      
      // Auto-switch to upload mode after 2 failed attempts
      setRetryCount(prev => {
        const newCount = prev + 1
        if (newCount >= 2) {
          toast.success('Beralih ke mode upload file untuk kemudahan Anda.')
          setIsCamera(false)
        }
        return newCount
      })
    } finally {
      setLoading(false)
      setIsInitializing(false)
    }
  }, [retryCount, loading, isInitializing, stream]) // Add protection flags

  const getCameraErrorMessage = (error: Error) => {
    const message = error.message?.toLowerCase() || ''
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent)
    
    if (message.includes('permission') || message.includes('denied')) {
      return isMobile 
        ? 'Akses kamera ditolak. Buka Pengaturan browser → Izin Situs → Kamera, lalu izinkan akses.'
        : 'Akses kamera ditolak. Klik ikon kamera di address bar untuk mengizinkan akses.'
    } else if (message.includes('not found') || message.includes('notfound')) {
      return 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.'
    } else if (message.includes('not supported') || message.includes('notsupported')) {
      return 'Browser tidak mendukung akses kamera. Gunakan browser modern seperti Chrome, Firefox, atau Safari.'
    } else if (message.includes('in use') || message.includes('notreadable')) {
      return 'Kamera sedang digunakan aplikasi lain. Tutup aplikasi yang menggunakan kamera.'
    } else if (message.includes('secure') || message.includes('https')) {
      return 'Akses kamera memerlukan koneksi HTTPS. Gunakan https:// atau localhost.'
    }
    
    return 'Tidak dapat mengakses kamera. Silakan gunakan fitur upload gambar.'
  }

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }, [stopCamera])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmImage = useCallback(() => {
    if (capturedImage) {
      // Convert data URL to File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' })
          onImageCapture(file)
          handleClose()
        })
    }
  }, [capturedImage, onImageCapture])

  const handleClose = useCallback(() => {
    stopCamera()
    setCapturedImage(null)
    setCameraError(null)
    setRetryCount(0)
    setIsCamera(true)
    setShowCameraHelp(false)
    setIsInitializing(false)
    onClose()
  }, [stopCamera, onClose])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    if (isCamera && !loading) {
      startCamera()
    }
  }, [isCamera, loading, startCamera])

  React.useEffect(() => {
    let isMounted = true
    
    if (isOpen && isCamera && !stream && !loading && !cameraError && !isInitializing) {
      // Add a small delay to prevent rapid re-triggers
      const timeoutId = setTimeout(() => {
        if (isMounted && !loading && !isInitializing) {
          startCamera()
        }
      }, 200)
      
      return () => {
        clearTimeout(timeoutId)
        isMounted = false
      }
    }
    
    // Cleanup function
    return () => {
      isMounted = false
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen, isCamera, stream, loading, cameraError, isInitializing]) // Add isInitializing

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {capturedImage ? 'Konfirmasi Foto' : 'Ambil Foto Selfie'}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {!capturedImage ? (
              <>
                {/* Mode Toggle */}
                <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                  <button
                    onClick={() => {
                      if (!isCamera) {
                        setIsCamera(true)
                        setCameraError(null)
                        setRetryCount(0)
                        // startCamera will be called by useEffect
                      }
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      isCamera
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Kamera</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isCamera) {
                        setIsCamera(false)
                        stopCamera()
                        setCameraError(null)
                      }
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      !isCamera
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Galeri</span>
                  </button>
                </div>

                {/* Camera View */}
                {isCamera && (
                  <div className="relative">
                    {loading ? (
                      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mengakses kamera...</p>
                        </div>
                      </div>
                    ) : cameraError ? (
                      <div className="aspect-[4/3] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center p-4">
                        <div className="text-center">
                          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                          <p className="text-sm text-red-700 dark:text-red-300 mb-4">{cameraError}</p>
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                setCameraError(null)
                                setRetryCount(0) // Reset retry count
                                startCamera()
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                              disabled={loading}
                            >
                              {loading ? 'Mencoba...' : 'Coba Lagi'}
                            </button>
                            <button
                              onClick={() => setShowCameraHelp(true)}
                              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Bantuan</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full aspect-[4/3] bg-black rounded-lg object-cover"
                      />
                    )}
                    
                    {stream && !loading && !cameraError && (
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-primary-500 hover:border-primary-600 transition-colors flex items-center justify-center"
                      >
                        <div className="w-12 h-12 bg-primary-500 rounded-full"></div>
                      </button>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {!isCamera && (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center space-y-3 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Pilih foto dari galeri
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG hingga 10MB
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Image Preview */
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ulangi</span>
                  </button>
                  <button
                    onClick={confirmImage}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Gunakan</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>

        {/* Camera Help Modal */}
        {showCameraHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-10"
            onClick={() => setShowCameraHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Bantuan Kamera</h4>
                <button
                  onClick={() => setShowCameraHelp(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Langkah-langkah:</h5>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Pastikan browser memiliki izin akses kamera</li>
                    <li>Tutup aplikasi lain yang menggunakan kamera</li>
                    <li>Gunakan browser modern (Chrome, Firefox, Safari)</li>
                    <li>Pastikan menggunakan HTTPS atau localhost</li>
                  </ol>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Cara mengizinkan kamera:</h5>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Chrome: Klik ikon kamera di address bar</li>
                    <li>Firefox: Klik ikon kamera di kiri address bar</li>
                    <li>Safari: Preferences {'->'} Websites {'->'} Camera</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-blue-700 dark:text-blue-300 text-xs">
                    💡 <strong>Tips:</strong> Jika masih bermasalah, gunakan fitur "Galeri" untuk upload foto dari file.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowCameraHelp(false)}
                className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Mengerti
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default CameraCapture