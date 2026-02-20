# AI-Powered Portfolio Website - "The Conversational Canvas"

An interactive, AI-powered portfolio website that functions as a conversational interface rather than a traditional static site. Users interact with an AI "Co-Pilot" through commands, receiving both text responses and dynamic visual content.

## 🎯 Project Vision

The entire website experience IS the portfolio demo - a sophisticated conversational interface that showcases technical capabilities through interaction rather than static presentation.

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [**Setup Guide**](docs/SETUP.md) - Instructions for local development, database, and analytics setup.
- [**Deployment Guide**](docs/DEPLOYMENT.md) - How to deploy to Vercel Serverless.
- [**Architecture & Database**](docs/DATABASE.md) - Deep dive into data models and backend architecture.
- [**Design System**](docs/DESIGN.md) - Explanation of the editorial design, typography, and layout.
- [**Analytics & Logs**](docs/ANALYTICS.md) - Guide to PostHog analytics and monitoring.
- [**Logging System**](docs/LOGGING.md) - Details on the backend and frontend logging infrastructure.
- [**Image Assets**](docs/IMAGES.md) - Guidelines for project images and visualizations.

## 🏗️ Architecture

This project uses a unified TypeScript architecture deployed on Vercel:

### Frontend (`frontend/`)
- **Framework:** React with Vite
- **Styling:** Tailwind CSS with custom theme
- **Animation:** Framer Motion
- **Language:** TypeScript
- **Data:** Static TypeScript files (ultra-fast loading)

### Backend (`api/`)
- **Platform:** Vercel Serverless Functions
- **Language:** TypeScript
- **AI:** Google Gemini API
- **Multi-Agent System:** Profile, Project, Career, Demo, Strategic Fit agents
- **Analytics:** PostHog integration
- **Features:** Job analysis, AI chat, intelligent routing

## 🚀 Quick Start

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy `.env.example` to `.env` and add your API keys (Gemini, Turso, PostHog). See [Setup Guide](docs/SETUP.md) for details.

4.  **Start development server:**
    ```bash
    npm run dev
    ```
    Frontend will be available at `http://localhost:5173`.

## 📋 Available Commands

The conversational interface supports these commands:

- `help` - Show available commands
- `list_projects` - Display project portfolio
- `show_project <name>` - Show detailed project case study
- `show_resume` - Display resume with PDF download
- `about_me` - Personal background and story
- `contact_info` - Contact information and links

## 📁 Project Structure

```
Portfolio/
├── api/                     # TypeScript Serverless Functions
│   ├── chat.ts             # AI chat endpoint
│   ├── health.ts           # Health check
│   └── lib/                # Shared libraries (agents, router, gemini, etc.)
├── docs/                    # Documentation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── data/          # Static portfolio data
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── styles/        # Styling
├── scripts/                # Utility scripts
└── package.json           # Root package.json
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