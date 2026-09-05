import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

const contactProxy = {
  "/api/send-email": {
    target: "https://kunaltech.vercel.app",
    changeOrigin: true,
  },
};

export default defineConfig({
  server: { host: "127.0.0.1", port: 8080, proxy: contactProxy },
  preview: { host: "127.0.0.1", proxy: contactProxy },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    react(),
    {
      name: "preview-prerendered-routes",
      configurePreviewServer(server) {
        // Mirror the Vercel resume rewrite during production verification.
        server.middlewares.use((request, _response, next) => {
          if (/^\/kunal-resume\/?(?:\?|$)/.test(request.url ?? "")) {
            request.url = request.url!.replace(/^\/kunal-resume\/?/, "/kunal-resume/index.html");
          }
          next();
        });
      },
    },
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: { navigateFallbackAllowlist: [/^\/$/] },
      manifest: {
        name: "Kunal Jadhav - Full Stack Developer",
        short_name: "Kunal.dev",
        description: "Portfolio of Kunal Jadhav",
        theme_color: "#0a0a0a",
        background_color: "#0f0f0f",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
