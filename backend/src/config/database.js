import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL tidak ditemukan di environment variables')
    }

    const conn = await mongoose.connect(DATABASE_URL, {
      // MongoDB connection options
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      bufferCommands: false,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected')
    })

    return conn
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectDB