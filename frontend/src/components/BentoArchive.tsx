import React from "react";
import { PROJECTS, type Project } from "../data/projects";
import SpotlightCard from "./ui/SpotlightCard";
import { motion, type Variants } from "framer-motion";

interface BentoArchiveProps {
  onProjectClick?: (project: Project) => void;
}

export const BentoArchive: React.FC<BentoArchiveProps> = ({
  onProjectClick,
}) => {
  const projects = PROJECTS;

  const handleCardClick = (project: Project) => {
    onProjectClick?.(project);
  };

  const handleKeyDown = (e: React.KeyboardEvent, project: Project) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onProjectClick?.(project);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="w-full">
      {/* Archive Header */}
      <div className="flex items-baseline justify-between border-b border-black pb-4 mb-6">
        <h2 className="font-sans text-xs font-bold uppercase tracking-widest">
          Projects Archive
        </h2>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-gray-500">
            Grid View
          </span>
          <span className="font-mono text-xs text-black border border-black px-1">
            Sort: Latest
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* TOP STORY - Autonomous Research Agent (2x2) - CUSTOM RESTORED HOVER */}
        <motion.div 
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden cursor-pointer bg-white border border-[#E5E5E5]"
            variants={itemVariants}
            onClick={() => handleCardClick(projects[0])}
            onKeyDown={(e) => handleKeyDown(e, projects[0])}
            tabIndex={0}
            role="button"
            aria-label={`View project: ${projects[0].title}`}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 via-cyan-200/20 to-pink-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
            
            {/* Fixed Top Section - Does not move */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20 pointer-events-none">
                <span className="font-mono text-[10px] bg-black text-white px-2 py-1 uppercase tracking-wider">
                    Top Story
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                    Oct 26, 2023
                </span>
            </div>

            {/* Moving Bottom Section - Title & Desc */}
            <div className="absolute bottom-0 left-0 right-0 p-8 transition-transform duration-500 group-hover:-translate-y-12 z-20 pointer-events-none">
               <h2 className="font-serif text-4xl font-medium mb-4 leading-tight text-balance">
                    AI Research Assistant
                </h2>
                <p className="text-gray-800 text-sm leading-relaxed font-medium max-w-md text-balance">
                    Automating literature reviews. Reducing insight time by 85%
                    through multi-domain query ingestion.
                </p> 
            </div>

             {/* Hidden Bottom Links Section - reveals on hover */}
            <div className="absolute bottom-6 left-8 right-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-500 delay-100 z-10 pointer-events-none">
                 <div className="flex gap-2 mb-2">
                    {projects[0].technologies.slice(0,3).map((tech, i) => (
                        <span key={i} className="text-[10px] font-mono border border-gray-200 px-2 py-1 bg-white/50 backdrop-blur-sm">
                            {tech}
                        </span>
                    ))}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#111]">
                    Read Case Study <span className="material-symbols-outlined text-sm">arrow_forward</span>
                 </div>
            </div>
        </motion.div>

        {/* HARDWARE - Wafer Fault Detection (1x2) */}
        <motion.div className="md:col-span-1 md:row-span-2" variants={itemVariants}>
            <SpotlightCard
            className="w-full h-full bg-[#F9F9F7] bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] cursor-pointer border border-[#E5E5E5]"
            onClick={() => handleCardClick(projects[3])}
            onKeyDown={(e) => handleKeyDown(e, projects[3])}
            tabIndex={0}
            role="button"
            ariaLabel={`View project: ${projects[3].title}`}
            >
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-blue-700 font-bold uppercase tracking-wider bg-blue-100 px-1">
                    Hardware
                </span>
                <span className="material-symbols-outlined text-sm text-blue-700">
                    memory
                </span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 leading-tight text-balance">
                {projects[3].title}
                </h3>
                <div className="flex-grow flex items-center justify-center my-4 opacity-80">
                <svg className="w-full h-32" viewBox="0 0 100 100">
                    <rect
                    fill="none"
                    height="80"
                    stroke="#000"
                    strokeWidth="0.5"
                    width="80"
                    x="10"
                    y="10"
                    ></rect>
                    <path
                    d="M10 50 H90 M50 10 V90"
                    stroke="#000"
                    strokeWidth="0.5"
                    ></path>
                    <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="20"
                    stroke="red"
                    strokeWidth="1"
                    ></circle>
                    <circle cx="52" cy="48" fill="red" r="2"></circle>
                </svg>
                </div>
            </div>
            </SpotlightCard>
        </motion.div>

        {/* AUDIO NLP - Lyric Alignment (1x1) */}
        <motion.div className="md:col-span-1 md:row-span-1" variants={itemVariants}>
            <SpotlightCard
            className="w-full h-full bg-white p-5 flex flex-col justify-between cursor-pointer border border-[#E5E5E5]"
            onClick={() => handleCardClick(projects[5])}
            onKeyDown={(e) => handleKeyDown(e, projects[5])}
            tabIndex={0}
            role="button"
            ariaLabel={`View project: ${projects[5].title}`}
            >
            <div>
                <span className="font-mono text-[10px] text-purple-600 uppercase tracking-wider">
                Audio NLP
                </span>
                <h3 className="font-serif text-lg font-bold mt-2 leading-tight group-hover:text-purple-700 transition-colors text-balance">
                Lyric Alignment
                </h3>
            </div>
            <div className="flex items-end justify-between mt-4">
                <div className="flex gap-0.5 h-8 items-end">
                <div className="w-1 bg-purple-200 h-[40%] group-hover:h-[60%] transition-[height] duration-300"></div>
                <div className="w-1 bg-purple-400 h-[70%] group-hover:h-[90%] transition-[height] duration-300 delay-75"></div>
                <div className="w-1 bg-purple-600 h-[50%] group-hover:h-[80%] transition-[height] duration-300 delay-100"></div>
                <div className="w-1 bg-purple-300 h-[30%] group-hover:h-[50%] transition-[height] duration-300 delay-150"></div>
                </div>
                <span className="material-symbols-outlined text-lg text-gray-300 group-hover:text-purple-600 transition-colors">
                arrow_outward
                </span>
            </div>
            </SpotlightCard>
        </motion.div>

        {/* F1 STRATEGY - StratSim (1x1) - CSS Content Swap */}
        <motion.article
          variants={itemVariants}
          className="md:col-span-1 md:row-span-1 bg-gray-50 p-5 flex flex-col justify-between group border-l-4 border-l-black cursor-pointer border border-[#E5E5E5] relative overflow-hidden"
          onClick={() => handleCardClick(projects[2])}
          onKeyDown={(e) => handleKeyDown(e, projects[2])}
          tabIndex={0}
          role="button"
          aria-label={`View project: ${projects[2].title}`}
          whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="relative z-10 w-full">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
              F1 Strategy
            </span>
            <div className="h-10 mt-2 relative">
                {/* Default State */}
                <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-75 group-hover:delay-0">
                    <div className="text-3xl font-serif font-bold text-gray-900">
                      0.05s
                    </div>
                </div>
                {/* Hover State */}
                <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 delay-0 group-hover:delay-75">
                    <span className="text-[11px] font-mono font-bold text-gray-800 leading-tight block">
                      PyTorch · MLflow · Simulation
                    </span>
                </div>
            </div>
             <div className="text-[10px] text-gray-400 uppercase tracking-tight mt-1">
               Lap Time Accuracy
            </div>
          </div>
        </motion.article>

        {/* HEALTHCARE - Prompt Optimization (2x1) - CSS Content Swap */}
        <motion.article
          variants={itemVariants}
          className="md:col-span-2 md:row-span-1 bg-white p-6 flex flex-col md:flex-row gap-6 items-center group cursor-pointer border border-[#E5E5E5]"
          onClick={() => handleCardClick(projects[4])}
          onKeyDown={(e) => handleKeyDown(e, projects[4])}
          tabIndex={0}
          role="button"
          aria-label={`View project: ${projects[4].title}`}
          whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex-1 relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                Healthcare
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold mb-2 text-balance">
              Prompt Optimization for Healthcare NLP
            </h3>
            
            <div className="h-10 relative">
               {/* Default: Problem Teaser */}
               <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-75 group-hover:delay-0">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {projects[4].modalPreview.problemTeaser}
                    </p>
               </div>
               {/* Hover: Tech Stack */}
               <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 delay-0 group-hover:delay-75">
                    <div className="flex gap-2 flex-wrap">
                      {projects[4].technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono border border-gray-200 px-2 py-1 rounded-sm bg-gray-50 text-gray-600">
                          {tech}
                        </span>
                      ))}
                    </div>
               </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col items-end justify-center min-w-[100px] border-l border-gray-100 pl-4 h-full">
            <span className="font-mono text-2xl font-bold text-gray-900">
              {projects[4].modalPreview.heroMetric.value}
            </span>
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider text-right">
              {projects[4].modalPreview.heroMetric.label}
            </span>
            <motion.span 
              className="mt-3 text-[10px] font-bold uppercase flex items-center gap-1 text-gray-400 group-hover:text-black transition-colors"
            >
              Read Study <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
            </motion.span>
          </div>
        </motion.article>

        {/* RESEARCH PROJECT - ReMind (2x1) */}
        <motion.div className="md:col-span-2 md:row-span-1" variants={itemVariants}>
            <SpotlightCard
            className="w-full h-full bg-[#111] text-white p-6 flex flex-col justify-between cursor-pointer border border-[#333]"
            spotlightColor="rgba(204, 255, 0, 0.15)"
            onClick={() => handleCardClick(projects[1])}
            onKeyDown={(e) => handleKeyDown(e, projects[1])}
            tabIndex={0}
            role="button"
            ariaLabel={`View project: ${projects[1].title}`}
            >
            <div className="absolute right-0 top-0 w-32 h-32 bg-gray-800 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                <span className="font-mono text-[10px] text-[#CCFF00] uppercase tracking-wider border border-[#CCFF00]/30 px-2 py-0.5 rounded-full">
                    Research
                </span>
                <h3 className="font-serif text-xl font-medium mt-3 mb-1 text-balance">
                    {projects[1].title}
                </h3>
                <p className="text-xs text-gray-400 font-light">
                    {projects[1].modalPreview.problemTeaser}
                </p>
                </div>
                <span className="material-symbols-outlined text-gray-600 group-hover:text-white transition-colors">
                description
                </span>
            </div>
            <div className="relative z-10 mt-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-700 border border-black flex items-center justify-center text-[8px]">
                    PM
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-600 border border-black flex items-center justify-center text-[8px]">
                    IA
                </div>
                </div>
                <span className="text-[10px] text-gray-500">
                Collaborative Research
                </span>
            </div>
            </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BentoArchive;
