# 🏢 JJC Attendance Dashboard

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> 🚀 Modern fullstack attendance management system dengan fitur selfie capture, real-time tracking, dan Excel export.

## ✨ Features

### 📊 **Dashboard Utama**
- ✅ **Real-time clock** dengan format Indonesia
- ✅ **Check-in/Check-out** dengan capture selfie
- ✅ **Live status tracking** (checked-in, completed)
- ✅ **Working hours calculation** otomatis
- ✅ **Today's attendance overview**

### 📷 **Camera & Image**
- ✅ **Live camera capture** untuk selfie check-in/out
- ✅ **Gallery picker** alternatif jika kamera tidak tersedia
- ✅ **Image preview & confirmation** sebelum submit
- ✅ **Base64 storage** untuk database efficiency
- ✅ **Mobile responsive** camera interface

### 📈 **Analytics & Reports**
- ✅ **Monthly summary** dengan statistics cards
- ✅ **Excel export** dengan filter date range
- ✅ **Pagination** untuk large datasets
- ✅ **Search & filter** functionality
- ✅ **Performance insights** analytics

### 🎨 **UI/UX**
- ✅ **Dark/Light mode** toggle
- ✅ **Responsive design** (mobile-first)
- ✅ **Framer Motion** smooth animations
- ✅ **Loading skeletons** untuk better UX
- ✅ **Toast notifications** dengan react-hot-toast
- ✅ **Indonesian language** interface

## 🛠️ Tech Stack

### **Frontend**
- **React 18** dengan TypeScript
- **Vite** untuk development & build
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animations
- **React Router** untuk navigation
- **Axios** untuk API calls
- **Date-fns** untuk date manipulation
- **React Hot Toast** untuk notifications

### **Backend**
- **Node.js** dengan Express.js
- **MongoDB Atlas** dengan Mongoose ODM
- **ES Modules** support
- **CORS, Helmet, Rate Limiting** untuk security
- **ExcelJS** untuk Excel export
- **Date-fns** untuk date operations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/your-username/jjc-attendance-dashboard.git
cd jjc-attendance-dashboard
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install

# Create .env file
cp .env.example .env
\`\`\`

Edit \`.env\` dengan MongoDB connection string:
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jjc_attendance
PORT=5000
NODE_ENV=development
\`\`\`

\`\`\`bash
# Start backend server
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../frontend
npm install

# Start frontend dev server
npm run dev
\`\`\`

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Mobile Features

- **📷 Camera Access**: Live selfie capture saat check-in/out
- **📁 Gallery Upload**: Alternatif upload foto dari galeri
- **📱 Responsive Design**: Optimized untuk semua device sizes
- **👆 Touch Friendly**: Button sizing dan spacing untuk mobile
- **🍔 Hamburger Menu**: Collapsible navigation untuk mobile
- **💨 Smooth Animations**: 60fps transitions dan micro-interactions

## 🎯 Usage Guide

### **Daily Attendance Flow:**
1. **Morning Check-in**:
   - Klik "Check-in + Selfie"
   - Ambil foto selfie atau upload dari galeri
   - Confirm foto dan otomatis tercatat jam masuk

2. **Evening Check-out**:
   - Klik "Check-out + Selfie" 
   - Ambil foto selfie konfirmasi
   - Sistem otomatis hitung working hours

3. **View Reports**:
   - Dashboard untuk overview hari ini
   - Summary page untuk rekap bulanan
   - Export Excel untuk laporan detail

## � Deployment

### **Quick Deploy:**
```bash
# Option 1: Vercel (Recommended)
./deploy-vercel.sh

# Option 2: Manual deployment guide
./deploy-manual.sh

# Option 3: Build for any hosting
./build.sh
```

### **Platform Options:**
- 🔥 **Vercel**: Frontend + Backend (Free tier available)
- 🌐 **Netlify + Railway**: Frontend + Backend (Free tiers)
- 📤 **Manual**: Any hosting provider with Node.js support

**📚 Detailed Guides:**
- 📖 [Complete Deployment Guide](DEPLOYMENT.md)
- ⚡ [Quick Deploy Instructions](QUICK-DEPLOY.md)

### **Environment Setup:**
```bash
# Backend (.env.production)
NODE_ENV=production
DATABASE_URL=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-key
FRONTEND_URL=https://your-frontend-domain.com

# Frontend (.env.production)
VITE_API_URL=https://your-backend-domain.com/api
```

**🔒 Security Notes:**
- Change JWT_SECRET from default value
- Use HTTPS for camera functionality
- Configure CORS for production domains

## �📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**JJC Development Team**
- Frontend: React + TypeScript + Tailwind
- Backend: Node.js + Express + MongoDB
- Features: Real-time attendance dengan camera capture

---

⭐ **Star this repo if you find it helpful!** ⭐