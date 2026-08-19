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

DECIDED: Use Next.js with React and TypeScript, hosted on Vercel.

Stack direction:

- Next.js + React + TypeScript for the app.
- Tailwind CSS plus small design-token conventions for styling.
- shadcn/ui only where useful for accessible controls and panels.
- Observable Plot or D3 for analytical charts.
- MapLibre GL JS for interactive map surfaces, with static image/SVG fallback
  if true browser-safe geospatial layers are not ready for MVP.
- Static artifact ingestion from parent-repo CSV/JSON into typed dashboard data.
- URL search params for shareable tab/layer/filter state.
- No backend, database, auth, or external API for MVP.

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
- DECIDED: First implementation should use Next.js + TypeScript on Vercel.
- UNKNOWN: Should v1 build true interactive geospatial layers or use static map
  images with summary-level interactions?
- UNKNOWN: What deployment target should be used?
- UNKNOWN: Should generated design concept images be copied into the dashboard
  docs/assets folder as formal references?

---

## Website redesign intake — 2026-08-19

This section is the authoritative intake for a second design phase. It augments
the original v1 intake above; it does not retroactively change the delivered v1
baseline.

### Request and phase boundary

The website needs a complete visual and storytelling redesign. The current
macro layout is a useful starting point, but the individual visualizations,
interactions, and narrative progression feel generic, uneven, and insufficiently
faithful to the paper. The Hilbert Space Gaussian Process (HSGP) phenology view
and the map are the highest-priority examples.

This session is planning and context work only. It may inspect the running site
and capture temporary screenshots, but it must not change application code,
tests, dependencies, data artifacts, generated assets, or production design
files. It must not run tests. Canonical v2 scope, a formal design specification,
and implementation tasks remain gated on design approval.

### Settled direction and constraints

- Preserve the current layout where it helps orientation; redesign its visual
  language, information hierarchy, visualization grammar, and interactions.
- Treat the paper and checked-in result artifacts as the evidence authority.
  Artistic expression may clarify evidence but must not manufacture geography,
  precision, values, or model certainty.
- Make the website tell a coherent research story rather than present four
  equal-weight dashboard tabs without narrative context.
- Use interaction to reveal meaning: hover/focus may preview, click/tap may pin,
  and zoom may expose supported geographic detail. Essential evidence must have
  a visible, keyboard-accessible, and touch-accessible path that does not depend
  on hover.
- Retain source, denominator, caveat, uncertainty, responsive, and reduced-motion
  expectations unless the approved v2 scope deliberately strengthens them.
- Continue the repository rule against generated imagery. Temporary screenshots,
  text wireframes, code-native visual motifs, and data-derived graphics are
  appropriate planning references.
- Prefer the existing application stack and source pipeline unless a later
  approved design requirement demonstrates a concrete gap.

### Evidence audit

The redesign cannot be solved as a styling pass because two lead visuals have
meaning-level problems:

- The current national map hardcodes categorical labels for only 10 states. It
  is not a visualization of the paper's measured state summaries, and the
  research artifacts cover 13 study states. The national frame also devotes
  most of the visual area to no-data states. Selecting an unregistered state can
  inherit Minnesota's values under a different label, and the resulting
  `selectedEntity` does not consistently coordinate the task panels. These are
  evidence-integrity and interaction-contract failures, not styling defects.
- The current HSGP chart shows one crop at a time, keys rows by rounded day of
  year, discards empirical year, and can overwrite repeated empirical and
  posterior observations. The empirical artifact has 535 rows per crop but only
  211 unique day-of-year values, so the rendered dashed line is not a valid
  single seasonal series. The chart also omits the empirical Q25–Q75 spatial
  band and posterior IQR fields that help explain the paper's result. Its fixed
  0–1 axis, jagged comparison line, and large brush flatten the phenology story
  and do not resemble the paper's three-panel comparison.
- Mobile inspection at a 390 px viewport found horizontal overflow, dense
  controls before the active evidence, and source/caveat cards wider than the
  viewport. The chart also emits negative-width/height warnings during live
  rendering. These are recorded as redesign risks, not implementation work for
  this phase.
- Task 2 has real state- and county-level summary tables, including 13-state
  rotation statistics. Task 3 has real state-by-crop flood and drought
  summaries. Task 4 does not currently have an equivalent browser-ready
  geographic table, so a uniform prediction map would overstate the available
  evidence.
- State geometry is already available through `us-atlas`, including county
  boundaries. No browser-ready GeoJSON, vector-tile, or pixel-level layer is
  currently checked in. A future map must stop at the honest grain of each
  result unless an explicit preprocessing task is approved.

### Paper-led story spine

The paper naturally supports four acts:

1. **See the season — Phenology.** Learn the recurring seasonal signal and how
   the HSGP models it with calibrated uncertainty.
2. **Read the land's memory — Rotation.** Move from a single season to a decade
   of crop sequences and the distinction between regular, monoculture, and
   irregular rotation.
3. **Watch the system under stress — Extremes.** Contrast the 2019 flood and
   2022 drought while distinguishing anomaly magnitude from confidence under a
   short baseline.
4. **Predict what comes next — Model.** Show how land-use history, NDVI, and soil
   moisture contribute to 2023 crop prediction, where the model succeeds, and
   where irregular regimes remain difficult.

The evidence anchors for this story include 2.08 million eligible Task 2 pixels
(27.36% regular, 3.90% monoculture, 68.74% irregular), Task 4 accuracy of 79.2%
and macro F1 of 0.791, a 1.7 percentage-point NDVI ablation gain, and markedly
lower accuracy for irregular rotations. These values must be revalidated against
their dated artifacts when final copy is approved.

### Candidate product directions

