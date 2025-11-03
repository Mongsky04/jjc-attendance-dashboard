#!/bin/bash
# Deploy script for Netlify + Railway

echo "🚀 Deploying JJC Attendance Dashboard..."
echo "🌐 Frontend: Netlify | 🔧 Backend: Railway"
echo ""

echo "📋 Manual Deployment Steps:"
echo ""
echo "🔧 Backend (Railway):"
echo "1. Go to https://railway.app"
echo "2. Connect GitHub repository"
echo "3. Select 'backend' folder"
echo "4. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=mongodb+srv://zakyramadhanxstudy:135504@cluster0.dt9i7yx.mongodb.net/jjc_attendance"
echo "   - JWT_SECRET=your-super-secret-jwt-key-change-this"
echo "   - FRONTEND_URL=https://your-netlify-domain.netlify.app"
echo "5. Deploy and copy the Railway URL"
echo ""

echo "🌐 Frontend (Netlify):"
echo "1. Go to https://netlify.com"
echo "2. Connect GitHub repository"
echo "3. Set build settings:"
echo "   - Base directory: frontend"
echo "   - Build command: npm run build"
echo "   - Publish directory: frontend/dist"
echo "4. Set environment variables:"
echo "   - VITE_API_URL=https://your-railway-backend.up.railway.app/api"
echo "   - VITE_APP_TITLE=JJC Attendance Dashboard"
echo "   - VITE_APP_VERSION=1.0.0"
echo "5. Deploy"
echo ""

echo "✅ Alternative: Use build files from dist folder for manual upload"
echo ""

# Build for manual deployment
read -p "📦 Build for manual deployment? (y/n): " build_manual

if [[ $build_manual == "y" || $build_manual == "Y" ]]; then
    echo "📦 Building frontend..."
    cd frontend
    npm run build
    echo ""
    echo "✅ Build complete!"
    echo "📁 Frontend files: frontend/dist/"
    echo "📤 Upload dist/ folder contents to your hosting provider"
    cd ..
fi

echo ""
echo "🎉 Deployment guide complete!"
echo "📚 See DEPLOYMENT.md for detailed instructions"