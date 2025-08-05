import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import '../styles/briefing-room.css';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  // Cursor tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations for cursor following
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Transform values for magnetic effects
  const nameOffsetX = useTransform(cursorX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-8, 8]);
  const nameOffsetY = useTransform(cursorY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-4, 4]);
  
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={heroRef}
      className="strategic-briefing-room"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="central-briefing-console">
        {/* Interactive Background Gradient */}
        <motion.div
          className="interactive-cursor-gradient"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        />

        {/* Modern Geometric Accent */}
        <motion.div
          className="modern-geometric-accent"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        />

        {/* Modern Hero Typography */}
        <motion.div 
          className="hero-typography"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Name with Modern Styling */}
          <motion.div 
            className="hero-name-container"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="name-highlight-bar"></div>
            <motion.h1 
              className="hero-large-name"
              style={{
                x: nameOffsetX,
                y: nameOffsetY,
              }}
            >
              <motion.span 
                className="name-part"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                PRATHAMESH
              </motion.span>
              <motion.span 
                className="name-part"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                MORE
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Enhanced Details Grid */}
          <motion.div 
            className="hero-details-grid"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className="hero-role-section"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="label-container">
                <span className="hero-label">DEVELOPER / 2024</span>
                <div className="label-accent"></div>
              </div>
              <motion.h2 
                className="hero-role-title"
                whileHover={{ color: "#0f172a" }}
                transition={{ duration: 0.2 }}
              >
                Full Stack Developer<br />
                <span className="role-accent">& ML Engineer</span>
              </motion.h2>
            </motion.div>
            
            <div className="hero-description-section">
              <p className="hero-description">
                Building intelligent web applications with modern<br />
                frameworks and machine learning integration.
              </p>
              <div className="hero-status">
                <div className="status-indicator">
                  <span className="status-dot"></span>
                  <span className="status-text">Open to new opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="portfolio-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div 
            className="scroll-indicator"
            onClick={() => scrollToSection('about')}
            whileHover={{ 
              scale: 1.02,
              y: -2,
              boxShadow: '0 16px 64px rgba(0, 0, 0, 0.12)'
            }}
            whileTap={{ scale: 0.98 }}
            style={{ cursor: 'pointer' }}
          >
            <span className="scroll-text">View Work</span>
            <motion.div
              className="scroll-arrow"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Portfolio Orb */}
      <motion.div 
        className="absolute top-6 left-6 w-14 h-14 rounded-full flex items-center justify-center border cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.1,
          y: -2,
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9)'
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderColor: 'rgba(15, 23, 42, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)'
        }}
      >
        <motion.span 
          className="text-slate-800 font-semibold text-base" 
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.01em'
          }}
          whileHover={{ scale: 1.05 }}
        >
          PM
        </motion.span>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(15, 23, 42, 0.06)'
          }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.1, 0.3] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
