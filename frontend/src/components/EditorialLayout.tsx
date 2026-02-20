import React from "react";
import { Link } from "react-router-dom";
import AIChatCard from "./AIChatCard";
import JobAnalysisCard from "./JobAnalysisCard";
import type { PortfolioData } from "../data";
import { ACTIVITIES } from "../data/activities";
import { analyzeJobMatch } from "../utils/backendConnection";
import { trackEvent, trackJobAnalysis, trackError } from "../utils/analytics";

// New Journal Components
import JournalNavbar from "./JournalNavbar";
import JournalMasthead from "./JournalMasthead";
import FeaturedArticle from "./FeaturedArticle";
import ActivityTimeline, { type TimelineEntry } from "./ActivityTimeline";
import TechStackBadges from "./TechStackBadges";
import ActiveFocusCard from "./ActiveFocusCard";
import CollabCTA from "./CollabCTA";
import BentoArchive from "./BentoArchive";

interface EditorialLayoutProps {
  portfolioData: PortfolioData;
  onProjectClick: (project: any) => void;
  onOpenJobAnalysis: () => void;
  onJobAnalysisComplete?: (result: any) => void;
  aiMessage?: string;
  isAnalyzing?: boolean;
  onSendMessage?: (message: string) => void;
  chatViewportContent?: {
    type?: string;
    agent?: string;
    content?: string;
  } | null;
}

