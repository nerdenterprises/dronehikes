# Vision

"AllTrails meets Aloft." A community-driven companion app for recreational drone pilots that combines the authoritative airspace data existing tools (Aloft, B4UFLY) already do well with the crowdsourced ground-truth nobody is doing: local ordinances, on-the-ground conditions, and verified launch spots with real notes from real pilots. The competitive moat is community-verified data — incumbents are structurally positioned around FAA data pipelines and compliance tooling, and can't easily bolt on a trust network of recreational pilots sharing local knowledge. The value grows with the dataset, and the dataset grows with the community.

# Phase 1: Hobby tool, seed the dataset (current phase)

The point of Phase 1 is to make something I actually use every time I go fly, and in the process of using it, pack it with high-quality data. The tool has to be good enough that maintaining its data feels like a natural part of flying, not a chore.

Goals:

- Build out the SoCal map as a personal-use tool with a polished UX.
- Establish the data model (clubs, spots, zones, ordinances) in versioned JSON so the shape is stable before any backend exists.
- Reach the milestone of **100 great spots in SoCal** as the seed crop for eventual public launch.
- Stay simple: static frontend on GitHub Pages, no backend, no auth, no accounts.
- Document everything in the README so the project is approachable to a future contributor (or future-me).

Non-goals for this phase:

- User accounts
- User submissions
- Backend infrastructure
- Mobile app
- Anything outside SoCal

# Phase 2: Community product (when it's clear this should be a real app)

Trigger: gut conviction that this deserves to be a real product, not just a hobby tool. No fixed timeline — this phase begins when the Phase 1 dataset is good enough that sharing it feels obviously valuable, and the itch to take it further is persistent.

Goals:

- Add Supabase as the backend (Postgres, auth, storage).
- User accounts with reputation scores.
- User-submitted spots and condition reports with a moderator queue.
- Verified-flyer program — trusted users whose submissions auto-publish.
- Expand coverage beyond SoCal as the user base grows.
- Freemium model: free tier covers browse + filter, paid tier unlocks offline tiles, TFR alerts, ordinance change notifications, and advanced filters.

Architectural note: the GitHub Pages frontend stays. Supabase is added behind it. The existing `data/*.json` files migrate to Postgres tables, but the map, polygon rendering, pin rendering, layer toggles, and club directory all stay the same — only the data source layer changes. This is the reason we're investing in clean, stable data shapes during Phase 1. If we get those shapes right now, Phase 2 is a data-source swap, not a rewrite.

# Phase 3: Platform and partnerships

Goals:

- Mobile-friendly PWA with an offline tile cache so the tool works in the field with no signal.
- Real-time TFR feed integration from the FAA NOTAM/TFR data.
- Live FAA airspace GIS data replacing the hand-drawn polygons.
- Integrated LAANC submission flow so users can request airspace authorization without leaving the app.
- Club partnerships: clubs can claim and maintain their own listings.
- Potential AMA endorsement or partnership.
- B2B angle: clubs pay a small annual fee for premium listing features (photos, event calendar, contact form).

# Non-goals (always)

These apply at every phase and should never be compromised:

- Bypassing or working around FAA regulations.
- Hosting harmful or unverifiable content — e.g., spots located inside clearly prohibited airspace marked as "OK".
- Becoming a flight planning tool that replaces Aloft for airspace authorization. We complement Aloft. We don't replace it.

# Operating principles

- **Trust through transparency.** Every spot shows when it was last verified and by whom. Stale data is flagged, not hidden.
- **The dataset is the moat.** Data quality matters more than feature count. A smaller, better-verified map beats a bigger, sloppier one.
- **Honest legal posture.** Users are responsible for verifying rules for themselves before flying. User submissions never display as "verified" without going through moderation.
- **Avoid premature scale.** Don't build Phase 2 infrastructure during Phase 1. The constraint of "static site, JSON files" is a feature — it forces good data discipline and keeps the project approachable.
