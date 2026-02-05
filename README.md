# PVApp 2.0 - Complete Full-Stack Application

Modern, high-performance full-stack application for multi-company materials and purchases management system, optimized for Raspberry Pi deployment.

## 📦 What's Included

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + JWT Authentication
- **Database**: SQLite (production-ready, upgradeable to PostgreSQL)
- **Documentation**: Comprehensive setup and deployment guides

## 🚀 Features

- **Multi-Company Management**: Handle multiple companies with easy switching
- **Materials Inventory**: Track materials with SKU, barcode, and stock levels
- **Purchase Orders**: Manage purchases with invoice tracking
- **Low Stock Alerts**: Automated alerts for materials below minimum stock
- **Stock Adjustments**: Easy stock adjustment with reason tracking
- **Responsive Design**: Optimized for tablets and Raspberry Pi touchscreens
- **Performance Optimized**: Code splitting, lazy loading, and caching for smooth operation

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy 2.0** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **JWT (python-jose)** - Token-based authentication
- **Bcrypt (passlib)** - Password hashing
- **SQLite/PostgreSQL** - Database options
- **Uvicorn** - ASGI server

## 📋 Prerequisites

- **Node.js 18+** and npm (for frontend)
- **Python 3.8+** and pip (for backend)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- For production: Nginx web server (optional but recommended)

## 🏗 Installation

### Quick Install (Recommended)

The easiest way to install PVApp 2.0 is using the automated installation scripts:

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
install.bat
```

Or use npm:
```bash
npm run install-app
```

The installation script will:
- ✅ Check all prerequisites
- ✅ Install frontend and backend dependencies
- ✅ Set up Python virtual environment
- ✅ Generate secure SECRET_KEY
- ✅ Initialize database with demo data
- ✅ Configure environment files

**Demo credentials:** `demo@pvapp.com` / `demo123`

For more details, see [SCRIPTS.md](SCRIPTS.md)

---

### Manual Installation

If you prefer to install manually or need more control:

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment (recommended)**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env and set SECRET_KEY (use: python -c "import secrets; print(secrets.token_hex(32))")
```

5. **Initialize database**
```bash
python init_db.py
```
This creates demo user: `demo@pvapp.com` / `demo123`

6. **Start backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to root directory**
```bash
cd ..  # or cd pvapp-frontend-v2
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. **Start development server**
```bash
npm run dev
```
Frontend will be available at `http://localhost:3000`

### Quick Start (Both Services)

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
npm run dev
```

Access the application at `http://localhost:3000` and login with:
- Email: `demo@pvapp.com`
- Password: `demo123`

## 🚀 Development

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs` (Swagger UI)
- ReDoc: `http://localhost:8000/redoc`
- Auto-reload on file changes

### Frontend Development
```bash
npm run dev
```
- App: `http://localhost:3000`
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps for debugging

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation with:
- All endpoints listed
- Request/response schemas
- Try-it-out functionality
- Authentication testing

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

## 🔄 Maintenance

### Update Application

To update dependencies and code to the latest version:

**Linux/Mac:**
```bash
./update.sh
```

**Windows:**
```cmd
update.bat
```

Or use npm:
```bash
npm run update-app
```

The update script will:
- ✅ Pull latest code from git (if available)
- ✅ Update Python and npm dependencies
- ✅ Back up database before migrations
- ✅ Run database migrations
- ✅ Rebuild production bundle

### Uninstall Application

To remove PVApp 2.0 from your system:

**Linux/Mac:**
```bash
./uninstall.sh
```

**Windows:**
```cmd
uninstall.bat
```

Or use npm:
```bash
npm run uninstall-app
```

Options:
- Remove everything (with optional database backup)
- Remove only frontend or backend
- Remove only dependencies (keep source code)

**Note:** Database is automatically backed up before removal.

For detailed information about installation, update, and uninstall scripts, see [SCRIPTS.md](SCRIPTS.md)

---

## 🥧 Deployment on Raspberry Pi

### 1. Build Applications

**Backend:**
```bash
cd backend
# Backend doesn't need building, but ensure requirements are installed
pip install -r requirements.txt
python init_db.py  # If first time
```

