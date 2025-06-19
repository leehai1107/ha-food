#!/bin/bash

# HA Food Next.js Docker Deployment Script

echo "🚀 Starting HA Food Next.js Docker deployment..."

# Function to display usage
show_usage() {
    echo "Usage: $0 [build|run|stop|clean|logs]"
    echo ""
    echo "Commands:"
    echo "  build   - Build the Docker image"
    echo "  run     - Run the application with docker-compose"
    echo "  stop    - Stop the application"
    echo "  clean   - Clean up Docker containers and images"
    echo "  logs    - Show application logs"
    echo ""
}

# Function to build the image
build_image() {
    echo "📦 Building Docker image..."
    docker-compose build
    echo "✅ Build completed!"
}

# Function to run the application
run_app() {
    echo "🏃 Running application..."
    docker-compose up -d
    echo "✅ Application is running on http://localhost:3000"
    echo "🗄️  Using external Railway database"
}

# Function to stop the application
stop_app() {
    echo "🛑 Stopping application..."
    docker-compose down
    echo "✅ Application stopped!"
}

# Function to clean up
clean_up() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v --rmi all
    docker system prune -f
    echo "✅ Cleanup completed!"
}

# Function to show logs
show_logs() {
    echo "📋 Showing application logs..."
    docker-compose logs -f app
}

# Main script logic
case "$1" in
    "build")
        build_image
        ;;
    "run")
        run_app
        ;;
    "stop")
        stop_app
        ;;
    "clean")
        clean_up
        ;;
    "logs")
        show_logs
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 