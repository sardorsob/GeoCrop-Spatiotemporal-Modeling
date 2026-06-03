# Architecture Memory

> QA updates this after tasks are approved done.

## Current Structure

- `package.json` defines the Next.js 16 + React 19 + TypeScript scaffold and the post-cleanup dependency set: `recharts`, `lucide-react`, `us-atlas`, `topojson-client`, `d3-geo`, `class-variance-authority`, `clsx`, `tailwind-merge`, and the Radix primitives currently used (`react-slot`, `react-select`, `react-popover`, `react-dialog`).
- `src/app/layout.tsx` defines the root HTML shell and metadata.
- `src/app/page.tsx` server-loads normalized dashboard data with `loadDashboardData()` and renders the client shell inside a Suspense boundary for URL search-param support.
- `src/app/globals.css` imports Tailwind CSS, defines the `@theme` design tokens (color and `--radius`), sets font smoothing and a soft body gradient, styles the scrollbar, and declares the `fade-in` keyframe.
- `src/lib/utils.ts` exports the `cn()` class-merge helper.
- `src/components/ui/card.tsx`, `button.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `popover.tsx`, and `sheet.tsx` define the local shadcn-style primitive layer backed by Radix where appropriate. `Card` supports `asChild` so it can wrap a semantic `<section>` while keeping styling.
- `src/components/layout/TopBar.tsx` renders the sticky brand bar with live source / task / load-issue badges.
- `src/components/layout/DashboardShell.tsx` composes the redesigned shell: `TopBar`, a `Hero` card with project narrative and four `KpiCard` tiles, a Card-wrapped `CompactFilterBar`, a full-width `MapPanel`, a controlled pill `TaskTabs`, the active task panel, and a `DataLoadStatus` card. It owns URL-backed filter, tab, and map-selection state. A hidden `<h1>` carries the "GeoCrop Interactive Dashboard" accessible heading used by the integration test.
- `src/components/layout/DashboardShell.test.tsx` verifies shell integration, URL restore/update behavior, tab switching, tab-panel ARIA linkage, source/caveat visibility, map selection state, and data-load errors.
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
- `src/components/filters/CompactFilterBar.tsx` renders the post-`TASK-011` six-up compact filter row (Crop, Extreme event, Rotation regime, State, Map layer, Selected entity), removable chips, a "Clear all" reset, and an advanced `Sheet` drawer for map-view longitude/latitude/zoom. Uses styled native `<select>` (with a Lucide `<ChevronDown />` overlay) inside a `NativeSelect` helper so that `getByLabelText` matchers from the integration test continue to work.
- `src/components/map/UsChoropleth.tsx` renders the U.S. Albers state choropleth. It reads `us-atlas/states-albers-10m.json` via `topojson-client.feature`, generates paths with `d3-geo.geoPath()`, applies a caller-provided `colorScale(value)`, and exposes each state as a keyboard-activatable `role="button"` with `aria-label="Select ${name}"`. It supports a hover tooltip and a selected-state shadow filter.
- `src/components/map/MapPanel.tsx` wraps `UsChoropleth` in a Card with header (title, "Schematic fallback" badge, layer `Select`, and info `Popover`), a side panel with the layer legend (including a "No data" swatch) and the selection context block. Maps categorical layer values to legend indices for color mapping.
- `src/components/map/__tests__/MapPanel.test.tsx` verifies the shipped map card's legend/source context, state selection callback payload, and map-layer metadata coverage.
- `src/features/map/map-layers.ts` defines map layer metadata, legends, source labels, and caveats for rotation, extremes, prediction, and agreement views.
- `src/features/map/map-selection.ts` defines schematic fallback geographies and selected-map context records for downstream panels.
- `src/features/phenology/PhenologyPanel.tsx` composes the phenology tab from a `PanelHeader` Card, the metrics card, the NDVI curve, and a gradient source-notes card. The crop control is a styled native `<select>` so the existing `getByLabelText("Crop")` test keeps passing.
- `src/features/phenology/NdviCurveChart.tsx` renders the Recharts `ComposedChart` (Area band for the credible interval, posterior `Line`, dashed empirical `Line`) with a static `LegendDot` row, a hover tooltip, and peak summary tiles. The chart container carries `role="img"` with `aria-label="${cropLabel} NDVI phenology curve"` for the test.
- `src/features/phenology/PhenologyMetrics.tsx` renders tone-coded metric tiles (emerald RMSE/MAE, sky Coverage, violet CRPS) and an observation count.
- `src/features/prediction/PredictionPanel.tsx` composes the prediction diagnostics tab from headline metrics, ablation, SHAP, regime metrics, and confusion matrix views.
- `src/features/prediction/AblationChart.tsx`, `ShapFeatureChart.tsx`, `RegimeMetricsChart.tsx`, and `ConfusionMatrix.tsx` render Task 4 diagnostic evidence with visible source/caveat context.
- `src/features/rotation/RotationPanel.tsx` composes the rotation tab from class summaries, geographic ranking, Markov/threshold caveats, selection status, and source notes.
- `src/features/rotation/RotationClassChart.tsx` renders Task 2 class evidence with code-native cards.
- `src/features/rotation/RotationGeoRanking.tsx` renders the Task 2 geographic ranking table with a compact 5-row view and a "Show N more" / "Show less" disclosure when there are more than 5 rows; default state is collapsed.
- `src/features/extremes/ExtremesPanel.tsx` composes the soil moisture extremes tab from event selection, URL-state-compatible filters, anomaly summary cards, anomaly table, caveats, and source notes.
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
- TASK-010 wires the server/client boundary: filesystem artifact loading remains in the server page, while URL search params and map/filter interactions live in the client shell.
- `DashboardShell` preserves unrelated URL params when writing dashboard params and keeps immediate local UI state in sync with representative share URLs.
- TASK-011 introduces a local shadcn-style primitive layer under `src/components/ui/` and rewrites the shell, map card, NDVI chart, and rotation geographic ranking to use it. Data flow above is unchanged; only the visual layer was replaced.
- `UsChoropleth` consumes a `values: Record<stateCode, number | undefined>` map and a `colorScale(value)` function. `MapPanel` derives the values map by looking up each Corn Belt fallback geography's `legendItemIds[layerId]` in the active layer's legend and using the legend index as the categorical value; the color scale returns the corresponding legend color or a soft slate for no-data.
- Map state selection is unchanged from `TASK-010`'s contract: `MapPanel` still emits `CornBeltMapSelectionContext` records into the shell, which writes `selectedEntity` back to the URL.

## Important Boundaries

- Workflow artifacts (`PROJECT.md`, `SCOPE.md`, `TASKS.md`, `AGENTS.md`, `memory/`, `logs/`, `scripts/`) remain outside the app runtime.
- The current shell now uses Radix-backed local UI primitives, Recharts for the NDVI chart, and `d3-geo` + `us-atlas` for the choropleth. There is still no backend, database, auth, or live tile source.
- Dashboard visual assets remain code-native; do not use image generation or `gpt-image-2`. SVG/Recharts/d3-geo rendering is the only acceptable visual pipeline.
- Analytical dashboard state is URL-backed; do not store active filters, map layer, selected entity, or analytical tab only in localStorage.
- Feature panels should receive normalized data as props and stay client-safe; server filesystem loading remains in `src/lib/data/dashboard-data.ts` and related loaders.
- Generated folders `dashboard/node_modules/`, `dashboard/.next/`, and `dashboard/tsconfig.tsbuildinfo` are ignored.

## Known Caveats

- `npm audit --audit-level=high` reports no high/critical advisories, but npm install/audit reports two moderate advisories in Next/PostCSS with only breaking `npm audit fix --force` remediation suggested. `TASK-011` dependencies did not introduce new high/critical advisories.
- The Corn Belt map is now a real U.S. Albers choropleth (`d3-geo` + `us-atlas/states-albers-10m.json`), but it uses categorical-index coloring derived from the Corn Belt fallback geography registry. States outside the fallback registry render as no-data. It is not pixel/raster geometry.
- The integration test relies on the shell using a controlled button tablist rather than Radix `<Tabs>` (under React 19 + JSDOM, `fireEvent.click` on a Radix `TabsTrigger` did not reliably propagate the controlled-state change during the redesign).
- In-app browser visual smoke is currently blocked in this environment by the browser runtime Windows sandbox setup error, and the Chrome MCP extension was unreachable in the last session. Use HTTP smoke plus automated tests until the runtime is available or Playwright is added.
