#!/bin/bash

echo "========================================"
echo "   Luxe Looks - Start All Servers"
echo "========================================"
echo ""

# Check if admin server is running
if curl -s http://localhost:3001/api/products > /dev/null 2>&1; then
    echo "✅ Admin Server is already running on port 3001"
else
    echo "🚀 Starting Admin Server..."
    cd admin && npm start &
    ADMIN_PID=$!
    sleep 3
fi

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend Server is already running on port 5173"
else
    echo "🚀 Starting Frontend Server..."
    npm run dev &
    FRONTEND_PID=$!
    sleep 2
fi

echo ""
echo "========================================"
echo "   All servers should be running now!"
echo "========================================"
echo ""
echo "   Frontend:  http://localhost:5173"
echo "   Admin API: http://localhost:3001/api/products"
echo "   Admin UI:  http://localhost:3001/admin"
echo ""
echo "   Default Admin Login:"
echo "   Username: admin"
echo "   Password: Admin@2024"
echo ""

# Open browser (Mac/Linux)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
fi
