# CrumbSave

**Public demo:** https://abylau2.github.io/crumbsave-react-midterm/  
**Source repository:** https://github.com/abylau2/crumbsave-react-midterm

**Good food, another chance.** CrumbSave is an independently built React university project: a fictional surplus-food Surprise Bag marketplace for Almaty. Visitors can browse demo offers, create a demo listing, and save a demo reservation. No real shops, payments, or pickup bookings are involved.

## Features

- 120 fan-inspired seeded listings from 52 iconic food ideas: 20 per category across Bakery, Meals, Produce, Desserts, Groceries, and Drinks. These are unofficial references with fictional sellers.
- Search by title, business, description, district, or pop-culture source; category, district, price, and availability filters; deterministic sorting; 12 results per page.
- Individual `/bags/:id` details with a working reservation action, quantity decrement, and duplicate prevention.
- Controlled add-bag form with inline validation and an API-backed success state.
- Persistent reservations and listings in browser `localStorage`.
- Loading skeletons, error and retry, empty results, empty reservations, sold-out, success, invalid bag, and custom 404 states.
- Responsive layouts and mobile navigation.

## Stack

React 19, Vite 6, JavaScript/JSX, React Router, Lucide React, standard CSS with custom properties, a simulated Promise API, and localStorage. The application does not require a backend.

## Run locally

Requires Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. To verify the production bundle:

```bash
npm run build
npm run preview
```

`npm test` runs focused Node tests for data quality, search, combined filtering, price boundaries, sorting, pagination, form validation, seeding, creation, reservations, transient failure, and cancellation. With Python Playwright and Google Chrome installed, start the production preview on port 4173 and run `python3 tests/browser_smoke.py` for an end-to-end smoke check.

## Routes

| Route | Purpose |
|---|---|
| `/` | Editorial home with six API-loaded featured bags |
| `/about` | Project concept and demo limitations |
| `/bags` | Full catalog with URL filters and pagination |
| `/dashboard` | API-based KPIs, breakdowns and interactive filters |
| `/login` | Styled authentication placeholder |
| `/bags/:id` | Bag details and demo reservation |
| `/add` | Controlled listing form |
| `/reservations` | Saved demo reservations |
| `*` | Custom 404 |

## Project structure

```text
src/
  services/service.js     asynchronous data and persistence boundary
  api/bagsApi.js          compatibility re-export
  layouts/RootLayout.jsx  shared Header, Outlet, Suspense and Footer
  data/fanConcepts.js     52 named food concepts and hand-written variants
  data/seedBags.js        deterministic 120-record demo catalog
  components/             reusable navigation, catalog, cards and states
  hooks/useBags.js        loading/error/success catalog hook with cleanup
  pages/                  route-level experiences
  utils/                  catalog and validation functions
  styles/                 tokens, global rules, layout, components, responsive
public/images/fan-food/   52 source images and 68 variation crops
public/fonts/             locally stored DM Sans and Newsreader fonts and OFL licenses
tests/                    focused unit and browser smoke tests
```

## Simulated API and persistence

All business data access goes through `src/services/service.js`: `getBags`, `getBagById`, `createBag`, `reserveBag`, and `getReservations`. Calls take about 450 ms and accept an optional `AbortSignal`. Returned values are copies so components cannot accidentally mutate storage. `reserveBag` reads the current state at commit time and writes the reduced quantity and reservation together. `createBag` validates fields again at the API boundary and uses a UUID for the new listing.

The first API read seeds `localStorage` with 120 meaningful records. The existing storage key is versioned internally. On migration from the original generic catalog, old `seed-` listings are replaced with new `fan-` listings while user-created `bag-` records and reservation snapshots remain. A later migration updates seeded variation image paths while preserving saved quantities and reservations. Reservations for retired seed listings are marked as archived, with their original details still visible. A stored empty array remains empty. Created bags, reduced quantities, and reservations survive refresh in the same browser. Browser storage can be cleared by the user, so this is a demo rather than a shared account system. To reset intentionally during development, run `localStorage.removeItem('crumbsave:demo:v1'); location.reload()` in DevTools. The API also exports `resetDemoData()` for tests.

