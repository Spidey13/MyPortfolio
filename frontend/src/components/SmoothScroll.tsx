import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<any>(null);
  // Set to false for native smooth scrolling (better performance)
  const USE_LENIS = false;

  useEffect(() => {
    if (!USE_LENIS) {
      // Enhanced smooth scrolling with modern CSS and JavaScript
      const smoothScrollCSS = `
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 120px;
        }
        
        body {
          overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = smoothScrollCSS;
      document.head.appendChild(style);
      
      // Enhanced scroll function with momentum and easing
      window.scrollToSection = (sectionId: string, offset = 120) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          // Use requestAnimationFrame for smoother scrolling
          const startPosition = window.pageYOffset;
          const distance = offsetPosition - startPosition;
          const duration = Math.min(Math.abs(distance) / 1.5, 1200); // Dynamic duration
          let start: number | null = null;
          
          const easeInOutQuart = (t: number): number => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
          };
          
          const animateScroll = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const easeProgress = easeInOutQuart(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };
          
          requestAnimationFrame(animateScroll);
        }
      };
      
      return () => {
        if (style && style.parentNode) {
          style.parentNode.removeChild(style);
        }
        document.documentElement.style.scrollBehavior = 'auto';
        delete window.scrollToSection;
      };
    }

    // Lenis smooth scroll initialization (if enabled)
    const initSmoothScroll = async () => {
      try {
        // Dynamic import to handle if Lenis isn't installed yet
        const { default: Lenis } = await import('@studio-freight/lenis');
        
        lenisRef.current = new Lenis({
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',   
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1.2,
          smoothTouch: false,
          touchMultiplier: 1.5,
          infinite: false,
        });

        // Animation frame loop
        function raf(time: number) {
          lenisRef.current?.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Scroll to specific sections
        window.scrollToSection = (sectionId: string) => {
          const element = document.getElementById(sectionId);
          if (element && lenisRef.current) {
            lenisRef.current.scrollTo(element, {
              duration: 1.2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        };

      } catch (error) {
        console.log('Lenis not installed. Using native smooth scroll.');
        
        // Fallback smooth scroll behavior
        window.scrollToSection = (sectionId: string) => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start' 
            });
          }
        };
      }
    };

    if (USE_LENIS) {
      initSmoothScroll();
    }

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;