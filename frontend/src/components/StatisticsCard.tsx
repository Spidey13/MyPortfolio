import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatisticsCardProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: '34', label: 'Total Projects' },
  { value: '8k+', label: 'Lines of Code' },
  { value: '1.2M', label: 'Datapoints Processed' }
];

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  stats = defaultStats
}) => {
  return (
    <div className="bg-[#1E293B] text-white p-5 rounded-sm shadow-md border border-[#111827]/20">
      <h3 className="font-mono font-bold text-[10px] uppercase tracking-widest opacity-60 mb-4 border-b border-white/10 pb-2">
        Quick Stats
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="font-serif font-bold text-3xl text-white">
              {stat.value}
            </span>
            <span className="font-sans text-[10px] opacity-60 uppercase tracking-wide">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCard;
