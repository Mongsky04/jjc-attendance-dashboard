import express from 'express'
import { attendanceController } from '../controllers/attendanceController.js'

const router = express.Router()

// Get all attendance records
router.get('/', attendanceController.getAllAttendance)

// Get attendance by date range
router.get('/range', attendanceController.getAttendanceByDateRange)

// Check-in endpoint
router.post('/checkin', attendanceController.checkIn)

// Check-out endpoint
router.post('/checkout', attendanceController.checkOut)

// Get today's attendance
router.get('/today', attendanceController.getTodayAttendance)

// Get monthly summary
router.get('/summary/:month/:year', attendanceController.getMonthlySummary)

// Export to Excel
router.get('/export', attendanceController.exportToExcel)

export default router