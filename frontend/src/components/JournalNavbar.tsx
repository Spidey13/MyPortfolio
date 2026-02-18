import React from 'react';

interface JournalNavbarProps {
  userName?: string;
}

export const JournalNavbar: React.FC<JournalNavbarProps> = ({ 
  userName = 'PRATHAMESH PRAVIN MORE'
}) => {
  return (
    <nav className="w-full border-b border-ink/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-12 flex items-center justify-between font-mono text-xs md:text-sm tracking-tight text-ink">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <a 
            className="hover:text-editorial-red transition-colors font-bold uppercase whitespace-nowrap cursor-pointer" 
            href="#"
          >
            Index
          </a>
          <a className="hover:text-editorial-red transition-colors hidden sm:block uppercase whitespace-nowrap" href="#work">
            Work
          </a>
          <a className="hover:text-editorial-red transition-colors hidden sm:block uppercase whitespace-nowrap" href="#experience">
            Experience
          </a>
          <a className="hover:text-editorial-red transition-colors hidden sm:block uppercase whitespace-nowrap" href="#research">
            Research
          </a>
          <a className="hover:text-editorial-red transition-colors hidden sm:block uppercase whitespace-nowrap" href="#contact">
            Contact
          </a>
        </div>
        <div className="flex items-center gap-4 pl-4">
          <span className="font-bold hidden md:inline">{userName}</span>
          <span className="font-bold md:hidden">P.P. MORE</span>
        </div>
      </div>
    </nav>
  );
};

export default JournalNavbar;
