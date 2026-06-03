# Handover

## Status

`TASK-011` UI redesign plus the follow-up cleanup pass are complete. The dashboard is a Next.js app in `dashboard/` and is designed for Vercel hosting.

## What Is Done

- Next.js + React 19 + TypeScript + Tailwind CSS v4 scaffold.
- Typed source registry, CSV/JSON loaders, and Task 1-4 normalization.
- URL-backed dashboard state for tab, map layer, crop, event, rotation regime, selected entity, state, and map view.
- Sticky `TopBar` with brand mark and live source / task / load-issue badges.
- Hero card with project narrative and four accent-bar KPI tiles (Phenology crops, Rotation classes, Extreme rows, Prediction status).
- Compact filter bar with six visible fields (Crop, Extreme event, Rotation regime, State, Map layer, Selected entity), removable filter chips, and an advanced sheet drawer for map view coordinates.
- Real U.S. Albers choropleth Corn Belt map (d3-geo + `us-atlas/states-albers-10m.json`) with hover tooltips, click-to-select state paths, in-card layer selector, info popover for source/caveat detail, and a selection context block.
- Pill-style tab bar with Lucide icons for the four research lanes.
- Phenology panel with tone-coded HSGP metric tiles and a Recharts NDVI seasonality chart (credible-interval band, posterior line, dashed empirical line, hover tooltips, peak summary cards).
- Rotation panel with three-class summary cards, Markov/threshold caveat band, and a geographic rotation summaries table that shows the top 5 rows by default with a "Show N more" / "Show less" toggle.
- Extremes panel with event selector, URL-state-compatible crop/state filters, anomaly summary tone cards, and state x crop anomaly table.
- Prediction panel with headline test-metric cards, ablation chart, SHAP feature ranking, regime-stratified metrics, and confusion matrix.
- Local shadcn-style primitive layer under `src/components/ui/` (Card, Button, Badge, Input, Select, Popover, Sheet) backed by Radix where needed.
- `cn()` class merge helper at `src/lib/utils.ts`.
- Component and data tests for all shipped feature lanes, including direct coverage for the new `MapPanel` choropleth selection path.

## What Is Not Done

- Browser-ready GeoJSON / TopoJSON / vector tiles from the modeling pipeline are not produced; the choropleth uses the static `us-atlas` Albers TopoJSON and renders categorical layer values. States outside the Corn Belt fallback registry render as no-data.
- Vercel project and deployment settings are not configured in this repo.
- No Playwright E2E suite has been added; manual / HTTP smoke checks are used for handoff.
- No backend, database, auth, saved views, or notebook / model reruns are included in the MVP.

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

Last QA run on 2026-06-02 (post `TASK-011` cleanup):

- `npm run test` passed (10 files, 37 tests).
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- Workflow artifact validators passed.

## Known Caveats

- Source artifacts are read from the parent repo at `../artifacts/tables/`.
- Source paths displayed in the UI are repo-relative artifact paths, not local absolute paths.
- Large Parquet / GeoTIFF artifacts are intentionally excluded from the browser bundle.
- The map is a real U.S. Albers choropleth but uses categorical-index coloring drawn from the Corn Belt fallback geography registry. It is not a per-pixel raster and should not be read as field-level geometry. States outside the Corn Belt fallback registry render as no-data.
- If a source artifact is missing or malformed, the dashboard keeps rendering and shows a visible data-load status in the bottom card.
- In-app browser screenshot smoke is currently blocked by `windows sandbox failed: spawn setup refresh`; the Chrome MCP extension was also unreachable in the last session. HTTP smoke and the automated component/data suite cover the regression surface for now.
- Two moderate npm advisories remain upstream in Next / PostCSS tooling; `npm audit --audit-level=high` previously reported no high/critical advisories and no high/critical advisories were introduced by the new redesign dependencies.
- The old schematic map/filter components were removed in the cleanup pass; `MapPanel.test.tsx` now covers the shipped choropleth map path directly.

## Dependencies Added In `TASK-011`

| Package | Purpose |
|---------|---------|
| `recharts` | NDVI seasonality ComposedChart |
| `lucide-react` | Icon set for top bar, tabs, map, and filter chrome |
| `us-atlas` | TopoJSON source for U.S. Albers state geometry |
| `topojson-client` | Decode TopoJSON to GeoJSON at runtime |
| `d3-geo` | Albers projection path generator for the choropleth |
| `class-variance-authority` | Variant-driven class composition for `Button` and `Badge` |
| `clsx` + `tailwind-merge` | Backing for `cn()` helper |
| `@radix-ui/react-slot` | `asChild` polymorphism |
| `@radix-ui/react-select` | Select primitive (Sheet drawer) |
| `@radix-ui/react-popover` | Map layer info popover |
| `@radix-ui/react-dialog` | Sheet drawer for advanced filters |
| `@types/topojson-client`, `@types/d3-geo` | Dev type packages |

## Next Steps

- Create the Vercel project and connect the GitHub repo.
- Generate browser-ready geography for a true vector-tile layer if county/pixel-level fidelity becomes a priority; then add the map library dependency at that point.
- Add Playwright E2E smoke tests after deployment settings stabilize.
- Add export / share workflows only after the MVP dashboard has been reviewed.
