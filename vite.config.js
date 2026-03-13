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
    chunkSizeWarningLimit: 2000
  }
})
