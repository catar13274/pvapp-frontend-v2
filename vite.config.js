import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Raspberry Pi optimizations
  build: {
    // Target modern browsers to reduce bundle size
    target: 'es2015',
    // Enable minification with Terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunking for optimal loading
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'clsx'],
          'vendor-data': ['axios', '@tanstack/react-query', 'zustand'],
          'vendor-utils': ['date-fns'],
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps for debugging (disable in production)
    sourcemap: false,
    // Optimize dependencies
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // Development server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses for Pi access
    strictPort: false,
    // API proxy to avoid CORS issues
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // Preview server configuration
  preview: {
    port: 3000,
    host: true,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@tanstack/react-query',
      'zustand',
      'lucide-react',
      'date-fns',
    ],
    exclude: [],
  },
})
