# Kunal Jadhav — Portfolio

React 18, TypeScript, Vite, Tailwind CSS, Radix UI and Framer Motion.

The local portfolio was synchronized with https://kunaltech.vercel.app/ on September 6, 2026. It retains the existing Vite project and reproduces the deployed site's visible content and interactions. Instagram and Gmail use the owner's subsequent instructions.

## Run locally

```powershell
npm install
npm run dev
```

The default address is http://127.0.0.1:8080. If that port is occupied:

```powershell
npm run dev -- --port 8086
```

## Routes and features

- `/`: Hero → Experience → About (including Skills) → Projects → Articles → Contact.
- `/#experience`, `/#about`, `/#projects`, `/#contact`: section navigation.
- `/kunal-resume`: embedded résumé viewer with PDF download and open actions.
- `/articles`: dedicated writing page with the approved “Coming soon” state. Add published entries to `src/data/articles.ts`; the homepage displays the first three and this route displays all entries.
- `/Kunal.pdf`: the exact résumé downloaded from the live site.
- Three-image carousel: automatic advance, hover/focus pause, buttons and touch gestures. The white-suit portrait was AI-generated using the owner's public Instagram photos and is labeled "I am a Developer".
- Personal, Education and Achievements tabs; animated 2+ / 3400 / 40+ / 550+ statistics.
- Eight skill categories and five projects with category filtering.
- Shared light/dark theme, floating desktop dock, mobile menu, animated hero waves, scroll progress, back-to-top and PWA support. The hero appears immediately without a timed loading screen.
- Instagram: https://www.instagram.com/the.mr_kunal
- Email: dev.kunaljadhav@gmail.com

## Firebase and Firestore

The browser initializes the supplied `kunal-jadhav-portfolio` Firebase project at startup through `src/lib/firebase.ts`. The module exports `app` and the Cloud Firestore instance `db`; import `db` alongside functions from `firebase/firestore` when adding database features. Startup uses a separate JavaScript chunk so Firebase does not block the initial render.

Firebase Analytics starts in production browsers after checking SDK support. It is skipped during server rendering and local development, and an Analytics failure does not stop the page. Firebase app initialization is reused during hot reloads.

This setup does not create a Firestore database, deploy security rules, or write documents. Database access depends on the existing project's configuration and rules. The Articles section still uses the approved “Coming soon” state; article storage, publishing and pre-rendering from Firestore are not wired yet.

## Email delivery

The live site posts JSON `{ name, email, message }` to `/api/send-email`. The local frontend uses that same contract. Both Vite development and Vite preview proxy this specific path to the existing live site. A successful valid submission sends real email through that service.

The private production email implementation and credentials are not accessible from the public website and are not included here. A standalone production deployment needs a compatible `/api/send-email` backend, or `VITE_CONTACT_API_URL` pointing to a backend that permits the frontend origin. See `.env.example`; never expose server secrets through `VITE_` variables.

For Node installations behind a corporate certificate authority, use the OS certificate store without disabling TLS checks, for example with a Node release supporting:

```powershell
node --use-system-ca node_modules/vite/bin/vite.js --port 8086
```

The form includes validation, remaining-character count, focus on invalid fields, sending/error/success states, timeout cancellation, form reset and a one-minute cooldown after success. Browser checks used invalid submissions only; email transport tests use mocked responses and send no messages.

## Content and assets

- `src/pages/Index.tsx`: page order, header/footer social links, navigation.
- `src/components/sections/`: Hero, Experience, About, Skills, Projects, Contact.
- `src/data/about.ts`: education, achievements and statistics.
- `src/lib/contact.ts`: validation and email API request.
- `src/pages/Resume.tsx`: résumé route.
- `src/index.css`, `src/fonts.css`: theme, design tokens and locally hosted reference fonts.
- `assets/source/`: seven source images used by `npm run optimize:images`, kept outside the deployed public directory.
- `public/hero/`, `public/about-portrait-*.webp`: responsive portrait and carousel images.
- `public/exp/`: redacted offer-letter images and thumbnails used by the current experience entries.
- `public/Kunal.pdf`, `favicon.ico`, PWA icons and `public/fonts/`: local copies of the live assets.

Oohpoint uses a redacted first-page preview from the owner's supplied offer letter. Social metadata uses a purpose-built 1200×630 preview at `/social/kunal-jadhav.jpg`. Only required source images are retained; responsive WebP derivatives serve the carousel, About portrait and letter previews.

