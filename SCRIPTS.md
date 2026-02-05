# PVApp 2.0 - Installation & Management Scripts

This document describes the installation, uninstallation, and update scripts for PVApp 2.0.

## 📦 Available Scripts

### Installation Scripts
- **Linux/Mac**: `install.sh`
- **Windows**: `install.bat`

### Uninstallation Scripts
- **Linux/Mac**: `uninstall.sh`
- **Windows**: `uninstall.bat`

### Update Scripts
- **Linux/Mac**: `update.sh`
- **Windows**: `update.bat`

---

## 🚀 Installation

### Linux/Mac Installation

```bash
# Make script executable (first time only)
chmod +x install.sh

# Run installation
./install.sh
```

Or use npm:
```bash
npm run install-app
```

### Windows Installation

```cmd
install.bat
```

### Installation Options

The installation script will prompt you to choose:

1. **Full installation** (Frontend + Backend) - Default
   - Installs both components
   - Sets up virtual environment for Python
   - Initializes database with demo data
   - Configures environment files

2. **Frontend only**
   - Installs Node.js dependencies
   - Sets up frontend environment

3. **Backend only**
   - Creates Python virtual environment
   - Installs Python dependencies
   - Initializes database
   - Generates SECRET_KEY

### What the Install Script Does

#### Backend Installation:
- ✅ Creates Python virtual environment (`backend/venv`)
- ✅ Upgrades pip to latest version
- ✅ Installs Python dependencies from `requirements.txt`
- ✅ Creates `.env` file with auto-generated SECRET_KEY
- ✅ Initializes SQLite database with demo data
- ✅ Creates demo user: `demo@pvapp.com` / `demo123`

#### Frontend Installation:
- ✅ Installs npm dependencies
- ✅ Creates frontend `.env` file
- ✅ Optionally builds production bundle

---

## 🗑️ Uninstallation

### Linux/Mac Uninstallation

```bash
./uninstall.sh
```

Or use npm:
```bash
npm run uninstall-app
```

### Windows Uninstallation

```cmd
uninstall.bat
```

### Uninstallation Options

1. **Everything** (Frontend + Backend + Dependencies) - Default
   - Removes all installed components
   - Can optionally preserve database and config files

2. **Frontend only**
   - Removes node_modules and frontend build

3. **Backend only**
   - Removes virtual environment
   - Can optionally preserve database

4. **Dependencies only**
   - Removes dependencies but keeps source code

### Data Preservation

When uninstalling backend, you'll be asked:
- **Keep database?** - Database is backed up before removal
- **Keep configuration?** - `.env` files can be preserved

Backups are automatically created with timestamp:
- `pvapp.db.backup.YYYYMMDD_HHMMSS`

---

## 🔄 Update

### Linux/Mac Update

```bash
./update.sh
```

Or use npm:
```bash
npm run update-app
```

### Windows Update

```cmd
update.bat
```

### Update Options

1. **Everything** (Frontend + Backend + Database) - Default
   - Updates all dependencies
   - Backs up database before migrations
   - Runs database migrations if available

2. **Frontend only**
   - Updates npm packages
   - Rebuilds production bundle if exists

3. **Backend only**
   - Updates Python packages
   - Runs database migrations

4. **Dependencies only**
   - Updates packages without database changes

### What the Update Script Does

#### Git Integration:
- ✅ Checks for code updates from git repository
- ✅ Optionally pulls latest changes

#### Backend Update:
- ✅ Activates virtual environment
- ✅ Upgrades pip
- ✅ Updates Python dependencies
- ✅ Backs up database before migrations
- ✅ Runs migration script if available
- ✅ Shows outdated packages

#### Frontend Update:
- ✅ Updates npm packages
- ✅ Rebuilds production bundle if exists
- ✅ Shows outdated packages

---

## 📋 Prerequisites

Before running installation:

### Required:
- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Git** (optional, for updates)

### Optional:
- **Virtual environment tools** (included in Python 3.3+)
- **Build tools** for native dependencies

---

## 🔧 Usage Examples

### Fresh Installation

```bash
# Clone repository
git clone <repository-url>
cd pvapp-frontend-v2

# Install everything
./install.sh
# Choose option 1 (Full installation)

# Start backend
cd backend
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start frontend (in new terminal)
npm run dev
```

### Update After Git Pull

```bash
# Pull latest code
git pull origin main

# Update dependencies
./update.sh
# Choose option 1 (Everything)

# Restart servers
```

### Clean Uninstall

```bash
# Remove everything
./uninstall.sh
# Choose option 1 (Everything)
# Choose 'n' to remove database (it will be backed up)
```

### Partial Uninstall

```bash
# Remove only dependencies (keep source and data)
./uninstall.sh
# Choose option 4 (Dependencies only)

# Reinstall later with:
./install.sh
```

---

## 🐛 Troubleshooting

### Script Permission Denied (Linux/Mac)

```bash
chmod +x install.sh uninstall.sh update.sh
```

### Python Not Found

Install Python 3.8+:
- **Linux**: `sudo apt install python3 python3-pip`
- **Mac**: `brew install python3`
- **Windows**: Download from [python.org](https://www.python.org/)

### Node.js Not Found

Install Node.js 18+:
- **Linux**: Use [nvm](https://github.com/nvm-sh/nvm) or package manager
- **Mac**: `brew install node`
- **Windows**: Download from [nodejs.org](https://nodejs.org/)

### Virtual Environment Issues

```bash
# Remove and recreate
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Database Initialization Failed

```bash
cd backend
source venv/bin/activate

# Check for errors
python init_db.py

# If database is corrupted, remove and recreate
rm pvapp.db
python init_db.py
```

### Port Already in Use

Backend (8000):
```bash
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Frontend (3000):
```bash
# Use alternative port
npm run dev -- --port 3001
```

---

## 📝 Script Features

### Color-Coded Output
- 🔵 **INFO**: Information messages
- 🟢 **SUCCESS**: Successful operations
- 🟡 **WARNING**: Warnings
- 🔴 **ERROR**: Error messages

### Safety Features
- **Automatic backups** before destructive operations
- **Confirmation prompts** for critical actions
- **Root user warnings** (Linux/Mac)
- **Prerequisite checks** before installation

### Cross-Platform Support
- **Shell scripts** (.sh) for Linux/Mac
- **Batch files** (.bat) for Windows
- **Consistent behavior** across platforms

---

## 🔐 Security Considerations

### SECRET_KEY Generation
The install script automatically generates a secure SECRET_KEY for JWT authentication:
- 32-byte random hex string
- Cryptographically secure
- Stored in `backend/.env`

### Database Security
- Database files are backed up before any destructive operation
- Backups include timestamp for version tracking
- Sensitive data protected by file system permissions

### Environment Files
- Never commit `.env` files to version control
- Template provided in `.env.example`
- Unique keys generated per installation

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error messages carefully
3. Check the main `README.md`
4. Look at backend `README.md` for API-specific issues

---

## 🎯 Quick Reference

| Task | Linux/Mac | Windows |
|------|-----------|---------|
| Install | `./install.sh` | `install.bat` |
| Update | `./update.sh` | `update.bat` |
| Uninstall | `./uninstall.sh` | `uninstall.bat` |
| Install via npm | `npm run install-app` | N/A |
| Update via npm | `npm run update-app` | N/A |
| Uninstall via npm | `npm run uninstall-app` | N/A |

---

**Last Updated**: February 2026  
**Version**: 2.0.0
