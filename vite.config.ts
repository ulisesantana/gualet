import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import {resolve} from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@application': resolve(__dirname, 'src/application'),
      '@components': resolve(__dirname, 'src/infrastructure/ui/components'),
      '@data-sources': resolve(__dirname, 'src/infrastructure/data-sources'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@repositories': resolve(__dirname, 'src/infrastructure/repositories'),
      '@views': resolve(__dirname, 'src/infrastructure/ui/views'),
    },
  },
});
