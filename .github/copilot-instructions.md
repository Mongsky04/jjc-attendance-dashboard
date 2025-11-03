# JJC Attendance Dashboard - Copilot Instructions

## Project Overview
Modern fullstack attendance dashboard with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + REST API
- **Features**: Check-in/out, attendance data, summary reports, Excel export, dark mode

## Development Guidelines

### Code Standards
- Use **TypeScript** for all React components
- Use **Tailwind CSS** classes only - no inline styles
- Use **Framer Motion** for animations (fade, slide, hover)
- Support **dark mode** via Tailwind's `dark:` classes
- Include **loading skeleton shimmer** placeholders
- Use **Axios** with `async/await` for API calls
- Maintain **code readability** with short, composable components
- Follow **responsive design** principles (mobile-first)

### Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Full pages (Dashboard, Summary, etc.)
│   ├── api/           # Axios API clients
│   └── hooks/         # Custom hooks (dark mode, etc.)
backend/
├── src/
│   ├── controllers/   # Route handlers
│   ├── routes/        # API endpoints
│   └── models/        # Data models
```

### UI Guidelines
- Clean, neumorphic design with soft shadows and rounded corners
- Use Indonesian labels for UI context (e.g., "Kehadiran", "Rekap", "Check-in")
- Consistent component patterns and prop interfaces
- Production-ready, clean, readable code

This project follows the JJC style guide for modern fullstack development.