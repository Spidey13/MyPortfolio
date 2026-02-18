import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EXPERIENCE } from "../data/experience";

// Component to display competencies with expand/collapse functionality
const CompetenciesList: React.FC<{ items: string[] }> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 3);

  return (
    <div>
      <div className="space-y-1.5">
        {visibleItems.map((item, idx) => (
          <div
            key={idx}
            className="text-xs text-primary/70 leading-relaxed pl-4 relative"
          >
            <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-accent rounded-full"></span>
            {item}
          </div>
        ))}
      </div>
      {items.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[10px] font-mono font-bold text-accent hover:underline"
        >
          {expanded ? `Show Less ↑` : `+${items.length - 3} More ↓`}
        </button>
      )}
    </div>
  );
};

// Component to display soft skills with expand/collapse functionality
const SoftSkillsList: React.FC<{ items: string[] }> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 3);

  return (
    <div>
      <div className="space-y-1.5">
        {visibleItems.map((item, idx) => (
          <div
            key={idx}
            className="text-xs text-primary/70 leading-relaxed pl-4 relative"
          >
            <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-secondary rounded-full"></span>
            {item}
          </div>
        ))}
      </div>
      {items.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[10px] font-mono font-bold text-accent hover:underline"
        >
          {expanded ? `Show Less ↑` : `+${items.length - 3} More ↓`}
        </button>
      )}
    </div>
  );
};

const ExperiencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const experience = EXPERIENCE.find((exp) => exp.id === Number(id));

  if (!experience) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Experience Not Found
          </h1>
          <Link
            to="/"
            className="text-accent hover:underline font-mono text-sm"
          >
            ← Back to Index
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Navigation */}
      <nav className="w-full border-b border-primary/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-12 flex items-center justify-between font-mono text-xs md:text-sm tracking-tight text-primary">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <Link
              className="hover:text-accent transition-colors uppercase whitespace-nowrap"
              to="/"
            >
              Index
            </Link>
            <Link
              className="hover:text-accent transition-colors uppercase whitespace-nowrap"
              to="/#work"
            >
              Work
            </Link>
            <span className="text-accent font-bold uppercase whitespace-nowrap">
              Experience
            </span>
            <Link
              className="hover:text-accent transition-colors uppercase whitespace-nowrap"
              to="/#research"
            >
              Research
            </Link>
          </div>
          <div className="flex items-center gap-4 pl-4">
            <span className="font-bold hidden md:inline">
              PRATHAMESH PRAVIN MORE
            </span>
            <span className="font-bold md:hidden">P.P. MORE</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-accent transition-colors"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Index
          </Link>
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            <span>
              Exp. ID: #{experience.company.substring(0, 2).toUpperCase()}-
              {new Date().getFullYear()}
            </span>
            <span className="text-primary/20">|</span>
            <span>Deep Dive View</span>
          </div>
        </div>

        {/* Article Container */}
        <article className="bg-white border border-primary/10 shadow-card p-6 md:p-12 relative overflow-hidden">
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

          {/* Header */}
          <header className="flex flex-col lg:flex-row justify-between items-start border-b border-primary/10 pb-8 mb-10 gap-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                  Full-Time Role
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                {experience.role}
              </h1>
              <h2 className="font-sans text-xl md:text-2xl font-light text-primary/70 mt-1">
                {experience.company}
                {experience.companyInfo?.industry && (
                  <>
                    {" "}
                    —{" "}
                    <span className="italic font-serif text-primary/90">
                      {experience.companyInfo.industry}
                    </span>
                  </>
                )}
              </h2>
            </div>
            <div className="flex flex-col items-start lg:items-end text-left lg:text-right font-mono text-sm gap-1 text-primary/60 pt-2 min-w-max">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-base">
                  calendar_month
                </span>
                {experience.duration}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                {experience.location}
              </div>
              {experience.companyInfo && (
                <span className="mt-2 px-2 py-1 bg-primary/5 text-[10px] uppercase tracking-wider rounded">
                  {experience.companyInfo.fundingStage}
                  {experience.companyInfo.fundingStage &&
                    experience.companyInfo.size &&
                    " • "}
                  {experience.companyInfo.size}
                </span>
              )}
            </div>
          </header>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left Column - Main Content - STAR Framework */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              {/* Situation & Context */}
              <div className="group">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-accent">
                    hub
                  </span>
                  Situation & Context
                </h3>
                <p className="font-sans text-sm md:text-base text-primary/70 leading-relaxed pl-4 border-l-2 border-primary/10">
                  {experience.star.situation}
                </p>
              </div>

              {/* Task & Challenge */}
              <div className="group">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-accent">
                    assignment
                  </span>
                  Task & Challenge
                </h3>
                <p className="font-sans text-sm md:text-base text-primary/70 leading-relaxed pl-4 border-l-2 border-primary/10">
                  {experience.star.task}
                </p>
              </div>

              {/* Action Taken */}
              <div className="group">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-accent">
                    build
                  </span>
                  Action Taken
                </h3>
                <p className="font-sans text-sm md:text-base text-primary/70 leading-relaxed pl-4 border-l-2 border-primary/10">
                  {experience.star.action}
                </p>
              </div>

              {/* Results Achieved */}
              <div className="group">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-accent">
                    check_circle
                  </span>
                  Results Achieved
                </h3>
                <p className="font-sans text-sm md:text-base text-primary/70 leading-relaxed pl-4 border-l-2 border-primary/10">
                  {experience.star.result}
                </p>
              </div>

              {/* Impact */}
              <div className="group">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-accent">
                    trending_up
                  </span>
                  Impact
                </h3>
                <p className="font-sans text-sm md:text-base text-primary/70 leading-relaxed pl-4 border-l-2 border-primary/10">
                  {experience.star.impact}
                </p>
              </div>

              {/* Architecture */}
              <div className="group">
                <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-accent">
                    architecture
                  </span>
                  Architecture & Technical Design
                </h3>
                <p className="font-sans text-sm md:text-base text-primary/70 leading-relaxed pl-4 border-l-2 border-primary/10">
                  {experience.star.architecture}
                </p>
              </div>
            </div>

            {/* Right Column - Sidebar - HCI-Centric Focus Rail */}
            <aside className="lg:col-span-5 flex flex-col gap-6">
              {/* Primary Metrics Cluster */}
              {experience.metrics && (
                <div className="bg-paper border border-primary/10 rounded-sm p-5">
                  <h3 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4 border-b border-primary/5 pb-2">
                    Impact Snapshot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {experience.metrics.usersScaled && (
                      <div className="bg-primary text-white p-4 border border-primary shadow-card relative overflow-hidden group">
                        <div className="absolute -right-1 -top-1 text-white/5 transform group-hover:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-[48px]">
                            group
                          </span>
                        </div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/60 mb-1">
                          Users Scaled
                        </h4>
                        <span className="font-serif text-xl font-bold">
                          {experience.metrics.usersScaled}
                        </span>
                      </div>
                    )}
                    {experience.metrics.systemUptime && (
                      <div className="bg-accent text-white p-4 border border-accent shadow-card relative overflow-hidden group">
                        <div className="absolute -right-1 -top-1 text-white/10 transform group-hover:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-[48px]">
                            monitoring
                          </span>
                        </div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/80 mb-1">
                          System Uptime
                        </h4>
                        <span className="font-serif text-xl font-bold">
                          {experience.metrics.systemUptime}
                        </span>
                      </div>
                    )}
                    {experience.metrics.costReduction && (
                      <div className="bg-secondary text-white p-4 border border-secondary shadow-card relative overflow-hidden group">
                        <div className="absolute -right-1 -top-1 text-white/5 transform group-hover:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-[48px]">
                            trending_down
                          </span>
                        </div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/60 mb-1">
                          Cost Reduction
                        </h4>
                        <span className="font-serif text-xl font-bold">
                          {experience.metrics.costReduction}
                        </span>
                      </div>
                    )}
                    {experience.metrics.performanceImprovement && (
                      <div className="bg-purple-600 text-white p-4 border border-purple-600 shadow-card relative overflow-hidden group">
                        <div className="absolute -right-1 -top-1 text-white/10 transform group-hover:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-[48px]">
                            bolt
                          </span>
                        </div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-white/80 mb-1">
                          Performance
                        </h4>
                        <span className="font-serif text-xl font-bold">
                          {experience.metrics.performanceImprovement}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div className="bg-paper p-5 border border-primary/10 rounded-sm">
                <h3 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-3 border-b border-primary/5 pb-2">
                  Tech Stack Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-primary/10 text-[10px] font-mono font-bold text-primary shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills & Collaboration Section */}
              <div className="bg-paper p-5 border border-primary/10 rounded-sm">
                <h3 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-3 border-b border-primary/5 pb-2">
                  Skills & Collaboration
                </h3>

                {/* Core Competencies */}
                {experience.competencies &&
                  experience.competencies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-mono text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          build
                        </span>
                        Core Competencies
                      </h4>
                      <CompetenciesList items={experience.competencies} />
                    </div>
                  )}

                {/* Soft Skills */}
                {experience.soft_skills &&
                  experience.soft_skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-mono text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          groups
                        </span>
                        Soft Skills
                      </h4>
                      <SoftSkillsList items={experience.soft_skills} />
                    </div>
                  )}

                {/* Team Collaboration */}
                {experience.teamStructure && (
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        people_alt
                      </span>
                      Team Collaboration
                    </h4>
                    <p className="font-sans text-xs text-primary/70 leading-relaxed">
                      {experience.teamStructure.collaboration ||
                        experience.teamStructure.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Related Artifacts */}
              {experience.artifacts && experience.artifacts.length > 0 && (
                <div className="pt-2">
                  <h3 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-3 border-b border-primary/5 pb-2">
                    Related Artifacts
                  </h3>
                  <div className="space-y-2">
                    {experience.artifacts.map((artifact, idx) => (
                      <a
                        key={idx}
                        className="flex items-center justify-between group p-3 bg-white border border-primary/10 hover:border-accent transition-colors rounded-sm"
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-primary/40 group-hover:text-accent text-sm">
                            {artifact.icon || "description"}
                          </span>
                          <span className="font-sans text-xs font-medium text-primary group-hover:text-accent">
                            {artifact.title}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-xs text-primary/40 group-hover:text-accent">
                          open_in_new
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-primary/10 flex justify-between items-center text-xs font-mono text-primary/40">
            <span>
              Last Verified:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="uppercase tracking-widest">
              Confidential / Public Portfolio Version
            </span>
          </div>
        </article>

        {/* Navigation to Other Experiences */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPERIENCE.filter((exp) => exp.id !== experience.id).map((exp) => (
            <motion.div
              key={exp.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                to={`/experience/${exp.id}`}
                className="group block p-4 bg-white border border-primary/10 hover:border-accent transition-colors h-full"
              >
                <div className="font-mono text-[10px] text-primary/40 uppercase mb-2 flex justify-between items-center">
                  <span>{exp.company}</span>
                  <motion.span 
                    className="material-symbols-outlined text-base opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  >
                    arrow_forward
                  </motion.span>
                </div>
                <div className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors">
                  {exp.role}
                </div>
                <div className="font-mono text-xs text-primary/60 mt-2">
                  {exp.duration}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1440px] mx-auto px-8 py-10 border-t border-primary/10 mt-auto mb-4 bg-paper">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-primary/40 uppercase tracking-widest">
          <p>
            © {new Date().getFullYear()} Prathamesh Pravin More. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <a
              className="hover:text-accent transition-colors"
              href="https://linkedin.com/in/more-prathamesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="hover:text-accent transition-colors"
              href="https://github.com/Spidey13"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="hover:text-accent transition-colors"
              href="https://tinyurl.com/434tnjd9"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>
          <p>The Technical Journal • Vol 02</p>
        </div>
      </footer>
    </div>
  );
};

export default ExperiencePage;
