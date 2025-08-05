import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const ParallaxBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  
  // Subtle parallax for scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, -50])
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])
  
  // Smooth spring animations for mouse
  const springConfig = { stiffness: 50, damping: 30, restDelta: 0.001 }
  const mouseX = useSpring(mousePosition.x, springConfig)
  const mouseY = useSpring(mousePosition.y, springConfig)

  // Mouse tracking for subtle interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.005,
        y: (e.clientY - window.innerHeight / 2) * 0.005
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Modern Gradient Base */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(240, 100%, 99%) 0%, hsl(220, 100%, 98%) 25%, hsl(200, 100%, 97%) 50%, hsl(240, 100%, 99%) 100%)',
        }}
        animate={{
          background: [
            'linear-gradient(135deg, hsl(240, 100%, 99%) 0%, hsl(220, 100%, 98%) 25%, hsl(200, 100%, 97%) 50%, hsl(240, 100%, 99%) 100%)',
            'linear-gradient(135deg, hsl(200, 100%, 99%) 0%, hsl(240, 100%, 98%) 25%, hsl(220, 100%, 97%) 50%, hsl(200, 100%, 99%) 100%)',
            'linear-gradient(135deg, hsl(220, 100%, 99%) 0%, hsl(200, 100%, 98%) 25%, hsl(240, 100%, 97%) 50%, hsl(220, 100%, 99%) 100%)',
            'linear-gradient(135deg, hsl(240, 100%, 99%) 0%, hsl(220, 100%, 98%) 25%, hsl(200, 100%, 97%) 50%, hsl(240, 100%, 99%) 100%)',
          ]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Abstract Geometric Shapes - Modern Style */}
      <motion.div style={{ y: y1 }}>
        {/* Large ambient circles */}
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%)',
            left: '20%',
            top: '10%',
            x: mouseX,
            y: mouseY,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, rgba(168, 85, 247, 0.01) 50%, transparent 100%)',
            right: '15%',
            top: '40%',
            x: useTransform(mouseX, [0, 1], [0, -0.5]),
            y: useTransform(mouseY, [0, 1], [0, -0.5]),
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>



      {/* Subtle Grid Overlay */}
      <motion.div 
        className="absolute inset-0 opacity-[0.015]"
        style={{ y: y1 }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="modernGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modernGrid)" className="text-slate-400" />
        </svg>
      </motion.div>

      {/* Subtle Interactive Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0.01) 40%, transparent 70%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          x: useTransform(mouseX, [-20, 20], [-30, 30]),
          y: useTransform(mouseY, [-20, 20], [-30, 30]),
        }}
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Modern Noise Texture Overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
        }}
      />
    </div>
  )
}

export default ParallaxBackground
