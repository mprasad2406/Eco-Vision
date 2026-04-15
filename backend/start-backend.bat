@echo off
REM EcoVision AI Backend Startup Script for Windows

echo ======================================================================
echo    🌿 EcoVision AI Backend - Startup Script
echo ======================================================================
echo.

REM Change to backend directory
cd /d %~dp0

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo ✅ Python found

REM Check if requirements are installed
echo.
echo Checking dependencies...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚙️  Installing dependencies from requirements.txt...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies OK

REM Check if model exists
if not exist "models\waste_classifier_model.h5" (
    echo.
    echo ⚠️  Model file not found!
    echo.
    echo Creating model... (this may take a minute)
    python create_model.py
    if errorlevel 1 (
        echo ❌ ERROR: Failed to create model
        pause
        exit /b 1
    )
)

echo ✅ Model OK

REM Create data directories if they don't exist
if not exist "data\database" mkdir data\database
if not exist "data\uploads" mkdir data\uploads
if not exist "data\backups" mkdir data\backups

echo ✅ Data directories OK

REM Start the Flask server
echo.
echo ======================================================================
echo.
echo 🚀 Starting EcoVision AI Flask Server...
echo.
echo 🌐 API Server will be available at:
echo    http://localhost:5000
echo    http://localhost:5000/api/health
echo.
echo 💡 Frontend should connect to: http://localhost:5000/api
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo.
echo ======================================================================
echo.

python app.py

if errorlevel 1 (
    echo.
    echo ❌ ERROR: Server failed to start
    echo.
    echo Troubleshooting:
    echo - Make sure port 5000 is not already in use
    echo - Check that all dependencies are installed
    echo - Verify the model file exists in models/ folder
    echo.
    pause
    exit /b 1
)

pause