To exercise the transient catalog error and retry state, open DevTools on the local app, run `sessionStorage.setItem('crumbsave:fail-next', 'getBags'); location.reload()`, then click **Try again**. This causes one request to reject and does not erase saved data.

## React architecture

`App.jsx` defines nested routes under `RootLayout`. The layout uses `Outlet` to show the current page between shared navigation and footer. Bags, About, Dashboard and Login use `React.lazy`; the layout provides a `Suspense` loading message.

`BagsPage` reads filters from `useSearchParams`. Search, category, district, price, availability, sorting and page are stored in the URL. Invalid values use defaults; out-of-range pages are clamped. Text changes use replace navigation. Other filter and page changes support Back/Forward. Detail cards pass catalog context so All Bags and Back restore the URL. `BagDetailsPage` reads its ID using `useParams` and fetches that record through the service.

`useBags` owns loading, error and success state and aborts old requests. Pages derive visible data from the API response. Dashboard computes six statistics and category/district counts in `utils/dashboard.js`; category and district filters recalculate both KPIs and bars. Empty datasets avoid division by zero. No numbers represent real revenue.

Login validates its inputs but only explains that authentication is unavailable. It does not save or send passwords.

See [ROUTING_HOMEWORK_GUIDE.md](ROUTING_HOMEWORK_GUIDE.md) for simple explanations and [TEST_REPORT.md](TEST_REPORT.md) for actual verification commands.

## Deployment

`vercel.json` supplies the SPA rewrite for Vercel. `public/_redirects` supplies the same fallback for Netlify. Both work with the root Vite build. Connect this repository to either host, use `npm run build`, set the publish directory to `dist`, and verify a direct refresh on `/bags/fan-001` and `/reservations`. No environment variables or backend service are required.

The public demo is deployed to GitHub Pages from the `gh-pages` branch. Run `npm run build:pages` to create `dist-pages` with the correct repository base path. `scripts/write-pages-fallback.mjs` writes a `404.html` redirect: GitHub Pages first responds with its missing-page status for a nested URL, then redirects to the root document, where `main.jsx` restores the route before React mounts. The final page works after refresh; Vercel or Netlify is still preferable because their rewrite rules serve nested routes directly without this intermediate redirect.

## Images and fonts

The catalog has 52 concept images and 68 separate close-up crops for variations, so each seeded listing uses a distinct local file. These mostly depict scenes or food from the referenced films, series, manga, and games. The Beef Wellington image comes from Gordon Ramsay's official Hell's Kitchen site; Chaliapin Steak Don uses a real-life recreation because the available anime still did not show the dish clearly. Gojo's Kikufuku uses a product photograph of the actual sweet because the available anime frame shows it too small to recognize. These images are third-party copyrighted material; their use is not licensed for commercial publication. Known image sources and the attribution limits are documented in [IMAGE_CREDITS.md](IMAGE_CREDITS.md). The older 16 Unsplash photos remain available for archived reservations and for newly created bags. DM Sans and Newsreader are served locally with their OFL licenses in `public/fonts/`. The images do not represent real marketplace offers or official franchise partnerships. Image URLs include a version suffix so returning visitors receive updated assets.

## Limits

This is one browser's student demo. Listings are fictional and cannot be booked in real life. There is no login, shared backend, payment, food-safety guarantee, QR pickup ticket, or physical collection verification. `localStorage` persistence is limited to the current browser profile and origin.

## Routing acceptance tests

```bash
npm test
npm run build
npm run build:pages
npm run preview -- --port 4173
# In another terminal, using Python with Playwright installed:
python3 tests/browser_smoke.py
python3 tests/routing_browser.py
```

The routing test also starts a temporary server on port 4175. It serves the Pages build with actual 404 responses to test deep-link restoration. Browser tests use fresh browser contexts and do not reset your normal browser data.
