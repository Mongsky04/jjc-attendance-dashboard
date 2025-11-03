// Mock API untuk testing tanpa backend
export const mockApi = {
  // Mock authentication
  login: async (email: string, _password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '1',
            name: 'Demo User',
            email: email,
            employeeId: 'EMP2025001'
          },
          token: 'mock-jwt-token'
        })
      }, 1000)
    })
  },

  // Mock register
  register: async (name: string, email: string, _password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '2',
            name: name,
            email: email,
            employeeId: 'EMP2025002'
          },
          token: 'mock-jwt-token'
        })
      }, 1000)
    })
  },

  // Mock attendance
  checkIn: async (_imageFile: File) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          attendance: {
            id: Date.now().toString(),
            employeeId: 'EMP2025001',
            checkInTime: new Date().toISOString(),
            checkInImage: 'data:image/jpeg;base64,mock-image'
          }
        })
      }, 1500)
    })
  },

  checkOut: async (_imageFile: File) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          attendance: {
            id: Date.now().toString(),
            employeeId: 'EMP2025001',
            checkOutTime: new Date().toISOString(),
            checkOutImage: 'data:image/jpeg;base64,mock-image',
            workingHours: '8 jam 30 menit'
          }
        })
      }, 1500)
    })
  },

  // Mock attendance data
  getAttendance: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: '1',
              date: new Date().toISOString().split('T')[0],
              checkInTime: '09:00:00',
              checkOutTime: '17:30:00',
              workingHours: '8 jam 30 menit',
              status: 'completed'
            },
            {
              id: '2',
              date: '2025-11-02',
              checkInTime: '08:45:00',
              checkOutTime: '17:15:00',
              workingHours: '8 jam 30 menit',
              status: 'completed'
            }
          ]
        })
      }, 1000)
    })
  }
}