import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '5174-i0tpuu8675ykppk98o39g-6eb94a25.manusvm.computer',
      '.manusvm.computer'
    ]
  }
})
