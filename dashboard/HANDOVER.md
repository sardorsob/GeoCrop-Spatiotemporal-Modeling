# Handover

## Status

TASK-010 integration is ready for QA handoff after final verification. The dashboard is a Next.js app in `dashboard/` and is designed for Vercel hosting.

## What Is Done

- Next.js + React + TypeScript dashboard scaffold.
- Typed source registry, CSV/JSON loaders, and Task 1-4 normalization.
- URL-backed dashboard state for tab, map layer, crop, event, rotation regime, selected entity, state, and map view.
- Integrated command-center shell with filters, task tabs, selected context, load status, and analytical summary.
- Code-native Corn Belt fallback map with layer control, legend, source notes, and selectable state tiles.
- Task panels for phenology, rotation, soil moisture extremes, and prediction diagnostics.
- Component and data tests for all shipped feature lanes.

## What Is Not Done

- Browser-ready GeoJSON/TopoJSON/vector tiles are not available; the map remains a clearly labeled schematic fallback.
- Vercel project and deployment settings are not configured in this repo.
- No Playwright E2E suite has been added; manual/HTTP smoke checks are used for final handoff.
- No backend, database, auth, saved views, or notebook/model reruns are included in the MVP.

## Run Locally

```bash
cd dashboard
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

- Copy `.env.example` to `.env` if applicable.
- Never commit real secrets.
- No secrets are currently required for the MVP.

## Verification

Run from `dashboard/`:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
python scripts\validate-task-statuses.py
python scripts\check-required-artifacts.py
```

Last QA run passed `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, and the workflow validators. HTTP smoke on `http://localhost:3000` returned 200 for representative extremes, prediction, and rotation URLs.

## Known Caveats

- Source artifacts are read from the parent repo at `../artifacts/tables/`.
- Source paths displayed in the UI are repo-relative artifact paths, not local absolute paths.
- Large Parquet/GeoTIFF artifacts are intentionally excluded from the browser bundle.
- The fallback map should not be interpreted as pixel, county, or field-level geometry.
- If a source artifact is missing or malformed, the dashboard keeps rendering and shows a visible data-load status.
- In-app browser screenshot smoke was attempted but blocked by `windows sandbox failed: spawn setup refresh`; add Playwright or retry the Browser runtime for screenshot-based desktop/mobile smoke.

## Next Steps

- Create the Vercel project and connect the GitHub repo.
- Generate browser-ready geography for a true MapLibre layer if map fidelity becomes a priority.
- Add Playwright E2E smoke tests after deployment settings stabilize.
- Add export/share workflows only after the MVP dashboard has been reviewed.
