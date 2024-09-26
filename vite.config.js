import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/popcorn-time/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "src/main.jsx",
      },
    },
  },
});
