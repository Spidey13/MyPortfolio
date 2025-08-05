# AI-Powered Portfolio Website - "The Conversational Canvas"

An interactive, AI-powered portfolio website that functions as a conversational interface rather than a traditional static site. Users interact with an AI "Co-Pilot" through commands, receiving both text responses and dynamic visual content.

## 🎯 Project Vision

The entire website experience IS the portfolio demo - a sophisticated conversational interface that showcases technical capabilities through interaction rather than static presentation.

## 🏗️ Architecture

This project is structured as a monorepo with two main components:

### Frontend (`frontend/`)
- **Framework:** React with Vite
- **Styling:** Tailwind CSS with custom theme
- **Animation:** Framer Motion
- **API Communication:** Axios
- **Language:** TypeScript

### Backend (`backend/`)
- **Framework:** Python FastAPI
- **AI Agent:** LangChain
- **Server:** Uvicorn
- **WebSocket:** Real-time communication

## 🎨 Design System

### Color Palette
- **Background:** Off-black (#111111)
- **Primary Text:** Off-white (#EAEAEA)
- **Accent Color:** Electric Green (#00FF41)

### Typography
- **Primary Font:** Inter (AI & UI text)
- **Secondary Font:** JetBrains Mono (user input & code)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-portfolio-website
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:8000`

## 📋 Available Commands

The conversational interface supports these commands:

- `help` - Show available commands
- `list_projects` - Display project portfolio
- `show_project <name>` - Show detailed project case study
- `show_resume` - Display resume with PDF download
- `about_me` - Personal background and story
- `contact_info` - Contact information and links

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Build for Production
```bash
npm run build
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
python -m pytest
```

## 📁 Project Structure

```
ai-portfolio-website/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── styles/         # Styling
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Python backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core logic
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   ├── main.py             # FastAPI app
│   └── requirements.txt
├── .taskmaster/            # Task management
└── package.json           # Root package.json
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API key for LangChain
- `ANTHROPIC_API_KEY` - Anthropic API key (optional)
- `CORS_ORIGINS` - Allowed CORS origins

### Tailwind Configuration
Custom theme configuration is in `frontend/tailwind.config.js` with the project's color palette and typography settings.

## 🚀 Deployment

### Frontend
The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.):

```bash
cd frontend
npm run build
```

### Backend
The backend can be deployed to any Python hosting service (Railway, Heroku, etc.):

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with modern web technologies and AI capabilities to create an innovative portfolio experience. 