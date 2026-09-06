import { build } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFile, writeFile, mkdir, unlink, rmdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { generateSW } from "workbox-build";

await build();
// Use the same React components for initial HTML and interactive hydration.
await build({
  configFile: false,
  plugins: [react()],
  resolve: { alias: { "@": path.resolve("src") } },
  build: { ssr: "src/entry-server.tsx", outDir: ".prerender", emptyOutDir: true, copyPublicDir: false, rollupOptions: { output: { entryFileNames: "entry-server.mjs", inlineDynamicImports: true } } },
  ssr: { noExternal: ["next-themes", "react-intersection-observer"] },
});
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
{
  const { render, SEO_PAGES, SITE_URL, getStructuredData } = await import(pathToFileURL(path.resolve(".prerender/entry-server.mjs")).href);
  const template = await readFile("dist/index.html", "utf8");
  for (const [route, page] of Object.entries(SEO_PAGES)) {
    const content = await render(route);
    let html = template.replace('<div id="root"></div>', `<div id="root" data-prerendered="${route}">${content}</div>`);
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escape(page.title)}</title>`);
    for (const [attribute, key, value] of [
      ["name", "description", page.description], ["name", "robots", page.robots],
      ["property", "og:title", page.title], ["property", "og:description", page.description],
      ["property", "og:url", SITE_URL + page.path], ["name", "twitter:title", page.title],
      ["name", "twitter:description", page.description],
    ]) html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${SITE_URL + page.path}" />`);
    const data = getStructuredData(route);
    if (data) html = html.replace("</head>", `<script id="profile-structured-data" type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script></head>`);
    if (route !== "/") html = html.replace(/<link\b(?=[^>]*as="image")[^>]*>/g, "");
    const destination = route === "/" ? "dist/index.html" : route === "/404" ? "dist/404.html" : path.join("dist", route.slice(1), "index.html");
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
    console.log(`Prerendered ${route}: ${content.length} characters`);
  }
}
// The server bundle is temporary; only dist/ is needed to serve the site.
await unlink(".prerender/entry-server.mjs");
await rmdir(".prerender");
// Recompute HTML revisions after prerendering, preventing stale offline pages.
await generateSW({
  globDirectory: "dist", globPatterns: ["**/*.{js,css,html,webmanifest}"],
  globIgnores: ["sw.js", "workbox-*.js"], swDest: "dist/sw.js",
  navigateFallback: "/index.html", navigateFallbackAllowlist: [/^\/$/],
  cleanupOutdatedCaches: true, clientsClaim: true, skipWaiting: true,
});
