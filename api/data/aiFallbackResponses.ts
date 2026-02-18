/**
 * AI Fallback Responses for Cold Start
 * These provide immediate value while backend AI is warming up (1-3 minute cold start)
 */

import { PORTFOLIO_DATA } from './index';

export interface FallbackResponse {
  response: string;
  confidence: 'high' | 'medium' | 'low';
  category: 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'publications' | 'general';
}

// Pattern matching for common queries
const queryPatterns = {
  about: [
    /tell me about yourself/i,
    /who are you/i,
    /about me/i,
    /your background/i,
    /introduce yourself/i,
    /your story/i,
  ],
  projects: [
    /projects/i,
    /what have you built/i,
    /show me your work/i,
    /portfolio/i,
    /f1|race|strategy/i,
    /wafer|fault|detection/i,
    /audio|lyric|emotional/i,
  ],
  experience: [
    /experience/i,
    /work history/i,
    /jobs/i,
    /internships/i,
    /where have you worked/i,
    /career/i,
    /indiana university/i,
    /dimensionless/i,
    /benchmark/i,
  ],
  skills: [
    /skills/i,
    /technologies/i,
    /what can you do/i,
    /tech stack/i,
    /programming languages/i,
    /python|react|langchain|mlops/i,
  ],
  contact: [
    /contact/i,
    /email/i,
    /reach out/i,
    /get in touch/i,
    /linkedin/i,
    /github/i,
  ],
  publications: [
    /publications/i,
    /research/i,
    /papers/i,
    /published/i,
    /ieee/i,
    /design journal/i,
  ],
};

