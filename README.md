# Loading Zone Routes (v0)

Mobile-first static web app for **TimeSnap** (BevChain / Linfox HR driver, Brisbane SEQ).

Narrow wedge: routes and notes for **loading zones** on beverage / supermarket depot runs — not a full truck GPS.

## Features

- Home map (Leaflet + OpenStreetMap) + searchable zone list
- Zone cards: name, suburb, access notes, typical window, truck constraints, tips
- **Get there** → opens Google Maps directions in a new tab
- Personal notes + custom zones (persisted in `localStorage`)
- Starter seed data (~12 SEQ zones) marked clearly for refinement after real drops

**Not in v0:** height-aware routing, low bridges, turn-by-turn engine, national coverage, live traffic.

## Run locally

```bash
cd loading-zone-routes
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/loading-zone-routes/`).  
HashRouter is used, so routes look like `/loading-zone-routes/#/zone/…`.

## Build

```bash
npm run build
```

Output is `dist/` (includes `.nojekyll` for GitHub Pages). Preview with:

```bash
npm run preview
```

## Edit starter zones

Edit `src/data/zones.json` — each entry needs:

| Field | Notes |
|-------|--------|
| `id` | Stable string id |
| `name`, `suburb`, `address` | Display |
| `lat`, `lng` | SEQ coords (approx OK for v0) |
| `accessNotes`, `typicalWindow`, `truckConstraints`, `tips` | Driver-facing copy |
| `category` | `liquor` \| `supermarket` \| `depot` \| `other` |
| `starter` | `true` for seed data badge |

Rebuild after edits. Custom zones / notes added in the app live in the browser only (`localStorage` keys `lzr-custom-zones`, `lzr-zone-notes`, `lzr-zone-edits`).

## Deploy (GitHub Pages)

1. Push this folder (or its contents) to a repo.
2. Enable Pages from the `dist/` folder **or** use a workflow that runs `npm run build` and publishes `dist/`.
3. Site must be served under `/loading-zone-routes/` (matches Vite `base`), **or** change `base` in `vite.config.ts` to `/` for a root project site.

Do not commit `node_modules/` or `dist/` (see `.gitignore`).

## Stack

Vite + React + TypeScript · React Router (HashRouter) · Leaflet / react-leaflet · OSM tiles (no API key)
