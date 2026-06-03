# GeoCrop Interactive Dashboard

Next.js dashboard workspace for the GeoCrop Spatiotemporal Modeling project.

## What It Shows

- Corn Belt command-center shell with URL-backed filters and task tabs.
- Code-native fallback map surface with layer legends and selectable state tiles.
- Task 1 phenology metrics and NDVI curve evidence.
- Task 2 rotation class summaries and geographic rankings.
- Task 3 soil moisture flood/drought anomaly summaries.
- Task 4 prediction diagnostics, ablation, SHAP, regime metrics, and confusion matrix.
- Visible source paths, denominators, dates, caveats, and load-error states.

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

## Deployment Notes

- Stack: Next.js, React, TypeScript, Tailwind CSS.
- Target host: Vercel.
- No runtime database, auth, or secrets are required for the MVP.
- Parent `../artifacts/tables/` CSV/JSON files are the dashboard source of truth.
- Large Parquet/GeoTIFF artifacts are intentionally not shipped to the browser.

## Known Caveats

- The map is a schematic state-tile fallback because browser-ready GeoJSON or TopoJSON has not been produced yet.
- Map tiles are not pixel, county, or field boundary geometry.
- Moderate npm advisories remain upstream in Next/PostCSS tooling; `npm audit --audit-level=high` previously reported no high/critical advisories.
- Vercel project settings still need to be created by the repo owner before deployment.

## Workflow

This project follows the local agentic workflow artifacts:

- `PROJECT.md`
- `SCOPE.md`
- `TASKS.md`
- `AGENTS.md`
- `memory/`
- `logs/`

Build work should follow one task at a time, with Builder and QA passes kept
separate.
