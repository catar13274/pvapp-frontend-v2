#!/bin/bash

################################################################################
# CoApp 2.0 - Update Script
# 
# This script updates the CoApp 2.0 installation with latest dependencies
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
    echo -e "${BLUE}$1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

print_header "🔄 CoApp 2.0 Update"

# Get current directory
PROJECT_DIR=$(pwd)

# Ask what to update
echo "What would you like to update?"
echo "1) Everything (Frontend + Backend + Database)"
echo "2) Frontend only"
echo "3) Backend only"
echo "4) Dependencies only (no database migration)"
read -p "Enter your choice (1-4) [1]: " UPDATE_MODE
UPDATE_MODE=${UPDATE_MODE:-1}

echo ""

# Check if git is available for version check
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        print_info "Checking for updates from git..."
        
        # Fetch latest changes
        git fetch origin 2>/dev/null || print_warning "Could not fetch from git repository"
        
        # Check if there are updates
        LOCAL=$(git rev-parse @ 2>/dev/null)
        REMOTE=$(git rev-parse @{u} 2>/dev/null)
        
        if [ "$LOCAL" != "$REMOTE" ]; then
            print_warning "Updates available in git repository!"
            read -p "Do you want to pull the latest changes? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                print_info "Pulling latest changes..."
                git pull origin $(git branch --show-current)
                print_success "Code updated from repository"
            fi
        else
            print_info "Code is up to date"
        fi
    fi
fi

# Update Backend
if [ "$UPDATE_MODE" = "1" ] || [ "$UPDATE_MODE" = "3" ] || [ "$UPDATE_MODE" = "4" ]; then
    print_header "📦 Updating Backend"
    
    cd "$PROJECT_DIR/backend"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_error "Virtual environment not found. Please run install.sh first."
        exit 1
    fi
    
    # Activate virtual environment
    print_info "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    print_info "Upgrading pip..."
    pip install --upgrade pip --quiet
    
    # Update Python dependencies
    print_info "Updating Python dependencies..."
    pip install --upgrade -r requirements.txt
    print_success "Python dependencies updated"
    
    # Check for database migrations
    if [ "$UPDATE_MODE" = "1" ]; then
        print_info "Checking database..."
        
        if [ -f "pvapp.db" ]; then
            # Backup database
            BACKUP_NAME="pvapp.db.backup.$(date +%Y%m%d_%H%M%S)"
            print_info "Creating database backup: $BACKUP_NAME"
            cp pvapp.db "$BACKUP_NAME"
            print_success "Database backed up"
            
            # Run migrations (if migration script exists)
            if [ -f "migrate_db.py" ]; then
                print_info "Running database migrations..."
                python migrate_db.py
                print_success "Database migrations completed"
            else
                print_warning "No migration script found. Database structure unchanged."
            fi
        else
            print_warning "Database not found. Run 'python init_db.py' to create it."
        fi
    fi
    
    deactivate
    
    print_success "Backend update completed!"
    cd "$PROJECT_DIR"
fi

# Update Frontend
if [ "$UPDATE_MODE" = "1" ] || [ "$UPDATE_MODE" = "2" ] || [ "$UPDATE_MODE" = "4" ]; then
    print_header "🎨 Updating Frontend"
    
    cd "$PROJECT_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found. Please run install.sh first."
        exit 1
    fi
    
    # Update npm dependencies
    print_info "Updating npm dependencies..."
    npm update
    print_success "npm dependencies updated"
    
    # Rebuild if dist exists
    if [ -d "dist" ]; then
        print_info "Production build exists. Rebuilding..."
        npm run build
        print_success "Frontend rebuilt successfully"
    fi
    
    print_success "Frontend update completed!"
fi

# Show outdated packages
print_header "📊 Package Status"

if [ "$UPDATE_MODE" = "1" ] || [ "$UPDATE_MODE" = "3" ] || [ "$UPDATE_MODE" = "4" ]; then
    cd "$PROJECT_DIR/backend"
    
    if [ -d "venv" ]; then
        print_info "Checking for outdated Python packages..."
        source venv/bin/activate
        
        OUTDATED=$(pip list --outdated 2>/dev/null)
        if [ -n "$OUTDATED" ]; then
            echo "$OUTDATED"
        else
            print_success "All Python packages are up to date!"
        fi
        
        deactivate
    fi
    
    cd "$PROJECT_DIR"
fi

if [ "$UPDATE_MODE" = "1" ] || [ "$UPDATE_MODE" = "2" ] || [ "$UPDATE_MODE" = "4" ]; then
    cd "$PROJECT_DIR"
    
    print_info "Checking for outdated npm packages..."
    
    OUTDATED=$(npm outdated 2>/dev/null || true)
    if [ -n "$OUTDATED" ]; then
        echo "$OUTDATED"
    else
        print_success "All npm packages are up to date!"
    fi
fi

# Final summary
print_header "✅ Update Complete!"

echo "Update Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$UPDATE_MODE" = "1" ] || [ "$UPDATE_MODE" = "3" ] || [ "$UPDATE_MODE" = "4" ]; then
    echo "✓ Backend dependencies updated"
    if [ "$UPDATE_MODE" = "1" ]; then
        echo "  - Database backed up"
        if [ -f "backend/migrate_db.py" ]; then
            echo "  - Database migrations applied"
        fi
    fi
fi

if [ "$UPDATE_MODE" = "1" ] || [ "$UPDATE_MODE" = "2" ] || [ "$UPDATE_MODE" = "4" ]; then
    echo "✓ Frontend dependencies updated"
    if [ -d "dist" ]; then
        echo "  - Production build updated"
    fi
fi

if ls backend/pvapp.db.backup.* 1> /dev/null 2>&1; then
    echo ""
    echo "💾 Database backups available in backend/ directory"
fi

echo ""
echo "Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Restart the backend server if running"
echo "2. Restart the frontend development server if running"
echo "3. Clear browser cache if you experience issues"
echo ""
print_success "Update completed successfully! 🎉"
