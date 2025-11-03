import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    trim: true,
    index: true
  },
  employeeName: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, 'Date is required'],
    index: true
  },
  checkInTime: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  workingHours: {
    type: Number,
    default: null,
    min: 0,
    max: 24
  },
  status: {
    type: String,
    enum: ['checked-in', 'completed'],
    default: 'checked-in'
  },
  checkInImage: {
    type: String, // Base64 string or file path
    default: null
  },
  checkOutImage: {
    type: String, // Base64 string or file path  
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'attendances'
})

// Compound index untuk mencegah duplicate check-in di hari yang sama
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

// Index untuk query yang sering digunakan
attendanceSchema.index({ date: -1 })
attendanceSchema.index({ employeeId: 1, date: -1 })
attendanceSchema.index({ status: 1 })

// Virtual untuk menghitung duration dalam format human-readable
attendanceSchema.virtual('workingDuration').get(function() {
  if (this.workingHours) {
    const hours = Math.floor(this.workingHours)
    const minutes = Math.round((this.workingHours - hours) * 60)
    return `${hours}j ${minutes}m`
  }
  return null
})

// Method untuk menghitung working hours
attendanceSchema.methods.calculateWorkingHours = function() {
  if (this.checkInTime && this.checkOutTime) {
    const diffMs = this.checkOutTime - this.checkInTime
    const diffHours = diffMs / (1000 * 60 * 60)
    this.workingHours = Math.round(diffHours * 100) / 100 // Round to 2 decimal places
    return this.workingHours
  }
  return null
}

// Static method untuk mendapatkan attendance hari ini
attendanceSchema.statics.getTodayAttendance = function(date = null) {
  const today = date || new Date().toISOString().split('T')[0]
  return this.find({ date: today }).sort({ checkInTime: -1 })
}

// Static method untuk mendapatkan monthly summary
attendanceSchema.statics.getMonthlySummary = function(month, year) {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
  const endDate = `${year}-${month.toString().padStart(2, '0')}-31`
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        completedDays: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalWorkingHours: { $sum: '$workingHours' },
        avgWorkingHours: { $avg: '$workingHours' }
      }
    }
  ])
}

// Pre-save middleware untuk auto-calculate working hours
attendanceSchema.pre('save', function(next) {
  if (this.checkInTime && this.checkOutTime && !this.workingHours) {
    this.calculateWorkingHours()
  }
  next()
})

// Post-save middleware untuk logging
attendanceSchema.post('save', function(doc) {
  console.log(`📝 Attendance saved: ${doc.employeeName} - ${doc.date} - ${doc.status}`)
})

const Attendance = mongoose.model('Attendance', attendanceSchema)

export default Attendance