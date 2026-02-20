import React from "react";
import { Link } from "react-router-dom";
import BentoArchive from "../components/BentoArchive";
import ActivityTimeline from "../components/ActivityTimeline";
import ActiveFocusCard from "../components/ActiveFocusCard";
import StatisticsCard from "../components/StatisticsCard";
import CollabCTA from "../components/CollabCTA";
import { ACTIVITIES } from "../data/activities";
import { PORTFOLIO_DATA } from "../data";
import type { Project } from "../data/projects";
import { motion } from "framer-motion";

interface ProjectsArchivePageProps {
  onProjectClick?: (project: Project) => void;
}

export const ProjectsArchivePage: React.FC<ProjectsArchivePageProps> = ({
  onProjectClick,
}) => {
  const portfolioData = PORTFOLIO_DATA;

  const sidebarContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sidebarItem = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#111827] font-sans antialiased">
      {/* Header */}
      <header className="w-full max-w-[1440px] mx-auto px-6 py-6 border-b border-[#E5E5E5] sticky top-0 z-50 bg-[#F9F9F7]/95 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Link
            to="/"
            className="text-2xl font-serif font-bold tracking-tight text-black mb-4 md:mb-0 hover:text-[#991b1b] transition-colors"
          >
            PRATHAMESH PRAVIN MORE
          </Link>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-black/10"></span>
            AI/ML Engineer • Technical Journal
          </div>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-start gap-6 text-xs font-bold tracking-widest uppercase text-gray-500 border-t border-[#E5E5E5] pt-4">
          <Link className="hover:text-black transition-colors" to="/">
            [ Index ]
          </Link>
          <Link className="text-black transition-colors" to="/projects">
            [ Work ]
          </Link>
          <Link className="hover:text-black transition-colors" to="/experience">
            [ Experience ]
          </Link>
          <a className="hover:text-black transition-colors" href="/#research">
            [ Research ]
          </a>
          <a className="hover:text-black transition-colors" href="/#ai-chat">
            [ AI Chat ]
          </a>
          <a
            className="hover:text-black transition-colors"
            href="/#job-analysis"
          >
            [ Job Analysis ]
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Column (3/4) */}
          <div className="w-full lg:w-3/4 flex flex-col gap-10">
            <BentoArchive onProjectClick={onProjectClick} />
          </div>

          {/* Sidebar (1/4) */}
          <motion.aside 
            className="w-full lg:w-1/4 flex flex-col gap-8"
            variants={sidebarContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Activity Log */}
            <motion.div variants={sidebarItem} className="bg-black text-white p-5 rounded-sm shadow-lg border border-gray-800">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#CCFF00]">
                  Activity Log
                </h4>
              </div>
              <ActivityTimeline
                entries={ACTIVITIES.slice(0, 3)}
                isDark={true}
              />
              <div className="mt-6 pt-3 border-t border-gray-800 text-center">
                <Link
                  to="/"
                  className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  View All Activity{" "}
                  <span className="material-symbols-outlined text-[10px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Current Focus */}
            <motion.div 
                variants={sidebarItem}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="bg-[#7C3AED] text-white p-6 rounded-sm relative overflow-hidden group shadow-lg"
            >
              <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                <span className="material-symbols-outlined text-9xl">
                  psychology
                </span>
              </div>
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-200 rounded-full"></span>
                Current Focus
              </h4>
              <h3 className="font-serif text-2xl font-bold mb-4 leading-tight z-10 relative">
                Google build with AI
              </h3>
              <p className="text-xs text-purple-100 mb-6 font-light leading-relaxed z-10 relative border-l border-purple-400/30 pl-3">
                Building and experimenting with AI-powered tools and workflows.
              </p>
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Research Phase</span>
                  <span>69%</span>
                </div>
                <div className="w-full bg-black/20 h-1 rounded-full overflow-hidden">
                  <div className="bg-white h-1 w-[69%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
              </div>
            </motion.div>

            {/* Technical Digest */}
            <motion.div 
                variants={sidebarItem}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="bg-[#F9F9F7] border border-dashed border-gray-300 p-6 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-gray-400 mb-2 group-hover:text-black transition-colors">
                  mail
                </span>
                <h4 className="font-serif text-lg font-bold mb-2">
                  Technical Digest
                </h4>
                <p className="text-xs text-gray-500 mb-4 max-w-[200px] mx-auto">
                  Get monthly insights on AI engineering and system
                  architecture.
                </p>
                <button
                  onClick={() =>
                    window.open(`mailto:${portfolioData.profile?.email}`)
                  }
                  className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-gray-800 transition-colors shadow-md"
                >
                  Subscribe
                </button>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto px-6 py-12 border-t border-[#E5E5E5] mt-12 bg-[#F9F9F7]">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-mono">
          <p>© 2023 Prathamesh Pravin More. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              className="hover:text-black transition-colors"
              href={
                portfolioData.profile?.links?.find((l) => l.type === "twitter")
                  ?.url || "#"
              }
            >
              Twitter
            </a>
            <a
              className="hover:text-black transition-colors"
              href={
                portfolioData.profile?.links?.find((l) => l.type === "linkedin")
                  ?.url || "#"
              }
            >
              LinkedIn
            </a>
            <a
              className="hover:text-black transition-colors"
              href={
                portfolioData.profile?.links?.find((l) => l.type === "github")
                  ?.url || "#"
              }
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectsArchivePage;
