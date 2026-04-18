# SoCal Drone Companion

> **Clean Drones — even accountants need hobbies!**

A drone-flying companion map for Southern California recreational pilots.

## About

This is a hobby project by the team behind **Clean by Nerd Enterprises**, the software dev division of Nerd Enterprises, Inc. Our day job is Clean Books, a product for accountants and bookkeepers. This is what we build on the side — something we actually use ourselves when planning a flight.

## Purpose

Existing tools (Aloft, B4UFLY) show FAA airspace but tell you nothing about the ground rules: local ordinances, NPS prohibitions, BLM permissions, AMA-chartered RC club fields, etc. This app combines all of that on one interactive map so a pilot can decide "can I launch here?" in one glance.

The map is Leaflet-based and covers SoCal within ~3 hours of Burbank. It shows:

- Controlled airspace (red polygons/circles — LAANC required)
- National Parks (red — drones prohibited)
- National Forests (yellow — generally allowed, check wilderness boundaries)
- BLM and other open lands (green — generally permissive)
- Verified launch spots (green pins) and known prohibited spots (red pins)
- AMA-chartered RC clubs (blue RC pins) with a clickable directory below the map

## File structure

```
/
├── index.html                     # minimal shell — loads CSS + JS entry only
├── css/
│   └── styles.css                 # all styles
├── js/
│   ├── app.js                     # entry point, orchestrates init
│   ├── map.js                     # Leaflet setup, base layers, shared helpers
│   ├── ui.js                      # view-mode buttons + layer control
│   └── layers/
│       ├── airspace.js            # controlled airspace
│       ├── nps.js                 # National Parks
│       ├── forests.js             # National Forests
│       ├── blm.js                 # BLM + permissive state land
│       ├── spots.js               # verified + prohibited launch spots
│       └── clubs.js               # RC clubs + directory grid renderer
├── data/
│   ├── airspace.json
│   ├── nps.json
│   ├── forests.json
│   ├── blm.json
│   ├── spots.json
│   ├── clubs.json
│   └── ordinances.json            # placeholder — schema only, empty array
├── README.md
└── socal_drone_zones.html         # frozen reference — do not edit
```

All data lives in `data/*.json`. Layer modules fetch their JSON at runtime, so editing a data file is the full workflow for adding/removing map features.

## Running locally

ES6 modules and `fetch()` do not work from `file://` in Chrome/Firefox/Safari due to CORS. You need a static HTTP server. The simplest option:

```
# from the project root
python -m http.server 8000
# then open http://localhost:8000
```

Any static server works — `npx serve`, `php -S localhost:8000`, VS Code Live Server, etc.

## Deployment

