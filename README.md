# EcoSphere - Climate Change Awareness Platform

![EcoSphere Logo](https://via.placeholder.com/200x80/10B981/FFFFFF?text=EcoSphere)

A comprehensive full-stack web application that combines climate awareness, personal carbon tracking, community engagement, and organizational reporting capabilities.

## 🌍 Features

### Core Functionality
- **Carbon Footprint Calculator**: Track emissions across domestic and transportation categories
- **Real-time Climate Dashboard**: Live global climate statistics and trends
- **AI-Powered Chatbot**: Gemini-powered assistant for climate guidance
- **Gamification System**: Points, badges, challenges, and leaderboards
- **News Curation**: AI-summarized climate news with categorization
- **Social Features**: Friends, comparisons, and community challenges

### User Roles
- **Individual Users**: Personal carbon tracking and challenges
- **NGO Accounts**: Create custom challenges and manage initiatives
- **Admin**: Platform management and content moderation

### Technical Features
- **Real-time Notifications**: WebSocket-powered live updates
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark Mode**: Complete theme switching support
- **Data Visualization**: Interactive charts and graphs
- **Export Capabilities**: PDF reports with EcoSphere branding

## 🏗️ Architecture

### Backend
- **Framework**: Django REST Framework + Django Channels
- **Database**: PostgreSQL (Supabase)
- **Real-time**: WebSockets with Redis
- **Background Tasks**: Celery + Celery Beat
- **AI Integration**: Google Gemini API
- **Authentication**: Google OAuth + JWT

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom EcoSphere theme
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Heroicons + Lucide React
- **State Management**: React Context

### Deployment
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (frontend) + Gunicorn/Daphne (backend)
- **Process Management**: Multi-container orchestration

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- A Google account (for OAuth)
- A Google AI Studio account (for Gemini API)

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
git clone <repository-url>
cd EcoSphere
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
git clone <repository-url>
cd EcoSphere
setup.bat
```

The setup script will guide you through:
- API key configuration
- Environment setup
- Docker container startup
- Database initialization
- Sample data loading

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoSphere
   ```

2. **Copy environment file**
   ```bash
   cp env.example .env
   ```

3. **Configure API keys**
   Edit `.env` file with your actual values. See [API_CONFIGURATION.md](API_CONFIGURATION.md) for detailed setup instructions:
   ```env
   # Required API Keys
   SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your-google-client-id
   SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your-google-client-secret
   GEMINI_API_KEY=your-gemini-api-key
   
   # Database (Supabase recommended)
   DATABASE_URL=postgresql://username:password@host:port/database
   
   # Redis
   REDIS_URL=redis://redis:6379/0
   
   # Security
   SECRET_KEY=your-django-secret-key
   ```

### Get Your API Keys

**Google OAuth2 (Required):**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:8000/api/auth/social/o/google-oauth2/`

**Gemini AI (Required):**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Create API Key
4. Copy the key

For detailed API setup instructions, see [API_CONFIGURATION.md](API_CONFIGURATION.md).

### Docker Deployment (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. **Load sample data**
   ```bash
   docker-compose exec backend python manage.py seed_challenges
   docker-compose exec backend python manage.py seed_achievements
   docker-compose exec backend python manage.py seed_news
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
EcoSphere/
├── backend/                 # Django backend
│   ├── ecosphere/          # Main Django project
│   │   ├── settings/       # Environment-specific settings
│   │   ├── urls.py         # URL routing
│   │   ├── asgi.py         # ASGI configuration
│   │   └── wsgi.py         # WSGI configuration
│   ├── apps/               # Django applications
│   │   ├── users/          # User management & authentication
│   │   ├── carbon/         # Carbon tracking & calculator
│   │   ├── gamification/   # Points, badges, challenges
│   │   ├── news/           # News curation & articles
│   │   ├── notifications/  # Real-time notifications
│   │   ├── chatbot/        # AI chatbot integration
│   │   └── climate_data/   # Climate statistics & alerts
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API & WebSocket services
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile         # Frontend container
│   └── nginx.conf         # Nginx configuration
├── docker-compose.yml      # Multi-container orchestration
├── env.example            # Environment template
├── setup.sh              # Linux/Mac setup script
├── setup.bat              # Windows setup script
├── API_CONFIGURATION.md   # Detailed API setup guide
├── QUICK_START.md         # Quick start guide
└── README.md              # This file
```

## 📋 Configuration Files

### Setup Scripts
- **`setup.sh`** (Linux/Mac): Automated setup script with API key configuration
- **`setup.bat`** (Windows): Windows batch file for automated setup

### Documentation
- **`env.example`**: Complete environment variables template with instructions
- **`API_CONFIGURATION.md`**: Detailed guide for setting up all API keys and services
- **`QUICK_START.md`**: 5-minute quick start guide for getting EcoSphere running

### Environment Configuration
- **`.env`**: Your actual environment variables (create from `env.example`)
- **`docker-compose.yml`**: Multi-container orchestration configuration
- **`backend/ecosphere/settings/`**: Django settings for different environments

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/google/` - Google OAuth login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `POST /api/auth/logout/` - Logout user

### User Management
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/leaderboard/` - Get leaderboard
- `POST /api/users/friends/` - Add friend

### Carbon Calculator
- `GET /api/carbon/entries/` - Get carbon entries
- `POST /api/carbon/entries/` - Create carbon entry
- `GET /api/carbon/summary/` - Get carbon summary
- `GET /api/carbon/comparison/` - Compare with averages
- `GET /api/carbon/export/` - Export PDF report

### Gamification
- `GET /api/gamification/challenges/` - Get challenges
- `POST /api/gamification/challenges/{id}/join/` - Join challenge
- `PUT /api/gamification/challenges/{id}/progress/` - Update progress
- `GET /api/gamification/achievements/` - Get achievements

### News & Content
- `GET /api/news/articles/` - Get news articles
- `POST /api/news/articles/{id}/bookmark/` - Bookmark article
- `GET /api/news/digest/` - Get weekly digest

### Real-time Features
- `WebSocket /ws/notifications/` - Real-time notifications
- `POST /api/chatbot/message/` - Send chatbot message

## 🎨 Design System

### Color Palette
- **Primary Green**: #10B981 (EcoSphere brand)
- **Secondary Blue**: #3B82F6 (Trust & reliability)
- **Earth Tones**: #92400E (Natural elements)
- **Accent Colors**: Various shades for different categories

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across devices

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Consistent shadow and border styling
- **Forms**: Accessible input fields with validation
- **Charts**: Responsive data visualization
- **Navigation**: Collapsible sidebar with active states

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Django ORM
- **XSS Protection**: Content Security Policy
- **HTTPS Ready**: Production security headers

## 📊 Database Schema

### Core Tables
- `users` - Extended user model with roles
- `carbon_entries` - Carbon footprint data
- `challenges` - Gamification challenges
- `user_challenges` - User participation
- `achievements` - Badge definitions
- `news_articles` - Curated climate news
- `notifications` - Real-time notifications
- `chat_messages` - Chatbot conversations

### Relationships
- Users have many carbon entries
- Users participate in multiple challenges
- Users earn multiple achievements
- Users receive multiple notifications
- Users have many chat sessions

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in production settings
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up SSL certificates
- [ ] Configure email settings
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CDN for static files

### Environment Variables
All required environment variables are documented in `env.example`. Key variables include:
- Database connection strings
- API keys for external services
- Security keys and secrets
- Email configuration
- Redis connection details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for React components
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Climate Data**: Open-Meteo API
- **AI Services**: Google Gemini API
- **Icons**: Heroicons and Lucide React
- **Charts**: Chart.js
- **UI Framework**: TailwindCSS
- **Backend Framework**: Django REST Framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints
- Contact the development team

---

**EcoSphere** - Building a sustainable future, one carbon footprint at a time. 🌱
