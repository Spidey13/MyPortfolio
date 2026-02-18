import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FeaturedArticleProps {
  title: string;
  quote?: string;
  description: string;
  image?: string;
  onClick?: () => void;
  updatedAgo?: string;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  title,
  quote,
  description,
  image,
  onClick,
  updatedAgo = '14M AGO'
}) => {
  return (
    <section className="border-y border-ink/10 bg-white shadow-sm group cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow duration-500 ease-out" onClick={onClick}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-full">
        {/* Image Section */}
        <div className="md:col-span-7 relative overflow-hidden bg-gray-100 min-h-[220px]">
          <img 
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-[filter] duration-500 transform-gpu will-change-[filter]"
            width={800}
            height={450}
            src={image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            alt={title}
            loading="eager"
            decoding="async"
          />
          <div className="absolute top-4 left-4 bg-editorial-red text-white font-mono text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-md z-10">
            Breaking News
          </div>
        </div>
        
        {/* Content Section */}
        <div className="md:col-span-5 p-5 md:p-6 flex flex-col justify-between h-full border-l border-ink/10">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-editorial-red font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-editorial-red animate-pulse"></span>
              UPDATED {updatedAgo}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-[1.05] text-ink mb-4" style={{ textWrap: 'balance' }}>
              {title}
            </h2>
            {quote && (
              <blockquote className="font-serif text-lg italic leading-relaxed text-ink/80 border-l-2 border-editorial-red pl-5 mb-4">
                "{quote}"
              </blockquote>
            )}
            <p className="font-sans text-sm text-ink/60 leading-relaxed">
              {description}
            </p>
          </div>
          <motion.button 
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group/link flex items-center justify-between w-full border-t border-ink/10 pt-4 mt-4"
          >
            <span className="font-mono text-xs font-bold text-ink group-hover/link:text-editorial-red transition-colors">
              READ FULL ANALYSIS
            </span>
            <ArrowRight className="text-sm text-ink group-hover/link:text-editorial-red transition-colors" size={16} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
