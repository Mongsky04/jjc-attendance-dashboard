import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'

interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: 'employee' | 'admin'
  department?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = (userData: User, token: string) => {
    setUser(userData)
    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setIsLoading(false) // Ensure loading is false after login
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    toast.success('Berhasil logout')
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('currentUser')

      if (!token || !userData) {
        setIsLoading(false)
        return
      }

      // Verify token with backend
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(JSON.parse(userData))
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('authToken')
          localStorage.removeItem('currentUser')
        }
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
      }
    } catch (error) {
      console.error('Auth verification error:', error)
      // Clear storage on error
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}