1. **Narrative Atlas: editorial story → analytical explorer (approved product
   frame; selected working layout).** Make the guided four-act story the default experience
   and offer an “Explore this evidence” handoff into task-specific controls.
   This best serves a first visit without discarding the analytical value and
   URL-backed state of v1. Its editorial thesis is: *The Corn Belt has a rhythm,
   a memory, and a breaking point. Three satellite records reveal how crops
   grow, how fields repeat, how weather interrupts, and why some landscapes are
   easier to read than others.*
2. **Refined Map Command Center.** Keep the current dashboard structure and
   replace the pseudo-data map and weak charts with honest task-specific
   graphics. This is the smallest structural change but tells a weaker story.
3. **Interactive paper.** Build a tightly authored scrollytelling interpretation
   of the paper. This makes the strongest linear narrative but reduces the
   analyst's ability to compare and inspect results freely.

Approval update on 2026-08-19: proceed with Narrative Atlas, but balance the
authored story with the existing analytical value. The design package therefore
uses a Chaptered Evidence Canvas inside Story and a sibling Evidence Lab inside
Explore. “Atlas” names the collection of evidence plates; it does not force a
map into every chapter. The HSGP comparator leads Act I, rotation and extremes
earn map-led acts, and prediction remains chart-led. The detailed mockups and
task graph are reviewable without beginning implementation.

### Provisional creative direction

The recommended visual language is **field notebook meets satellite atlas**:
warm paper/soil neutrals, ink-like greens, disciplined crop and anomaly colors,
editorial typography for the narrative, and clean analytical typography for
controls. Data-derived crop sequences, contour lines, raster cells, and seasonal
curves can supply texture and rhythm. Avoid generic gradients, glow effects,
decorative particles, fake 3D, or motion without explanatory purpose.

Provisional lead visuals:

- Open with a compact, data-bearing braid of CDL (30 m), NDVI (250 m), and SMAP
  (9 km) that introduces how three observation scales feed the four acts.
- Rebuild phenology as three vertically aligned crop panels on shared seasonal
  axes, with the empirical spatial IQR, posterior uncertainty, direct crop
  labels, seasonal-stage annotations, and optional crop focus. Move custom DOY
  controls out of the default reading path.
- Explain rotation first with decade-long crop-sequence strips and a 100-cell
  composition field, clearly labeled as a proportional graphic rather than
  geography. Follow it with a real county/state map using measured rotation
  shares and discrete, source-supported threshold comparisons.
- Compare the 2019 wet and 2022 dry events in stable, paired Corn Belt frames
  with one fixed diverging scale and a state/crop evidence lens showing value,
  denominator, and uncertainty.
- Tell the prediction result through an evidence braid into LightGBM, incremental
  ablation bars, grouped feature importance, an annotated corn/soy confusion
  matrix, and direct comparison of rotation-regime accuracy. Use a map only if a
  truthful geographic prediction artifact is prepared.
- Replace the universal map with task-specific geography. Focus the main map on
  the 13-state study region with a quiet national locator. Hover/focus previews a
  state or county and opens an anchored “evidence lens”; click/tap pins it. The
  lens may reveal counties only where county data exists and must never imply
  field-level precision.
- Compose mobile as a sibling experience: insight and main evidence first,
  controls in a disclosure or bottom sheet, tap/focus instead of hover, and a
  compact pinned-detail sheet for maps. Reduced motion shows the same key states
  without animation.

### Success criteria for an approved v2 design

- A first-time visitor can state the four-part research story and the main result
  of each act without opening every control.
- The HSGP view is recognizably faithful to the paper's comparison and uncertainty
  semantics while remaining legible and exploratory.
- Every mapped color is traceable to a measured field and honest geographic
  grain; no placeholder category is presented as scientific evidence.
- Interaction produces insight rather than decoration and has equivalent mouse,
  keyboard, and touch paths.
- Desktop and mobile have intentional reading orders with no horizontal overflow
  and no essential information hidden behind hover.
- Sources, denominators, uncertainty, limitations, and data freshness remain
  visible at the moment a claim is made.
- The result feels authored and distinctive while reusing the existing stack and
  avoiding unsupported complexity.

### Open decisions requiring approval or source resolution

- Review and revise the selected Chaptered Evidence Canvas + Evidence Lab layout
  before implementation begins.
- Confirm the priority audience among portfolio/judging visitors, agricultural
  analysts, and data-science reviewers; the hybrid assumes the first group enters
  through Story and the latter groups continue into Explore.
- Approve the “field notebook meets satellite atlas” art direction and desired
  motion intensity.
- Confirm the first-screen claim and how prominently the challenge/award identity
  should appear.
- Decide whether state comparison, crop comparison, or method explanation is the
  primary exploratory interaction after the guided story.
- Resolve conflicting rotation percentages in the root README versus the paper
  and dated artifacts.
- Define “irregular” explicitly as outside the strict alternation template, not
  as disorder, failure, or poor farm management.
- Resolve the paper's internal mismatch between edit-distance ceilings of 2 and
  3 and eligibility thresholds of 7 and 5 years before presenting an interactive
  rule explainer.
- Resolve inconsistent NeurIPS 2024, NAFSI 2025, and Spring 2026 labels before
  redesign copy repeats an unsupported chronology or award claim.
- Correct or deliberately contextualize the unrelated repository link embedded
  in the paper source.
- Do not describe Task 4 as a pre-plant forecast: its NDVI and SMAP inputs include
  the concurrent growing season. Surface that the 2023 test set is class-balanced
  at 125,000 pixels per class and that SHAP uses a 1,000-pixel subsample wherever
  those results are interpreted.
- Do not imply field-level fidelity from 9 km SMAP or the common analysis grid.
