import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true, // Will fail if port is in use instead of hunting for 5175
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
            if (id.includes('html2canvas') || id.includes('jspdf')) return 'pdf-vendor';
            if (id.includes('tesseract.js')) return 'ocr-vendor';
            if (id.includes('recharts') || id.includes('lucide-react') || id.includes('framer-motion')) return 'ui-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
})
