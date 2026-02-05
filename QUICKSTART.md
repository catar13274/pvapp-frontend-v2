# CoApp 2.0 - Quick Start Guide

## 🚀 Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

Visit http://localhost:3000

## 📦 Production Deployment

```bash
# 1. Build for production
npm run build

# 2. Test production build locally
npm run preview

# 3. Deploy dist/ folder to your web server
```

## 🔑 Default Configuration

The app connects to backend at: `http://localhost:8001`

To change this, edit `.env`:
```env
VITE_API_BASE_URL=http://your-backend-url:8001
```

## 📱 First Time Usage

1. **Register an account** at `/register`
2. **Login** at `/login`
3. **Create a company** in Companies page
4. **Select the company** from header dropdown
5. **Add materials** in Materials page
6. **Create purchases** in Purchases page

## 🎯 Key Features

### Dashboard
- View total materials, low stock alerts
- Quick action buttons
- Recent activity feed

### Companies
- Create, edit, delete companies
- Search and filter
- Company selector in header

### Materials
- Add/edit materials with SKU and barcode
- Track stock levels
- Adjust stock with reason
- Low stock indicators

### Purchases
- Create purchase orders
- Track invoice numbers
- Manage purchase status
- View purchase history

## 🛠 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📊 Project Stats

- **50+ Components** - Fully reusable UI components
- **4 Major Pages** - Dashboard, Companies, Materials, Purchases
- **384KB Build** - Optimized for Raspberry Pi
- **Code Splitting** - Lazy loaded routes for performance
- **React Query** - Efficient data caching and fetching

## 🎨 Tech Highlights

- **Modern Stack**: React 18 + Vite + Tailwind CSS
- **State Management**: Zustand + React Query
- **Authentication**: JWT with auto-refresh
- **API Integration**: Axios with interceptors
- **Responsive**: Mobile, tablet, desktop
- **Performance**: Optimized for Raspberry Pi

## 🐛 Troubleshooting

### Backend Connection Error
```bash
# Check if backend is running
curl http://localhost:8001/docs
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001  # Change this
}
```

## 📚 Learn More

- Full documentation in [README.md](README.md)
- API endpoints documented in README
- Component examples in `src/components/`
- Page examples in `src/pages/`

## ✅ Checklist Before Production

- [ ] Build passes: `npm run build`
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] CORS configured on backend
- [ ] Nginx/web server configured
- [ ] SSL certificate (for HTTPS)
- [ ] Monitoring setup
- [ ] Backup strategy

---

**Happy coding! 🚀**
