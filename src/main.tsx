import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const root = document.getElementById("root")!;
const route = window.location.pathname.replace(/\/$/, "") || "/";
if (root.dataset.prerendered === route) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
