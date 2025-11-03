import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'
import ExcelJS from 'exceljs'
import Attendance from '../models/Attendance.js'

export const attendanceController = {
  // Get all attendance records
  getAllAttendance: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit

      const total = await Attendance.countDocuments()
      const records = await Attendance.find()
        .sort({ date: -1, checkInTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

      res.json({
        success: true,
        data: records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      console.error('Error in getAllAttendance:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // Get attendance by date range
  getAttendanceByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        })
      }

      const records = await Attendance.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1, checkInTime: -1 }).lean()

      res.json({
        success: true,
        data: records
      })
    } catch (error) {
      console.error('Error in getAttendanceByDateRange:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

    // Check-in endpoint
  checkIn: async (req, res) => {
    try {
      const { employeeId, employeeName, checkInImage } = req.body
      
      if (!employeeId || !employeeName) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID and name are required'
        })
      }

      const today = format(new Date(), 'yyyy-MM-dd')
      const checkInTime = new Date()

      // Check if already checked in today
      const existingRecord = await Attendance.findOne({
        employeeId,
        date: today
      })

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: 'Already checked in today'
        })
      }

      const newRecord = new Attendance({
        employeeId,
        employeeName,
        date: today,
        checkInTime,
        checkInImage: checkInImage || null, // Store base64 image
        status: 'checked-in'
      })

      await newRecord.save()

      res.status(201).json({
        success: true,
        message: 'Successfully checked in',
        data: newRecord
      })
    } catch (error) {
      console.error('Error in checkIn:', error)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Already checked in today'
        })
      }
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

    // Check-out endpoint
  checkOut: async (req, res) => {
    try {
      const { employeeId, checkOutImage } = req.body
      
      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        })
      }

      const today = format(new Date(), 'yyyy-MM-dd')
      const checkOutTime = new Date()

      const record = await Attendance.findOne({
        employeeId,
        date: today
      })

      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'No check-in record found for today'
        })
      }

      if (record.checkOutTime) {
        return res.status(400).json({
          success: false,
          message: 'Already checked out today'
        })
      }

      // Update record with checkout time, image and calculate working hours
      record.checkOutTime = checkOutTime
      record.checkOutImage = checkOutImage || null
      record.calculateWorkingHours()
      record.status = 'completed'

      await record.save()

      res.json({
        success: true,
        message: 'Successfully checked out',
        data: record
      })
    } catch (error) {
      console.error('Error in checkOut:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // Get today's attendance
  getTodayAttendance: async (req, res) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const todayRecords = await Attendance.getTodayAttendance(today)

      res.json({
        success: true,
        data: todayRecords
      })
    } catch (error) {
      console.error('Error in getTodayAttendance:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // Get monthly summary
  getMonthlySummary: async (req, res) => {
    try {
      const { month, year } = req.params
      
      if (!month || !year) {
        return res.status(400).json({
          success: false,
          message: 'Month and year are required'
        })
      }

      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`

      // Get monthly records
      const monthlyRecords = await Attendance.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 }).lean()

      // Get summary statistics
      const summaryResult = await Attendance.getMonthlySummary(parseInt(month), parseInt(year))
      const summary = summaryResult[0] || {
        totalDays: 0,
        completedDays: 0,
        totalWorkingHours: 0,
        avgWorkingHours: 0
      }

      res.json({
        success: true,
        data: {
          summary: {
            totalDays: summary.totalDays,
            completedDays: summary.completedDays,
            totalWorkingHours: summary.totalWorkingHours || 0,
            averageWorkingHours: summary.avgWorkingHours ? summary.avgWorkingHours.toFixed(2) : '0.00'
          },
          records: monthlyRecords
        }
      })
    } catch (error) {
      console.error('Error in getMonthlySummary:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  },

  // Export to Excel
  exportToExcel: async (req, res) => {
    try {
      const { startDate, endDate } = req.query
      
      let query = {}
      
      if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate }
      }

      const records = await Attendance.find(query)
        .sort({ date: -1, checkInTime: -1 })
        .lean()

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Attendance Report')

      // Add headers
      worksheet.columns = [
        { header: 'Employee ID', key: 'employeeId', width: 15 },
        { header: 'Employee Name', key: 'employeeName', width: 25 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Check In Time', key: 'checkInTime', width: 20 },
        { header: 'Check Out Time', key: 'checkOutTime', width: 20 },
        { header: 'Working Hours', key: 'workingHours', width: 15 },
        { header: 'Status', key: 'status', width: 15 }
      ]

      // Add data
      records.forEach(record => {
        worksheet.addRow({
          employeeId: record.employeeId,
          employeeName: record.employeeName,
          date: record.date,
          checkInTime: record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm:ss') : '',
          checkOutTime: record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm:ss') : '',
          workingHours: record.workingHours || '',
          status: record.status
        })
      })

      // Style the header row
      worksheet.getRow(1).font = { bold: true }
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      }

      // Set response headers for file download
      const filename = `attendance_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

      // Write to response
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('Error in exportToExcel:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}