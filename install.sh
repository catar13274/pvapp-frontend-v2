#!/bin/bash

################################################################################
# PVApp 2.0 - Installation Script
# 
# This script installs both the frontend and backend components of PVApp 2.0
# Optimized for Raspberry Pi and Linux environments
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}$1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then 
    print_warning "Running as root is not recommended. Consider running as a regular user."
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_header "🚀 PVApp 2.0 Installation"

# Check prerequisites
print_info "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    print_info "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm $(npm -v) detected"

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 8 ]); then
    print_error "Python 3.8 or higher is required. Current version: $PYTHON_VERSION"
    exit 1
fi
print_success "Python $PYTHON_VERSION detected"

# Check pip
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 is not installed. Please install pip3 first."
    exit 1
fi
print_success "pip3 detected"

print_success "All prerequisites satisfied!"
echo ""

# Ask for installation mode
echo "Select installation mode:"
echo "1) Full installation (Frontend + Backend)"
echo "2) Frontend only"
echo "3) Backend only"
read -p "Enter your choice (1-3) [1]: " INSTALL_MODE
INSTALL_MODE=${INSTALL_MODE:-1}

# Get current directory
PROJECT_DIR=$(pwd)

# Install Backend
if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "3" ]; then
    print_header "📦 Installing Backend"
    
    cd "$PROJECT_DIR/backend"
    
    # Check if virtual environment exists
    if [ -d "venv" ]; then
        print_warning "Virtual environment already exists. Skipping creation."
    else
        print_info "Creating Python virtual environment..."
        python3 -m venv venv
        print_success "Virtual environment created"
    fi
    
    # Activate virtual environment
    print_info "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    print_info "Upgrading pip..."
    pip install --upgrade pip --quiet
    
    # Install Python dependencies
    print_info "Installing Python dependencies..."
    pip install -r requirements.txt
    print_success "Python dependencies installed"
    
    # Setup environment file
    if [ ! -f ".env" ]; then
        print_info "Creating .env file..."
        cp .env.example .env
        
        # Generate SECRET_KEY
        SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
        
        # Update .env with generated secret key
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/your-secret-key-change-this-in-production/$SECRET_KEY/" .env
        else
            # Linux
            sed -i "s/your-secret-key-change-this-in-production/$SECRET_KEY/" .env
        fi
        
        print_success ".env file created with generated SECRET_KEY"
    else
        print_warning ".env file already exists. Skipping."
    fi
    
    # Initialize database
    if [ ! -f "pvapp.db" ]; then
        print_info "Initializing database..."
        python init_db.py
        print_success "Database initialized with demo data"
        print_info "Demo credentials: demo@pvapp.com / demo123"
    else
        print_warning "Database already exists. Skipping initialization."
        read -p "Do you want to reinitialize the database? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Backing up existing database..."
            cp pvapp.db "pvapp.db.backup.$(date +%Y%m%d_%H%M%S)"
            print_info "Reinitializing database..."
            python init_db.py
            print_success "Database reinitialized"
        fi
    fi
    
    deactivate
    
    print_success "Backend installation completed!"
    cd "$PROJECT_DIR"
fi

# Install Frontend
if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "2" ]; then
    print_header "🎨 Installing Frontend"
    
    cd "$PROJECT_DIR"
    
    # Install npm dependencies
    print_info "Installing npm dependencies..."
    npm install
    print_success "npm dependencies installed"
    
    # Setup environment file
    if [ ! -f ".env" ]; then
        print_info "Creating frontend .env file..."
        cp .env.example .env
        print_success "Frontend .env file created"
    else
        print_warning "Frontend .env file already exists. Skipping."
    fi
    
    # Build frontend for production
    read -p "Do you want to build the frontend for production? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_info "Building frontend for production..."
        npm run build
        print_success "Frontend built successfully"
    fi
    
    print_success "Frontend installation completed!"
fi

# Final summary
print_header "✅ Installation Complete!"

echo "Installation Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "3" ]; then
    echo "✓ Backend installed in: $PROJECT_DIR/backend"
    echo "  - Virtual environment: backend/venv"
    echo "  - Database: backend/pvapp.db"
    echo "  - Environment: backend/.env"
fi

if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "2" ]; then
    echo "✓ Frontend installed in: $PROJECT_DIR"
    echo "  - Dependencies: node_modules/"
    echo "  - Environment: .env"
    if [ -d "dist" ]; then
        echo "  - Production build: dist/"
    fi
fi

echo ""
echo "Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "3" ]; then
    echo "1. Start the backend:"
    echo "   cd backend"
    echo "   source venv/bin/activate"
    echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo "   → Backend API: http://localhost:8000"
    echo "   → API Docs: http://localhost:8000/docs"
    echo ""
fi

if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "2" ]; then
    echo "2. Start the frontend:"
    echo "   npm run dev"
    echo "   → Frontend: http://localhost:3000"
    echo ""
fi

if [ "$INSTALL_MODE" = "1" ] || [ "$INSTALL_MODE" = "3" ]; then
    echo "3. Login credentials:"
    echo "   Email: demo@pvapp.com"
    echo "   Password: demo123"
    echo ""
fi

echo "For more information, see README.md"
echo ""
print_success "Installation completed successfully! 🎉"
