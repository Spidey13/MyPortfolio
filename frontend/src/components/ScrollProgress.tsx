import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent transform-gpu z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      {/* Subtle glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-accent/30 blur-sm transform-gpu z-40"
        style={{ scaleX, transformOrigin: "0%" }}
      />
    </>
  );
};

export default ScrollProgress;