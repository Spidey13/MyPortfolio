/**
 * Static Portfolio Data
 * This ensures instant page loads and provides fallback when backend is cold starting
 * Data is identical to backend/app/data/portfolio_data.json
 */

export const STATIC_PORTFOLIO_DATA = {
    "profile": {
      "name": "Prathamesh Pravin More",
      "title": "AI/ML Engineer & Data Scientist",
      "summary": "M.S. Data Science graduate specializing in productionizing end-to-end Generative AI and Agentic AI solutions. Proven experience architecting advanced RAG pipelines and deploying full-stack ML applications using Python, LangChain, and MLOps best practices.",
      "location": "Currently seeking full-time opportunities",
      "email": "pramore@iu.edu",
      "highlights": [
        "Architected and operationalized end-to-end MLOps pipelines using Docker, MLflow, and DVC that slashed model retraining time by 10x.",
        "Engineered agentic AI workflows and advanced Retrieval-Augmented Generation (RAG) pipelines using LangChain and vector databases (Pinecone).",
        "Delivered high-impact results, including a 70% improvement in information retrieval speed and a 98% F1-score in a production-level anomaly detection system.",
        "Published research on novel algorithms and text-mining frameworks in outlets including IEEE and The Design Journal."
      ],
      "links": [
        { "type": "github", "url": "https://github.com/Spidey13" },
        { "type": "linkedin", "url": "https://linkedin.com/in/more-prathamesh" },
        { "type": "publications", "url": "https://scholar.google.com/citations?user=hzA9FxwAAAAJ&hl=en" },
        { "type": "resume", "url": "https://tinyurl.com/434tnjd9" }
      ]
    },  
    "education": {
      "degree": "M.S. in Data Science",
      "university": "Indiana University",
      "graduation": "2025",
      "gpa": "3.7/4.0",
      "coursework": [
        "Applied Machine Learning",
        "Statistical Learning",
        "Data Mining",
        "Applied Database Technologies",
        "Mathematical Foundations for Informatics"
      ]
    },
    "experience": [
      {
        "id": 1,
        "role": "Data Science Intern",
        "company": "Indiana University",
        "duration": "05/2024 to Present",
        "location": "Bloomington, IN",
        "star": {
          "situation": "Researchers needed to analyze over 550 design publications for complex DEI themes, a task too large for manual review.",
          "task": "My goal was to architect an automated and reproducible system to analyze these publications, identify trends, and visualize the findings for a non-technical audience.",
          "action": "I engineered advanced topic modeling pipelines using LDA, NMF, and K-Means, and built interactive dashboards with Plotly and Dash for temporal analysis.",
          "result": "The system achieved 93% Topic Coherence, and the modular text-mining framework was accepted for publication in The Design Journal.",
          "impact": "This automated framework enabled reproducible research at scale and provided stakeholders with a self-service tool to explore complex data, directly contributing to a peer-reviewed publication.",
          "architecture": "A modular Python framework was chosen for its flexibility in testing various topic modeling algorithms, while Plotly/Dash provided a low-latency solution for interactive web-based data visualization without requiring a heavy frontend stack."
        },
        "technologies": ["Python", "LDA", "NMF", "K-Means", "Plotly", "Dash", "Scikit-learn"],
        "competencies": [
          "Research & Innovation: Novel Algorithm Development, Academic Research & Publication, Proof-of-Concept Development",
          "Technical Leadership: End-to-End ML Pipeline Architecture, Performance Optimization",
          "Problem Solving: Complex System Analysis, Data-Driven Decision Making"
        ],
        "soft_skills": [
          "Communication: Technical Documentation, Presentation & Public Speaking",
          "Innovation: Creative Problem Solving, Design Thinking, Continuous Improvement",
          "Leadership: Strategic Thinking, Influence & Negotiation"
        ]
      },
      {
        "id": 2,
        "role": "Machine Learning Engineer Intern",
        "company": "Dimensionless Technologies",
        "duration": "03/2023 to 07/2023",
        "location": "Mumbai, India",
        "star": {
          "situation": "As the only technical team member at Dimensionless Technologies, I was responsible for both technical development and direct client communication. The company needed to streamline the processing of industrial documents for tender creation and monitor market trends from news articles.",
          "task": "I was tasked with building and deploying two separate NLP pipelines while managing all client relationships, requirements gathering, and project delivery as the sole technical representative.",
          "action": "I implemented an OCR model with a QA system for documents and devised a BERT-based pipeline using AWS for real-time trend analysis. Additionally, I handled all client communications, requirement discussions, and project presentations, translating technical concepts into business value for stakeholders.",
          "result": "The QA system improved information retrieval speed by 70%, and the trend analysis pipeline achieved a precision of 0.84. Successfully delivered both solutions on time while maintaining excellent client relationships.",
          "impact": "The OCR solution drastically reduced manual data entry and accelerated the tender creation process, while the news pipeline provided the client with timely market insights for strategic decision-making. My direct client engagement led to additional project opportunities.",
          "architecture": "An AWS Lambda-based architecture was selected for the news pipeline to create a serverless, event-driven system that was both cost-effective and highly scalable. The OCR system combined Tesseract for text extraction with a semantic search layer for contextual retrieval."
        },
        "technologies": ["Python", "BERT", "AWS", "OCR", "NLP", "Trend Monitoring"],
        "competencies": [
          "Technical Leadership: End-to-End ML Pipeline Architecture, Production System Design",
          "Problem Solving: Complex System Analysis, Algorithm Design & Optimization",
          "Business Impact: Stakeholder Communication, ROI Analysis & Measurement, Cross-Functional Collaboration"
        ],
        "soft_skills": [
          "Communication: Technical Documentation, Presentation & Public Speaking, Client Relationship Management",
          "Leadership: Strategic Thinking, Decision Making Under Pressure, Influence & Negotiation",
          "Adaptability: Rapid Learning & Skill Acquisition, Change Management, Remote Work Excellence"
        ]
      },
      {
        "id": 3,
        "role": "Full Stack Developer Intern",
        "company": "Benchmark Computer Solutions Pvt. Ltd.",
        "duration": "06/2022 to 12/2022",
        "location": "Mumbai, India",
        "star": {
          "situation": "The recruitment team was manually screening over 1,000 resumes, a process that was slow, labor-intensive, and prone to inconsistencies.",
          "task": "My objective was to automate the extraction of structured data from resumes to accelerate the screening process and improve consistency.",
          "action": "I developed a full-stack Flask application with a RESTful API and engineered advanced NLP modules using SpaCy and Transformers for parsing.",
          "result": "The application reduced recruiter screening time by 30% and improved the entity extraction F1-score from 0.78 to 0.91.",
          "impact": "This tool directly improved hiring efficiency, allowing the HR team to focus on higher-quality candidates and significantly shortening the hiring funnel.",
          "architecture": "A Flask backend was chosen for its lightweight nature and ease of developing RESTful APIs. The NLP module used a hybrid approach, combining rule-based matching with SpaCy for common entities and a fine-tuned Transformer model for more nuanced extractions."
        },
        "technologies": ["Python", "Flask", "REST API", "SpaCy", "Transformers", "Active Learning"],
        "competencies": [
          "Technical Leadership: Production System Design, Code Review & Mentorship",
          "Problem Solving: Algorithm Design & Optimization, Root Cause Analysis",
          "Business Impact: ROI Analysis & Measurement, Project Management"
        ],
        "soft_skills": [
          "Communication: Technical Documentation, Cross-Cultural Collaboration",
          "Adaptability: Rapid Learning & Skill Acquisition, Agile Methodologies",
          "Innovation: Creative Problem Solving, Continuous Improvement"
        ]
      }
    ],
    "projects": [
      {
        "id": "p1",
        "title": "F1 Race Strategy Simulator",
        "github_url": "#",
        "star": {
          "situation": "F1 race outcomes depend on complex strategic decisions that are difficult to optimize under dynamic, high-stakes race conditions.",
          "task": "The goal was to build a high-fidelity Digital Twin to model race dynamics, simulate entire races, and identify optimal strategies.",
          "action": "I engineered a multi-agent simulation using CatBoost and XGBoost on high-frequency telemetry data and operationalized the system with an end-to-end MLOps pipeline using MLflow, Docker, and FastAPI.",
          "result": "The system accurately modeled critical race variables like tire degradation and lap times, serving actionable strategic insights to an interactive Streamlit dashboard.",
          "impact": "This tool enables powerful 'what-if' analysis, allowing users to test strategies against simulated competitors to find the optimal path to victory and move beyond simple heuristics to data-driven decision-making.",
          "architecture": "A multi-agent simulation architecture was designed, where each 'driver' agent makes decisions based on predictive model outputs. The system was decoupled with a FastAPI backend for the core simulation engine and a Streamlit front-end for interactive analysis."
        },
        "technologies": ["CatBoost", "XGBoost", "MLflow", "DVC", "Docker", "FastAPI", "Streamlit"],
        "featured": true
      },
      {
        "id": "p2",
        "title": "Wafer Fault Detection System",
        "github_url": "#",
        "star": {
          "situation": "In semiconductor manufacturing, accurately detecting wafer defects from high-dimensional sensor data is essential to maintain production yield.",
          "task": "I was tasked with building a high-precision, automated anomaly detection system with a full MLOps lifecycle for continuous monitoring and retraining.",
          "action": "I engineered a classification pipeline using XGBoost and Random Forest and integrated a real-time model monitoring solution with proactive data drift detection.",
          "result": "The system successfully classified wafer defects with a 98% F1-score and the MLOps architecture slashed model retraining time by 10x.",
          "impact": "This system prevents costly manufacturing errors by providing early warnings of production anomalies, leading to a significant reduction in wasted materials and an increase in production yield.",
          "architecture": "The MLOps pipeline was built using MLflow for experiment tracking, DVC for data versioning, and Docker for containerization. A Flask API served the model, which included a separate monitoring module to check for data drift against a baseline schema."
        },
        "technologies": ["XGBoost", "Random Forest", "MLflow", "DVC", "Docker", "Flask", "OpenCV"],
        "featured": true
      },
      {
        "id": "p3",
        "title": "Audio-Lyric Emotional Alignment",
        "github_url": "#",
        "star": {
          "situation": "Understanding the emotional congruence between a song's music (audio) and its lyrics (text) is a complex, multimodal AI challenge that simple recommendation engines fail to capture.",
          "task": "The objective was to build an autonomous agent that could reason about both modalities to quantify this alignment and provide richer contextual understanding.",
          "action": "I engineered an agentic AI workflow using LangChain, implementing a RAG pipeline with Pinecone and using Sentence Transformers and OpenL3 for multimodal analysis.",
          "result": "The system successfully analyzed emotion trends across genres and the use of generative models boosted downstream classification accuracy to 92%.",
          "impact": "This project serves as a proof-of-concept for advanced, emotion-aware music recommendation systems that can provide users with more nuanced and personalized playlists based on the true 'vibe' of a song.",
          "architecture": "A reasoning-and-acting (ReAct) agent was designed in LangChain. The agent was equipped with tools to fetch lyrics, generate multimodal embeddings (Sentence Transformers, OpenL3), and perform similarity analysis. The entire workflow was orchestrated to provide a final congruence score."
        },
        "technologies": ["LangChain", "LLMs", "RAG", "Sentence Transformers", "OpenL3", "PyTorch"],
        "featured": true
      },
      {
        "id": "p4",
        "title": "Perspective-Aware Summarization with Prompt Optimization",
        "github_url": "#",
        "star": {
          "situation": "Healthcare forums have noisy, multi-perspective answers, and manually crafting prompts for LLMs to summarize them is inefficient.",
          "task": "My goal was to create a system that could automatically optimize prompts for an LLM to generate high-quality, perspective-aware summaries.",
          "action": "I developed an Automatic Prompt Optimization (APO) framework using DSPy and designed two novel augmentation methods: injecting keywords from a BERTopic model and adding relevant text spans selected by a custom-trained cross-encoder.",
          "result": "The final model outperformed the baseline by 6-14% across all key metrics (ROUGE, BERTScore), achieving state-of-the-art results on the PUMA dataset.",
          "impact": "This project demonstrates a method to significantly improve controllable text generation without costly LLM fine-tuning, paving the way for more efficient and accurate summarization systems.",
          "architecture": "The system leverages a frozen LLM and treats the prompt as the primary optimizable parameter. A DSPy pipeline manages the optimization loop, which includes a cross-encoder for span ranking and a BERTopic model for keyword extraction."
        },
        "technologies": ["Python", "PyTorch", "DSPy", "Transformers", "BERTopic", "Scikit-Learn"],
        "featured": true
      },
      {
        "id": "p5",
        "title": "AI-Powered Conversational Portfolio",
        "github_url": "#",
        "star": {
          "situation": "Traditional static portfolios are passive and fail to demonstrate a developer's interactive and AI engineering skills directly.",
          "task": "The vision was to build a portfolio where the website experience itself is a live demo of my full-stack and AI capabilities.",
          "action": "I built a full-stack application with a React/TypeScript frontend and a production-grade FastAPI backend, powered by a multi-agent AI system using LangChain and Google Gemini.",
          "result": "The application successfully serves as an interactive portfolio, handling natural language queries with context-aware responses and dynamic content, and features a full production middleware stack (logging, monitoring, rate-limiting).",
          "impact": "This project provides an immediate, engaging demonstration of my technical skills to recruiters and hiring managers, moving beyond static text to a live, interactive showcase of my work.",
          "architecture": "A multi-agent LangChain architecture featuring a router agent that directs queries to specialized agents (Portfolio, General, Contact). The system is served by a FastAPI backend with a comprehensive middleware stack and deployed via CI/CD to Vercel and Render."
        },
        "technologies": ["React", "TypeScript", "FastAPI", "Python", "LangChain", "Google Gemini", "Docker"],
        "featured": true
      }
    ],
    "skills": {
      "languages_and_tools": ["Python", "R", "SQL", "Java", "C++", "Scala", "Spark", "Hadoop", "Airflow"],
      "databases": ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Pinecone"],
      "ml_and_nlp": ["Transformers", "LLMs", "LangChain", "RAG", "PyTorch", "TensorFlow", "Scikit-learn", "SpaCy", "NLTK", "XGBoost", "CatBoost"],
      "cloud_and_mlops": ["AWS (S3, SageMaker, ECS)", "Azure", "MLflow", "DVC", "Kubeflow", "Docker", "Kubernetes", "CI/CD", "FastAPI"],
      "visualization": ["Plotly", "Dash", "Streamlit", "Matplotlib", "Seaborn", "Power BI", "Tableau"]
    },
    "publications": [
      {
        "id": 1,
        "title": "Modular text-mining framework for DEI themes",
        "outlet": "The Design Journal (Taylor & Francis)",
        "date": "2025",
        "related_project_id": null
      },
      {
        "id": 2,
        "title": "Novel extractive summarization algorithm",
        "outlet": "IEEE CONIT 2023",
        "date": "2023",
        "related_project_id": "p4"
      }
    ]
  } as const;
  
  // Type for portfolio data
  export type PortfolioData = typeof STATIC_PORTFOLIO_DATA;