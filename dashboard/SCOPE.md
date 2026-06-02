# Scope

> Canonical contract for the GeoCrop Interactive Dashboard.

## 1. Project Overview

**Name:** GeoCrop Interactive Dashboard

**Description:** A source-backed web dashboard that turns the GeoCrop
Spatiotemporal Modeling paper and generated artifacts into an interactive
agricultural resilience visualization for the U.S. Corn Belt.

**Goals:**

- Present the four GeoCrop research tasks as one coherent analytical workspace:
  NDVI phenology, crop rotation, soil moisture extremes, and crop prediction.
- Use existing artifact tables and figures first, without rerunning notebooks in
  the web app.
- Make geographic, crop, event, rotation-regime, and model-layer comparisons
  explorable.
- Preserve methods, denominators, date stamps, and caveats so users do not
  overread the model results.
- Deploy cleanly to Vercel as a portfolio-quality dashboard.

**Users:**

- Agricultural analysts inspecting Corn Belt patterns by state, crop, event,
  and model layer.
- Data science reviewers evaluating methodology, evidence, limitations, and
  model performance.
- Future maintainers continuing the dashboard from durable workflow artifacts.

## 2. System Architecture

**Frontend:** Next.js application with TypeScript. The initial user experience is
the Map Command Center: a map-led dashboard with guided task tabs and
coordinated analytical panels.

**Backend:** None for MVP. Use static build-time or client-side data ingestion
from normalized artifact JSON derived from parent-repo CSV/JSON inputs.

**Database:** None for MVP.

**Auth:** None for MVP.

**External services:** Vercel for hosting. No external APIs are required for the
first milestone.

**Data flow:**

1. Parent GeoCrop artifacts remain the source of truth.
2. Dashboard-side data adapter reads source CSV/JSON inputs or generated
   normalized JSON.
3. Components consume typed, dashboard-friendly data contracts.
4. URL search params preserve meaningful dashboard state: active tab, map layer,
   state, crop, event, rotation regime, selected entity, and map view when
   practical.

**Important boundaries:**

- Do not train models, tune models, or rerun notebooks inside the dashboard.
- Do not introduce server persistence until a later scope explicitly requires
  saved views or collaboration.
- Do not make unsupported claims beyond the paper and artifacts.
- Treat image maps as fallbacks unless true browser-safe spatial layers are
  prepared.

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS plus small design-token conventions |
| UI primitives | shadcn/ui only for useful controls and panels |
| Charts | Observable Plot or D3 for analytical charts |
| Maps | MapLibre GL JS for interactive map surfaces; static image/SVG fallback for MVP if source geospatial layers are not browser-ready |
| Data processing | Build-time/static artifact normalization from CSV/JSON into typed JSON |
| State | URL search params for shareable state; localStorage only for user preferences if needed |
| Backend | None for MVP |
| Database | None for MVP |
| Auth | None |
| Testing | Vitest for data transforms and component logic; Playwright later for dashboard smoke tests |
| Deployment | Vercel |

## 4. Design / References

| Type | Path or URL | Notes |
|------|-------------|-------|
| Intake | `docs/intake.md` | Source input for scope |
| Paper | `../artifacts/reports/neurips_2024.tex` | Research narrative and figure references |
| Project README | `../README.md` | Artifact inventory and key result summary |
| Tables | `../artifacts/tables/` | Primary source data for MVP |
| Figures | `../artifacts/figures/` | Static figure/map fallbacks and design references |
| Visual companion | `../.superpowers/` | Temporary local brainstorming output; ignored and not required for repo |

**Primary design direction:** Map Command Center with guided analytical tabs.

**Fallback design direction:** Interactive Paper if presentation/reviewer flow
becomes more important than open exploration.

**Color roles:**

- Neutral context: light map/background tones and charcoal text.
- Corn: orange.
- Soybean: green.
- Winter wheat: purple.
- Wet/dry anomaly: blue/red only.
- Selection/focus: high-contrast outline or accent independent of data colors.

## 5. Feature Breakdown

### Feature: Dashboard Shell And Navigation

**Description:** Main Next.js dashboard surface with project title, source/caveat
status, global filters, and task tabs.

**Screens / Pages / Modules:**

- `/` dashboard route.
- Optional methodology/source drawer within the dashboard.
- Optional `/about` route if scope later needs a separate explanatory page.

**API / Data / Contracts:**

- URL params for active tab, selected layer, state, crop, event, rotation regime,
  and selected entity.

**Data Models:**

- `DashboardFilterState`
- `DashboardTab`
- `LayerId`
- `SourceManifest`

**Depends on features:** none

### Feature: Artifact Data Registry And Normalization

**Description:** Typed source registry and adapters for parent-repo artifact
tables/JSON. Normalized outputs should be small enough for Vercel/browser use.

**Screens / Pages / Modules:**

- Data source registry module.
- Task-specific data adapters for Tasks 1-4.
- Source/caveat metadata module.

**API / Data / Contracts:**

- Reads CSV/JSON source artifacts from `../artifacts/tables/`.
- Produces typed dashboard data objects.
- Records source path, date stamp, denominator, and caveat for visible views.

**Data Models:**

- `PhenologySeries`
- `RotationSummary`
- `AnomalySummary`
- `PredictionMetrics`
- `FeatureImportanceRow`
- `SourceNote`

**Depends on features:** none

### Feature: Corn Belt Map Surface

