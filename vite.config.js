import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:2606', // Replace with your backend URL
    },
    build: {
      outDir: 'dist', // Make sure this matches your deployment setup
    },
  }
})