@echo off
REM ############################################################################
REM CoApp 2.0 - Update Script (Windows)
REM 
REM This script updates the CoApp 2.0 installation with latest dependencies
REM ############################################################################

setlocal enabledelayedexpansion

echo.
echo ================================================================
echo    CoApp 2.0 Update (Windows)
echo ================================================================
echo.

set PROJECT_DIR=%CD%

echo What would you like to update?
echo 1^) Everything ^(Frontend + Backend + Database^)
echo 2^) Frontend only
echo 3^) Backend only
echo 4^) Dependencies only ^(no database migration^)
set /p UPDATE_MODE="Enter your choice (1-4) [1]: "
if "!UPDATE_MODE!"=="" set UPDATE_MODE=1

echo.

REM Check if git is available
where git >nul 2>&1
if %errorlevel% equ 0 (
    if exist ".git" (
        echo [INFO] Checking for updates from git...
        git fetch origin 2>nul
        
        REM Note: Checking for updates in batch is complex, so we just notify
        echo [INFO] Run 'git status' to check for updates
        echo.
        set /p PULL="Do you want to pull the latest changes? (y/N): "
        if /i "!PULL!"=="y" (
            echo [INFO] Pulling latest changes...
            git pull
            echo [SUCCESS] Code updated from repository
            echo.
        )
    )
)

REM Update Backend
if "!UPDATE_MODE!"=="1" goto update_backend
if "!UPDATE_MODE!"=="3" goto update_backend
if "!UPDATE_MODE!"=="4" goto update_backend
goto check_frontend_update

:update_backend
echo.
echo ================================================================
echo    Updating Backend
echo ================================================================
echo.

cd "%PROJECT_DIR%\backend"

REM Check if virtual environment exists
if not exist "venv" (
    echo [ERROR] Virtual environment not found. Please run install.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip --quiet

REM Update Python dependencies
echo [INFO] Updating Python dependencies...
pip install --upgrade -r requirements.txt
echo [SUCCESS] Python dependencies updated

REM Check for database migrations
if "!UPDATE_MODE!"=="1" (
    echo [INFO] Checking database...
    
    if exist "pvapp.db" (
        REM Backup database
        set BACKUP_NAME=pvapp.db.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
        echo [INFO] Creating database backup: !BACKUP_NAME!
        copy pvapp.db "!BACKUP_NAME!"
        echo [SUCCESS] Database backed up
        
        REM Run migrations if script exists
        if exist "migrate_db.py" (
            echo [INFO] Running database migrations...
            python migrate_db.py
            echo [SUCCESS] Database migrations completed
        ) else (
            echo [WARNING] No migration script found. Database structure unchanged.
        )
    ) else (
        echo [WARNING] Database not found. Run 'python init_db.py' to create it.
    )
)

call deactivate

echo [SUCCESS] Backend update completed!
cd "%PROJECT_DIR%"

:check_frontend_update
REM Update Frontend
if "!UPDATE_MODE!"=="1" goto update_frontend
if "!UPDATE_MODE!"=="2" goto update_frontend
if "!UPDATE_MODE!"=="4" goto update_frontend
goto update_complete

:update_frontend
echo.
echo ================================================================
echo    Updating Frontend
echo ================================================================
echo.

cd "%PROJECT_DIR%"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] node_modules not found. Please run install.bat first.
    pause
    exit /b 1
)

REM Update npm dependencies
echo [INFO] Updating npm dependencies...
call npm update
echo [SUCCESS] npm dependencies updated

REM Rebuild if dist exists
if exist "dist" (
    echo [INFO] Production build exists. Rebuilding...
    call npm run build
    echo [SUCCESS] Frontend rebuilt successfully
)

echo [SUCCESS] Frontend update completed!

:update_complete
echo.
echo ================================================================
echo    Package Status
echo ================================================================
echo.

if "!UPDATE_MODE!"=="1" goto check_backend_packages
if "!UPDATE_MODE!"=="3" goto check_backend_packages
if "!UPDATE_MODE!"=="4" goto check_backend_packages
goto check_frontend_packages

:check_backend_packages
cd "%PROJECT_DIR%\backend"

if exist "venv" (
    echo [INFO] Checking for outdated Python packages...
    call venv\Scripts\activate.bat
    
    pip list --outdated
    
    call deactivate
    echo.
)

cd "%PROJECT_DIR%"

if "!UPDATE_MODE!"=="3" goto show_update_summary

:check_frontend_packages
if "!UPDATE_MODE!"=="2" goto frontend_packages_only
if "!UPDATE_MODE!"=="1" (
    cd "%PROJECT_DIR%"
    
    echo [INFO] Checking for outdated npm packages...
    call npm outdated
    echo.
    goto show_update_summary
)

if "!UPDATE_MODE!"=="4" (
    cd "%PROJECT_DIR%"
    
    echo [INFO] Checking for outdated npm packages...
    call npm outdated
    echo.
    goto show_update_summary
)

:frontend_packages_only
cd "%PROJECT_DIR%"

echo [INFO] Checking for outdated npm packages...
call npm outdated
echo.

:show_update_summary
echo.
echo ================================================================
echo    Update Complete!
echo ================================================================
echo.

echo Update Summary:
echo ================================================================

if "!UPDATE_MODE!"=="1" goto summary_full
if "!UPDATE_MODE!"=="2" goto summary_frontend
if "!UPDATE_MODE!"=="3" goto summary_backend
if "!UPDATE_MODE!"=="4" goto summary_deps

:summary_full
echo Backend dependencies updated
echo   - Database backed up
if exist "backend\migrate_db.py" echo   - Database migrations applied
echo.
echo Frontend dependencies updated
if exist "dist" echo   - Production build updated
echo.
goto next_steps

:summary_backend
echo Backend dependencies updated
if "!UPDATE_MODE!"=="1" (
    echo   - Database backed up
    if exist "backend\migrate_db.py" echo   - Database migrations applied
)
echo.
goto next_steps

:summary_frontend
echo Frontend dependencies updated
if exist "dist" echo   - Production build updated
echo.
goto next_steps

:summary_deps
echo Backend dependencies updated
echo Frontend dependencies updated
echo.

:next_steps
if exist "backend\pvapp.db.backup.*" (
    echo Database backups available in backend\ directory
    echo.
)

echo Next Steps:
echo ================================================================
echo 1. Restart the backend server if running
echo 2. Restart the frontend development server if running
echo 3. Clear browser cache if you experience issues
echo.
echo [SUCCESS] Update completed successfully!
echo.
pause