Upload everything (HTML, CSS, JS, data/) to a web host via FTP, preserving the directory structure. No build step, no server-side code. Any static hosting works (shared hosting, S3, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Data schemas

### Polygon/circle zone (airspace, nps, forests, blm)

```json
{
  "id": "kebab-case-id",
  "name": "Display name",
  "shape": "polygon",
  "geometry": [[lat, lng], [lat, lng], ...],
  "opacity": 0.30,
  "popup": {
    "title": "Popup header",
    "lines": ["line 1", "line 2"],
    "warning": "Optional red italic warning, or null"
  },
  "verified": "YYYY-MM-DD",
  "source": "url or note, or null"
}
```

For circles, `shape` is `"circle"` and `geometry` is an object:

```json
"geometry": { "center": [lat, lng], "radiusMeters": 8000 }
```

`opacity` is optional. Each layer has a default fill opacity (airspace 0.30, nps 0.40, forests 0.20, blm 0.25); set `opacity` only when you need to override that default for a single zone.

### Spot

```json
{
  "id": "kebab-case-id",
  "name": "Display name",
  "lat": 34.4480,
  "lng": -119.2429,
  "status": "ok",
  "notes": "Free-form notes shown in popup",
  "verified": "YYYY-MM-DD",
  "sources": ["https://..."]
}
```

`status` is `"ok"` (green pin) or `"prohibited"` (red pin).

### Club

```json
{
  "id": "kebab-case-id",
  "name": "Display name",
  "parentClub": "Parent club name or null",
  "amaNumber": "152",
  "lat": 34.189,
  "lng": -118.2173,
  "address": "Street, City, ST ZIP",
  "website": "https://... or null",
  "phone": "555-555-5555 or null",
  "guestPolicy": "guests_welcome",
  "guestNotes": "Free-form text shown in popup and directory card",
  "notes": "Additional popup notes",
  "verified": "YYYY-MM-DD"
}
```

`guestPolicy` is one of: `"members_only"`, `"guests_welcome"`, `"contact_for_details"`.

### Ordinance (schema only — not yet rendered)

```json
{
  "id": "kebab-case-id",
  "jurisdiction": "City of Burbank",
  "lat": 34.1808,
  "lng": -118.3089,
  "appliesTo": "city_parks",
  "rule": "prohibited",
  "summary": "One-line summary",
  "sourceUrl": "https://...",
  "verified": "YYYY-MM-DD"
}
```

`appliesTo`: `"city_parks"`, `"all_public_property"`, or `"specific_location"`.
`rule`: `"prohibited"`, `"permit_required"`, or `"designated_areas_only"`.

## Adding a new entry

### Add an RC club

1. Open `data/clubs.json`.
2. Append a new object to the array. Example:

   ```json
   {
     "id": "example-rc-club",
     "name": "Example RC Club",
     "parentClub": null,
     "amaNumber": "9999",
     "lat": 34.5000,
     "lng": -118.5000,
     "address": "123 Airfield Rd, Example, CA 99999",
     "website": "https://examplerc.org/",
     "phone": null,
     "guestPolicy": "guests_welcome",
     "guestNotes": "Visitors welcome with AMA card; contact first.",
     "notes": "400ft paved runway. ~45 min from Burbank.",
     "verified": "2026-04-18"
   }
   ```

3. Reload the page. A new blue RC pin appears on the map and a new card appears in the directory.

### Add a verified launch spot

1. Open `data/spots.json`.
2. Append a new spot:

   ```json
   {
     "id": "example-spot",
     "name": "Example Overlook",
     "lat": 34.7000,
     "lng": -119.2000,
     "status": "ok",
     "notes": "Class G, open BLM. Pullout on the west side.",
     "verified": "2026-04-18",
     "sources": ["https://aloft.ai/..."]
   }
   ```

3. Reload. Use `"status": "prohibited"` for a red pin.

### Add a zone (airspace / NPS / forest / BLM)

1. Pick the right file: `data/airspace.json`, `data/nps.json`, `data/forests.json`, or `data/blm.json`.
2. Append a polygon:

   ```json
   {
     "id": "example-zone",
     "name": "Example Wilderness",
     "shape": "polygon",
     "geometry": [[34.5, -119.5], [34.5, -119.3], [34.3, -119.3], [34.3, -119.5]],
     "popup": {
       "title": "Example Wilderness",
       "lines": ["USFS wilderness — no drones"],
       "warning": null
     },
     "verified": "2026-04-18",
     "source": null
   }
   ```

   Or a circle (airspace is often circular around airports):

   ```json
   {
     "id": "example-circle",
     "name": "Example (EXA) Class D",
     "shape": "circle",
     "geometry": { "center": [34.5, -119.5], "radiusMeters": 7000 },
     "popup": {
       "title": "Example (EXA) Class D",
       "lines": ["LAANC authorization required"],
       "warning": null
     },
     "verified": "2026-04-18",
     "source": null
   }
   ```

3. Reload.

## The `verified` field

Every record has a `verified` date. Treat this as "I personally confirmed this was accurate on this date." Rules change — airspace redesignates, city ordinances pass, parks update policy, clubs move or close. Re-check each record periodically (a good cadence: at least once a year, or before relying on it for an important flight) and bump the date when you re-confirm.

When you find something is out of date, fix the data *and* update the date — a stale `verified` date is how you find entries that need attention next time.

## Future ideas

Out of scope for now, but worth capturing:

- **Search / filter UI** — filter clubs by guest policy, filter spots by status, search by name.
- **Distance from home base** — sort clubs and spots by drive distance from a configurable home location.
- **Live FAA TFR feed** — overlay active Temporary Flight Restrictions from the FAA NOTAM/TFR feed.
- **Live FAA airspace GIS data** — replace the hand-drawn airspace polygons with real FAA GIS shapes (B4UFLY/UAS Data Delivery).
- **Real ordinance database** — populate `ordinances.json` from scraped/crowdsourced city + county drone ordinances, render as another overlay layer.
- **PWA with offline tile cache** — make it installable and usable in the field with no signal. Cache tiles for the SoCal bounding box.
- **Potential public release** — share with the broader SoCal drone community. Would need content review, contribution workflow, and an about/disclaimer page.
