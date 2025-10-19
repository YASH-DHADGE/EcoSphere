# EcoSphere Frontend

A modern, interactive React frontend for the EcoSphere climate change awareness platform.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with dark mode support
- **Carbon Tracking**: Interactive calculator with real-time CO2 calculations
- **Climate News**: Latest environmental news with filtering and search
- **Gamification**: Challenges, achievements, and leaderboards
- **AI Assistant**: Intelligent chatbot for climate guidance
- **Social Features**: Friends, comparisons, and community challenges
- **Real-time Data**: Live climate statistics and trends
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Chart.js** for data visualization
- **Axios** for API communication
- **Heroicons** for beautiful icons

## 📦 Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Chatbot.tsx     # AI assistant widget
│   └── NotificationCenter.tsx
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Authentication
│   ├── CarbonCalculator.tsx
│   ├── News.tsx        # Climate news
│   ├── Challenges.tsx  # Gamification
│   ├── Profile.tsx     # User profile
│   └── ...
├── context/            # React context providers
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Dark/light mode
├── services/           # API services
│   ├── api.ts          # API configuration
│   └── websocket.ts    # Real-time communication
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── main.tsx           # App entry point
```

## 🎨 Design System

### Colors
- **Primary**: Green (#10B981) - Environmental theme
- **Secondary**: Blue (#3B82F6) - Trust and technology
- **Earth**: Orange (#F28C0C) - Natural elements
- **Success**: Green variants
- **Warning**: Yellow variants
- **Error**: Red variants

### Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Interactive cards with hover effects
- **Forms**: Consistent input styling with focus states
- **Badges**: Status indicators and categories
- **Charts**: Data visualization components

## 🔌 API Integration

The frontend integrates with the Django backend through:

- **Authentication**: JWT token-based auth
- **Carbon Tracking**: CRUD operations for carbon entries
- **Gamification**: Challenges and achievements
- **News**: Climate news articles
- **Notifications**: Real-time notifications
- **Chatbot**: AI assistant communication

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Large touch targets and gestures
- **Progressive Enhancement**: Works without JavaScript

## 🌙 Dark Mode

- **System Preference**: Automatically detects user preference
- **Manual Toggle**: Users can switch themes
- **Persistent**: Remembers user choice
- **Smooth Transitions**: Animated theme changes

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run linting:
```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Docker
```bash
docker build -t ecosphere-frontend .
docker run -p 3000:3000 ecosphere-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ for a sustainable future 🌍
