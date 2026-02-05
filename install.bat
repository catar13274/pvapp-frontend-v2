@echo off
REM ############################################################################
REM CoApp 2.0 - Installation Script (Windows)
REM 
REM This script installs both the frontend and backend components of CoApp 2.0
REM ############################################################################

setlocal enabledelayedexpansion

echo.
echo ================================================================
echo    CoApp 2.0 Installation (Windows)
echo ================================================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node -v
echo.

REM Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [INFO] npm version:
npm -v
echo.

REM Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3 is not installed. Please install Python 3.8+ first.
    echo Visit: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [INFO] Python version:
python --version
echo.

REM Check pip
where pip >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip is not installed. Please install pip first.
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites satisfied!
echo.

REM Ask for installation mode
echo Select installation mode:
echo 1^) Full installation ^(Frontend + Backend^)
echo 2^) Frontend only
echo 3^) Backend only
set /p INSTALL_MODE="Enter your choice (1-3) [1]: "
if "!INSTALL_MODE!"=="" set INSTALL_MODE=1

set PROJECT_DIR=%CD%

REM Install Backend
if "!INSTALL_MODE!"=="1" goto install_backend
if "!INSTALL_MODE!"=="3" goto install_backend
goto check_frontend

:install_backend
echo.
echo ================================================================
echo    Installing Backend
echo ================================================================
echo.

cd "%PROJECT_DIR%\backend"

REM Check if virtual environment exists
if exist "venv" (
    echo [WARNING] Virtual environment already exists. Skipping creation.
) else (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
    echo [SUCCESS] Virtual environment created
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip --quiet

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt
echo [SUCCESS] Python dependencies installed

REM Setup environment file
if not exist ".env" (
    echo [INFO] Creating .env file...
    copy .env.example .env
    
    REM Generate SECRET_KEY using Python
    python -c "import secrets; key = secrets.token_hex(32); file = open('.env', 'r'); content = file.read(); file.close(); content = content.replace('your-secret-key-change-this-in-production', key); file = open('.env', 'w'); file.write(content); file.close()"
    
    echo [SUCCESS] .env file created with generated SECRET_KEY
) else (
    echo [WARNING] .env file already exists. Skipping.
)

REM Initialize database
if not exist "pvapp.db" (
    echo [INFO] Initializing database...
    python init_db.py
    echo [SUCCESS] Database initialized with demo data
    echo [INFO] Demo credentials: demo@pvapp.com / demo123
) else (
    echo [WARNING] Database already exists. Skipping initialization.
    set /p REINIT="Do you want to reinitialize the database? (y/N): "
    if /i "!REINIT!"=="y" (
        echo [INFO] Backing up existing database...
        copy pvapp.db "pvapp.db.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
        echo [INFO] Reinitializing database...
        python init_db.py
        echo [SUCCESS] Database reinitialized
    )
)

call deactivate

echo [SUCCESS] Backend installation completed!
cd "%PROJECT_DIR%"

:check_frontend
REM Install Frontend
if "!INSTALL_MODE!"=="1" goto install_frontend
if "!INSTALL_MODE!"=="2" goto install_frontend
goto installation_complete

:install_frontend
echo.
echo ================================================================
echo    Installing Frontend
echo ================================================================
echo.

cd "%PROJECT_DIR%"

REM Install npm dependencies
echo [INFO] Installing npm dependencies...
call npm install
echo [SUCCESS] npm dependencies installed

REM Setup environment file
if not exist ".env" (
    echo [INFO] Creating frontend .env file...
    copy .env.example .env
    echo [SUCCESS] Frontend .env file created
) else (
    echo [WARNING] Frontend .env file already exists. Skipping.
)

REM Build frontend for production
set /p BUILD="Do you want to build the frontend for production? (Y/n): "
if /i not "!BUILD!"=="n" (
    echo [INFO] Building frontend for production...
    call npm run build
    echo [SUCCESS] Frontend built successfully
)

echo [SUCCESS] Frontend installation completed!

:installation_complete
echo.
echo ================================================================
echo    Installation Complete!
echo ================================================================
echo.

echo Installation Summary:
echo ================================================================

if "!INSTALL_MODE!"=="1" goto show_backend_summary
if "!INSTALL_MODE!"=="3" goto show_backend_summary
goto show_frontend_summary

:show_backend_summary
echo Backend installed in: %PROJECT_DIR%\backend
echo   - Virtual environment: backend\venv
echo   - Database: backend\pvapp.db
echo   - Environment: backend\.env
echo.

if "!INSTALL_MODE!"=="3" goto show_next_steps

:show_frontend_summary
if "!INSTALL_MODE!"=="2" goto frontend_only_summary
if "!INSTALL_MODE!"=="1" (
    echo Frontend installed in: %PROJECT_DIR%
    echo   - Dependencies: node_modules\
    echo   - Environment: .env
    if exist "dist" echo   - Production build: dist\
    echo.
    goto show_next_steps
)

:frontend_only_summary
echo Frontend installed in: %PROJECT_DIR%
echo   - Dependencies: node_modules\
echo   - Environment: .env
if exist "dist" echo   - Production build: dist\
echo.

:show_next_steps
echo Next Steps:
echo ================================================================

if "!INSTALL_MODE!"=="1" goto next_full
if "!INSTALL_MODE!"=="3" goto next_backend
goto next_frontend

:next_full
echo 1. Start the backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
echo    -^> Backend API: http://localhost:8001
echo    -^> API Docs: http://localhost:8001/docs
echo.
echo 2. Start the frontend (in a new terminal):
echo    npm run dev
echo    -^> Frontend: http://localhost:3000
echo.
echo 3. Login credentials:
echo    Email: demo@pvapp.com
echo    Password: demo123
echo.
goto end_script

:next_backend
echo 1. Start the backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
echo    -^> Backend API: http://localhost:8001
echo    -^> API Docs: http://localhost:8001/docs
echo.
echo 2. Login credentials:
echo    Email: demo@pvapp.com
echo    Password: demo123
echo.
goto end_script

:next_frontend
echo 1. Start the frontend:
echo    npm run dev
echo    -^> Frontend: http://localhost:3000
echo.

:end_script
echo For more information, see README.md
echo.
echo [SUCCESS] Installation completed successfully!
echo.
pause
