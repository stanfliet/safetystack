import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "SafetyStack",
        short_name: "SafetyStack",
        description: "OHS Compliance Platform for SA Construction",
        theme_color: "#1e40af",
        background_color: "#ffffff",
        icons: [{ src: "icon-192.png", sizes: "192x192", type: "image/png" }]
      }
    })
  ],
  server: { host: true, port: 5173 }
});
