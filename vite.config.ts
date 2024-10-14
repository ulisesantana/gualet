import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
  test: {
    globals: true,
    reporters: ["verbose"],
    environment: "jsdom",
    setupFiles: "./src/setup-tests.ts",
    coverage: {
      include: ["src"],
      exclude: [
        "src/infrastructure/data-sources",
        "src/application/repositories",
        "src/**/index.ts",
        "src/**/*.stories.ts",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@application": resolve(__dirname, "src/application"),
      "@components": resolve(__dirname, "src/infrastructure/ui/components"),
      "@domain": resolve(__dirname, "src/domain"),
      "@infrastructure": resolve(__dirname, "src/infrastructure"),
      "@test": resolve(__dirname, "test"),
      "@views": resolve(__dirname, "src/infrastructure/ui/views"),
    },
  },
});
