import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {resolve} from "node:path";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
  base: '/gualet',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
    })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup-tests.ts',
  },
  resolve: {
    alias: {
      '@application': resolve(__dirname, 'src/application'),
      '@components': resolve(__dirname, 'src/infrastructure/ui/components'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@infrastructure': resolve(__dirname, 'src/infrastructure'),
      '@views': resolve(__dirname, 'src/infrastructure/ui/views'),
    },
  },
});
