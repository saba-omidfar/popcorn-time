import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/popcorn-time/", // Adjust this to match your GitHub Pages subpath
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "src/main.jsx",
        vendor: "src/vendor/index.js",
      },
    },
  },
});
