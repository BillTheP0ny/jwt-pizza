import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    react(),
    istanbul({
      include: ['src/**/*'],
      exclude: ['node_modules', 'tests', 'playwright-report', 'coverage'],
      requireEnv: false,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        // ✅ Local: defaults to your local backend
        // ✅ GitHub Actions: set VITE_PIZZA_SERVICE_URL to the deployed backend
        target: process.env.VITE_PIZZA_SERVICE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // allows https targets without cert issues
      },
    },
  },
});
