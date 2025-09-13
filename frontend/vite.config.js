import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // Ensure CSS variables are available globally
  },
  server: {
    allowedHosts: [
      "eebe1028b3a5.ngrok-free.app", // 👈 your ngrok domain
    ],
    port: 5173,
  },
})
