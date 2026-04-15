@echo off
REM EcoVision AI - Complete Startup Script
REM This script starts both backend and frontend

echo.
echo ╔════════════════════════════════════════════╗
echo ║   EcoVision AI - Waste Classification     ║
echo ║         Complete Startup Script            ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if backend folder exists
if not exist "backend" (
    echo ❌ Backend folder not found!
    exit /b 1
)

REM Check if frontend folder exists
if not exist "frontend" (
    echo ❌ Frontend folder not found!
    exit /b 1
)

echo Starting services...
echo.

REM Start backend
echo [1/2] Starting Backend (Flask)...
start cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak

REM Start frontend
echo [2/2] Starting Frontend (React + Vite)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ╔════════════════════════════════════════════╗
echo ║         🎉 Services Starting...           ║
echo ╠════════════════════════════════════════════╣
echo ║  📊 Backend:   http://localhost:5000       ║
echo ║  🎨 Frontend:  http://localhost:5173       ║
echo ║  API:          http://localhost:5000/api   ║
echo ╠════════════════════════════════════════════╣
echo ║  Note: Open http://localhost:5173 in       ║
echo ║        your browser when ready!            ║
echo ╚════════════════════════════════════════════╝
echo.
pause
