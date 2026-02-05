@echo off
REM ############################################################################
REM PVApp 2.0 - Uninstallation Script (Windows)
REM 
REM This script removes the PVApp 2.0 installation
REM ############################################################################

setlocal enabledelayedexpansion

echo.
echo ================================================================
echo    PVApp 2.0 Uninstallation (Windows)
echo ================================================================
echo.

echo [WARNING] This will remove PVApp 2.0 and its dependencies.
set /p CONFIRM="Are you sure you want to continue? (y/N): "
if /i not "!CONFIRM!"=="y" (
    echo [INFO] Uninstallation cancelled.
    pause
    exit /b 0
)

echo.
echo What would you like to uninstall?
echo 1^) Everything ^(Frontend + Backend + Dependencies^)
echo 2^) Frontend only
echo 3^) Backend only
echo 4^) Dependencies only ^(keep source code^)
set /p UNINSTALL_MODE="Enter your choice (1-4) [1]: "
if "!UNINSTALL_MODE!"=="" set UNINSTALL_MODE=1

set KEEP_DATA=false
if "!UNINSTALL_MODE!"=="1" goto ask_data
if "!UNINSTALL_MODE!"=="3" goto ask_data
goto start_uninstall

:ask_data
echo.
set /p KEEP="Do you want to keep the database and configuration files? (y/N): "
if /i "!KEEP!"=="y" (
    set KEEP_DATA=true
    echo [INFO] Database and configuration will be preserved
)

:start_uninstall
set PROJECT_DIR=%CD%

REM Uninstall Backend
if "!UNINSTALL_MODE!"=="1" goto uninstall_backend
if "!UNINSTALL_MODE!"=="3" goto uninstall_backend
if "!UNINSTALL_MODE!"=="4" goto uninstall_backend
goto check_frontend_uninstall

:uninstall_backend
echo.
echo ================================================================
echo    Uninstalling Backend
echo ================================================================
echo.

cd "%PROJECT_DIR%\backend"

REM Remove virtual environment
if exist "venv" (
    echo [INFO] Removing Python virtual environment...
    rmdir /s /q venv
    echo [SUCCESS] Virtual environment removed
) else (
    echo [INFO] Virtual environment not found. Skipping.
)

REM Remove Python cache
if exist "__pycache__" (
    echo [INFO] Removing Python cache...
    for /d /r %%d in (__pycache__) do @if exist "%%d" rmdir /s /q "%%d"
    del /s /q *.pyc >nul 2>&1
    echo [SUCCESS] Python cache removed
)

REM Remove database and env files if requested
if "!KEEP_DATA!"=="false" (
    if exist "pvapp.db" (
        echo [INFO] Backing up database...
        set BACKUP_NAME=pvapp.db.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
        copy pvapp.db "!BACKUP_NAME!"
        echo [SUCCESS] Database backed up to: !BACKUP_NAME!
        
        echo [INFO] Removing database...
        del pvapp.db
        echo [SUCCESS] Database removed
    )
    
    if exist ".env" (
        echo [INFO] Removing backend .env file...
        del .env
        echo [SUCCESS] Backend .env file removed
    )
) else (
    echo [INFO] Keeping database and configuration files
)

cd "%PROJECT_DIR%"

:check_frontend_uninstall
REM Uninstall Frontend
if "!UNINSTALL_MODE!"=="1" goto uninstall_frontend
if "!UNINSTALL_MODE!"=="2" goto uninstall_frontend
if "!UNINSTALL_MODE!"=="4" goto uninstall_frontend
goto uninstall_complete

:uninstall_frontend
echo.
echo ================================================================
echo    Uninstalling Frontend
echo ================================================================
echo.

cd "%PROJECT_DIR%"

REM Remove node_modules
if exist "node_modules" (
    echo [INFO] Removing node_modules...
    rmdir /s /q node_modules
    echo [SUCCESS] node_modules removed
) else (
    echo [INFO] node_modules not found. Skipping.
)

REM Remove package-lock.json
if exist "package-lock.json" (
    echo [INFO] Removing package-lock.json...
    del package-lock.json
    echo [SUCCESS] package-lock.json removed
)

REM Remove dist folder
if exist "dist" (
    echo [INFO] Removing production build...
    rmdir /s /q dist
    echo [SUCCESS] Production build removed
)

REM Remove .env file if not keeping data
if "!KEEP_DATA!"=="false" (
    if exist ".env" (
        echo [INFO] Removing frontend .env file...
        del .env
        echo [SUCCESS] Frontend .env file removed
    )
) else (
    echo [INFO] Keeping frontend configuration files
)

:uninstall_complete
echo.
echo ================================================================
echo    Uninstallation Complete!
echo ================================================================
echo.

echo Uninstallation Summary:
echo ================================================================

if "!UNINSTALL_MODE!"=="1" goto summary_backend
if "!UNINSTALL_MODE!"=="3" goto summary_backend
if "!UNINSTALL_MODE!"=="4" goto summary_backend
goto summary_frontend

:summary_backend
echo Backend dependencies removed
if "!KEEP_DATA!"=="false" (
    echo   - Database backed up and removed
    echo   - Configuration files removed
) else (
    echo   - Database and configuration preserved
)
echo.

if "!UNINSTALL_MODE!"=="3" goto preserved_files

:summary_frontend
if "!UNINSTALL_MODE!"=="2" goto frontend_only_summary
if "!UNINSTALL_MODE!"=="1" (
    echo Frontend dependencies removed
    if "!KEEP_DATA!"=="false" (
        echo   - Configuration files removed
    ) else (
        echo   - Configuration preserved
    )
    echo.
    goto preserved_files
)

if "!UNINSTALL_MODE!"=="4" (
    echo Frontend dependencies removed
    goto preserved_files
)

:frontend_only_summary
echo Frontend dependencies removed
if "!KEEP_DATA!"=="false" (
    echo   - Configuration files removed
) else (
    echo   - Configuration preserved
)
echo.

:preserved_files
if "!KEEP_DATA!"=="true" (
    echo Preserved files:
    if exist "backend\pvapp.db" echo   - backend\pvapp.db
    if exist "backend\.env" echo   - backend\.env
    if exist ".env" echo   - .env
    echo.
    echo To reinstall, run: install.bat
    echo.
)

if exist "backend\pvapp.db.backup.*" (
    echo Database backups available in backend\ directory
    echo.
)

echo [SUCCESS] Uninstallation completed!
echo.
pause
