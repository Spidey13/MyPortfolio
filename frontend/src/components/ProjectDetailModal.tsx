import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { trackProjectInteraction, trackContactAction } from "../utils/analytics";
import { PROFILE } from "../data/profile";

const CONTACT_EMAIL = PROFILE.email;

interface ProjectDetailModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * True only for URLs that point at an actual repository, i.e. github.com/<owner>/<repo>.
 * Some projects still carry a bare profile URL (github.com/Spidey13) as their
 * github_url; rendering a "Source Code" button for those sends a hiring manager to a
 * profile page instead of the code, which reads as a dead link.
 */
const isRepoUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith('github.com')) return true; // non-GitHub hosts: trust as given
    return pathname.split('/').filter(Boolean).length >= 2;
  } catch {
    return false;
  }
};

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  // ESC key handler
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0a0a0a]/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-2 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                default: { type: "spring", damping: 25, stiffness: 300 },
                opacity: { duration: 0.25, ease: "easeOut" }
              }}
              className="relative w-full max-w-6xl bg-[#F9F9F7] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]"
              onClick={(e) => e.stopPropagation()}
            >
              
                {/* Visual Column (Left) */}
              <div className="md:w-5/12 relative bg-ink flex flex-col justify-between overflow-hidden group">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  {project.image ? (
                      <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                  ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
                  )}
                  {/* Overlays for readability */}
                  <div className="absolute inset-0 bg-ink/30 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                </div>

                {/* Content Over Image */}
                <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-widest text-white/90">
                         Case No. {project.id.toString().toUpperCase().padStart(3, '0')}
                      </div>
                      <div className="px-2 py-0.5 border border-editorial-red/50 text-[9px] font-mono uppercase tracking-[0.2em] text-editorial-red animate-pulse">
                         Confidential
                      </div>
                   </div>

                   <div>
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[0.95] text-white mb-6 text-balance"
                      >
                          {project.modalPreview.hook}
                      </motion.h2>
                   </div>
                </div>
              </div>

              {/* Content Column (Right) */}
              <div className="md:w-7/12 bg-[#F9F9F7] p-8 md:p-12 md:pl-16 flex flex-col relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-ink/40 hover:text-editorial-red hover:bg-ink/5 rounded-full transition-all group z-50"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">close</span>
                </button>

                <div className="flex-grow flex flex-col justify-center py-4">
                   {/* Tech Stack */}
                   <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                         <span key={i} className="px-3 py-1 rounded-full bg-ink/5 text-ink/60 text-[10px] font-mono uppercase tracking-wide border border-ink/5">
                            {tech}
                         </span>
                      ))}
                      {project.technologies.length > 4 && (
                         <span className="px-3 py-1 text-ink/40 text-[10px] font-mono uppercase tracking-wide">
                            +{project.technologies.length - 4}
                         </span>
                      )}
                   </div>

                   {/* Narrative */}
                   <div className="mb-8">
                      <h3 className="font-mono text-xs text-editorial-red uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-editorial-red/40"></span>
                        Project Brief
                      </h3>
                      <p className="font-serif text-xl md:text-2xl text-ink/90 leading-snug block mb-5">
                         {project.modalPreview.problemTeaser}
                      </p>

                      {/* The outcome. This is the persuasive part and it used to live only
                          on the case study page, which almost nobody reached. */}
                      {(project.star?.result || project.star?.impact) && (
                        <p className="text-sm text-ink/70 leading-relaxed line-clamp-4">
                           {project.star?.result || project.star?.impact}
                        </p>
                      )}
                   </div>

                   {/* Hero Metric + supporting metrics */}
                   <div className="mb-6 flex flex-wrap items-end gap-x-10 gap-y-6">
                      <div className="inline-flex flex-col border-l-2 border-editorial-red pl-6 py-1">
                        <div className="font-serif text-5xl md:text-6xl text-ink leading-[0.8]">
                            {project.modalPreview.heroMetric.value}
                        </div>
                        <div className="font-mono text-xs text-ink/50 uppercase tracking-widest mt-2">
                            {project.modalPreview.heroMetric.label}
                        </div>
                      </div>

                      {/* Was already in the data and rendered nowhere. */}
                      {Array.isArray(project.metrics) && project.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                          {project.metrics
                            .filter((m: { label: string }) => m.label !== project.modalPreview.heroMetric.label)
                            .map((metric: { label: string; value: string }, i: number) => (
                              <div key={i} className="flex flex-col">
                                <span className="font-mono text-sm text-ink/80">{metric.value}</span>
                                <span className="font-mono text-[9px] text-ink/40 uppercase tracking-wider mt-1">
                                  {metric.label}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                   </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-8 flex flex-col gap-4">
                   
                   {/* Technical Actions Row */}
                   <div className="flex flex-col sm:flex-row gap-4 w-full">
                      {project.deployed_url && (
                         <a
                            href={project.deployed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackProjectInteraction(project.title, 'demo')}
                            className="flex-1 group flex items-center justify-center gap-3 px-4 py-3 border border-ink/10 hover:border-editorial-red/50 bg-white hover:bg-editorial-red/5 transition-all duration-300 min-h-[50px]"
                         >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-red opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-editorial-red"></span>
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/70 group-hover:text-editorial-red transition-colors">
                               Live Demo
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-ink/30 group-hover:text-editorial-red/70 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all">
                               arrow_outward
                            </span>
                         </a>
                      )}

                      {/* Falls back to the demo video when there is no hosted demo. Codiey
                          is the most-clicked project on the site and has no deployed_url, so
                          it previously offered no demo action at all despite shipping one. */}
                      {!project.deployed_url && project.video && (
                         <a
                            href={project.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackProjectInteraction(project.title, 'demo')}
                            className="flex-1 group flex items-center justify-center gap-3 px-4 py-3 border border-ink/10 hover:border-editorial-red/50 bg-white hover:bg-editorial-red/5 transition-all duration-300 min-h-[50px]"
                         >
                            <span className="material-symbols-outlined text-[18px] text-ink/40 group-hover:text-editorial-red transition-colors">
                               play_circle
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/70 group-hover:text-editorial-red transition-colors">
                               Watch Demo
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-ink/30 group-hover:text-editorial-red/70 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all">
                               arrow_outward
                            </span>
                         </a>
                      )}

                      {isRepoUrl(project.github_url) && (
                         <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackProjectInteraction(project.title, 'github')}
                            className="flex-1 group flex items-center justify-center gap-3 px-4 py-3 border border-ink/10 hover:border-ink/30 bg-white hover:bg-ink/5 transition-all duration-300 min-h-[50px]"
                         >
                            <span className="material-symbols-outlined text-[18px] text-ink/40 group-hover:text-ink transition-colors">
                               code
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/70 group-hover:text-ink transition-colors">
                               Source Code
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-ink/30 group-hover:text-ink/70 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all">
                                  arrow_outward
                            </span>
                         </a>
                      )}
                   </div>

                   {/* Primary CTA */}
                   <Link
                      to={`/project/${project.id}`}
                      className="group relative w-full bg-ink hover:bg-editorial-red text-white py-5 px-6 md:px-8 flex items-center justify-between overflow-hidden transition-colors duration-500 shadow-xl"
                      onClick={() => {
                        // The single most important click in the funnel, previously untracked.
                        trackProjectInteraction(project.title, 'case_study');
                        onClose();
                      }}
                   >
                      <div className="flex flex-col relative z-10">
                         <span className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-1.5 flex items-center gap-2">
                            <span className="w-2 h-[1px] bg-white/50"></span>
                            Detailed Analysis Available
                         </span>
                         <span className="font-serif text-2xl md:text-3xl italic leading-none group-hover:translate-x-1 transition-transform duration-300">
                            Read Case Study
                         </span>
                      </div>
                      
                      <div className="relative z-10 w-10 h-10 flex items-center justify-center border border-white/20 rounded-full group-hover:bg-white group-hover:text-editorial-red group-hover:border-white transition-all duration-500">
                         <span className="material-symbols-outlined text-xl transition-transform duration-500 group-hover:rotate-0 -rotate-45">
                            arrow_forward
                         </span>
                      </div>
                      
                      {/* Background Texture Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent transition-opacity duration-500" />
                   </Link>

                   {/* Contact at the point of peak intent. The only ask used to live in the
                       sidebar, which visitors pass before they have a reason to care. */}
                   <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                        `Re: ${project.title}`
                      )}`}
                      onClick={() => trackContactAction('email', 'project_modal')}
                      className="group flex items-center justify-center gap-2 py-2 text-ink/50 hover:text-editorial-red transition-colors"
                   >
                      <span className="material-symbols-outlined text-[15px]">mail</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                         Questions about this project? Email me
                      </span>
                   </a>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
