# EcoSphere Quick Start Guide

Get EcoSphere running in 5 minutes! 🚀

## Prerequisites

- Docker and Docker Compose installed
- A Google account (for OAuth)
- A Google AI Studio account (for Gemini API)

## 🚀 Quick Setup

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd EcoSphere
```

### 2. Run Setup Script

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

### 3. Manual Setup (Alternative)

If you prefer manual setup:

1. **Copy environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file with your API keys:**
   ```bash
   # Minimum required:
   SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your_google_client_id
   SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   SECRET_KEY=your_django_secret_key
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Setup database:**
   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   docker-compose exec backend python manage.py seed_data
   ```

## 🔑 Get Your API Keys

### Google OAuth2 (Required)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:8000/api/auth/social/o/google-oauth2/`

### Gemini AI (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Create API Key
4. Copy the key

## 🌐 Access Your Application

Once running, access EcoSphere at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🎯 First Steps

1. **Register**: Click "Login" and sign in with Google
2. **Choose Role**: Select Individual, NGO, or Admin
3. **Calculate Carbon**: Go to Calculator and log your first entry
4. **Explore**: Check out News, Challenges, and Leaderboard
5. **Chat**: Try the AI chatbot in the bottom-right corner

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart application
docker-compose restart

# Update application
docker-compose pull && docker-compose up -d

# Access backend shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test
```

## 🆘 Troubleshooting

### Services won't start
```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs backend
```

### API errors
- Verify your API keys are correct
- Check API quotas and permissions
- Ensure all services are running

### Database issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [API_CONFIGURATION.md](API_CONFIGURATION.md) for advanced setup
- Explore the codebase structure
- Customize the application for your needs

## 🎉 You're Ready!

EcoSphere is now running! Start exploring climate awareness, tracking your carbon footprint, and engaging with the community.

Happy coding! 🌱
