#!/bin/bash
# Build script untuk production

echo "🚀 Building JJC Attendance Dashboard for Production..."

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Prepare Backend
echo "🔧 Preparing Backend..."
cd backend
npm install
echo "✅ Backend prepared"
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "📁 Frontend build files: frontend/dist/"
echo "🚀 Backend ready for deployment: backend/"
echo ""
echo "🌐 Next steps:"
echo "1. Deploy backend to Vercel/Railway/Render"
echo "2. Deploy frontend to Vercel/Netlify"
echo "3. Update environment variables with production URLs"