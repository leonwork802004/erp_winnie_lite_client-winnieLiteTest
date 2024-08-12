/// <reference types="vitest" />

import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/tests/setup.ts",
      coverage: {
        provider: "v8",
      },
      testTimeout: 30000,
    },
    resolve: {
      alias: {
        "@api": path.resolve(__dirname, "./src/api"),
        "@appTypes": path.resolve(__dirname, "./src/appTypes"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@tests": path.resolve(__dirname, "./src/tests"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_SERVER_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
