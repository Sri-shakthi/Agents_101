#!/bin/bash

# Development startup script for the video meeting application

echo "🚀 Starting Video Meeting Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check ports
echo "🔍 Checking ports..."
check_port 5000 || echo "Backend port 5000 is in use"
check_port 5173 || echo "Frontend port 5173 is in use"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start backend server
echo "🔧 Starting backend server on port 5000..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start frontend server
echo "🎨 Starting frontend server on port 5173..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Application started successfully!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo "🏥 Doctor Dashboard: http://localhost:5173/doctor/dashboard"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
