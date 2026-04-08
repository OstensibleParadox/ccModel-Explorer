# ccModel Explorer

Interactive explorer for the Constraint Cascade Method across property law, civil-law analogues, AI governance frameworks, and a shared eigenspace projection.

**[Live Demo](https://ostensibleparadox.github.io/ccModel-Explorer/)**

## Overview

The app uses one shared 7-dimension slider bundle:

- `possession`
- `use`
- `income`
- `alienation`
- `exclusion`
- `duration`
- `inheritability`

That same 7D input drives:

- property-law matching in two legal traditions
- AI governance framework matching
- a 3D eigenspace projection over all entities

## Current Feature Set

### Property Law Mode

- **13 common-law estates**
- **13 civil-law forms**
- Independent common-law and civil-law ranking
- Common-law jurisdiction context: `UK` / `US`
- Civil-law jurisdiction context: `DE` / `JP` / `TW` / `PRC`
- PRC asset-type switching: `land` / `movables` / `intangibles`
- Convergence panel mapping top civil-law forms to common-law analogues
- Harmonisation panel for international instrument bridge points
- Property-specific violation alerts and slider constraints
- Arrangement locking with doctrinal range violations and modal drill-down

### AI Governance Mode

- **7 ranked AI governance frameworks**
- **1 special “Unregulated Deployment” baseline**
- AI-specific slider labels over the same underlying 7D schema
- AI governance violation alerts
- Ranked framework matching with notes and authority text

### Eigenspace View

- Shared 3D PCA projection over **34 entities** total
  - 13 common-law entities
  - 13 civil-law entities
  - 8 AI entities
- User-controlled point projected into the same space
- Mode-based dimming so irrelevant categories fade instead of disappearing
- Hover tooltip showing:
  - entity name
  - entity category
  - PCA-space distance
  - the entity feature vector used for projection
- Dashed overlap lines from the user point to overlapping entities
- Inspector panel with:
  - distance vs threshold
  - per-PC deltas
  - explained variance
  - residual discarded variance
  - 7D cosine similarity as a secondary descriptor

### Localization

The interface currently supports:

- English
- 简体中文
- Deutsch
- 日本語

## Architecture

Detailed architecture documentation lives in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

## Repository Notes

- Main application shell: [src/App.jsx](./src/App.jsx)
- Eigenspace implementation: [src/components/EigenVisualization.jsx](./src/components/EigenVisualization.jsx)
- Shared projection math: [src/utils/eigenProjection.js](./src/utils/eigenProjection.js)
- Localization entry point: [src/i18n.js](./src/i18n.js)

## License

CC BY-SA 4.0 — see [LICENSE](./LICENSE).
