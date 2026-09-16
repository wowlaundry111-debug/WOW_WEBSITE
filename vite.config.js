import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],

  build: {
    // Target modern browsers — smaller output, faster execution
    target: 'es2020',

    // Use esbuild for ultra-fast and efficient minification
    minify: 'esbuild',

    // Inline assets <8KB as base64 — eliminates extra HTTP requests for small icons/SVGs
    assetsInlineLimit: 8192,

    // Split CSS per-chunk — critical CSS loads faster with lazy routes
    cssCodeSplit: true,

    // Disable source maps in production for smaller builds and performance
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Realtime socket client is completely standalone
            if (id.includes('socket.io-client') || id.includes('engine.io-client')) {
              return 'vendor-socket';
            }
            // Icon packs are large and static
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // Core react runtime and libraries stay together to avoid circular chunk dependencies
            return 'vendor-app';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },

  server: {
    // Dev server: proxy API calls to avoid CORS issues locally
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  // Optimize dependency pre-bundling — include heavy deps so Vite doesn't re-bundle on cold starts
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
      'socket.io-client',
      'lucide-react',
      'react-hot-toast',
      'react-loading-skeleton',
    ],
  },
})
