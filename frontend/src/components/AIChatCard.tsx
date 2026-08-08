import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatCardProps {
  onSendMessage: (message: string) => void;
  aiMessage?: string;
  isAnalyzing?: boolean;
  viewportContent?: {
    type?: string;
    agent?: string;
    content?: string;
  } | null;
}

// Typewriter effect component
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  
  React.useEffect(() => {
    let index = 0;
    setDisplayedText('');
    
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, 15); // Speed of typing
    
    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="prose prose-sm max-w-none text-ink/80 leading-relaxed font-serif">
      {displayedText.split('\n\n').filter(Boolean).map((paragraph, idx) => (
        <p key={idx} className="mb-3 last:mb-0">{paragraph}</p>
      ))}
    </div>
  );
};

/** Phrased as the questions a hiring manager actually has, not as feature demos. */
const STARTER_PROMPTS = [
  'Why should I interview Prathamesh?',
  'What is the hardest thing you have shipped?',
  'Walk me through Codiey.',
] as const;

export const AIChatCard: React.FC<AIChatCardProps> = ({
  onSendMessage,
  aiMessage,
  isAnalyzing,
  viewportContent
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [hasError, setHasError] = useState(false);

  const submitQuery = (query: string) => {
    if (!query.trim() || isAnalyzing) return;
    setHasError(false);
    onSendMessage(query);
    setInputValue('');
    setShowResult(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(inputValue);
  };

  const handleCollapse = () => {
    setShowResult(false);
    setInputValue('');
    setHasError(false);
  };

  const handleAskAnother = () => {
    setShowResult(false);
    setInputValue('');
    setHasError(false);
  };

  // Show result state when we have an AI message or check for error
  React.useEffect(() => {
    if (aiMessage) {
      setShowResult(true);
      setHasError(false);
    }
  }, [aiMessage]);

  // Check for timeout/error after analyzing
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isAnalyzing) {
      // If analyzing for more than 30 seconds, show error
      timeoutId = setTimeout(() => {
        if (isAnalyzing && !aiMessage) {
          setHasError(true);
          setShowResult(true);
        }
      }, 30000);
    }
    return () => clearTimeout(timeoutId);
  }, [isAnalyzing, aiMessage]);

  return (
    <motion.div
      layout
      transition={{ layout: { type: "spring", damping: 30, stiffness: 400 } }}
      className={`relative overflow-hidden shadow-card transition-[shadow,border-color] duration-300 rounded-sm ${
        showResult 
          ? 'bg-[#F9F9F7] border border-ink/10' // "Newspaper" off-white
          : 'bg-ink border-l-4 border-editorial-red'
      }`}
    >
      <AnimatePresence mode="wait">
        {!showResult ? (
          // State 1: Input (Dark Mode / "Command Center")
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-6 relative z-10"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white/90 mb-6">
              <span className="w-2 h-2 rounded-full bg-editorial-red animate-pulse"/>
              Live Correspondent
            </div>
            <p className="font-serif text-2xl font-bold leading-tight text-white mb-8">
              “Ask me about my architecture, decisions, or trade-offs.”
            </p>
            {/* One-tap starters. The card had no suggestions at all, only a blank input,
                and had not been used once since 2026-03-13 -- asking a stranger to invent
                a question about someone they just met is a high bar. */}
            <div className="flex flex-wrap gap-2 mb-4">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitQuery(prompt)}
                  disabled={isAnalyzing}
                  className="text-left font-sans text-[11px] leading-snug text-white/70 bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 hover:border-white/30 rounded-sm px-3 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white/10 backdrop-blur-md rounded-sm border border-white/20 flex items-center hover:border-white/40 transition-colors">
                <input
                  type="text"
                  name="ai-query"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Or ask your own question…"
                  disabled={isAnalyzing}
                  autoComplete="off"
                  className="bg-transparent text-white placeholder-white/40 text-sm font-sans w-full py-3 px-4 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !inputValue.trim()}
                  className="mr-2 p-2 text-white/70 hover:text-white transition-colors disabled:opacity-30"
                >
                  {isAnalyzing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          // State 3: Result (Editorial "Field Note")
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              y: { type: "spring", damping: 24, stiffness: 260 },
              // Tween, not spring — see the note in BentoArchive: a spring on
              // opacity emits scientific-notation values that Firefox drops.
              opacity: { duration: 0.3, ease: "easeOut" }
            }}
            className="p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-ink/5 pb-3">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/40">
                <span className="material-symbols-outlined text-sm">
                  {hasError ? 'warning' : 'feed'}
                </span>
                {hasError ? 'Transmission Error' : 'Field Report'}
              </div>
              <button
                onClick={handleCollapse}
                className="text-ink/40 hover:text-editorial-red transition-colors"
                aria-label="Close report"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            {hasError ? (
              <div className="text-editorial-red font-mono text-xs">
                Connection lost. Please verify network status.
              </div>
            ) : aiMessage ? (
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                <TypewriterText text={aiMessage} />
                <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-ink/30 uppercase">
                    {/* Deliberately not a version number. This said "Gemini 1.5 Flash"
                        while the API called 2.0, which was then retired entirely; the
                        model is now env-configurable, so any pinned label will drift. */}
                    Generated via Google Gemini
                  </span>
                  <button
                     onClick={handleAskAnother}
                     className="font-mono text-[10px] font-bold text-editorial-red hover:underline"
                  >
                    ASK FOLLOW-UP
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-ink/30">
                <span className="material-symbols-outlined text-2xl animate-pulse mb-2">more_horiz</span>
                <span className="font-mono text-[10px] uppercase">Processing Query...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIChatCard;