const fallbackResponses = {
  about: {
    response: `Hi! I'm Prathamesh Pravin More, an AI/ML Engineer & Data Scientist with an M.S. in Data Science from Indiana University (3.7 GPA). I specialize in productionizing end-to-end Generative AI and Agentic AI solutions.

🎯 **Key Highlights:**
• Architected MLOps pipelines that slashed model retraining time by 10x
• Engineered advanced RAG pipelines using LangChain and vector databases
• Delivered 70% improvement in information retrieval speed and 94% F1-score in production systems
• Published research in IEEE and The Design Journal

I'm passionate about building production-ready AI applications that solve real-world problems!

*🤖 AI features are warming up for more detailed, personalized responses...*`,
    confidence: 'high' as const,
    category: 'about' as const,
  },

  projects: {
    response: `Here are my featured projects that showcase my AI/ML expertise:

🏎️ **F1 Race Strategy Simulator**
• Built a Digital Twin using CatBoost/XGBoost on telemetry data
• Complete MLOps pipeline with MLflow, Docker, FastAPI
• Multi-agent simulation for optimal race strategies

🔬 **Wafer Fault Detection System**
• 94% F1-score anomaly detection on 200+ sensor features
• Real-time monitoring with data drift detection
• 10x faster model retraining through MLOps automation

🎵 **Audio-Lyric Emotional Alignment**
• Agentic AI workflow using LangChain and RAG
• Multimodal analysis with Sentence Transformers & OpenL3
• 92% classification accuracy for emotion-aware music systems

Each project demonstrates end-to-end MLOps, from data engineering to production deployment.

*🔄 AI assistant is starting up to discuss specific technical details and answer deeper questions...*`,
    confidence: 'high' as const,
    category: 'projects' as const,
  },

  experience: {
    response: `My professional experience spans AI/ML engineering and full-stack development:

📊 **Data Science Intern - Indiana University** (May 2024 - Aug 2024)
• Analyzed 550+ design publications using advanced topic modeling
• Built interactive dashboards with Plotly/Dash
• Achieved 93% Topic Coherence, published in The Design Journal

🤖 **ML Engineer Intern - Dimensionless Technologies** (May 2023 - Jul 2023)
• Solo technical lead handling client communications
• Built OCR + QA system (70% speed improvement)
• BERT-based trend analysis pipeline on AWS (0.84 precision)

💻 **Full Stack Developer - Benchmark Computer Solutions** (Aug 2022 - Oct 2022)
• Automated resume screening for 1000+ applications
• Flask API with SpaCy/Transformers NLP
• Improved F1-score from 0.78 to 0.91, reduced screening time by 30%

*⚡ AI co-pilot is warming up to provide deeper insights about my experience and how it relates to your needs...*`,
    confidence: 'high' as const,
    category: 'experience' as const,
  },

  skills: {
    response: `My technical skill set spans the full AI/ML and software development stack:

🧠 **AI/ML & NLP:**
Python, LangChain, RAG, Transformers, LLMs, PyTorch, TensorFlow, Scikit-learn, SpaCy, NLTK, XGBoost, CatBoost

☁️ **Cloud & MLOps:**
AWS (S3, SageMaker, ECS), Azure, MLflow, DVC, Kubeflow, Docker, Kubernetes, CI/CD, FastAPI

🗄️ **Data & Databases:**
SQL, MongoDB, PostgreSQL, MySQL, Firebase, Pinecone (Vector DB), Spark, Hadoop, Airflow

💻 **Development:**
React, TypeScript, Node.js, Python, R, Java, C++, Scala

📊 **Visualization:**
Plotly, Dash, Streamlit, Matplotlib, Seaborn, Power BI, Tableau

I'm particularly strong in building production-ready AI systems that bridge research and real-world applications.

*🎯 AI assistant is starting up to discuss how these skills apply to specific use cases and projects...*`,
    confidence: 'high' as const,
    category: 'skills' as const,
  },

  contact: {
    response: `Let's connect! Here are the best ways to reach me:

📧 **Email:** pramore@iu.edu

🔗 **LinkedIn:** https://linkedin.com/in/more-prathamesh
📱 **GitHub:** https://github.com/Spidey13
📚 **Publications:** https://scholar.google.com/citations?user=hzA9FxwAAAAJ&hl=en
📄 **Resume:** https://tinyurl.com/434tnjd9

🌍 **Location:** Currently seeking full-time opportunities

I'm always excited to discuss AI/ML opportunities, technical challenges, or potential collaborations. Feel free to reach out via any of these channels!

*💬 AI chat features are warming up for more interactive conversations...*`,
    confidence: 'high' as const,
    category: 'contact' as const,
  },

  publications: {
    response: `My research contributions in AI and data science:

📄 **"Modular text-mining framework for DEI themes"**
• Published in The Design Journal (Taylor & Francis) - 2025
• Novel framework for automated analysis of design publications
• Achieved 93% Topic Coherence with LDA, NMF, and K-Means

📄 **"Novel extractive summarization algorithm"**
• Published in IEEE CONIT 2023
• Advanced NLP techniques for automated text summarization
• Demonstrated improved efficiency in information extraction

🎯 **Research Focus:**
My work bridges practical AI applications with academic rigor, focusing on scalable frameworks that solve real-world problems in design research and NLP.

*📚 AI research assistant is starting up to discuss technical details and methodologies...*`,
    confidence: 'high' as const,
    category: 'publications' as const,
  },

  general: {
    response: `I'm an AI/ML Engineer passionate about building production-ready AI applications. I have experience with:

• **Agentic AI & RAG Systems** using LangChain
• **MLOps Pipelines** with Docker, MLflow, and cloud platforms  
• **Full-Stack Development** with React, Python, and FastAPI
• **Research & Publications** in AI and data science

I'm currently seeking full-time opportunities where I can apply my technical skills to solve complex problems at scale.

*🤖 Advanced AI features are warming up to provide more detailed, context-aware responses to your specific questions...*`,
    confidence: 'medium' as const,
    category: 'general' as const,
  },
};

/**
 * Find the best fallback response for a given query
 */
export function getFallbackResponse(query: string): FallbackResponse | null {
  const lowerQuery = query.toLowerCase().trim();
  
  // Check for exact category matches
  for (const [category, patterns] of Object.entries(queryPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerQuery)) {
        return fallbackResponses[category as keyof typeof fallbackResponses];
      }
    }
  }

  // Fallback to general response for longer queries (likely questions)
  if (lowerQuery.length > 15 || lowerQuery.includes('?')) {
    return fallbackResponses.general;
  }

  return null;
}

/**
 * Get a random tip while AI is warming up
 */
export function getWarmupTip(): string {
  const tips = [
    "💡 Pro tip: While AI is starting up, explore the static portfolio content below!",
    "🚀 Fun fact: This portfolio itself is built with React, TypeScript, and AI agents!",
    "⏰ The backend is waking up from sleep mode - this only takes about 60 seconds.",
    "🎯 Tip: Try asking about specific projects, experience, or skills for detailed responses!",
    "🔧 Behind the scenes: The AI is powered by LangChain and Google Gemini.",
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Enhanced fallback response with warming message
 */
export function getEnhancedFallbackResponse(query: string): string {
  const fallback = getFallbackResponse(query);
  
  if (!fallback) {
    return `I can provide information about my projects, experience, skills, publications, and contact details. 

*🔄 AI features are warming up (about 60 seconds) for more detailed, interactive responses...*

${getWarmupTip()}`;
  }

  return fallback.response;
}

export { fallbackResponses };
