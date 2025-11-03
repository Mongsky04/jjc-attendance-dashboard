import axios from 'axios'
import { api } from './client'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkInTime: string | null
  checkOutTime: string | null
  workingHours: number | null
  status: 'checked-in' | 'completed'
  checkInImage?: string | null
  checkOutImage?: string | null
}

export interface AttendanceAPI {
  getAllAttendance: (page?: number, limit?: number) => Promise<{
    success: boolean
    data: AttendanceRecord[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }>
  getAttendanceByDateRange: (startDate: string, endDate: string) => Promise<{
    success: boolean
    data: AttendanceRecord[]
  }>
  checkIn: (employeeId: string, employeeName: string, checkInImage?: string) => Promise<{
    success: boolean
    message: string
    data: AttendanceRecord
  }>
  checkOut: (employeeId: string, checkOutImage?: string) => Promise<{
    success: boolean
    message: string
    data: AttendanceRecord
  }>
  getTodayAttendance: () => Promise<{
    success: boolean
    data: AttendanceRecord[]
  }>
  getMonthlySummary: (month: number, year: number) => Promise<{
    success: boolean
    data: {
      summary: {
        totalDays: number
        completedDays: number
        totalWorkingHours: number
        averageWorkingHours: string
      }
      records: AttendanceRecord[]
    }
  }>
  exportToExcel: (startDate?: string, endDate?: string) => Promise<Blob>
}

export const attendanceAPI: AttendanceAPI = {
  getAllAttendance: async (page = 1, limit = 10) => {
    return api.get(`/attendance?page=${page}&limit=${limit}`)
  },

  getAttendanceByDateRange: async (startDate: string, endDate: string) => {
    return api.get(`/attendance/range?startDate=${startDate}&endDate=${endDate}`)
  },

  checkIn: async (employeeId: string, employeeName: string, checkInImage?: string) => {
    return api.post('/attendance/checkin', { 
      employeeId, 
      employeeName,
      checkInImage 
    })
  },

  checkOut: async (employeeId: string, checkOutImage?: string) => {
    return api.post('/attendance/checkout', { 
      employeeId,
      checkOutImage 
    })
  },

  getTodayAttendance: async () => {
    return api.get('/attendance/today')
  },

  getMonthlySummary: async (month: number, year: number) => {
    return api.get(`/attendance/summary/${month}/${year}`)
  },

  exportToExcel: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    // Direct axios call without interceptor for blob
    const response = await axios.get(`${api.defaults.baseURL}/attendance/export?${params.toString()}`, {
      responseType: 'blob',
      timeout: 30000
    })
    return response.data
  }
}