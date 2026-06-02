# Intake

This is the source input for the GeoCrop dashboard build. It comes from the
GeoCrop project paper, README, generated artifacts, and the dashboard planning
discussion on 2026-06-02.

## Problem

Build an interactive web dashboard for the GeoCrop Spatiotemporal Modeling
project. The dashboard should turn the existing paper and artifacts into a
source-driven geospatial analytics experience for agricultural resilience:
phenology, rotation, soil moisture extremes, and crop prediction.

The dashboard should not be a generic chart gallery. It should preserve the
research story and make the existing outputs explorable without rerunning the
notebooks for the first useful version.

## Users

- Agricultural analysts who need to inspect Corn Belt patterns by geography,
  crop, event, and model layer.
- Data science reviewers who need to understand methods, evidence, limitations,
  and model performance.
- Future project maintainers who need a reproducible website/dashboard surface
  built from durable artifacts.

## Smallest Useful Version

ASSUMPTION: MVP is a static-data React/Next-style dashboard or equivalent web
app that reads checked-in artifact tables and figure assets from the parent
GeoCrop repository.

MVP should include:

- A landing dashboard view with a Corn Belt evidence map as the primary visual.
- Layer switching for the four research tasks.
- Coordinated summary panels for selected task/state/crop/event.
- A source/caveat area that makes denominators, date stamps, and model limits
  visible.
- Mobile portrait layout where the main map remains visible before controls.

## Recommended Design Direction

Primary direction: Map Command Center with guided analytical tabs.

Fallback direction: Interactive Paper if reviewer communication becomes more
important than exploration.

Alternative direction: Model Workbench if ML diagnostics become the primary
goal.

Desktop reading path:

1. Top command bar: project title, source/caveat status, compact filters.
2. Center-left: Corn Belt interactive map.
3. Right rail: selected geography/task summary, metrics, uncertainty/caveat,
   and model explanation.
4. Bottom band: coordinated small multiples for NDVI curves, rotation bars,
   soil moisture timeline, and confusion/ablation matrix.

Mobile reading path:

1. Insight title and compact metric strip.
2. Main map immediately visible.
3. Bottom-sheet controls for filters.
4. Swipeable tabs for Phenology, Rotation, Extremes, and Prediction.
5. Tap/focus selection replaces hover.

## Features

- Dashboard shell and navigation
  - Four task tabs: Phenology, Rotation, Extremes, Prediction.
  - Global filters: state, crop, event, rotation regime, model layer.
  - Active filter chips remain visible when controls collapse.

- Corn Belt map
  - Primary evidence substrate.
  - Layers:
    - Task 2 rotation class.
    - Task 2 Bayesian P(regular) or uncertainty where feasible.
    - Task 3 flood/drought anomaly summaries.
    - Task 4 predicted crop and agreement/disagreement.
  - Selection should coordinate with side panels and charts.

- Phenology panel
  - NDVI seasonal curves for corn, soybean, and winter wheat.
  - HSGP model metrics and uncertainty notes.
  - Peak timing and peak NDVI summary.

- Rotation panel
  - Regular, monoculture, irregular class proportions.
  - State/county ranking where artifact data supports it.
  - Threshold and Bayesian uncertainty caveat.

- Extremes panel
  - 2019 Midwest flood and 2022 Plains drought event views.
  - State x crop anomaly stats.
  - NIG P(drought) explanation and z-score caveat.

- Prediction panel
  - LightGBM 2023 holdout metrics.
  - Ablation comparison.
  - SHAP top features.
  - Rotation-regime stratified performance.
  - Confusion matrix and major corn/soy error mode.

- Shareable state
  - URL should preserve tab, layer, filters, selected state/crop/event, and map
    bounds when practical.

- Accessibility and responsive design
  - Essential values visible without hover.
  - Keyboard and screen-reader paths for filters and tabs.
  - Color roles resilient to color-vision deficiencies.
  - Reduced-motion/static fallback if animation is added.

## Screens / Routes / Modules

