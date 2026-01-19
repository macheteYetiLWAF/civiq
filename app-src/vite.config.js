import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sud/claude/civiq/app/',
  build: {
    outDir: '../app',
    emptyOutDir: true,
  },
})
