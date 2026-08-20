# Architecture Memory

> QA updates this after tasks are approved done.

## Current Structure

- `package.json` defines the Next.js 16 + React 19 + TypeScript scaffold and the post-cleanup dependency set: `recharts`, `lucide-react`, `us-atlas`, `topojson-client`, `d3-geo`, `class-variance-authority`, `clsx`, `tailwind-merge`, and the Radix primitives currently used (`react-slot`, `react-select`, `react-popover`, `react-dialog`).
- `src/app/layout.tsx` defines the root HTML shell and metadata.
- `src/app/page.tsx` server-loads normalized dashboard data with `loadDashboardData()` and renders the client shell inside a Suspense boundary for URL search-param support.
- `src/app/globals.css` imports Tailwind CSS, defines the `@theme` design tokens (color and `--radius`), sets font smoothing and a soft body gradient, styles the scrollbar, and declares the `fade-in` keyframe.
- `src/lib/utils.ts` exports the `cn()` class-merge helper.
- `src/components/ui/card.tsx`, `button.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `popover.tsx`, and `sheet.tsx` define the local shadcn-style primitive layer backed by Radix where appropriate. `Card` supports `asChild` so it can wrap a semantic `<section>` while keeping styling.
- `src/components/layout/TopBar.tsx` renders the sticky Narrative Atlas brand, Story/Explore switch, neutral paper action, and live source/task/load-issue badges.
- `src/components/layout/DashboardShell.tsx` owns URL-backed view/task/filter/pin state and composes two siblings from one `TaskPanel` dispatcher. Story renders the scale-bearing opening, act navigator, and all four shared panels in authored order. Explore renders a controlled task tablist and only the active shared panel. The measured `MapPanel` is injected only into Rotation; no universal map or global control wall remains.
- `src/components/layout/DashboardShell.test.tsx` verifies the default four-act Story, HSGP-before-map order, per-act Explore links, v1 URL inference, active Explore task switching, visible legacy-layer warnings, neutral paper drawer, source continuity, and load errors.
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
- `src/lib/state/__tests__/url-state.test.ts` verifies Story defaults, explicit Explore serialization, v1 analytical-link inference, retired-layer normalization/warnings, invalid params, stable order, and unrelated-param preservation.
- The v1 `src/components/filters/CompactFilterBar.tsx` global six-control surface was deleted in `TASK-022`. Task controls now live inside the Phenology, Rotation, or Extremes evidence component they affect.
- `src/components/map/UsChoropleth.tsx` renders the U.S. Albers state choropleth. It reads `us-atlas/states-albers-10m.json` via `topojson-client.feature`, generates paths with `d3-geo.geoPath()`, applies a caller-provided `colorScale(value)`, and exposes each state as a keyboard-activatable `role="button"` with `aria-label="Select ${name}"`. It supports a hover tooltip and a selected-state shadow filter.
- `src/components/map/MapPanel.tsx` wraps `UsChoropleth` with measured Task 2/3 selectors, state/county grain where supported, exact-value list, complete numeric legend, no-data, pin/reset evidence lens, sources, denominator, and caveat. Integration can hide its layer chooser when the active task owns one metric.
- `src/components/map/__tests__/MapPanel.test.tsx` verifies all 13 measured states, pointer/keyboard pin equivalence, reset, county GEOID detail, Task 3 shared zero domain, and safe retired-layer normalization.
- `src/features/map/map-layers.ts` defines only the measured Task 2 regular-share and Task 3 mean-anomaly layers. Legacy `rotation-class`, `crop-prediction`, and `prediction-agreement` ids normalize to regular share but never appear as available layers.
- `src/features/map/map-selection.ts` defines typed selected-map context records for downstream panels.
- `src/features/phenology/PhenologyPanel.tsx` composes Task 1 as one corn/soybean/winter-wheat comparator. Story always shows all three crops; Explore keeps all three while adding a crop emphasis and one compact shared season-window disclosure. The panel owns source/caveat and named fallback states.
- `src/features/phenology/NdviCurveChart.tsx` renders each comparator row with a shared focused 0.50–1.00 NDVI domain, month context, posterior 5–95% and 25–75% areas, posterior mean, empirical Q25/Q75 lines, direct modeled peak, and paper-authored crop-stage chips. A safe initial Recharts dimension prevents negative-width SSR/container warnings.
- `src/features/phenology/PhenologyMetrics.tsx` renders the three paper crops in one responsive semantic fit table, keeping RMSE and 90% coverage visible at narrow widths while progressively revealing supporting metrics.
- `src/features/prediction/PredictionPanel.tsx` composes Act IV from a feature-source braid through held-out metrics, ablation, grouped SHAP, annotated confusion, regime close, and a visible timing/sample/spatial limitation ledger.
- `src/features/prediction/FeatureSourceBraid.tsx` keeps CDL 30 m / 19 features, NDVI 250 m / 15 features, and SMAP 9 km / 4 features visible as they feed the 38-feature, four-class LightGBM model.
- `src/features/prediction/AblationChart.tsx` orders configurations by stable A–D identifiers and computes B/C relative to CDL and D relative to CDL+NDVI, so unexpected source row order cannot change the increment story.
- `src/features/prediction/ShapFeatureChart.tsx` classifies every source row into CDL, NDVI, SMAP, or Other/context and renders all rows on one global magnitude scale; unknown names remain visible.
- `src/features/prediction/ConfusionMatrix.tsx` derives the visible class count from the exported matrix, prints counts and safe row shares, and directly annotates both corn/soy directions. `RegimeMetricsChart.tsx` closes with overall accuracy and denominators for monoculture, regular, and irregular strata.
- `src/features/rotation/RotationPanel.tsx` composes Task 2 in explanatory order: schematic rule strips, dated composition, an optional shared-map figure slot, measured ranking/detail, discrete sensitivity, Markov context, and source limits. `TASK-022` supplies the already-built map through the figure slot without duplicating map logic.
- `src/features/rotation/RotationSequenceStrip.tsx` renders three explicitly schematic ten-year crop-code strips; the irregular definition is neutral and rejects management/condition judgment.
- `src/features/rotation/RotationClassChart.tsx` allocates a largest-remainder 100-cell field from the dated Task 2 shares while printing exact two-decimal percentages, pixels, area, source date, and denominator.
- `src/features/rotation/RotationGeoRanking.tsx` ranks regular share only within the selected state or county grain, assigns equal values equal competition ranks, exposes a pinned exact-share detail, and uses responsive list rows rather than a wide table.
- `src/features/rotation/ThresholdComparison.tsx` filters to complete exported sensitivity rows and exposes them through a native discrete select; it never interpolates threshold results or treats the sensitivity grid as the dated baseline.
- `src/features/extremes/ExtremesPanel.tsx` composes Act III as a matched flood/drought chapter. One crop drives both event maps; Story keeps the comparison concise while Explore reveals the complete event × state × crop table.
- `src/features/extremes/EventMapComparison.tsx` reuses the shared Albers `UsChoropleth` twice with one crop-wide symmetric mean-z domain. Hover/focus previews and click/keyboard pins are shared across frames; the pinned region reports event-specific mean z, NIG posterior percentile, pixel-week denominator, source, limitation, and explicit no-data.
- `src/features/extremes/EventSelector.tsx`, `AnomalySummaryChart.tsx`, and `AnomalyTable.tsx` render the fixed event pair, separate magnitude/posterior anchors, and exact Task 3 evidence.
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
- TASK-004 adds URL-backed dashboard state helpers; `TASK-022` extends them with `view`. Empty state serializes to Story, explicit Explore round-trips, v1 analytical params without `view` infer Explore, invalid params warn, and retired map-layer ids normalize visibly.
- TASK-005, TASK-006, and TASK-009 consume normalized source contracts through component props; they do not load filesystem artifacts directly.
- Map selections are represented as typed context records so later integration can synchronize selected geography, map layer, and panel evidence through URL-backed state.
- Phenology and prediction visual components keep essential values, source paths, and caveats visible without hover. Task 1 applies one shared season window and NDVI domain to all three crop rows so Explore never destroys comparison context.
- Rotation and extremes visual components receive normalized Task 2/3 data via props and expose URL-state-compatible selection/filter props for TASK-010 integration.
- Rotation consumes `selectedEntity` or `selectedGeographyId`; extremes consumes `selectedEvent`, `selectedCrop`, and `selectedState` plus matching callbacks.
- Rotation strips `state:` / `county:` URL prefixes when matching a pin and switches ranking grain to the matched geography, keeping the external map lens and chapter detail synchronized.
- Extremes selectors compute a crop-wide anomaly domain across both events, so the paired maps always share a zero-centered scale. The map encodes mean z only; NIG remains a separately labeled posterior-predictive percentile and missing combinations are never substituted from another event or crop.
- TASK-010 wires the server/client boundary: filesystem artifact loading remains in the server page, while URL search params and interactions live in the client shell. `TASK-022` preserves that boundary while splitting composition into Story and Explore.
- `DashboardShell` preserves unrelated URL params, makes Story the empty-URL default, routes per-act handoffs to matching Explore tabs, and keeps immediate local UI state synchronized with representative share URLs.
- TASK-011 introduces a local shadcn-style primitive layer under `src/components/ui/` and rewrites the shell, map card, NDVI chart, and rotation geographic ranking to use it. Data flow above is unchanged; only the visual layer was replaced.
- `UsChoropleth` consumes measured `MapEvidenceValue` rows and a caller color scale. `MapPanel` selects regular-share or event-anomaly evidence from normalized artifacts and uses soft paper gray only for explicit no-data.
- Map state selection is unchanged from `TASK-010`'s contract: `MapPanel` still emits `CornBeltMapSelectionContext` records into the shell, which writes `selectedEntity` back to the URL.

## Important Boundaries

- Workflow artifacts (`PROJECT.md`, `SCOPE.md`, `TASKS.md`, `AGENTS.md`, `memory/`, `logs/`, `scripts/`) remain outside the app runtime.
- The current shell now uses Radix-backed local UI primitives, Recharts for the NDVI chart, and `d3-geo` + `us-atlas` for the choropleth. There is still no backend, database, auth, or live tile source.
- Dashboard visual assets remain code-native; do not use image generation or `gpt-image-2`. SVG/Recharts/d3-geo rendering is the only acceptable visual pipeline.
- Meaningful analytical state is URL-backed: view, active Explore task, supported task-local filters, and selected evidence. Do not move it to localStorage.
- Feature panels should receive normalized data as props and stay client-safe; server filesystem loading remains in `src/lib/data/dashboard-data.ts` and related loaders.
- Generated folders `dashboard/node_modules/`, `dashboard/.next/`, and `dashboard/tsconfig.tsbuildinfo` are ignored.

## Known Caveats

- `npm audit --audit-level=high` reported zero vulnerabilities after `TASK-022` refreshed the lockfile to patched versions within the existing manifest ranges. No feature dependency was added.
- The Corn Belt map is a real U.S. Albers choropleth (`d3-geo` + `us-atlas`) driven by aggregate numeric artifacts. It is not pixel/raster or field geometry; Task 2 county evidence and Task 3 state evidence retain their honest grain.
- The integration test relies on the shell using a controlled button tablist rather than Radix `<Tabs>` (under React 19 + JSDOM, `fireEvent.click` on a Radix `TabsTrigger` did not reliably propagate the controlled-state change during the redesign).
- Browser Use verified the final app at 1440, 390, and 320 px. In managed sandboxes, use Webpack when Turbopack is prevented from spawning its CSS helper process or binding an internal port.
