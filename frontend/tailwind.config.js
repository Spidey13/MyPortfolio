/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Modern Pastel Portfolio Design System - 2024
        primary: "#1e293b", // Deep charcoal for text
        secondary: "#64748b", // Medium gray for secondary text
        accent: "#8b5cf6", // Soft pastel purple (primary brand)
        "accent-secondary": "#06b6d4", // Soft pastel teal (secondary brand)
        success: "#10b981", // Soft emerald green
        ink: "#111827", // Editorial text/dark black (journal identity)
        "editorial-red": "#991b1b", // Journal accent red (masthead, links, badges)
        background: "#ffffff", // Pure white background
        surface: "#f8fafc", // Soft gray for cards/surfaces
        paper: "#F9FAFB", // Off-white paper color
        border: "#e2e8f0", // Light gray for borders
        gray: {
          50: "#F7FAFC",
          100: "#EDF2F7",
          200: "#E2E8F0",
          300: "#CBD5E0",
          400: "#A0AEC0",
          500: "#718096",
          600: "#4A5568",
          700: "#2D3748",
          800: "#1A202C",
          900: "#171923",
        },
        // Dark mode colors (refined for minimal aesthetic)
        dark: {
          primary: "#F7FAFC", // Light text for dark mode
          secondary: "#CBD5E0", // Secondary text for dark mode
          background: "#1A202C", // Dark background (softer than pure black)
          surface: "#2D3748", // Dark surface
          border: "#4A5568", // Dark border
        },
      },
      fontFamily: {
        // Typography system
        sans: ["Inter", "system-ui", "sans-serif"], // Primary UI font
        serif: ["Playfair Display", "Georgia", "serif"], // Editorial font for body text
        mono: ["JetBrains Mono", "monospace"], // Command/code font
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem", // Back to 1rem (16px) for minimal design
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
      },
      lineHeight: {
        relaxed: "1.625", // More relaxed line height for minimal design
        loose: "2", // Very loose for headings
      },
      animation: {
        // Breathing Orb and UI animations
        breathing: "breathing 2s ease-in-out infinite",
        "breathing-reduced": "breathing-reduced 4s ease-in-out infinite", // Slower for reduced motion
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-out": "fadeOut 0.3s ease-in-out",
        "pulse-cyan": "pulseCyan 1.5s ease-in-out infinite",
        "orbital-sweep": "orbitalSweep 2.5s ease-in-out",
        typing: "typing 0.6s steps(40, end)",
      },
      keyframes: {
        breathing: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.7",
            boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            transform: "scale(1.02)",
            opacity: "0.9",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
          },
        },
        "breathing-reduced": {
          "0%, 100%": {
            opacity: "0.7",
            boxShadow: "0 0 10px rgba(6, 182, 212, 0.2)",
          },
          "50%": {
            opacity: "0.9",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)",
          },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-10px)" },
        },
        pulseCyan: {
          "0%, 100%": {
            color: "#64748b",
            textShadow: "none",
          },
          "50%": {
            color: "#8b5cf6",
            textShadow: "0 0 8px rgba(139, 92, 246, 0.5)",
          },
        },
        orbitalSweep: {
          "0%": {
            transform: "translate(0, 0) scale(0.5)",
            opacity: "0",
          },
          "10%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "1",
          },
          "90%": {
            transform:
              "translate(calc(100vw - 100px), calc(100vh - 100px)) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform:
              "translate(calc(100vw - 100px), calc(100vh - 100px)) scale(0.8)",
            opacity: "0.8",
          },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },
      borderRadius: {
        widget: "12px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
