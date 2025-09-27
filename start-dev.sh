#!/bin/bash

echo "🚀 Starting RapidWaste Development Environment..."

# Start MongoDB if not running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log --dbpath /tmp/mongodb-data || {
        echo "❌ Failed to start MongoDB. Please install MongoDB or start it manually."
        echo "You can also use MongoDB Atlas cloud database."
        echo "Update the MONGODB_URI in backend/.env file."
    }
fi

# Function to run commands in background
run_in_background() {
    local name=$1
    local command=$2
    local directory=$3
    
    echo "🔧 Starting $name..."
    cd "$directory"
    eval "$command" &
    local pid=$!
    echo "✅ $name started (PID: $pid)"
    cd - > /dev/null
}

# Start Backend
run_in_background "Backend API" "npm run start:dev" "./backend"

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start Frontend
run_in_background "Frontend" "npm run dev" "."

echo ""
echo "🎉 Development environment is starting up!"
echo ""
echo "📋 Services:"
echo "  🖥️  Frontend: http://localhost:5173"
echo "  🔗 Backend API: http://localhost:3001/api"
echo "  🗄️  MongoDB: mongodb://localhost:27017/rapidwaste"
echo ""
echo "📖 Instructions:"
echo "  1. Wait for both services to start"
echo "  2. Open http://localhost:5173 in your browser"
echo "  3. Click 'Admin Portal' to access drivers dashboard"
echo "  4. Test booking creation on the main page"
echo ""
echo "🔑 Test Driver Login:"
echo "  📧 Email: admin@notarynow.com"
echo "  🔒 Password: admin123"
echo ""
echo "⚠️  Note: Run 'npm run seed' in backend/ to create sample data"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait 