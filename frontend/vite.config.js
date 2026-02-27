import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Dosyaların Nginx'in okuduğu yere gittiğinden emin oluyoruz
  }
})