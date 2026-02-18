import React from 'react';
import { Mail, Github, Linkedin, Link as LinkIcon } from 'lucide-react';

interface CollabCTAProps {
  onEmailClick?: () => void;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export const CollabCTA: React.FC<CollabCTAProps> = ({
  onEmailClick,
  githubUrl,
  linkedinUrl,
  websiteUrl
}) => {
  return (
    <div className="bg-ink text-paper p-6 shadow-card mt-2 relative overflow-hidden group cursor-pointer border-t-4 border-editorial-red">
      <div className="absolute -right-6 -bottom-6 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
        <Mail size={140} strokeWidth={1.5} />
      </div>
      <div className="relative z-10">
        <h3 className="font-serif font-bold text-2xl mb-2 text-white">
          Open for Collab
        </h3>
        <p className="font-sans text-xs text-white/70 mb-5 leading-relaxed pr-4">
          Building a distinct AI solution? Let's discuss architecture and feasibility.
        </p>
        <button 
          onClick={onEmailClick}
          className="w-full bg-paper text-ink font-mono font-bold text-xs uppercase py-3 hover:bg-editorial-red hover:text-white transition-[color,background-color] duration-300 ease-out shadow-lg"
        >
          Email Me
        </button>
        <div className="flex justify-start gap-4 mt-6 border-t border-white/10 pt-4">
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="GitHub profile"
            >
              <Github size={18} />
            </a>
          )}
          {linkedinUrl && (
            <a 
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={18} />
            </a>
          )}
          {websiteUrl && (
            <a 
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Personal website"
            >
              <LinkIcon size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollabCTA;
