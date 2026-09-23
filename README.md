# Liquorland Docks (Loading Zone Routes)

Mobile-first static web app for **TimeSnap** (BevChain / Linfox HR driver, Brisbane SEQ).

Cab-focused wedge: **find Liquorland loading docks faster** across SEQ (Brisbane → Gold Coast → Sunshine Coast). Not a full truck GPS.

## Coverage

**151 Liquorland SEQ stores** in `src/data/zones.json`:

| Region | Stores |
|--------|--------|
| Brisbane metro (incl. Logan, Ipswich, Moreton Bay, Redlands) | 96 |
| Gold Coast | 34 |
| Sunshine Coast | 17 |
| Other SEQ (Bribie, Toowoomba) | 4 |
| **Total** | **151** |

~12 are Liquorland **Warehouse** format (tagged `warehouse`).

### Caveats (read before relying on a pin)

- **Verify dock / park on site** — notes are public-clue heuristics, not surveyed dock positions.
- **Dock and park GPS are never invented** (`dockLat` / `dockLng` / `parkLat` / `parkLng` stay `null` until a real drop confirms them). Nav uses the storefront pin + notes.
- Some coordinates are **suburb-level geocode fallbacks** when the full address failed — treat those as approximate (`constraints` may say `Geo confidence: …`).
- List is a practical merge of public directories + OSM + official page snippets; not a guaranteed complete Coles master list.

### Data source note

Research merge (2026-09-23): Liquorland store-page snippets, australia-shoppings.com Queensland directory, OpenStreetMap Nominatim geocoding, and centre operator pages for Toowoomba. Official Coles/Liquorland locator HTML/API is bot-protected and was not bulk-scraped.

## Features

- **Liquorland only** filter (ON by default)
- Region chips: Brisbane metro / Gold Coast / Sunshine Coast / Other SEQ
- Fast find: search by suburb / store name, **Nearest** (geolocation sort), large tap targets
- Map + scrollable list of filtered stores; pin prefers **dock** coords when known, else store pin
- Per store: dock notes, **best park for storefront** (+ optional park lat/lng), personal notes
- **Get there** → Google Maps directions to dock (preferred) or store pin; **Park-up** when park coords exist
- Personal tips + custom stores / edits in `localStorage` (`lzr-zone-notes`, `lzr-custom-zones`, `lzr-zone-edits`)

**Not in scope:** height-aware routing, low bridges, turn-by-turn engine, invented precise dock GPS.

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

## Data shape (`src/data/zones.json`)

| Field | Notes |
|-------|--------|
| `id` | Stable string id (e.g. `ll-seq-003`) |
| `name`, `brand`, `suburb`, `region` | Display / filter |
| `lat`, `lng` | Storefront / store pin |
| `dockLat`, `dockLng` | Loading-dock pin when **verified**; otherwise `null` |
| `dockNotes` | How to find / approach the dock |
| `parkLat`, `parkLng` | Optional recommended truck park-up pin |
| `parkNotes` | Best park / approach for storefront |
| `accessNotes`, `window`, `constraints` | Driver-facing copy (address / geo confidence) |
| `tips` | String array |
| `tags` | e.g. `["liquorland","brisbane"]` (+ `warehouse` when applicable) |
| `starter` | `false` for this research set |

Leave dock/park GPS null until verified from a real drop — put guidance in `dockNotes` / `parkNotes` instead.

## Deploy (GitHub Pages)

1. Push this folder (or its contents) to a repo.
2. Enable Pages from the `dist/` folder **or** use a workflow that runs `npm run build` and publishes `dist/`.
3. Site must be served under `/loading-zone-routes/` (matches Vite `base`), **or** change `base` in `vite.config.ts` to `/` for a root project site.

Do not commit `node_modules/` or `dist/` (see `.gitignore`).

## Stack

Vite + React + TypeScript · React Router (HashRouter) · Leaflet / react-leaflet · OSM tiles (no API key)
