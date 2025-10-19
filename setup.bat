@echo off
REM EcoSphere Setup Script for Windows
REM This script helps you configure API keys and set up the environment

echo 🌱 Welcome to EcoSphere Setup!
echo ================================
echo.

REM Check if .env file exists
if exist ".env" (
    echo ⚠ .env file already exists. Backing up to .env.backup
    copy .env .env.backup
)

REM Copy template
echo ℹ Creating .env file from template...
copy env.example .env
echo ✓ Environment file created

echo.
echo 🔑 API Key Configuration Required
echo ==================================
echo.

REM Google OAuth2 Setup
echo 1. Google OAuth2 Setup (Required for Authentication)
echo    Go to: https://console.cloud.google.com/
echo    - Create/select a project
echo    - Enable Google+ API
echo    - Create OAuth 2.0 credentials
echo    - Set redirect URI: http://localhost:8000/api/auth/social/o/google-oauth2/
echo.

set /p GOOGLE_CLIENT_ID="Enter your Google OAuth2 Client ID: "
set /p GOOGLE_CLIENT_SECRET="Enter your Google OAuth2 Client Secret: "

REM Gemini API Setup
echo.
echo 2. Gemini AI API Setup (Required for Chatbot)
echo    Go to: https://makersuite.google.com/app/apikey
echo    - Sign in with Google
echo    - Create API Key
echo.

set /p GEMINI_API_KEY="Enter your Gemini API Key: "

REM Open-Meteo API (Optional)
echo.
echo 3. Open-Meteo API (Optional - for Climate Data)
echo    Go to: https://open-meteo.com/en/docs
echo    - Free tier available (no key required)
echo.

set /p OPEN_METEO_KEY="Enter your Open-Meteo API Key (or press Enter to skip): "

REM Generate Django Secret Key (simplified for Windows)
echo ℹ Generating Django secret key...
set DJANGO_SECRET_KEY=your_django_secret_key_here

REM Update .env file
echo ℹ Updating environment configuration...

REM Replace placeholders in .env file
powershell -Command "(Get-Content .env) -replace 'your_google_client_id_here', '%GOOGLE_CLIENT_ID%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'your_google_client_secret_here', '%GOOGLE_CLIENT_SECRET%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'your_gemini_api_key_here', '%GEMINI_API_KEY%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'your_django_secret_key_here', '%DJANGO_SECRET_KEY%' | Set-Content .env"

if not "%OPEN_METEO_KEY%"=="" (
    powershell -Command "(Get-Content .env) -replace 'your_open_meteo_api_key_here', '%OPEN_METEO_KEY%' | Set-Content .env"
) else (
    powershell -Command "(Get-Content .env) -replace 'your_open_meteo_api_key_here', '' | Set-Content .env"
)

echo ✓ Environment configuration updated

echo.
echo 🐳 Docker Setup
echo ===============
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Docker Compose is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

echo ✓ Docker and Docker Compose are installed

echo.
echo 🚀 Starting EcoSphere Application
echo =================================
echo.

REM Start the application
echo ℹ Starting Docker containers...
docker-compose up -d

REM Wait for services to be ready
echo ℹ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✓ Services are running
) else (
    echo ✗ Some services failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo.
echo 📊 Database Setup
echo =================
echo.

REM Run migrations
echo ℹ Running database migrations...
docker-compose exec backend python manage.py migrate

REM Create superuser
echo.
echo ℹ Creating admin user...
echo You'll be prompted to create an admin account.
docker-compose exec backend python manage.py createsuperuser

REM Seed data
echo.
echo ℹ Seeding database with sample data...
docker-compose exec backend python manage.py seed_data

echo ✓ Database setup complete

echo.
echo 🎉 EcoSphere Setup Complete!
echo ============================
echo.
echo ✓ Application is running!
echo.
echo 📱 Access Points:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    Admin Panel: http://localhost:8000/admin
echo.
echo 🔧 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop app: docker-compose down
echo    Restart: docker-compose restart
echo    Update: docker-compose pull ^&^& docker-compose up -d
echo.
echo 📚 Documentation:
echo    README.md - Full setup guide
echo    env.example - Environment variables reference
echo.
echo 🆘 Troubleshooting:
echo    If you encounter issues:
echo    1. Check logs: docker-compose logs backend
echo    2. Verify API keys are correct
echo    3. Ensure all services are running: docker-compose ps
echo.
echo Happy coding! 🌱
pause
