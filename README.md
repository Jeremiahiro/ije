# Wedding website

An Astro site (server output, deployed on Vercel) for a couple's wedding: schedule, travel,
FAQ, things to do, asoebi, RSVP and a wedding-train sign-up. RSVPs and sign-ups are written to
a Google Sheet.

```sh
corepack enable pnpm   # once per machine; uses the pnpm version pinned in package.json
pnpm install
pnpm dev               # http://localhost:4321
pnpm test
pnpm build
```

pnpm is pinned to 11.x via `packageManager` in `package.json`. pnpm 12 ships as a native
binary that Corepack can't run yet (Corepack 0.36); revisit when Corepack supports it.
On Vercel, set `ENABLE_EXPERIMENTAL_COREPACK=1` so builds use the same pinned version.

## Setting the site up for a new couple

### 1. Identity and settings: `src/config/event.ts`

Names, dates, location, RSVP deadline, production URL, registry link, Google Sheet tab names,
and which pages are switched on. Everything that repeats across the site reads from here.
Disabled pages return 404 and drop out of the nav (restart `pnpm dev` after toggling one).

### 2. Page content: `src/data/`

| File | Page |
|---|---|
| `site-nav.ts` | Home page intro and event previews |
| `schedule.ts` | Schedule: events, times, venues, map and calendar links |
| `travel-flights.ts`, `travel-hotels.ts`, `travel-visa.ts` | Travel |
| `things-to-do.ts` | Things to do |
| `faq.ts` | FAQ |
| `asoebi.ts` | Asoebi |
| `about-wedding-party.ts` | Wedding party |
| `weddingTrain.ts` | Join / wedding train (including the contact person) |

Some copy still lives in components, notably
`src/components/wedding-train/WeddingTrainContent.astro` (event dates) and the page
descriptions in `src/pages/*.astro`. Search for the previous couple's names, cities and dates
before launch.

### 3. Images: `public/`

- `public/assets/couple/1.jpeg` (home hero) and `1–4.webp` (home marquee, gate background)
- `public/assets/logo-n.png`, `logo-icon.png` and the `wedding_*.png` / city `.webp` images
- Favicons (`favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png`)
  and `site.webmanifest`

Files in `public/` are served directly and are **not** behind the password gate.

### 4. Backend: a new Google Sheet per couple

1. Create a Google Cloud service account and download its JSON key.
2. Create a new spreadsheet and share it with the service account email (Editor).
3. Set the environment variables below. The sheet tabs are created on first write.
4. Optional: create the wedding-train tab up front with
   `curl -X POST -H "Authorization: Bearer $ADMIN_SECRET" https://<site>/api/init-train-sheet`

Never reuse the previous couple's spreadsheet: it holds their guests' personal data.

### 5. Environment variables (Vercel → Project → Settings → Environment Variables)

See `.env.example`.

| Variable | Purpose |
|---|---|
| `SITE_GATE_PASSWORD` | Password for the whole site. Empty = public. Checked server-side only. |
| `ADMIN_SECRET` | Bearer token for admin endpoints. Long, random, different from the gate password. |
| `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Google Sheets access |
| `BOTH_NAMES`, `TRAIN_NAMES`, `GROOMSMEN_NAMES` | Comma-separated invitee lists for `/join?n=<name>` |

Do not prefix secrets with `PUBLIC_`; Astro ships those to the browser.

## How the password gate works

`src/middleware.ts` redirects every page request without a valid `site_gate` cookie to
`/unlock` (API routes get a 401). The form posts to `/api/unlock`, which compares the password
on the server and sets an HttpOnly cookie signed with the password (valid 36 hours). Changing
the password signs everyone out.

Pages must stay server-rendered for the gate to apply: don't add `export const prerender = true`
to a page that should be private.

## Known limitations

Open issues to keep in mind (or fix) before handing the site to a couple.

**Security and privacy**

- **Images are public.** Everything in `public/` (couple photos, logo) is served straight from
  Vercel's CDN, bypassing the middleware, so anyone with a direct URL can open it. To protect
  them, move them out of `public/` and serve them through a route the middleware covers.
- **No limit on password attempts.** `/api/unlock` and the admin bearer check accept unlimited
  guesses. Use a password that isn't easy to guess, and a long random `ADMIN_SECRET`. A fix
  would be rate limiting per IP (e.g. Vercel Firewall rules or Upstash Redis).
- **One shared password.** Every guest uses the same password, so it can be passed on freely,
  and revoking access means changing it, which signs everyone out.
- **Prerendered pages skip the gate.** Middleware only runs for server-rendered pages; adding
  `export const prerender = true` to a page makes it public.
- **Form spam.** The RSVP and wedding-train forms only have a honeypot field: no captcha or
  rate limit. With the gate on, only visitors who know the password can submit.
- **New sheet-writing code must escape cells.** Values that start with `=`, `+`, `-` or `@`
  become formulas in Google Sheets. Pass every user-supplied cell through
  `sanitizeSheetCell` (`src/util/sheetCell.ts`), as `rsvpSheet.ts` and `weddingTrainSheet.ts` do.

**Development**

- `pnpm dev` doesn't hot-reload `src/middleware.ts` or config it imports: restart after
  toggling a page in `src/config/event.ts`.
- `astro check` needs `@astrojs/check`, which isn't installed. `tsc` also reports missing
  Node types (`@types/node`) and two existing type errors in the test files; the build is
  unaffected.
