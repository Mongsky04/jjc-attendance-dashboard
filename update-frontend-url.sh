# Script untuk update frontend setelah Railway deploy
# Ganti YOUR_RAILWAY_URL dengan URL Railway yang didapat

RAILWAY_URL="https://your-app.up.railway.app"

echo "Updating frontend environment with Railway backend URL..."
echo "VITE_API_URL=${RAILWAY_URL}/api" > frontend/.env.production
echo "VITE_APP_TITLE=JJC Attendance Dashboard" >> frontend/.env.production  
echo "VITE_APP_VERSION=1.0.0" >> frontend/.env.production

echo "Updated! Frontend will now connect to Railway backend."
echo "Next: Redeploy frontend with: cd frontend && vercel --prod"