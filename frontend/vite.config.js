import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';


export default defineConfig({
  plugins: [react(),
     visualizer({
      filename: './dist/stats.html',
      open: true,   // build ke baad browser me report khul jaayegi
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

