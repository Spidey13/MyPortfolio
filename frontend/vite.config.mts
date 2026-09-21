import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'node:fs/promises'
import path from 'node:path'
import { INDEXABLE_ROUTES, ROUTE_SEO_MANIFEST, SEO, renderSeoHead, absoluteUrl } from './src/seo/routeSeo'

const SEO_START = '<!-- seo:generated:start -->'
const SEO_END = '<!-- seo:generated:end -->'

function withRouteSeo(html: string, route: (typeof ROUTE_SEO_MANIFEST)[number]) {
  const shell = html
    .replace(new RegExp(`${SEO_START}[\\s\\S]*?${SEO_END}\\s*`, 'g'), '')
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/i, '')
  return shell.replace('</head>', `${renderSeoHead(route)}\n  </head>`)
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character] ?? character)
}

function seoBuildPlugin() {
  let outputDirectory = ''

  return {
    name: 'portfolio-seo-assets',
    configResolved(config: { root: string; build: { outDir: string } }) {
      outputDirectory = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const rootShell = await fs.readFile(path.join(outputDirectory, 'index.html'), 'utf8')
      const homepage = ROUTE_SEO_MANIFEST.find((route) => route.path === '/')!
      await fs.writeFile(path.join(outputDirectory, 'index.html'), withRouteSeo(rootShell, homepage))

      for (const route of ROUTE_SEO_MANIFEST.filter((entry) => entry.path.startsWith('/project/') || entry.path === '/demo/diagnostiq')) {
        const routeFile = path.join(outputDirectory, `${route.path.slice(1)}.html`)
        await fs.mkdir(path.dirname(routeFile), { recursive: true })
        await fs.writeFile(routeFile, withRouteSeo(rootShell, route))
      }

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...INDEXABLE_ROUTES.map((route) => `  <url><loc>${escapeXml(absoluteUrl(route.canonicalPath))}</loc></url>`),
        '</urlset>',
        '',
      ].join('\n')
      await fs.writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap)
      await fs.writeFile(path.join(outputDirectory, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SEO.origin}/sitemap.xml\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoBuildPlugin()],
  
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
        target: 'http://localhost:3001',
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
