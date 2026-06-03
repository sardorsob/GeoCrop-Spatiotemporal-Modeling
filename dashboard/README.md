# GeoCrop Interactive Dashboard

Next.js dashboard workspace for the GeoCrop Spatiotemporal Modeling project.

## What It Shows

- Sticky top bar with brand mark, live source / task / load-issue badges.
- Hero strip with project narrative and four accent-bar KPI tiles.
- Compact filter bar (Crop, Extreme event, Rotation regime, State, Map layer, Selected entity) with removable filter chips and an advanced sheet drawer for map view coordinates.
- Real U.S. Albers choropleth Corn Belt map with hover tooltips, click-to-select states, in-card layer selector, and an info popover with source/caveat detail.
- Pill-style task tabs for the four research lanes.
- Task 1 phenology metrics (tone-coded RMSE / MAE / Coverage / CRPS tiles) and a Recharts NDVI seasonality chart with credible-interval band, posterior line, dashed empirical line, hover tooltips, brush zoom, season-window presets, custom DOY inputs, and selected-span peak summary cards.
- Task 2 rotation class summaries and a collapsible Geographic rotation summaries table (compact 5-row view by default with a "Show N more" / "Show less" toggle).
- Task 3 soil-moisture flood/drought anomaly summaries and a state x crop anomaly table.
- Task 4 prediction diagnostics, ablation, SHAP, regime-stratified metrics, and confusion matrix.
- Visible source paths, denominators, dates, caveats, and load-error states throughout.

## Local Development

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
python scripts\validate-task-statuses.py
python scripts\check-required-artifacts.py
```

Last QA run on 2026-06-03 (after `TASK-012` HSGP season-window zoom): `npm run test` passed 42/42 in 11 files, `npm run typecheck`, `npm run lint`, and `npm run build` passed. Workflow validators passed. HTTP smoke at `http://localhost:3000` returned 200 and included the new Season window controls.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack), React 19, TypeScript 5.9.
- **Styling:** Tailwind CSS v4 (`@theme` tokens in `globals.css`), `class-variance-authority` for variants, `clsx` + `tailwind-merge` for class composition.
- **Primitives:** Local shadcn-style components under `src/components/ui/` (Card, Button, Badge, Input, Select, Popover, Sheet) backed by Radix where needed.
- **Icons:** `lucide-react`.
- **Charts:** `recharts` (NDVI ComposedChart; other panels stay on HTML/SVG tables and bars).
- **Maps:** `d3-geo` + `us-atlas/states-albers-10m.json` + `topojson-client` for the U.S. Albers choropleth.
- **State:** URL search params for shareable analytical state. No database / auth / backend for MVP.
- **Testing:** Vitest + Testing Library.

## Deployment Notes

- Target host: Vercel.
- No runtime database, auth, or secrets are required for the MVP.
- Parent `../artifacts/tables/` CSV/JSON files are the dashboard source of truth.
- Large Parquet/GeoTIFF artifacts are intentionally not shipped to the browser.

## Known Caveats

- The Corn Belt map is a real U.S. Albers choropleth, but it uses categorical-index coloring derived from the Corn Belt fallback geography registry. It is not a per-pixel raster and should not be read as field-level geometry. States outside the Corn Belt fallback registry render as no-data.
- Two moderate npm advisories remain upstream in Next/PostCSS tooling; `npm audit --audit-level=high` previously reported no high/critical advisories and no high/critical advisories were introduced by the `TASK-011` redesign dependencies.
- Vercel project settings still need to be created by the repo owner before deployment.
- The old schematic map/filter components were removed in the cleanup pass; the shipped `MapPanel` choropleth is covered directly by component tests.

## Workflow

This project follows the local agentic workflow artifacts:

- `PROJECT.md`
- `SCOPE.md`
- `TASKS.md`
- `AGENTS.md`
- `memory/`
- `logs/`

Build work follows one task at a time, with Builder and QA passes kept separate.
