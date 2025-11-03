#!/bin/bash
# Deploy script for Vercel

echo "🚀 Deploying JJC Attendance Dashboard to Vercel..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "📋 Deployment Steps:"
echo "1. 🔧 Deploy Backend API first"
echo "2. 🌐 Deploy Frontend with updated API URL"
echo ""

read -p "🚀 Deploy Backend API? (y/n): " deploy_backend

if [[ $deploy_backend == "y" || $deploy_backend == "Y" ]]; then
    echo "🔧 Deploying Backend..."
    cd backend
    vercel --prod
    echo ""
    echo "📝 Backend deployed! Copy the deployment URL."
    echo "📋 Next: Update frontend/.env.production with backend URL"
    echo ""
    read -p "📝 Enter backend URL (e.g., https://your-api.vercel.app): " backend_url
    
    # Update frontend environment
    cd ../frontend
    echo "VITE_API_URL=${backend_url}/api" > .env.production
    echo "VITE_APP_TITLE=JJC Attendance Dashboard" >> .env.production
    echo "VITE_APP_VERSION=1.0.0" >> .env.production
    echo "✅ Frontend environment updated!"
    cd ..
fi

echo ""
read -p "🌐 Deploy Frontend? (y/n): " deploy_frontend

if [[ $deploy_frontend == "y" || $deploy_frontend == "Y" ]]; then
    echo "🌐 Deploying Frontend..."
    cd frontend
    vercel --prod
    echo ""
    echo "🎉 Frontend deployed!"
    cd ..
fi

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📋 Don't forget to:"
echo "1. 🔐 Update backend environment variables in Vercel dashboard"
echo "2. 🌐 Update FRONTEND_URL in backend with frontend domain"
echo "3. 🧪 Test all features on production"
echo "4. 📱 Test camera functionality (requires HTTPS)"