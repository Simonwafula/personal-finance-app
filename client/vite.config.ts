import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
      },
      '/accounts': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Expose VITE_PLATFORM to the app
    'import.meta.env.VITE_PLATFORM': JSON.stringify(process.env.VITE_PLATFORM || 'web'),
  },
  build: {
    // Optimize for tree-shaking
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep SMS features in separate chunk for better tree-shaking
          if (id.includes('features/sms')) {
            return 'sms';
          }
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
