#!/bin/bash

echo "🚀 Starting MongoCafe..."

# 1. Cleanup: Kill any process running on port 8000 (Backend)
if lsof -ti:8000 > /dev/null; then
    echo "🧹 Freeing port 8000..."
    lsof -ti:8000 | xargs kill -9
fi

# 2. Activate Python Environment (if exists)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# 3. Start Backend in Background
echo "☕ Starting Backend Server..."
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# 4. Start Frontend in Background
echo "🎨 Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# 5. Handle Exit (Ctrl+C kills both)
trap "echo '🛑 Stopping MongoCafe...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Keep script running
wait
