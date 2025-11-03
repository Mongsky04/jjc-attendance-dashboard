# 🚀 JJC Attendance Dashboard - Deployment Guide

## Opsi Deployment

### 1. 🔥 **Vercel (Recommended)**

**Frontend + Backend dalam satu platform**

#### Frontend Deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### Backend Deployment:

```bash
# Deploy backend API
cd backend
vercel --prod
```

**Environment Variables untuk Vercel:**

- `NODE_ENV` = `production`
- `DATABASE_URL` = (MongoDB connection string)
- `JWT_SECRET` = (strong secret key)
- `FRONTEND_URL` = (frontend domain dari Vercel)

---

### 2. 🌐 **Netlify + Railway**

**Frontend di Netlify, Backend di Railway**

#### Frontend (Netlify):

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables:
   - `VITE_API_URL` = (Railway backend URL)

#### Backend (Railway):

1. Connect GitHub repository
2. Select `backend` folder
3. Set environment variables (sama seperti Vercel)

---

### 3. 🐳 **Docker Deployment**

#### Frontend Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### Backend Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔧 Environment Variables Setup

### Backend (.env.production):

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://zakyramadhanxstudy:135504@cluster0.dt9i7yx.mongodb.net/jjc_attendance
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.production):

```env
VITE_API_URL=https://your-backend-api.vercel.app/api
VITE_APP_TITLE=JJC Attendance Dashboard
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Quick Deploy Commands

### Build untuk Production:

```bash
# Run build script
./build.sh

# Manual build
cd frontend && npm run build
cd ../backend && npm install
```

### Test Production Build:

```bash
# Test frontend build
cd frontend && npm run preview

# Test backend
cd backend && NODE_ENV=production npm start
```

---

## 📋 Deployment Checklist

- [ ] ✅ Environment variables configured
- [ ] 🔐 JWT_SECRET changed from default
- [ ] 🌐 CORS origins updated for production
- [ ] 📱 Frontend API URL points to production backend
- [ ] 🗄️ MongoDB Atlas whitelist IPs (0.0.0.0/0 for cloud deployment)
- [ ] 🔧 Build scripts working
- [ ] 🧪 Production build tested locally
- [ ] 📸 Camera functionality tested on HTTPS
- [ ] 🔒 Security headers configured

---

## 🔧 Post-Deployment

1. **Update Environment Variables:**

   - Backend: Update `FRONTEND_URL` with actual frontend domain
   - Frontend: Update `VITE_API_URL` with actual backend domain

2. **Test Features:**

   - Authentication (Login/Register)
   - Camera capture (requires HTTPS)
   - Attendance check-in/out
   - Excel export
   - Dark mode toggle

3. **Monitor:**
   - Check deployment logs
   - Monitor API response times
   - Test mobile responsiveness

---

## 🆘 Troubleshooting

### Common Issues:

**1. Camera not working on deployment:**

- Ensure deployment uses HTTPS
- Check browser permissions

**2. API calls failing:**

- Verify CORS configuration
- Check environment variables
- Confirm API URLs

**3. MongoDB connection issues:**

- Whitelist deployment IPs in MongoDB Atlas
- Check connection string format

**4. Build failures:**

- Clear node_modules and reinstall
- Check TypeScript errors
- Verify all dependencies

---

## 🎯 Recommended Setup

**For Production:**

1. **Frontend:** Vercel
2. **Backend:** Vercel Functions
3. **Database:** MongoDB Atlas (already configured)
4. **Domain:** Custom domain from Vercel

**Total Cost:** FREE (with Vercel free tier + MongoDB free tier)

---

## 📞 Support

Jika ada issues:

1. Check deployment logs
2. Verify environment variables
3. Test locally first
4. Check network/CORS issues
