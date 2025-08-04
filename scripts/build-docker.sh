#!/bin/bash

# Docker build script for Sairam MUN Website
set -e

echo "🐳 Building Docker image for Sairam MUN Website..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the image
echo "📦 Building Docker image..."
docker build -t sairam-mun-website:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "🚀 To run the container:"
    echo "   docker run -p 10000:10000 -e MONGODB_URI=your_mongodb_uri sairam-mun-website:latest"
    echo ""
    echo "🐳 Or use docker-compose:"
    echo "   docker-compose up"
else
    echo "❌ Docker build failed!"
    exit 1
fi 