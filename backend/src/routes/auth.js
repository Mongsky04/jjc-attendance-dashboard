import express from 'express'
import { 
  register, 
  login, 
  verifyToken, 
  getProfile, 
  updateProfile 
} from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.get('/verify', verifyToken)

// Protected routes
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)

export default router