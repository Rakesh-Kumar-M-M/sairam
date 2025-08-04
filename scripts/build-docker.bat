@echo off
echo 🐳 Building Docker image for Sairam MUN Website...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Set environment variables for JS-only builds
set ROLLUP_SKIP_NATIVE=true
set NODE_OPTIONS=--max-old-space-size=4096

echo 🔧 Using JS-only Rollup builds (no native modules)

REM Build the image
echo 📦 Building Docker image...
docker build -t sairam-mun-website:latest .

if %errorlevel% equ 0 (
    echo ✅ Docker image built successfully!
    echo 🚀 To run the container:
    echo    docker run -p 10000:10000 -e MONGODB_URI=your_mongodb_uri sairam-mun-website:latest
    echo.
    echo 🐳 Or use docker-compose:
    echo    docker-compose up
) else (
    echo ❌ Docker build failed!
    exit /b 1
) 