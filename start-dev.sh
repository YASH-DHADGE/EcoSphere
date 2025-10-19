#!/usr/bin/env bash

# EcoSphere Development Startup Script
# This script starts both the Django backend and React frontend

echo "🌍 Starting EcoSphere Development Environment..."
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if ports are available
echo "🔍 Checking ports..."
if ! check_port 8000; then
    echo "❌ Django backend port 8000 is already in use"
    echo "   Please stop the existing Django server or change the port"
    exit 1
fi

if ! check_port 5173; then
    echo "❌ React frontend port 5173 is already in use"
    echo "   Please stop the existing Vite server or change the port"
    exit 1
fi

echo "✅ Ports are available"
echo ""

# Start Django backend
echo "🐍 Starting Django backend..."
cd backend
python manage.py runserver &
DJANGO_PID=$!
echo "   Django backend started (PID: $DJANGO_PID)"
echo "   Backend URL: http://localhost:8000"
echo ""

# Wait a moment for Django to start
sleep 3

# Start React frontend
echo "⚛️  Starting React frontend..."
cd ../frontend
npm run dev &
REACT_PID=$!
echo "   React frontend started (PID: $REACT_PID)"
echo "   Frontend URL: http://localhost:5173"
echo ""

echo "🎉 EcoSphere is now running!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000/api"
echo "👤 Admin Panel: http://localhost:8000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $DJANGO_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
