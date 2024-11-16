import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  define: { global: "window" },
  server: {
    proxy: {
      "/api": {
        target: "https://34.64.87.216/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
        ws: true,
      },
      "/ws": {
        target: "https://www.projectkkk.com/ws/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ""),
        secure: false,
        ws: true,
      },
    },
  },
});
