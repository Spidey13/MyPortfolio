import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Production build optimization
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          utils: ['axios']
        }
      }
    }
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
<<<<<<< HEAD:frontend/vite.config.ts
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
=======
        target: 'http://localhost:3001',
>>>>>>> feature/vercel-test:frontend/vite.config.mts
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  
  // Preview configuration for production testing
  preview: {
    port: 4173,
    host: true,
  }
})
