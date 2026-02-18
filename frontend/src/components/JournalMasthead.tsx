import React from 'react';

interface JournalMastheadProps {
  volume?: string;
  issue?: string;
  date?: string;
  categories?: string[];
}

export const JournalMasthead: React.FC<JournalMastheadProps> = ({
  volume = '02',
  issue = '43',
  date,
  categories = [
    'Machine Learning Engineering',
    'Large Language Models',
    'System Architecture',
    'Data Science'
  ]
}) => {
  const displayDate = date ?? (() => {
    const now = new Date();
    const day = now.getDate();
    const suffix = [11, 12, 13].includes(day) ? 'th'
      : day % 10 === 1 ? 'st'
      : day % 10 === 2 ? 'nd'
      : day % 10 === 3 ? 'rd' : 'th';
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
    const year = now.getFullYear();
    return `${weekday}, ${month} ${day}${suffix}, ${year}`;
  })();

  return (
    <header className="w-full max-w-[1440px] px-4 md:px-8 pt-6 pb-5 border-b border-ink flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-ink/10 pb-4">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-ink uppercase w-full text-center md:text-left font-serif"
        >
          The Technical<br/>
          <span className="pl-2 md:pl-4 italic font-medium text-editorial-red">Journal</span>
        </h1>
        <div className="flex flex-col items-end md:pb-2 mt-6 md:mt-0 w-full md:w-auto text-right min-w-max">
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2 py-0.5 border border-ink/20 text-[10px] font-mono uppercase tracking-wider">
              Vol. {volume}
            </span>
            <span className="px-2 py-0.5 border border-ink/20 text-[10px] font-mono uppercase tracking-wider">
              Iss. {issue}
            </span>
          </div>
          <p className="font-mono text-sm font-bold text-ink">{displayDate}</p>
        </div>
      </div>
      <div className="flex justify-between items-center font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-ink/60 w-full overflow-x-auto whitespace-nowrap gap-8 pb-2">
        {categories.map((category, idx) => (
          <React.Fragment key={category}>
            <span>{category}</span>
            {idx < categories.length - 1 && <span className="text-editorial-red">•</span>}
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};

export default JournalMasthead;
