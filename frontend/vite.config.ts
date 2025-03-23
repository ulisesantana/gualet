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
      manifest: {
        short_name: "Gualet",
        name: "Gualet",
        icons: [
          {
            src: "icons/gualet.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/png",
          },
          {
            src: "icons/gualet.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "icons/gualet.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        display: "standalone",
        start_url: ".",
        theme_color: "#358A94",
        background_color: "#f9ffff",
        description: "Track your expenses.",
      },
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
        "src/infrastructure/ui/main.tsx",
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
