import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, RotateCcw, Check } from 'lucide-react'

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
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setLoading(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Tidak dapat mengakses kamera. Silakan gunakan fitur upload gambar.')
      setIsCamera(false)
    } finally {
      setLoading(false)
    }
  }, [])

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
    setIsCamera(true)
    onClose()
  }, [stopCamera, onClose])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    if (isCamera) {
      startCamera()
    }
  }, [isCamera, startCamera])

  React.useEffect(() => {
    if (isOpen && isCamera) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, isCamera, startCamera, stopCamera])

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
                      setIsCamera(true)
                      startCamera()
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      isCamera
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Kamera</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCamera(false)
                      stopCamera()
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
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full aspect-[4/3] bg-black rounded-lg object-cover"
                      />
                    )}
                    
                    {stream && !loading && (
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
      </motion.div>
    </AnimatePresence>
  )
}

export default CameraCapture