import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['es2020'],
  },

  optimizeDeps: {
    esbuildOptions: { target: 'es2020' },
    include: ['buffer'],
  },
  plugins: [react()],
});
