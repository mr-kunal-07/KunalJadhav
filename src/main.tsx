import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const root = document.getElementById("root")!;
const route = window.location.pathname.replace(/\/$/, "") || "/";
// The private, lazy-loaded admin screen starts from live browser auth state.
// Mount it fresh to avoid a theme/session update interrupting Suspense hydration.
if (root.dataset.prerendered === route && route !== "/admin") hydrateRoot(root, <App />);
else createRoot(root).render(<App />);

// Start Firebase without delaying the initial page render or SSR hydration.
void import("./lib/firebase")
  .then(({ initializeAnalytics }) => {
    // Keep local development visits out of production analytics.
    if (import.meta.env.PROD) return initializeAnalytics();
  })
  .catch((error: unknown) => {
    console.error("Firebase initialization failed.", error);
  });
