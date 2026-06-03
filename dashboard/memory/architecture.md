# Architecture Memory

> QA updates this after tasks are approved done.

## Current Structure

- `package.json` defines the Next.js 16 + React 19 + TypeScript scaffold and verification scripts.
- `src/app/layout.tsx` defines the root HTML shell and metadata.
- `src/app/page.tsx` renders `DashboardShell`.
- `src/app/globals.css` imports Tailwind CSS and sets global font/body defaults.
- `src/components/layout/DashboardShell.tsx` defines the responsive Map Command Center shell with task tabs, main evidence region, selected context rail, layer/filter controls, and analytical summary band.
- `src/components/layout/DashboardShell.test.tsx` verifies the shell landmarks and four task tabs.
- `src/lib/data/types.ts` exports dashboard source, phenology, rotation, extremes, prediction, map, and filter types.
- `src/lib/data/sources.ts` defines the ordered Task 1-4 artifact source registry and typed lookup API.
- `src/lib/data/source-notes.ts` derives user-facing source notes from the registry.
- `src/lib/data/loaders.ts` resolves parent artifact paths from the dashboard root and loads CSV/JSON files into typed success/error states for server/test use.
- `src/lib/data/normalize.ts` converts loaded Task 1-4 artifacts into dashboard-ready phenology, rotation, extremes, and prediction structures.
- `src/lib/data/dashboard-data.ts` assembles all registered artifacts and returns normalized dashboard data.
- `src/lib/data/__tests__/sources.test.ts` verifies registry completeness, stable ids, source paths, source notes, and compile-time invalid id rejection.
- `src/lib/data/__tests__/normalize.test.ts` verifies representative source loads, missing-source errors, header aliases, row counts, and normalized Task 1-4 values.
- `src/lib/format/number.ts` provides safe numeric parsing for CSV/JSON values.
- `src/lib/state/dashboard-state.ts` defines default dashboard filter state, stable option lists, type guards, and normalization helpers.
- `src/lib/state/url-state.ts` parses, validates, normalizes, serializes, and updates URL search params for shareable dashboard state.
- `src/lib/state/__tests__/url-state.test.ts` verifies defaults, stable serialization, invalid param warnings, and unrelated-param preservation.
- `src/components/filters/FilterBar.tsx` renders accessible controls for task, layer, crop, event, regime, selected entity, and map view.
- `src/components/filters/ActiveFilterChips.tsx` renders visible active-filter chips and removal controls.
- `src/components/map/CornBeltMap.tsx` renders the TASK-005 code-native Corn Belt fallback map surface with selectable state tiles, layer controls, legends, source text, and fallback limitations.
- `src/components/map/MapLayerControl.tsx` and `src/components/map/MapLegend.tsx` provide reusable controls/legend blocks for map layers.
- `src/features/map/map-layers.ts` defines map layer metadata, legends, source labels, and caveats for rotation, extremes, prediction, and agreement views.
- `src/features/map/map-selection.ts` defines schematic fallback geographies and selected-map context records for downstream panels.
- `src/features/phenology/PhenologyPanel.tsx` composes the TASK-006 phenology tab from model metric cards, NDVI curve, crop control, and source notes.
- `src/features/phenology/NdviCurveChart.tsx` and `src/features/phenology/PhenologyMetrics.tsx` render Task 1 evidence with code-native SVG and visible uncertainty/caveat text.
- `src/features/prediction/PredictionPanel.tsx` composes the TASK-009 prediction diagnostics tab from headline metrics, ablation, SHAP, regime metrics, and confusion matrix views.
- `src/features/prediction/AblationChart.tsx`, `ShapFeatureChart.tsx`, `RegimeMetricsChart.tsx`, and `ConfusionMatrix.tsx` render Task 4 diagnostic evidence with visible source/caveat context.
- `src/features/rotation/RotationPanel.tsx` composes the TASK-007 rotation tab from class summaries, geographic ranking, Markov/threshold caveats, selection status, and source notes.
- `src/features/rotation/RotationClassChart.tsx` and `src/features/rotation/RotationGeoRanking.tsx` render Task 2 class and geography evidence using code-native cards/tables.
- `src/features/extremes/ExtremesPanel.tsx` composes the TASK-008 soil moisture extremes tab from event selection, URL-state-compatible filters, anomaly summary cards, anomaly table, caveats, and source notes.
- `src/features/extremes/EventSelector.tsx`, `AnomalySummaryChart.tsx`, and `AnomalyTable.tsx` render Task 3 event, aggregate, and state x crop evidence.
- `src/lib/scaffold/home-copy.ts` stores minimal scaffold copy for the landing page.
- `src/lib/scaffold/home-copy.test.ts` verifies the scaffold title and four research lanes.
- `next.config.ts` pins `turbopack.root` to the dashboard folder so local builds do not infer a parent lockfile as the workspace root.
- `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `postcss.config.mjs`, and `tsconfig.json` provide scaffold tooling.

## Data Flow

- TASK-001 defines artifact source contracts only; it does not read, parse, or copy source data files.
- `artifactSources` is the canonical source metadata list for Task 1-4 scoped CSV/JSON inputs.
- `sourceNotesById` is derived from `artifactSources` so user-facing caveats remain aligned with registry metadata.
- TASK-002 adds deterministic CSV/JSON loaders and typed normalization for all scoped Task 1-4 source registry entries.
- Loader outputs preserve source id, path, label, caveat, date stamp, denominator, row count, and typed load errors.
- Normalizers account for observed artifact header aliases instead of assuming registry-friendly column names.
- TASK-004 adds URL-backed dashboard state helpers. Defaults are omitted from serialized URLs, invalid params produce warning objects, and incoming state is normalized before use.
- TASK-005, TASK-006, and TASK-009 consume normalized source contracts through component props; they do not load filesystem artifacts directly.
- Map selections are represented as typed context records so later integration can synchronize selected geography, map layer, and panel evidence through URL-backed state.
- Phenology and prediction visual components keep essential values, source paths, and caveats visible without hover.
- Rotation and extremes visual components receive normalized Task 2/3 data via props and expose URL-state-compatible selection/filter props for TASK-010 integration.
- Rotation consumes `selectedEntity` or `selectedGeographyId`; extremes consumes `selectedEvent`, `selectedCrop`, and `selectedState` plus matching callbacks.

## Important Boundaries

- Workflow artifacts (`PROJECT.md`, `SCOPE.md`, `TASKS.md`, `AGENTS.md`, `memory/`, `logs/`, `scripts/`) remain outside the app runtime.
- The current shell does not include backend, database, auth, MapLibre, D3, Observable Plot, or shadcn/ui yet.
- Dashboard visual assets are code-native only for now; do not use image generation or `gpt-image-2`.
- Analytical dashboard state is URL-backed; do not store active filters, map layer, selected entity, or analytical tab only in localStorage.
- Feature panels should receive normalized data as props and stay client-safe; server filesystem loading remains in `src/lib/data/dashboard-data.ts` and related loaders.
- Generated folders `dashboard/node_modules/`, `dashboard/.next/`, and `dashboard/tsconfig.tsbuildinfo` are ignored.

## Known Caveats

- `npm audit --audit-level=high` reports no high/critical advisories, but npm install/audit reports two moderate advisories in Next/PostCSS with only breaking `npm audit fix --force` remediation suggested.
- The current dashboard shell still needs TASK-010 integration to wire source-backed map, phenology, rotation, extremes, and prediction components into the main page.
- The TASK-005 map is a schematic state-tile fallback because browser-ready GeoJSON/TopoJSON has not been produced yet.
