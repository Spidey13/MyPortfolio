import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FeaturedArticleProps {
  title: string;
  quote?: string;
  description: string;
  image?: string;
  video?: string;
  onClick?: () => void;
  updatedAgo?: string;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  title,
  quote,
  description,
  image,
  video,
  onClick,
  updatedAgo = '14M AGO'
}) => {
  return (
    <section
      className="bg-white border border-ink/10 shadow-sm group cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow duration-500 ease-out overflow-hidden"
      onClick={onClick}
    >
      {/* Video / Image Hero — full width, constrained height */}
      <div className="relative w-full overflow-hidden bg-gray-900">
        <div className="relative w-full" style={{ aspectRatio: '16 / 7' }}>
          {video ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={video}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500 transform-gpu will-change-[filter]"
              src={image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
              alt={title}
              loading="eager"
              decoding="async"
            />
          )}

          {/* Gradient scrim at bottom for readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Breaking News badge */}
          <div className="absolute top-4 left-4 bg-editorial-red text-white font-mono text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-md z-10">
            Breaking News
          </div>

          {/* Live indicator overlay at bottom-left */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-editorial-red animate-pulse" />
            <span className="font-mono text-[10px] text-white/80 font-medium tracking-wide uppercase">
              Updated {updatedAgo}
            </span>
          </div>
        </div>
      </div>

      {/* Content strip — compact horizontal layout */}
      <div className="px-6 py-5 flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
        {/* Left: Title + description */}
        <div className="flex-1 min-w-0">
          <h2
            className="text-2xl md:text-3xl font-serif font-bold leading-[1.1] text-ink mb-2 group-hover:text-editorial-red transition-colors duration-300"
            style={{ textWrap: 'balance' }}
          >
            {title}
          </h2>
          {quote && (
            <p className="font-serif text-sm italic text-ink/60 leading-relaxed line-clamp-2">
              &ldquo;{quote}&rdquo;
            </p>
          )}
          {!quote && description && (
            <p className="font-sans text-sm text-ink/60 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Right: CTA */}
        <motion.div
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex items-center gap-2 shrink-0 md:self-center md:border-l md:border-ink/10 md:pl-8"
        >
          <span className="font-mono text-xs font-bold text-ink group-hover:text-editorial-red transition-colors whitespace-nowrap">
            READ FULL ANALYSIS
          </span>
          <ArrowRight className="text-ink group-hover:text-editorial-red transition-colors" size={14} />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