export const EditorialLayout: React.FC<EditorialLayoutProps> = ({
  portfolioData,
  onProjectClick,
  onJobAnalysisComplete,
  aiMessage,
  isAnalyzing,
  onSendMessage,
  chatViewportContent,
}) => {
  const [jobAnalysisResult, setJobAnalysisResult] = React.useState<any>(null);
  const [isJobAnalyzing, setIsJobAnalyzing] = React.useState(false);

  // Handle job analysis
  const handleAnalyzeJob = async (jobDescription: string) => {
    setIsJobAnalyzing(true);
    const startTime = Date.now();

    // Track submission
    trackEvent('job_analysis_submitted', {
      job_description_length: jobDescription.length,
      job_description_preview: jobDescription.slice(0, 200),
    });

    try {
      // OPTIMIZED: Removed portfolioData parameter
      const result = await analyzeJobMatch(jobDescription);
      setJobAnalysisResult(result);

      // Track completion with results
      const processingTime = Date.now() - startTime;
      trackJobAnalysis(result?.matchScore, processingTime);
      trackEvent('job_analysis_completed', {
        match_score: result?.matchScore,
        processing_time_ms: processingTime,
        agent_used: result?.agent_used,
      });

      if (onJobAnalysisComplete) {
        onJobAnalysisComplete(result);
      }
    } catch (error) {
      console.error("Job analysis failed:", error);
      trackError('job_analysis_failed', (error as Error).message, 'EditorialLayout.handleAnalyzeJob');
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
      alert(
        `⚠️ Backend offline - Please ensure the backend server is running on ${apiBaseUrl}`,
      );
    } finally {
      setIsJobAnalyzing(false);
    }
  };

  // Prepare data for components
  const featuredProject = portfolioData.projects?.[0]; // F1 Race Strategy Simulator

  // Map all projects for the archive (featured + others)
  const allProjects =
    portfolioData.projects?.map((p: any, idx: number) => ({
      title: p.title,
      tagline: p.star?.task,
      description: p.star?.situation || p.star?.result || "",
      image:
        p.image ||
        `https://via.placeholder.com/600x400/111827/ffffff?text=${encodeURIComponent(p.title)}`,
      version:
        idx === 0
          ? "v2.0"
          : idx === 1
            ? "v1.8"
            : idx === 2
              ? "v1.5"
              : idx === 3
                ? "v1.2"
                : "v1.0",
      technologies: [...(p.technologies || [])],
      stars:
        idx === 0
          ? "1.2k"
          : idx === 1
            ? "842"
            : idx === 2
              ? "654"
              : idx === 3
                ? "423"
                : "312",
      featured: idx === 0, // Only mark the first project as featured for the large card
    })) || [];

  // Activity timeline from activities.ts
  const timelineEntries: TimelineEntry[] = ACTIVITIES;

  // Tech stack from skills
  const allSkills = portfolioData.skills
    ? [
        ...(portfolioData.skills.languages_and_tools || []),
        ...(portfolioData.skills.ml_and_nlp || []),
        ...(portfolioData.skills.cloud_and_mlops || []),
      ]
        .slice(0, 8)
        .map((skill: any) => (typeof skill === "string" ? skill : skill.name))
    : [
        "Python",
        "TensorFlow",
        "PyTorch",
        "React",
        "AWS",
        "Docker",
        "NLP",
        "Kubernetes",
      ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col items-center overflow-x-hidden selection:bg-editorial-red/20">
      {/* Navbar */}
      <JournalNavbar userName={portfolioData.profile?.name?.toUpperCase()} />

      {/* Masthead */}
      <JournalMasthead />

      {/* Main Content */}
      <main className="w-full max-w-[1440px] px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Column (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-12">
          {/* Featured Article */}
          <FeaturedArticle
            title={featuredProject?.title || "Featured Project"}
            quote={(featuredProject as any)?.star?.impact}
            description={(featuredProject as any)?.star?.situation || ""}
            image={(featuredProject as any)?.image}
            onClick={() => featuredProject && onProjectClick(featuredProject)}
          />

          {/* Project Archive - Bento Grid */}
          <section id="work">
            <BentoArchive onProjectClick={onProjectClick} />
          </section>

          {/* Experience Section - Compact & Clean */}
          <section id="experience">
            <div className="flex items-center justify-between border-b border-ink mb-8 pb-3">
              <h3 className="font-mono font-bold text-sm text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  history_edu
                </span>{" "}
                Professional Experience
              </h3>
            </div>

            <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-3">
              {/* Data Scientist Card */}
              {portfolioData.experience?.[0] && (
                <Link
                  to={`/experience/${portfolioData.experience[0].id}`}
                  className="group relative flex bg-white border border-ink/10 hover:shadow-card transition-[shadow,border-color] duration-300 overflow-hidden"
                >
                  {/* Left Accent */}
                  <div className="w-1 bg-gradient-to-b from-[#8B5CF6] to-[#3B82F6] group-hover:w-1.5 transition-[width] duration-300"></div>

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`material-symbols-outlined text-${portfolioData.experience?.[0]?.tag?.color || "[#8B5CF6]"} text-lg`}
                          >
                            {portfolioData.experience?.[0]?.tag?.icon ||
                              "workspace_premium"}
                          </span>
                          <span className="font-mono text-[9px] text-ink/40 uppercase tracking-wider">
                            {portfolioData.experience?.[0]?.tag?.text ||
                              "Current"}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xl text-ink leading-tight mb-1.5 group-hover:text-editorial-red transition-colors">
                          Data Scientist
                        </h4>
                        <p className="font-sans text-sm text-ink font-semibold mb-1">
                          Indiana University
                        </p>
                        <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">
                          May 2024 — Present
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-sm text-ink/70 leading-relaxed mb-4">
                      Processed 550+ academic publications to identify diversity
                      trends, creating the 100% reproducible data framework that
                      secured a peer-reviewed publication in{" "}
                      <i>The Design Journal</i>.
                    </p>

                    <div className="flex items-center gap-2 text-ink/50 group-hover:text-editorial-red transition-colors text-xs font-mono uppercase tracking-wider">
                      <span>Full story</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ML Engineer Card */}
              {portfolioData.experience?.[1] && (
                <Link
                  to={`/experience/${portfolioData.experience[1].id}`}
                  className="group relative flex bg-white border border-ink/10 hover:shadow-card transition-[shadow,border-color] duration-300 overflow-hidden"
                >
                  {/* Left Accent */}
                  <div className="w-1 bg-gradient-to-b from-[#F59E0B] to-[#EF4444] group-hover:w-1.5 transition-[width] duration-300"></div>

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`material-symbols-outlined text-${portfolioData.experience?.[1]?.tag?.color || "[#F59E0B]"} text-lg`}
                          >
                            {portfolioData.experience?.[1]?.tag?.icon ||
                              "trending_up"}
                          </span>
                          <span className="font-mono text-[9px] text-ink/40 uppercase tracking-wider">
                            {portfolioData.experience?.[1]?.tag?.text ||
                              "Series A Prep"}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xl text-ink leading-tight mb-1.5 group-hover:text-editorial-red transition-colors">
                          Machine Learning Engineer
                        </h4>
                        <p className="font-sans text-sm text-ink font-semibold mb-1">
                          Dimensionless Technologies
                        </p>
                        <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">
                          May — Jul 2023
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-sm text-ink/70 leading-relaxed mb-4">
                      Successfully managed requirements for concurrent clients,
                      translating vague business goals into deployed, scalable
                      ML products.
                    </p>

                    <div className="flex items-center gap-2 text-ink/50 group-hover:text-editorial-red transition-colors text-xs font-mono uppercase tracking-wider">
                      <span>Full story</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Full Stack Developer Card */}
              {portfolioData.experience?.[2] && (
                <Link
                  to={`/experience/${portfolioData.experience[2].id}`}
                  className="group relative flex bg-white border border-ink/10 hover:shadow-card transition-[shadow,border-color] duration-300 overflow-hidden"
                >
                  {/* Left Accent */}
                  <div className="w-1 bg-gradient-to-b from-[#10B981] to-[#06B6D4] group-hover:w-1.5 transition-[width] duration-300"></div>

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`material-symbols-outlined text-${portfolioData.experience?.[2]?.tag?.color || "[#10B981]"} text-lg`}
                          >
                            {portfolioData.experience?.[2]?.tag?.icon ||
                              "school"}
                          </span>
                          <span className="font-mono text-[9px] text-ink/40 uppercase tracking-wider">
                            {portfolioData.experience?.[2]?.tag?.text ||
                              "Early Career"}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xl text-ink leading-tight mb-1.5 group-hover:text-editorial-red transition-colors">
                          Full Stack Developer
                        </h4>
                        <p className="font-sans text-sm text-ink font-semibold mb-1">
                          Benchmark Computer Solutions
                        </p>
                        <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">
                          Jun — Dec 2022
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-sm text-ink/70 leading-relaxed mb-4">
                      Built an intelligent candidate screening engine that
                      increased matching accuracy to 91%, drastically reducing
                      the manual effort required to filter resumes.
                    </p>

                    <div className="flex items-center gap-2 text-ink/50 group-hover:text-editorial-red transition-colors text-xs font-mono uppercase tracking-wider">
                      <span>Full story</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* Micro-Experiments */}
          <section className="border-t border-ink/10 pt-6" id="research">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-mono text-xs font-bold text-ink uppercase tracking-widest">
                Research
              </h5>
              <a
                className="font-mono text-[10px] text-editorial-red hover:underline"
                href="https://scholar.google.com/citations?user=hzA9FxwAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Scholar
              </a>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              {(portfolioData.publications || []).map(
                (pub: any, idx: number) => (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={pub.id || idx}
                    className="block"
                  >
                    <li className="flex items-center gap-3 p-3 bg-white border border-ink/5 hover:border-ink/20 transition-colors group cursor-pointer rounded-sm shadow-sm">
                      <span className="material-symbols-outlined text-base text-ink/40 group-hover:text-editorial-red">
                        school
                      </span>
                      <div className="flex flex-col">
                        <span className="font-sans text-sm font-medium text-ink group-hover:text-editorial-red transition-colors">
                          {pub.title}
                        </span>
                        <span className="font-mono text-[10px] text-ink/40">
                          {pub.outlet}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-ink/60">
                          {pub.date}
                        </span>
                        <span className="material-symbols-outlined text-sm text-ink/30">
                          chevron_right
                        </span>
                      </div>
                    </li>
                  </a>
                ),
              )}
            </ul>
          </section>
        </div>

        {/* Right Sidebar (1 col) */}
        <aside className="lg:col-span-1 relative flex flex-col gap-6">
          {/* AI Chat Card */}
          <AIChatCard
            onSendMessage={(message) => {
              if (onSendMessage) {
                onSendMessage(message);
              }
            }}
            aiMessage={aiMessage}
            isAnalyzing={isAnalyzing}
            viewportContent={chatViewportContent}
          />

          {/* Job Analysis Card */}
          <JobAnalysisCard
            onAnalyze={handleAnalyzeJob}
            matchScore={jobAnalysisResult?.matchScore}
            analysisResult={jobAnalysisResult}
            isAnalyzing={isJobAnalyzing}
            onViewReport={() => {
              // Scroll to the full-width strategic analysis section
              const el = document.getElementById('strategic-fit-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />

          {/* Activity Timeline */}
          <ActivityTimeline entries={timelineEntries} />

          {/* Tech Stack */}
          <TechStackBadges technologies={allSkills} />

          {/* Active Focus */}
          <ActiveFocusCard
            title="Google build with AI"
            description="Building and experimenting with AI-powered tools and workflows."
            phase="Research Phase"
            progress={65}
          />

          {/* Collaboration CTA */}
          <CollabCTA
            onEmailClick={() =>
              window.open(`mailto:${portfolioData.profile?.email}`)
            }
            githubUrl={
              portfolioData.profile?.links?.find((l) => l.type === "github")
                ?.url
            }
            linkedinUrl={
              portfolioData.profile?.links?.find((l) => l.type === "linkedin")
                ?.url
            }
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1440px] px-8 py-10 border-t border-ink/10 mt-auto mb-4 bg-paper">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-ink/40 uppercase tracking-widest">
          <p>
            © {new Date().getFullYear()} {portfolioData.profile?.name}. All
            rights reserved.
          </p>
          <p>The Technical Journal • Vol 02</p>
        </div>
      </footer>
    </div>
  );
};

export default EditorialLayout;
