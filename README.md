# PVApp 2.0 - Frontend

Modern, high-performance frontend application for multi-company materials and purchases management system, optimized for Raspberry Pi deployment.

## 🚀 Features

- **Multi-Company Management**: Handle multiple companies with easy switching
- **Materials Inventory**: Track materials with SKU, barcode, and stock levels
- **Purchase Orders**: Manage purchases with invoice tracking
- **Low Stock Alerts**: Automated alerts for materials below minimum stock
- **Stock Adjustments**: Easy stock adjustment with reason tracking
- **Responsive Design**: Optimized for tablets and Raspberry Pi touchscreens
- **Performance Optimized**: Code splitting, lazy loading, and caching for smooth operation

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Backend API** running on http://localhost:8000 (or configured URL)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- For production: Nginx web server

## 🏗 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pvapp-frontend-v2
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=PVApp 2.0
VITE_COMPANY_NAME=Your Company Name
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Features
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps for debugging
- API proxy to avoid CORS issues

## 🏭 Production Build

Build for production:
```bash
npm run build
```

Preview production build locally:
```bash
npm run preview
```

The optimized build will be in the `dist/` directory.

## 🥧 Deployment on Raspberry Pi

### 1. Build the Application
```bash
npm run build
```

### 2. Install Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 3. Configure Nginx

Create configuration file `/etc/nginx/sites-available/pvapp`:
```nginx
server {
    listen 80;
    server_name localhost;
    
    root /var/www/pvapp;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (if backend is on same Pi)
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. Deploy Files
```bash
# Copy build files to web root
sudo mkdir -p /var/www/pvapp
sudo cp -r dist/* /var/www/pvapp/

# Set permissions
sudo chown -R www-data:www-data /var/www/pvapp
```

### 5. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/pvapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Auto-start on Boot
```bash
sudo systemctl enable nginx
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Button, Card, etc.)
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── companies/      # Company management components
│   ├── materials/      # Materials management components
│   ├── purchases/      # Purchase management components
│   └── layout/         # Layout components (Header, Sidebar, Footer)
├── pages/              # Page components
├── services/           # API service layer
├── store/              # Zustand state stores
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎨 UI Components

All UI components follow shadcn/ui patterns with Tailwind CSS:

- **Button** - Multiple variants (default, outline, ghost, destructive)
- **Card** - Container with header, body, footer sections
- **Input/Textarea** - Form inputs with error states
- **Select** - Dropdown select component
- **Dialog** - Modal dialogs
- **Table** - Responsive data tables
- **Badge** - Status indicators
- **Alert** - Notification messages
- **Toast** - Temporary notifications
- **Avatar** - User avatars with fallback
- **Tabs** - Tab navigation
- **Loading** - Spinners and skeletons

## 🔐 Authentication

The app uses JWT token-based authentication:

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor automatically adds token to requests
5. Auto-logout on 401 responses

## 🗄 State Management

### Zustand Stores
- **authStore** - User authentication state
- **companyStore** - Selected company and companies list

### React Query
- Handles all server state
- Automatic caching and refetching
- Optimistic updates
- Background refetching

## 🌐 API Integration

All API calls go through service layer:
- `authService` - Authentication operations
- `companiesService` - Company CRUD operations
- `materialsService` - Materials and stock management
- `purchasesService` - Purchase order management

### API Endpoints
```
POST   /auth/login              - Login
POST   /auth/register           - Register
GET    /companies/              - List companies
POST   /companies/              - Create company
PUT    /companies/{id}          - Update company
DELETE /companies/{id}          - Delete company
GET    /materials/              - List materials
POST   /materials/              - Create material
POST   /materials/{id}/stock/adjust - Adjust stock
GET    /purchases/              - List purchases
POST   /purchases/              - Create purchase
```

## ⚡ Performance Optimizations

### Raspberry Pi Specific
- **Code Splitting**: Routes loaded on-demand
- **Lazy Loading**: Components loaded when needed
- **Tree Shaking**: Unused code eliminated
- **Minification**: Terser with console.log removal
- **Gzip Compression**: Reduced file sizes
- **Image Optimization**: WebP format recommended
- **Debounced Inputs**: Search inputs debounced by 300ms
- **Memoization**: React.memo, useMemo, useCallback used
- **Query Caching**: 5-minute stale time, 10-minute cache time

### Build Optimizations
```javascript
// vite.config.js includes:
- Manual chunking for vendor libraries
- Terser minification
- CSS code splitting
- Asset optimization
```

## 🧪 Testing

Run linter:
```bash
npm run lint
```

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running on configured URL
- Check CORS settings on backend
- Verify network connectivity

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Raspberry Pi Performance
- Increase Node.js memory: `export NODE_OPTIONS="--max-old-space-size=2048"`
- Use production build, not development server
- Enable Nginx gzip compression
- Consider using PM2 for backend process management

### Low Memory Issues
```bash
# Increase swap space on Raspberry Pi
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Set CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

## 📱 Mobile/Tablet Support

- Touch-friendly UI (44px minimum touch targets)
- Responsive breakpoints (mobile, tablet, desktop)
- Collapsible sidebar on mobile
- Mobile-optimized forms

## 🎯 Best Practices

- Always select a company before managing materials/purchases
- Use stock adjustment feature for inventory changes
- Set minimum stock levels to receive low stock alerts
- Regularly backup data
- Keep Node.js and dependencies updated

## 🔄 Updates

To update dependencies:
```bash
npm update
npm outdated  # Check for major updates
```

## 📄 License

[Your License Here]

## 👥 Support

For issues and questions:
- Check documentation
- Review backend API logs
- Check browser console for errors
- Verify environment variables

## 🚀 Future Enhancements

- [ ] PDF export for purchases
- [ ] Barcode scanning
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Mobile apps (React Native)

---

**Built with ❤️ for efficient materials management**