ASSUMPTION: Route/module shape will be finalized during scope.

Expected screens:

- `/` or dashboard home: main Map Command Center.
- Optional `/methodology` or in-dashboard methodology drawer.
- Optional `/about` or source/caveat page.

Expected modules:

- Data normalization/source registry.
- Map renderer.
- Coordinated chart panels.
- Global state and URL codec.
- Responsive layout shell.
- Accessibility/error/empty-state components.

## Data

Use existing artifacts from the parent repository first.

Task 1:

- `../artifacts/tables/task1/model_evaluation.csv`
- `../artifacts/tables/task1/hsgp_posterior_phenology.csv`
- `../artifacts/tables/task1/empirical_ndvi_by_crop.csv`
- `../artifacts/figures/task1/*.png`

Task 2:

- `../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv`
- `../artifacts/tables/task4/task2__areal_stats_by_county__20260412.csv`
- `../artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv`
- `../artifacts/tables/task2/task2__markov_transition_probs.csv`
- `../artifacts/tables/task2/task2__threshold_sensitivity_grid.csv`
- `../artifacts/figures/task2/*.png`

Task 3:

- `../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv`
- `../artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv`
- `../artifacts/figures/task3/*.png`

Task 4:

- `../artifacts/tables/task4/task4_ablation_results.csv`
- `../artifacts/tables/task4/task4_regime_stratified_metrics.csv`
- `../artifacts/tables/task4/task4_shap_feature_importance.csv`
- `../artifacts/tables/task4/task4_split_summary.csv`
- `../artifacts/tables/task4/task4__test_metrics__20260413.json`
- `../artifacts/figures/task4/*.png`

UNKNOWN: Whether the dashboard should ingest GeoTIFF/Parquet directly for
pixel-level interaction, or start from CSV summaries plus PNG fallback maps.

## Integrations

- No auth expected for MVP.
- No remote database expected for MVP.
- No external API required for MVP.
- Optional future integration: remote tile service or static generated tiles for
  high-resolution map layers.

## Stack

UNKNOWN: Final stack is not selected.

ASSUMPTION: A modern TypeScript web app is preferred, likely React/Next.js or
Vite React, with D3/Observable Plot/Recharts for charts and MapLibre/deck.gl or
SVG/Canvas map layers depending on artifact format.

## Out Of Scope

- Rerunning notebooks as part of the web app.
- Training or tuning the LightGBM model inside the dashboard.
- Replacing the paper.
- Auth, payments, multi-user collaboration, or persistent remote saved views.
- Live data streaming.
- Real-time crop forecasting.
- Claims not supported by existing artifacts.

## Done Means

For the first build milestone:

- Dashboard app runs locally.
- Main dashboard view renders source-backed data.
- Four task tabs expose the key paper results.
- Map or map fallback is visible and coordinated with panels.
- Mobile portrait layout keeps the main evidence visible.
- URL state covers meaningful filters/tabs.
- Typecheck and tests pass where configured.
- Manual smoke covers desktop and mobile viewport.
- Handover explains run instructions, data inputs, caveats, and next tasks.

## Risks

- Map layer fidelity may be limited if only PNG maps are available.
- GeoTIFF/Parquet ingestion may require preprocessing before browser use.
- Source artifact paths and date-stamped filenames may drift.
- Dashboard could become too dense if all four tasks are equal weight.
- Color encodings could conflict between crop classes and anomaly wet/dry scale.
- Mobile controls could hide the map if not designed carefully.
- Model results can be misread without denominators and caveats.

## Open Questions

- UNKNOWN: Should `dashboard/` be an independent nested git repo or tracked as a
  folder in the parent GeoCrop repository?
- UNKNOWN: Should the first implementation use Next.js, Vite, or another stack?
- UNKNOWN: Should v1 build true interactive geospatial layers or use static map
  images with summary-level interactions?
- UNKNOWN: What deployment target should be used?
- UNKNOWN: Should generated design concept images be copied into the dashboard
  docs/assets folder as formal references?