**Description:** Primary evidence substrate for geography-first exploration.
Layer switching should support available rotation, anomaly, prediction, and
agreement views.

**Screens / Pages / Modules:**

- Map panel.
- Layer control.
- Legend and caveat block.
- Selected geography detail.

**API / Data / Contracts:**

- MVP may use state/county summary GeoJSON or static map fallback images.
- Future tasks may add browser-ready tiles or vector layers.

**Data Models:**

- `MapLayer`
- `MapSelection`
- `MapLegendItem`
- `GeoSummary`

**Depends on features:** Artifact Data Registry And Normalization

### Feature: Phenology Panel

**Description:** Shows HSGP NDVI seasonal curves and Task 1 model quality.

**Screens / Pages / Modules:**

- Phenology tab or bottom-panel module.
- NDVI curve chart.
- Model evaluation metric strip.

**API / Data / Contracts:**

- `model_evaluation.csv`
- `hsgp_posterior_phenology.csv`
- `empirical_ndvi_by_crop.csv`

**Data Models:**

- `PhenologySeries`
- `PhenologyModelEvaluation`

**Depends on features:** Artifact Data Registry And Normalization

### Feature: Rotation Panel

**Description:** Shows regular rotation, monoculture, and irregular class
patterns with state/county summaries and uncertainty caveats.

**Screens / Pages / Modules:**

- Rotation tab.
- Class proportion chart.
- State/county ranking.
- Rotation source/caveat note.

**API / Data / Contracts:**

- `task2__areal_stats_by_class__20260412.csv`
- `task2__areal_stats_by_county__20260412.csv`
- `task2__areal_stats_by_region__20260412.csv`
- `task2__markov_transition_probs.csv`
- `task2__threshold_sensitivity_grid.csv`

**Data Models:**

- `RotationClassSummary`
- `RotationGeoSummary`
- `MarkovTransition`

**Depends on features:** Artifact Data Registry And Normalization, Corn Belt Map
Surface

### Feature: Extremes Panel

**Description:** Shows 2019 Midwest flood and 2022 Plains drought anomaly
statistics by state and crop, including NIG P(drought) interpretation.

**Screens / Pages / Modules:**

- Extremes tab.
- Event selector.
- State x crop anomaly table/chart.
- Event timeline or small multiple.

**API / Data / Contracts:**

- `task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv`
- `task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv`

**Data Models:**

- `ExtremeEventId`
- `AnomalyStateCropSummary`

**Depends on features:** Artifact Data Registry And Normalization, Corn Belt Map
Surface

### Feature: Prediction Panel

**Description:** Shows LightGBM Task 4 prediction results, ablation, SHAP, regime
performance, and confusion/error evidence.

**Screens / Pages / Modules:**

- Prediction tab.
- Metric cards.
- Ablation chart.
- SHAP feature ranking.
- Regime-stratified performance chart.
- Confusion matrix.

**API / Data / Contracts:**

- `task4_ablation_results.csv`
- `task4_regime_stratified_metrics.csv`
- `task4_shap_feature_importance.csv`
- `task4_split_summary.csv`
- `task4__test_metrics__20260413.json`

**Data Models:**

- `AblationResult`
- `RegimeMetric`
- `ShapFeature`
- `PredictionTestMetrics`

**Depends on features:** Artifact Data Registry And Normalization

## 6. Out of Scope

- Rerunning notebooks as part of the web app.
- Model training, model tuning, or live inference.
- Auth, payments, multi-user collaboration, or remote saved views.
- Live remote sensing data streams.
- Real-time crop forecasting.
- Database-backed persistence.
- Claims not supported by existing GeoCrop artifacts.
- Full pixel-level raster interaction unless a task explicitly prepares
  browser-safe spatial data.

## 7. Non-Functional Requirements

- Security: no secrets expected for MVP; no credentials committed; static
  artifact data only.
- Performance: dashboard should load acceptably on Vercel; avoid shipping large
  Parquet/GeoTIFF files directly to the browser.
- Accessibility: essential values visible without hover; keyboard-accessible
  filters/tabs; color encodings must not be the only channel.
- Responsive behavior: mobile portrait must show the main evidence map before
  or alongside controls; controls should collapse into a bottom sheet/drawer.
- Error handling: missing source artifacts should produce visible source/error
  states, not blank panels.
- Testing: Vitest for data normalization; smoke tests/manual verification for
  desktop and mobile viewports; Playwright later when UI stabilizes.
- Shareability: meaningful dashboard state should be URL-backed.
- Maintainability: Builders work only from task-owned files and QA updates
  memory after done tasks.

## 8. Gaps / Assumptions

- `ASSUMPTION:` `dashboard/` is tracked as a folder in the parent GeoCrop repo,
  not as a nested git repo, unless the user later requests a separate repo.
- `ASSUMPTION:` Next.js + TypeScript + Vercel is the approved stack direction.
- `ASSUMPTION:` MVP starts from CSV/JSON summary artifacts plus static map
  fallbacks before attempting pixel-level raster interaction.
- `ASSUMPTION:` No backend, database, or auth is required for the first
  milestone.
- `UNKNOWN:` Whether state/county GeoJSON boundaries are already available in
  browser-ready form or need to be generated.
- `UNKNOWN:` Whether generated visual concept images should be copied into
  dashboard docs/assets as formal references.
- `UNKNOWN:` Final deployment project settings on Vercel.
