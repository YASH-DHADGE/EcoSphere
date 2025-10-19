#!/bin/bash

# EcoSphere Setup Script
# This script helps you configure API keys and set up the environment

set -e

echo "🌱 Welcome to EcoSphere Setup!"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if .env file exists
if [ -f ".env" ]; then
    print_warning ".env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy template
print_info "Creating .env file from template..."
cp env.example .env
print_status "Environment file created"

echo ""
echo "🔑 API Key Configuration Required"
echo "=================================="
echo ""

# Google OAuth2 Setup
echo "1. Google OAuth2 Setup (Required for Authentication)"
echo "   Go to: https://console.cloud.google.com/"
echo "   - Create/select a project"
echo "   - Enable Google+ API"
echo "   - Create OAuth 2.0 credentials"
echo "   - Set redirect URI: http://localhost:8000/api/auth/social/o/google-oauth2/"
echo ""

read -p "Enter your Google OAuth2 Client ID: " GOOGLE_CLIENT_ID
read -p "Enter your Google OAuth2 Client Secret: " GOOGLE_CLIENT_SECRET

# Gemini API Setup
echo ""
echo "2. Gemini AI API Setup (Required for Chatbot)"
echo "   Go to: https://makersuite.google.com/app/apikey"
echo "   - Sign in with Google"
echo "   - Create API Key"
echo ""

read -p "Enter your Gemini API Key: " GEMINI_API_KEY

# Open-Meteo API (Optional)
echo ""
echo "3. Open-Meteo API (Optional - for Climate Data)"
echo "   Go to: https://open-meteo.com/en/docs"
echo "   - Free tier available (no key required)"
echo ""

read -p "Enter your Open-Meteo API Key (or press Enter to skip): " OPEN_METEO_KEY

# Generate Django Secret Key
print_info "Generating Django secret key..."
DJANGO_SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || echo "your_django_secret_key_here")

# Update .env file
print_info "Updating environment configuration..."

# Replace placeholders in .env file
sed -i.bak "s/your_google_client_id_here/$GOOGLE_CLIENT_ID/g" .env
sed -i.bak "s/your_google_client_secret_here/$GOOGLE_CLIENT_SECRET/g" .env
sed -i.bak "s/your_gemini_api_key_here/$GEMINI_API_KEY/g" .env
sed -i.bak "s/your_django_secret_key_here/$DJANGO_SECRET_KEY/g" .env

if [ ! -z "$OPEN_METEO_KEY" ]; then
    sed -i.bak "s/your_open_meteo_api_key_here/$OPEN_METEO_KEY/g" .env
else
    sed -i.bak "s/your_open_meteo_api_key_here//g" .env
fi

# Clean up backup files
rm -f .env.bak

print_status "Environment configuration updated"

echo ""
echo "🐳 Docker Setup"
echo "==============="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

print_status "Docker and Docker Compose are installed"

echo ""
echo "🚀 Starting EcoSphere Application"
echo "================================="
echo ""

# Start the application
print_info "Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
print_info "Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "Services are running"
else
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "📊 Database Setup"
echo "================="
echo ""

# Run migrations
print_info "Running database migrations..."
docker-compose exec backend python manage.py migrate

# Create superuser
echo ""
print_info "Creating admin user..."
echo "You'll be prompted to create an admin account."
docker-compose exec backend python manage.py createsuperuser

# Seed data
echo ""
print_info "Seeding database with sample data..."
docker-compose exec backend python manage.py seed_data

print_status "Database setup complete"

echo ""
echo "🎉 EcoSphere Setup Complete!"
echo "============================"
echo ""
print_status "Application is running!"
echo ""
echo "📱 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Admin Panel: http://localhost:8000/admin"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop app: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Update: docker-compose pull && docker-compose up -d"
echo ""
echo "📚 Documentation:"
echo "   README.md - Full setup guide"
echo "   env.example - Environment variables reference"
echo ""
echo "🆘 Troubleshooting:"
echo "   If you encounter issues:"
echo "   1. Check logs: docker-compose logs backend"
echo "   2. Verify API keys are correct"
echo "   3. Ensure all services are running: docker-compose ps"
echo ""
echo "Happy coding! 🌱"