**Frontend:**
```bash
cd ..  # or root directory
npm run build
```

### 2. Install System Dependencies
```bash
sudo apt update
sudo apt install nginx python3-venv supervisor
```

### 3. Setup Backend Service

Create systemd service `/etc/systemd/system/pvapp-backend.service`:
```ini
[Unit]
Description=PVApp Backend API
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/pvapp-frontend-v2/backend
Environment="PATH=/home/pi/pvapp-frontend-v2/backend/venv/bin"
ExecStart=/home/pi/pvapp-frontend-v2/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable pvapp-backend
sudo systemctl start pvapp-backend
sudo systemctl status pvapp-backend
```

### 4. Configure Nginx

Create configuration file `/etc/nginx/sites-available/pvapp`:
```nginx
server {
    listen 80;
    server_name localhost;
    
    # Frontend - Serve static files
    root /home/pi/pvapp-frontend-v2/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Direct backend access (optional, for debugging)
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host $host;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. Deploy Files
```bash
# Frontend (if not already there)
sudo mkdir -p /home/pi/pvapp-frontend-v2
# Copy or clone your repo to /home/pi/pvapp-frontend-v2

# Set permissions
sudo chown -R pi:pi /home/pi/pvapp-frontend-v2
```

### 6. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/pvapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 7. Update Frontend API URL

Update `backend/.env` for production:
```env
# Use your Raspberry Pi's IP or domain
CORS_ORIGINS=http://192.168.1.100,http://raspberrypi.local
```

Rebuild frontend with production API URL:
```env
# frontend/.env
VITE_API_BASE_URL=http://raspberrypi.local/api
```

### 8. Verify Deployment
```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost/

# Check from another device
curl http://raspberrypi.local/
```

## 📁 Project Structure

```
pvapp-frontend-v2/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # FastAPI app & CORS setup
│   │   ├── database.py     # SQLAlchemy configuration
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # JWT utilities
│   │   ├── dependencies.py # FastAPI dependencies
│   │   └── routers/
│   │       ├── auth.py     # Authentication endpoints
│   │       ├── companies.py # Companies CRUD
│   │       ├── materials.py # Materials + Stock
│   │       └── purchases.py # Purchases + Items
│   ├── init_db.py          # Database initialization
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment config (not in git)
│   └── README.md           # Backend documentation
│
├── src/                     # React Frontend
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard-specific
│   │   ├── companies/     # Company management
│   │   ├── materials/     # Materials management
│   │   ├── purchases/     # Purchase management
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── store/             # Zustand state stores
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
│
├── dist/                   # Production build (generated)
├── README.md              # This file
└── package.json           # Frontend dependencies
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

### Backend API Endpoints

**Authentication** (`/auth/`)
```
POST   /auth/login              - Login with email/password
POST   /auth/register           - Register new user
GET    /auth/me                 - Get current user profile
PUT    /auth/me                 - Update user profile
POST   /auth/change-password    - Change password
POST   /auth/logout             - Logout
```

**Companies** (`/companies/`)
```
GET    /companies/              - List all companies (with search)
GET    /companies/{id}          - Get single company
POST   /companies/              - Create company
PUT    /companies/{id}          - Update company
DELETE /companies/{id}          - Delete company
```

**Materials** (`/materials/`)
```
GET    /materials/              - List materials (filter by company_id, search)
GET    /materials/{id}          - Get single material
POST   /materials/              - Create material
PUT    /materials/{id}          - Update material
DELETE /materials/{id}          - Delete material
POST   /materials/{id}/stock/adjust - Adjust stock
GET    /materials/{id}/movements    - Get stock history
GET    /materials/company/{id}/low-stock - Get low stock items
```

**Purchases** (`/purchases/`)
```
GET    /purchases/              - List purchases (filter, search)
GET    /purchases/{id}          - Get single purchase
POST   /purchases/              - Create purchase
PUT    /purchases/{id}          - Update purchase
DELETE /purchases/{id}          - Delete purchase
GET    /purchases/{id}/items    - Get purchase items
POST   /purchases/{id}/items    - Add item to purchase
PUT    /purchases/{id}/items/{item_id} - Update item
DELETE /purchases/{id}/items/{item_id} - Delete item
```

