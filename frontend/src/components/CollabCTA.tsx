import React from 'react';
import { Mail, Github, Linkedin, Phone, MessageSquare } from 'lucide-react';
import { trackContactAction } from '../utils/analytics';

interface CollabCTAProps {
  email?: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  onAIChatClick?: () => void;
}

export const CollabCTA: React.FC<CollabCTAProps> = ({
  email,
  phone,
  githubUrl,
  linkedinUrl,
  onAIChatClick
}) => {
  const handleLinkClick = (method: 'email' | 'linkedin' | 'github' | 'phone') => {
    trackContactAction(method);
  };

  return (
    <div className="bg-ink text-paper p-5 shadow-card relative overflow-hidden border-t-4 border-editorial-red rounded-sm">
      {/* Background decoration */}
      <div className="absolute -right-4 -bottom-4 text-white/[0.03] transform -rotate-12">
        <Mail size={120} strokeWidth={1.5} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/50">
            Available Now
          </span>
        </div>
        <h3 className="font-serif font-bold text-xl mb-1 text-white">
          Get In Touch
        </h3>
        <p className="font-sans text-[11px] text-white/50 mb-4 leading-relaxed">
          Currently seeking full-time AI/ML engineering roles
        </p>

        {/* Contact Links */}
        <div className="flex flex-col gap-2 mb-4">
          {/* Email — Primary CTA */}
          {email && (
            <a
              href={`mailto:${email}`}
              onClick={() => handleLinkClick('email')}
              className="flex items-center gap-3 w-full bg-paper text-ink font-mono font-bold text-xs uppercase py-3 px-4 hover:bg-editorial-red hover:text-white transition-[color,background-color] duration-300 ease-out shadow-lg group"
            >
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{email}</span>
              <span className="material-symbols-outlined text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </a>
          )}

          {/* Phone */}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              onClick={() => handleLinkClick('phone')}
              className="flex items-center gap-3 w-full bg-white/10 text-white/90 font-mono text-xs py-2.5 px-4 hover:bg-white/20 transition-colors rounded-sm group"
            >
              <Phone size={13} className="shrink-0 text-white/60" />
              <span>{phone}</span>
              <span className="material-symbols-outlined text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white/40">call</span>
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 border-t border-white/10 pt-3 mb-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('github')}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-wider group"
              aria-label="GitHub profile"
            >
              <Github size={15} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('linkedin')}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-wider group"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={15} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          )}
        </div>

        {/* AI Nudge */}
        <button
          onClick={onAIChatClick}
          className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-sm p-3 transition-colors group cursor-pointer"
        >
          <MessageSquare size={13} className="text-editorial-red shrink-0" />
          <span className="font-sans text-[10px] text-white/60 group-hover:text-white/80 transition-colors text-left leading-relaxed">
            Want to know more? Ask the <span className="text-editorial-red font-bold">AI assistant</span> anything about my work.
          </span>
        </button>
      </div>
    </div>
  );
};

export default CollabCTA;