The About profile links to the owner's GitHub, LinkedIn and Gmail. The Multi AI achievement's certificate URL is retained from the source site.

The current role is Front-End Developer at IDSSPL Technologies Pvt. Ltd., starting 6 July 2026, as confirmed by the supplied offer letter. Hero, About and Experience reflect this update; Oohpoint runs from January through December 2025 per the owner's instruction. `assets/source/idsspl-redacted.png` and `assets/source/oohpoint-redacted.png` contain only the first pages, with salary amounts (including the IDSSPL amount in words) permanently removed. Surrounding compensation, probation and payment terms remain visible. IDSSPL, Oohpoint and Nestcraft previews open in keyboard-accessible dialogs; full images load only after opening. The original offer PDFs are not included in the site.

## SEO and performance

`npm run build` creates complete HTML for the homepage, résumé and 404 page using the same React components as the browser. React hydrates that HTML on matching routes. Main portfolio sections use synchronous imports so theme updates cannot interrupt a pending lazy hydration boundary. Images below the hero remain lazy-loaded, and full offer letters load on demand.

- `src/data/seo.ts`: page titles, descriptions, canonical domain and Person / WebSite / ProfilePage structured data.
- `src/components/PageSeo.tsx`: keeps metadata accurate during client navigation.
- `scripts/build.mjs`: pre-renders routes and regenerates service-worker revisions after writing the HTML.
- `public/sitemap.xml`: homepage, résumé and articles page; section fragments are not separate pages.
- `public/robots.txt`: crawl guidance and sitemap location.
- `vercel.json`: résumé rewrite, asset cache headers and noindex headers for offer-letter images.
- `scripts/optimize-images.mjs`: regenerates responsive WebP portraits, letter thumbnails and the social preview from local sources. Run `npm run optimize:images` after replacing source images.

The canonical production domain is `https://kunaltech.vercel.app`. If it changes, update `src/data/seo.ts`, `index.html`, `public/sitemap.xml` and `public/robots.txt` together. Use `npm run build` for deployment; `build:dev` is not the SEO production build.

After deployment, verify the production URLs in Google Search Console, submit `/sitemap.xml`, and inspect the homepage and résumé. Confirm unknown routes return HTTP 404 and check real-user Core Web Vitals once data is available. Local checks cannot verify Vercel's deployed status codes or guarantee indexing, rich results or rankings. The existing résumé PDF was copied from the prior live site and should be reviewed for current employment details.

## Verification

Article management is available at `/admin`: Firebase Authentication protects sign-in, and Firestore rules restrict editing to a manually granted admin role. The public article section stays in Coming soon mode until Firebase is configured and `VITE_FIREBASE_ARTICLES_ENABLED=true` is set. Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for the account, role, rules, index and deployment steps, plus the current article SEO limitations.

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run check:seo
npm run preview
```

The production build generates `dist/`. The SEO check validates rendered content, unique titles, canonicals, structured data, sitemap entries, local image references, social-image dimensions and image-size budgets. The Vercel rewrite serves the pre-rendered résumé page directly. Other hosts should map `/kunal-resume` to `kunal-resume/index.html`, serve `404.html` with HTTP 404 for unknown paths, and preserve real asset and API routes.

Use npm and the committed `package-lock.json` for dependencies. Unused starter components, duplicate notification infrastructure, obsolete image variants and the old Bun lockfile have been removed. TypeScript rejects unused imports and parameters. Build-only `.prerender/` files are automatically removed after rendering; `dist/` and `node_modules/` remain ignored generated directories needed for preview and development.

## Lighthouse audits

Run `npm run build`, then `npm run preview -- --port 8088 --strictPort`, and audit the preview URL or the deployed site. The development server on port 8080 includes unminified dependencies, hot reload and React development checks, so its performance score does not describe the production build. Use a clean browser profile without extensions and keep device/throttling settings consistent between runs. Rebuild and reload preview after source changes.

Carousel indicators have 44 × 44 pixel click targets with small visual dots. Images include responsive variants for intermediate display densities, and React 18 uses the lowercase `fetchpriority` attribute. `public/llms.txt` provides a short portfolio index for tools that support it; it does not set crawler permissions or guarantee search rankings.
