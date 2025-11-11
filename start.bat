@echo off
echo ============================================================
echo MaskGuard Detection System - Startup Script
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher
    pause
    exit /b 1
)

echo Checking dependencies...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo.
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting MaskGuard server...
echo.
echo Access the application at:
echo   http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

python app.py

pause
