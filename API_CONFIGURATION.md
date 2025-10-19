# EcoSphere API Configuration Guide

This guide provides detailed instructions for setting up all required API keys and external services for the EcoSphere platform.

## 🔑 Required API Keys

### 1. Google OAuth2 (Authentication)

**Purpose**: User authentication and registration

**Setup Steps**:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Click "Select a project" → "New Project"
   - Name: "EcoSphere" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "EcoSphere Web Client"

5. **Configure Authorized Redirect URIs**
   ```
   Development:
   http://localhost:8000/api/auth/social/o/google-oauth2/
   
   Production:
   https://yourdomain.com/api/auth/social/o/google-oauth2/
   ```

6. **Get Credentials**
   - Copy "Client ID" → `SOCIAL_AUTH_GOOGLE_OAUTH2_KEY`
   - Copy "Client Secret" → `SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET`

**Environment Variables**:
```bash
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your_client_id_here
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your_client_secret_here
```

### 2. Gemini AI API (Chatbot & News Summarization)

**Purpose**: AI-powered chatbot and news article summarization

**Setup Steps**:

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select your project (or create new)
   - Copy the generated API key

3. **Configure API Key**
   - Copy the API key to `GEMINI_API_KEY` in your `.env` file

**Environment Variables**:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Usage Limits**:
- Free tier: 15 requests per minute
- Paid tier: Higher limits available

### 3. Open-Meteo API (Climate Data)

**Purpose**: Real-time climate data and weather information

**Setup Steps**:

1. **Visit Open-Meteo**
   - Go to: https://open-meteo.com/en/docs
   - Free API available (no registration required)

2. **Optional: Create Account**
   - Sign up for higher rate limits
   - Get API key from dashboard

3. **Configure API Key** (Optional)
   - Copy API key to `OPEN_METEO_API_KEY` in your `.env` file
   - Leave empty for free tier

**Environment Variables**:
```bash
OPEN_METEO_API_KEY=your_open_meteo_api_key_here
```

**Free Tier Limits**:
- 10,000 requests per day
- 1 request per second

## 🗄️ Database Configuration

### Option 1: Supabase (Recommended)

**Purpose**: PostgreSQL database with built-in features

**Setup Steps**:

1. **Create Supabase Account**
   - Go to: https://supabase.com/
   - Sign up with GitHub/GitLab/Email

2. **Create New Project**
   - Click "New Project"
   - Choose organization
   - Project name: "EcoSphere"
   - Database password: Generate secure password
   - Region: Choose closest to your users

3. **Get Connection String**
   - Go to Settings → Database
   - Copy "Connection string" under "Connection parameters"
   - Format: `postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

4. **Configure Environment**
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

**Supabase Features**:
- Automatic backups
- Real-time subscriptions
- Built-in authentication (optional)
- Dashboard for data management

### Option 2: Local PostgreSQL

**Purpose**: Development and testing

**Setup Steps**:

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Follow installation instructions

2. **Create Database**
   ```sql
   CREATE DATABASE ecosphere_dev_db;
   CREATE USER ecosphere_user WITH PASSWORD 'ecosphere_password';
   GRANT ALL PRIVILEGES ON DATABASE ecosphere_dev_db TO ecosphere_user;
   ```

3. **Configure Environment**
   ```bash
   DATABASE_URL=postgres://ecosphere_user:ecosphere_password@localhost:5432/ecosphere_dev_db
   ```

## 📧 Email Configuration (Optional)

**Purpose**: Send notifications, weekly summaries, password resets

### Gmail Setup

**Setup Steps**:

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Follow setup instructions

2. **Generate App Password**
   - Go to Google Account settings
   - Security → App passwords
   - Select "Mail" and "Other (custom name)"
   - Name: "EcoSphere"
   - Copy the generated password

3. **Configure Environment**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password_here
   ```

### Other Email Providers

**SendGrid**:
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your_sendgrid_api_key
```

**Mailgun**:
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_HOST_USER=your_mailgun_username
EMAIL_HOST_PASSWORD=your_mailgun_password
```

## 🔐 Security Configuration

### Django Secret Key

**Generate Secure Secret Key**:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Environment Variable**:
```bash
SECRET_KEY=your_generated_secret_key_here
```

### Production Security Settings

**Environment Variables**:
```bash
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

## 🌐 CORS Configuration

**Purpose**: Allow frontend to communicate with backend

**Environment Variables**:
```bash
# Development
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Production
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🚀 Frontend Configuration

**Environment Variables**:
```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000/api

# WebSocket URL
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Google Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 📊 Redis Configuration

**Purpose**: Caching, WebSocket channels, Celery message broker

**Environment Variables**:
```bash
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

## 🐳 Docker Configuration

**Environment Variables**:
```bash
POSTGRES_DB=ecosphere_dev_db
POSTGRES_USER=ecosphere_user
POSTGRES_PASSWORD=ecosphere_password
```

## 🔧 Environment File Template

Create a `.env` file with the following template:

```bash
# Django Settings
SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://ecosphere_user:ecosphere_password@db:5432/ecosphere_dev_db

# Redis
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Google OAuth2
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your_google_client_id_here
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your_google_client_secret_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Open-Meteo (Optional)
OPEN_METEO_API_KEY=your_open_meteo_api_key_here

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Docker
POSTGRES_DB=ecosphere_dev_db
POSTGRES_USER=ecosphere_user
POSTGRES_PASSWORD=ecosphere_password
```

## 🚨 Security Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Use HTTPS URLs in `CORS_ALLOWED_ORIGINS`
- [ ] Set up proper database credentials
- [ ] Configure email settings
- [ ] Enable SSL redirects
- [ ] Set up proper logging
- [ ] Use environment-specific configurations
- [ ] Test all API integrations

## 🆘 Troubleshooting

### Common Issues

1. **Google OAuth not working**
   - Check redirect URIs in Google Console
   - Ensure CORS_ALLOWED_ORIGINS includes your frontend URL
   - Verify client ID and secret are correct

2. **Gemini API errors**
   - Verify API key is correct
   - Check API quota limits
   - Ensure billing is set up if using paid tier

3. **Database connection failed**
   - Verify DATABASE_URL format
   - Check if database service is running
   - Ensure credentials are correct

4. **WebSocket connection failed**
   - Ensure Redis is running
   - Check VITE_WS_BASE_URL matches backend
   - Verify CORS settings

5. **Email not sending**
   - Check email credentials
   - Verify SMTP settings
   - Check firewall/network restrictions

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Test API endpoints
curl http://localhost:8000/api/health/

# Check environment variables
docker-compose exec backend env | grep -E "(SECRET_KEY|DATABASE_URL|GEMINI_API_KEY)"
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs backend`
2. Verify all environment variables are set correctly
3. Ensure all services are running: `docker-compose ps`
4. Check API key permissions and quotas
5. Review the troubleshooting section above
6. Check the main README.md for additional help
