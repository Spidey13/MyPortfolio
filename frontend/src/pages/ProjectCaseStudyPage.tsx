import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PROJECTS } from "../data/projects";

const ProjectCaseStudyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Project Not Found
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

  const caseStudySections = [
    {
      title: "THE CHALLENGE",
      subtitle: "Problem Context & Scope",
      content: project.star.situation,
      icon: "lightbulb",
    },
    {
      title: "THE APPROACH",
      subtitle: "Technical Implementation",
      content: project.star.action,
      icon: "code",
    },
    {
      title: "THE OUTCOME",
      subtitle: "Results & Impact",
      content: project.star.result + " " + project.star.impact,
      icon: "trending_up",
    },
    {
      title: "THE ARCHITECTURE",
      subtitle: "System Design & Decisions",
      content: project.star.architecture,
      icon: "architecture",
    },
  ];

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
            <span className="text-accent font-bold uppercase whitespace-nowrap">
              Work
            </span>
            <Link
              className="hover:text-accent transition-colors uppercase whitespace-nowrap"
              to="/#experience"
            >
              Experience
            </Link>
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
            <span>Project ID: #{project.id.toUpperCase()}</span>
            <span className="text-primary/20">|</span>
            <span>Case Study</span>
          </div>
        </div>

        {/* Article Container */}
        <article className="bg-white border border-primary/10 shadow-card p-6 md:p-12 relative overflow-hidden">
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

          {/* Header */}
          <header className="border-b border-primary/10 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#8B5CF6] rounded-full"></span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6]">
                Production System
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-4">
              {project.title}
            </h1>
            <p className="font-sans text-xl md:text-2xl font-light text-primary/70 max-w-4xl">
              {project.star.task}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-mono text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  code
                </span>
                View Code
              </a>
            </div>
          </header>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-7 flex flex-col gap-12">
              {caseStudySections.map((section, idx) => (
                <div
                  key={idx}
                  className="group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <span className="material-symbols-outlined text-primary group-hover:text-accent transition-colors">
                        {section.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-1">
                        {section.title}
                      </h3>
                      <h4 className="font-serif text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                        {section.subtitle}
                      </h4>
                    </div>
                  </div>
                  <p className="font-sans text-base text-primary/70 leading-relaxed pl-14 border-l-2 border-primary/10 group-hover:border-accent transition-colors">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column - Sidebar */}
            <aside className="lg:col-span-5 flex flex-col gap-8">
              {/* Tech Stack */}
              <div className="bg-paper p-6 border border-primary/10 rounded-sm sticky top-24">
                <h3 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4 border-b border-primary/5 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    build
                  </span>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-primary/10 text-[11px] font-mono font-bold text-primary shadow-sm hover:border-accent hover:text-accent transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Key Metrics */}
                <div className="mt-8 pt-6 border-t border-primary/10">
                  <h4 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4">
                    Key Metrics
                  </h4>
                  <div className="space-y-3">
                    {project.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="font-sans text-xs text-primary/60">
                          {metric.label}
                        </span>
                        <span className="font-mono text-sm font-bold text-primary">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Links */}
                <div className="mt-8 pt-6 border-t border-primary/10">
                  <h4 className="font-mono text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4">
                    External Resources
                  </h4>
                  <div className="space-y-2">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:text-accent transition-colors group"
                    >
                      <span className="material-symbols-outlined text-base">
                        link
                      </span>
                      <span className="group-hover:underline">
                        GitHub Repository
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-primary/40">
            <span>
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="flex items-center gap-4">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                View Source Code
              </a>
              <span className="text-primary/20">|</span>
              <span className="uppercase tracking-widest">
                Open Source Project
              </span>
            </div>
          </div>
        </article>

        {/* Navigation to Other Projects */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROJECTS.filter((p) => p.id !== project.id).map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                to={`/project/${p.id}`}
                className="group block p-4 bg-white border border-primary/10 hover:border-accent transition-colors h-full"
              >
                <div className="font-mono text-[10px] text-primary/40 uppercase mb-2 flex justify-between items-center">
                  <span>Case Study</span>
                  <motion.span 
                    className="material-symbols-outlined text-base opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  >
                    arrow_forward
                  </motion.span>
                </div>
                <div className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors">
                  {p.title}
                </div>
                <div className="font-sans text-xs text-primary/60 mt-2 line-clamp-2">
                  {p.star.task}
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

export default ProjectCaseStudyPage;
