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
    response: `Hi! I'm Prathamesh Pravin More, an AI Engineer & Full Stack developer with an M.S. in Data Science from Indiana University (3.6 GPA). I specialize in productionizing end-to-end Generative AI and Agentic AI solutions.

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
    response: `Here are my featured projects that showcase my AI engineering expertise:

🎙️ **Codiey - Voice-First AI Coding Partner**
• Real-time bidirectional voice over Gemini native audio at <200ms latency
• Tree-sitter AST intelligence + personalized PageRank file ranking with a live D3 dependency graph
• Two-tier tool system with Pydantic-enforced schemas keeping the audio loop safe during execution

🔧 **Diagnostiq - AI Technical Support Agent**
• Custom agentic loop on the Anthropic API with a 4-tool architecture and SSE streaming
• Branching diagnostic job cards grounded in the actual HVAC service manual, with multimodal image input
• Dual-embedding RAG pipeline, prompt caching, deployed on GCP Cloud Run

✅ **Queue Whisperer - Human-Approved GitHub Agent in Slack**
• Grounded Q&A over a live GitHub issue queue, with citations to the issues it actually read
• Zero model-initiated writes — every action requires a human Approve click in Slack
• Citation-trace grounding eval regression-checks every prompt or model change

Also: an Autonomous Research Agent (5-agent literature review on AWS Bedrock with MCP servers), ReMind (memory-augmented RAG), an F1 race strategy simulator, and more — see the Work section for full case studies.

*🔄 AI assistant is starting up to discuss specific technical details and answer deeper questions...*`,
    confidence: 'high' as const,
    category: 'projects' as const,
  },

  experience: {
    response: `My professional experience spans AI/ML engineering and full-stack development:

🔬 **Applied AI Engineer - Indiana University** (May 2024 - Jun 2026)
• Built an Agentic RAG platform on Python + Pinecone with hybrid BM25 + semantic retrieval across 550+ academic publications, validated against a faculty-curated relevance set
• Engineered FastAPI/Docker async microservices + spaCy/NMF pipelines serving multiple university departments
• Developed the text-mining pipeline behind a peer-reviewed diversity study published in The Design Journal, with MLflow tracking for full computational reproducibility

🤖 **Machine Learning Engineer - Dimensionless Technologies** (Feb 2023 - Jul 2023)
• Deployed AWS SageMaker MLOps pipeline for real-time stock prediction with sub-100ms inference latency
• Built PropelPro — Azure Functions + Tesseract OCR + BERT pipeline handling 10,000+ enterprise documents/month
• Right-sized compute with spot-instance strategies and CI/CD for automated retraining and deployment

💻 **Full Stack Engineer - Benchmark Computer Solutions** (Jun 2022 - Dec 2022)
• Rebuilt production API with FastAPI + Docker + Redis, cutting P99 latency from 500ms to 300ms
• Fine-tuned Hugging Face Transformer NER model, improving candidate matching F1-score from 78% to 91%
• Built an active-learning loop with uncertainty sampling to continuously improve the model

*⚡ AI co-pilot is warming up to provide deeper insights about my experience and how it relates to your needs...*`,
    confidence: 'high' as const,
    category: 'experience' as const,
  },

  skills: {
    response: `My technical skill set spans the full AI/ML and software development stack:

🧠 **AI/ML & NLP:**
Python, RAG Pipelines, LLMs, Agentic Systems, Prompt Engineering, Hugging Face Transformers, PyTorch, Scikit-learn, XGBoost, CatBoost, spaCy, LangChain, Anthropic Claude, Google Gemini

☁️ **Cloud & MLOps:**
AWS (SageMaker, Lambda, Bedrock), Azure Functions, GCP Cloud Run, Docker, Kubernetes, CI/CD (GitHub Actions), MLflow, FastAPI

🗄️ **Data & Databases:**
SQL, PostgreSQL, MongoDB, Redis, Pinecone, ChromaDB, Pandas, Spark

💻 **Development:**
TypeScript, JavaScript, React, Next.js, Node.js, Express, WebSockets, SSE, D3.js, Java, C++, R

📊 **Visualization:**
Plotly, Dash, Streamlit, Matplotlib, Seaborn

I'm particularly strong in building production-ready AI systems that bridge research and real-world applications.

*🎯 AI assistant is starting up to discuss how these skills apply to specific use cases and projects...*`,
    confidence: 'high' as const,
    category: 'skills' as const,
  },

  contact: {
    response: `Let's connect! Here are the best ways to reach me:

📧 **Email:** prpmore@gmail.com

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

📄 **"An exploratory text-mining approach to analyzing DEI-related issues in eight leading architecture & design firms' publications"**
• Published in The Design Journal (Taylor & Francis) - 2025
• Computational text-mining pipeline (spaCy, NMF topic modeling) across 550+ publications
• Findings independently validated through peer review

📄 **"An algorithmic approach for text summarization"**
• Published at IEEE ICONAT 2023
• Extractive summarization algorithm for automated text analysis
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
