#!/bin/bash

################################################################################
# PVApp 2.0 - Uninstallation Script
# 
# This script removes the PVApp 2.0 installation
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
    echo -e "${YELLOW}$1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

print_header "🗑️  PVApp 2.0 Uninstallation"

print_warning "This will remove PVApp 2.0 and its dependencies."
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Uninstallation cancelled."
    exit 0
fi

# Get current directory
PROJECT_DIR=$(pwd)

# Ask what to uninstall
echo ""
echo "What would you like to uninstall?"
echo "1) Everything (Frontend + Backend + Dependencies)"
echo "2) Frontend only"
echo "3) Backend only"
echo "4) Dependencies only (keep source code)"
read -p "Enter your choice (1-4) [1]: " UNINSTALL_MODE
UNINSTALL_MODE=${UNINSTALL_MODE:-1}

# Ask about data preservation
KEEP_DATA=false
if [ "$UNINSTALL_MODE" = "1" ] || [ "$UNINSTALL_MODE" = "3" ]; then
    echo ""
    read -p "Do you want to keep the database and configuration files? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        KEEP_DATA=true
        print_info "Database and configuration will be preserved"
    fi
fi

echo ""

# Uninstall Backend
if [ "$UNINSTALL_MODE" = "1" ] || [ "$UNINSTALL_MODE" = "3" ] || [ "$UNINSTALL_MODE" = "4" ]; then
    print_header "📦 Uninstalling Backend"
    
    cd "$PROJECT_DIR/backend"
    
    # Remove virtual environment
    if [ -d "venv" ]; then
        print_info "Removing Python virtual environment..."
        rm -rf venv
        print_success "Virtual environment removed"
    else
        print_info "Virtual environment not found. Skipping."
    fi
    
    # Remove Python cache
    if [ -d "__pycache__" ]; then
        print_info "Removing Python cache..."
        find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
        find . -type f -name "*.pyc" -delete 2>/dev/null || true
        print_success "Python cache removed"
    fi
    
    # Remove database and env files if requested
    if [ "$KEEP_DATA" = false ]; then
        if [ -f "pvapp.db" ]; then
            print_info "Backing up database..."
            BACKUP_NAME="pvapp.db.backup.$(date +%Y%m%d_%H%M%S)"
            cp pvapp.db "$BACKUP_NAME"
            print_success "Database backed up to: $BACKUP_NAME"
            
            print_info "Removing database..."
            rm -f pvapp.db
            print_success "Database removed"
        fi
        
        if [ -f ".env" ]; then
            print_info "Removing backend .env file..."
            rm -f .env
            print_success "Backend .env file removed"
        fi
    else
        print_info "Keeping database and configuration files"
    fi
    
    cd "$PROJECT_DIR"
fi

# Uninstall Frontend
if [ "$UNINSTALL_MODE" = "1" ] || [ "$UNINSTALL_MODE" = "2" ] || [ "$UNINSTALL_MODE" = "4" ]; then
    print_header "🎨 Uninstalling Frontend"
    
    cd "$PROJECT_DIR"
    
    # Remove node_modules
    if [ -d "node_modules" ]; then
        print_info "Removing node_modules..."
        rm -rf node_modules
        print_success "node_modules removed"
    else
        print_info "node_modules not found. Skipping."
    fi
    
    # Remove package-lock.json
    if [ -f "package-lock.json" ]; then
        print_info "Removing package-lock.json..."
        rm -f package-lock.json
        print_success "package-lock.json removed"
    fi
    
    # Remove dist folder
    if [ -d "dist" ]; then
        print_info "Removing production build..."
        rm -rf dist
        print_success "Production build removed"
    fi
    
    # Remove .env file if not keeping data
    if [ "$KEEP_DATA" = false ]; then
        if [ -f ".env" ]; then
            print_info "Removing frontend .env file..."
            rm -f .env
            print_success "Frontend .env file removed"
        fi
    else
        print_info "Keeping frontend configuration files"
    fi
fi

# Final summary
print_header "✅ Uninstallation Complete!"

echo "Uninstallation Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$UNINSTALL_MODE" = "1" ] || [ "$UNINSTALL_MODE" = "3" ] || [ "$UNINSTALL_MODE" = "4" ]; then
    echo "✓ Backend dependencies removed"
    if [ "$KEEP_DATA" = false ]; then
        echo "  - Database backed up and removed"
        echo "  - Configuration files removed"
    else
        echo "  - Database and configuration preserved"
    fi
fi

if [ "$UNINSTALL_MODE" = "1" ] || [ "$UNINSTALL_MODE" = "2" ] || [ "$UNINSTALL_MODE" = "4" ]; then
    echo "✓ Frontend dependencies removed"
    if [ "$KEEP_DATA" = false ]; then
        echo "  - Configuration files removed"
    else
        echo "  - Configuration preserved"
    fi
fi

echo ""

if [ "$KEEP_DATA" = true ]; then
    echo "💾 Preserved files:"
    if [ -f "backend/pvapp.db" ]; then
        echo "  - backend/pvapp.db"
    fi
    if [ -f "backend/.env" ]; then
        echo "  - backend/.env"
    fi
    if [ -f ".env" ]; then
        echo "  - .env"
    fi
    echo ""
    echo "To reinstall, run: ./install.sh"
fi

if ls backend/pvapp.db.backup.* 1> /dev/null 2>&1; then
    echo ""
    echo "📦 Database backups available in backend/ directory"
fi

echo ""
print_success "Uninstallation completed! 👋"
