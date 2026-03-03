import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
      setupFiles: ["./src/setup-tests.ts", "./test/setup-chakra.tsx"],
      coverage: {
        include: ["src"],
        exclude: [
          "src/features/common/infrastructure/http",
          "src/features/common/infrastructure/storage",
          "src/**/application/*repository.ts",
          "src/**/application/repositories.ts",
          "src/**/application/use-case.ts",
          "src/**/domain/types.ts",
          "src/features/common/ui/main.tsx",
          "src/**/index.ts",
          "src/**/*.stories.ts",
          "src/**/*.stories.tsx",
          "src/**/*.test.ts",
          "src/**/*.test.tsx",
        ],
      },
    },
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 3000,
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || "http://localhost:5050",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@features": resolve(__dirname, "src/features"),
        "@common": resolve(__dirname, "src/features/common"),
        "@common/infrastructure": resolve(
          __dirname,
          "src/features/common/infrastructure",
        ),
        "@common/application/use-case": resolve(
          __dirname,
          "src/features/common/application/use-case",
        ),
        "@common/domain/types": resolve(
          __dirname,
          "src/features/common/domain/types",
        ),
        "@common/infrastructure/http": resolve(
          __dirname,
          "src/features/common/infrastructure/http",
        ),
        "@common/ui/components": resolve(
          __dirname,
          "src/features/common/ui/components",
        ),
        "@infrastructure/types": resolve(
          __dirname,
          "src/features/common/infrastructure/types",
        ),
        "@infrastructure/repositories": resolve(
          __dirname,
          "src/features/common/infrastructure",
        ),
        "@infrastructure/ui/App/App": resolve(
          __dirname,
          "src/features/common/ui/App/App",
        ),
        "@domain/models": resolve(__dirname, "src/features/common/domain"),
        "@application/cases": resolve(
          __dirname,
          "src/features/common/application/cases",
        ),
        "@application/repositories": resolve(
          __dirname,
          "src/features/common/application/repositories",
        ),
        "@auth": resolve(__dirname, "src/features/auth"),
        "@auth/application": resolve(
          __dirname,
          "src/features/auth/application",
        ),
        "@categories": resolve(__dirname, "src/features/categories"),
        "@categories/application": resolve(
          __dirname,
          "src/features/categories/application",
        ),
        "@payment-methods": resolve(__dirname, "src/features/payment-methods"),
        "@payment-methods/application": resolve(
          __dirname,
          "src/features/payment/application",
        ),
        "@transactions": resolve(__dirname, "src/features/transactions"),
        "@transactions/application": resolve(
          __dirname,
          "src/features/transactions/application",
        ),
        "@reports": resolve(__dirname, "src/features/reports"),
        "@reports/application": resolve(
          __dirname,
          "src/features/reports/application",
        ),
        "@settings": resolve(__dirname, "src/features/settings"),
        "@settings/application": resolve(
          __dirname,
          "src/features/settings/application",
        ),
        "@test": resolve(__dirname, "test"),
        "@gualet/shared": resolve(__dirname, "../shared/src"),
      },
    },
  };
});
