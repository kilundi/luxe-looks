@echo off
echo ========================================
echo   Luxe Looks - Start All Servers
echo ========================================
echo.

REM Check if admin server is running
curl -s http://localhost:3001/api/products >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting Admin Server...
    start "Admin Server" cmd /k "cd admin && npm start"
    timeout /t 3 /nobreak >nul
) else (
    echo Admin Server is already running on port 3001
)

REM Check if frontend is running
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting Frontend Server...
    start "Frontend Server" cmd /k "npm run dev"
) else (
    echo Frontend Server is already running on port 5173
)

echo.
echo ========================================
echo   All servers should be running now!
echo ========================================
echo.
echo   Frontend:  http://localhost:5173
echo   Admin API: http://localhost:3001/api/products
echo   Admin UI:  http://localhost:3001/admin
echo.
echo   Default Admin Login:
echo   Username: admin
echo   Password: Admin@2024
echo.
echo   Press any key to open browser...
pause >nul

REM Open default browser to the website
start http://localhost:5173