### Frontend Service Layer
All API calls go through service modules:
- `authService.js` - Authentication operations
- `companiesService.js` - Company CRUD operations
- `materialsService.js` - Materials and stock management
- `purchasesService.js` - Purchase order management

Each service uses Axios with automatic:
- JWT token injection
- Error handling
- Auto-logout on 401
- Request/response transformation

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

### Backend Issues

**Database Locked**
```bash
# Stop all backend processes
ps aux | grep uvicorn
kill <PID>
# Restart backend
cd backend && uvicorn app.main:app --reload
```

**Import Errors**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Port Already in Use**
```bash
# Find process on port 8000
lsof -i :8000
kill <PID>
# Or use different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**API Connection Issues**
- Verify backend is running on configured URL
- Check CORS settings in `backend/app/main.py`
- Verify VITE_API_BASE_URL in `.env`
- Check browser console for errors

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Raspberry Pi Specific

**Performance Issues**
- Use production build, not development server
- Enable Nginx gzip compression
- Increase Node.js memory: `export NODE_OPTIONS="--max-old-space-size=2048"`
- Use PM2 for backend process management

**Low Memory**
```bash
# Increase swap space
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

## 🔒 Security

### Backend Security
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ CORS configuration for allowed origins
- ✅ Input validation with Pydantic
- ✅ Secure SECRET_KEY (change in production!)
- ✅ Environment variable configuration
- ✅ Token expiration (30 days default)

### Production Security Checklist
- [ ] Generate new SECRET_KEY: `python -c "import secrets; print(secrets.token_hex(32))"`
- [ ] Update CORS origins to production domain
- [ ] Use HTTPS with SSL certificate
- [ ] Set DEBUG=False in production
- [ ] Use PostgreSQL instead of SQLite (optional)
- [ ] Regular dependency updates
- [ ] Implement rate limiting
- [ ] Set up database backups
- [ ] Monitor logs for suspicious activity
- [ ] Use firewall rules (ufw on Ubuntu/Raspbian)

### Environment Variables Security
```bash
# Never commit .env files to git
# Backend .env should have:
SECRET_KEY=<64-char-hex-string>  # Generate new one!
DATABASE_URL=sqlite:///./pvapp.db
DEBUG=False  # In production

# Frontend .env should have:
VITE_API_BASE_URL=https://your-domain.com/api
```

## 🎯 Best Practices

### Application Usage
- Always select a company before managing materials/purchases
- Use stock adjustment feature for inventory changes
- Set minimum stock levels to receive low stock alerts
- Regularly backup database file (`backend/pvapp.db`)
- Review API documentation at `/docs` endpoint

### Development
- Keep dependencies updated: `pip install -U -r requirements.txt` and `npm update`
- Test backend with Swagger UI before frontend integration
- Use environment variables for configuration
- Follow REST API conventions
- Write descriptive commit messages

### Deployment
- Always use production build for frontend
- Use systemd or supervisor for backend process management
- Enable Nginx gzip compression
- Set up log rotation
- Monitor disk space (SQLite database can grow)
- Regular security updates: `sudo apt update && sudo apt upgrade`

## 📄 License

[Your License Here]

## 👥 Support

For issues and questions:
- Check documentation
- Review backend API logs
- Check browser console for errors
- Verify environment variables

## 🚀 Future Enhancements

- [ ] PDF export for purchases and invoices
- [ ] Barcode scanning with camera
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Advanced reporting and analytics
- [ ] Email notifications for low stock
- [ ] Mobile apps (React Native)
- [ ] Batch operations (bulk stock adjustments)
- [ ] Export to Excel/CSV
- [ ] Role-based access control (RBAC)
- [ ] Audit logs
- [ ] Backup/restore utilities

---

## 📚 Additional Resources

- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) (when running)
- **Backend README**: [backend/README.md](backend/README.md)
- **FastAPI Documentation**: [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **React Documentation**: [https://react.dev](https://react.dev)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

---

**Built with ❤️ for efficient materials management**

**Demo Credentials:**
- Email: `demo@pvapp.com`
- Password: `demo123`
