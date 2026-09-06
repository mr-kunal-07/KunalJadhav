# Portfolio article admin setup

The dashboard is at `/admin`. Firebase Console setup is intentionally left to you. No password is stored in the website or this repository, and no live account or security rules were changed while building this feature.

Repository: `C:\Users\kunal.jadhav\Desktop\KunalJadhav`.

## 1. Enable sign-in and create your account

1. Open https://console.firebase.google.com/project/kunal-jadhav-portfolio/authentication/providers.
2. Enable **Email/Password** in Authentication → Sign-in method.
3. In Authentication → Users, add `dev.kunaljadhav@gmail.com` with the password you chose in this conversation. Copy the new user's **UID**.
4. The website's username is **kunal**. It maps to that Firebase email. If you choose a different account email, set `VITE_FIREBASE_ADMIN_EMAIL` to it before rebuilding.
5. Check Authentication → Settings → Authorized domains for `kunaltech.vercel.app` and the local development host if needed.

## 2. Create Firestore and grant your account access

1. Create the project's default Cloud Firestore database in production mode if it does not already exist.
2. In the Firestore Console, create collection `admins` and a document whose ID is the exact **UID** copied above.
3. Add a string field: `role` = `admin`.
4. Paste the repository's `firestore.rules` into Firestore → Rules and publish. These rules deny access to all other collections, so merge them with any existing rules if the project already serves another application. Do not use open/test-mode rules.
5. Recommended for efficient reads: create a composite index for collection `articles`, collection query scope: `status` ascending, `publishedAt` descending. The equivalent configuration is in `firestore.indexes.json`. While this index is missing or building, the public list reads only published articles and sorts them in the browser; it still works, but reads all published documents before showing the newest 100.

Alternatively, after reviewing the rules and installing/signing in to Firebase CLI:

```powershell
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project kunal-jadhav-portfolio
```

Only the Console/Admin SDK can add or remove admins. Browser clients cannot promote themselves. Removing the role document immediately blocks future privileged Firestore requests.

## 3. Enable public articles

Copy `.env.example` to `.env.local` for local development and set:

```dotenv
VITE_FIREBASE_ADMIN_EMAIL=dev.kunaljadhav@gmail.com
VITE_FIREBASE_ARTICLES_ENABLED=true
```

Vite does not load `.env.example`; it is only a template. Restart Vite after changing `.env.local`. For `npm run preview`, run `npm run build` again first: preview serves the existing compiled build. Set the same public build variables in Vercel and redeploy when ready. Never add the login password, service account JSON or private keys to `VITE_` variables.

Visit `/admin`, enter username `kunal` and your chosen password. Create an article, preview it, then save as Draft or Published. The first save fixes its URL slug. Changing Published to Draft and saving removes it from public queries. Deleting asks for confirmation. Session login lasts for the browser session; sign out on shared devices.

Public articles load from Firestore on the homepage, `/articles`, and `/articles/your-slug`. The listing shows the newest 100 published articles. The admin library includes all your articles. New publications appear on the next page load; no rebuild is needed for article content after the feature is enabled.

## Views and likes

Article cards, full article pages and the admin library display Firestore-backed counts. A full article visit records one view per browser profile on the same site. The Like button records one like per browser and then stays in the Liked state; this version does not offer unlike. No login is required for readers. A random ID is stored in browser local storage, without names, email addresses or IP addresses in the engagement documents.

Deploy the updated `firestore.rules` for the new `articles/{slug}/views` and `articles/{slug}/likes` subcollections. Only published articles accept new events under those rules. Events are append-only for visitors, and counts come from Firestore aggregation queries rather than writable numeric totals. The event's article creation timestamp keeps counts separate if a deleted slug is reused. Editing or unpublishing/re-publishing an existing article retains its engagement.

These are approximate browser-based engagement counts, not verified unique-person analytics or fraud-resistant voting. Clearing storage, using another browser/site origin, or deliberately generating new IDs can produce additional events. No historical traffic is backfilled, and no likes are seeded. Counts load on page entry and refresh when the window regains focus; they are not a live stream of all visitors' activity. Admin library/preview visits do not record views, while opening a public article page does.

## Writing and search visibility

The editor supports Markdown headings, lists, links, images by URL, and fenced code blocks. Raw HTML is disabled. There is no image upload or rich-text toolbar in this version.

Each published article gets its own URL, title, description, canonical URL and BlogPosting structured data after loading. Drafts are restricted by Firestore rules. `/admin` is excluded from indexing and the sitemap.

The existing static sitemap includes the portfolio, resume and article index. **Individual Firestore articles are currently rendered in the browser and are not automatically added to that sitemap.** Search engines that render JavaScript can discover linked articles, but indexing is not guaranteed and social preview bots may see generic article metadata. For complete initial HTML, per-article social previews and automatic sitemap entries, add server rendering or a build-time article export with a rebuild trigger. This has not been configured as part of the admin dashboard.

## Verification and troubleshooting

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run check:seo
```

Run security-rule tests against a local emulator (Java and Firebase CLI required; no production data is used):

```powershell
npx firebase-tools emulators:exec --project demo-portfolio-admin --only firestore "node --test scripts/test-firestore-rules.mjs"
```

Verified locally: 24 unit tests and 8 Firestore emulator tests passed, including draft privacy, admin CRUD, denied article writes by visitors, engagement validation, schema validation and role revocation. TypeScript, lint, production build and static SEO checks passed. Live Firebase login and published article reads were also verified. Updated security rules still need to be published in Firebase Console.

This Windows machine's Java runtime needed a temporary TCP fallback for the emulator's internal wakeup pipe. If the emulator reports `Unable to establish loopback connection`, use Java 21 and set `JAVA_TOOL_OPTIONS` for that terminal to `-Djdk.net.unixdomain.tmpdir=` followed by a nonexistent path under your temporary work directory, then rerun the emulator. Java falls back to TCP when the Unix socket cannot bind. This workaround was used only for local testing; no system-wide Java settings were changed.

- Sign-in not enabled: enable Firebase's Email/Password provider and create the account.
- No admin access: confirm `admins/{exact-user-uid}` contains the string `role: admin`.
- Permission denied: check the deployed rules and role document.
- Index required: create the composite index above and wait for it to finish building.
- Coming soon after publishing: enable the public-articles build variable and restart/redeploy.
- Article changed in another session: reopen the article before saving to avoid overwriting someone else's changes.
- Password reset: manage the account through Firebase Authentication. The site has no public registration or account-management endpoint.
