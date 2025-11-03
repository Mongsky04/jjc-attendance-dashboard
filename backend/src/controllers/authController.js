import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jjc-secret-key', {
    expiresIn: '30d'
  })
}

// Generate unique Employee ID
const generateEmployeeId = async () => {
  const currentYear = new Date().getFullYear()
  const lastUser = await User.findOne({}, {}, { sort: { 'createdAt': -1 } })
  
  let nextNumber = 1
  if (lastUser && lastUser.employeeId) {
    // Extract number from last employee ID (e.g., "EMP2025001" -> 1)
    const lastNumber = parseInt(lastUser.employeeId.slice(-3))
    nextNumber = lastNumber + 1
  }
  
  // Format: EMP + Year + 3-digit number (e.g., EMP2025001)
  return `EMP${currentYear}${nextNumber.toString().padStart(3, '0')}`
}

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body

    // Validate required fields
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      })
    }

    // Generate unique Employee ID
    const employeeId = await generateEmployeeId()

    // Create new user
    const user = await User.create({
      employeeId,
      name,
      email,
      password,
      department
    })

    // Generate token
    const token = generateToken(user._id)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    res.status(201).json({
      success: true,
      message: `Registrasi berhasil! Employee ID Anda: ${employeeId}`,
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      })
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan'
      })
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    })
  }
}

// Verify token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jjc-secret-key')
    
    // Find user
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    })
  }
}

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, department } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      })
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan oleh user lain'
        })
      }
    }

    // Update user data
    if (name) user.name = name
    if (email) user.email = email
    if (department) user.department = department

    await user.save()

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    })
  }
}