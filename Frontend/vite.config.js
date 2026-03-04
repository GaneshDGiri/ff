import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // This tells Vite to automatically inject React into your JSX files!
    jsxRuntime: 'automatic',
  })],
})
