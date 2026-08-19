# Scope

> Canonical v2 contract for the GeoCrop Narrative Atlas website redesign. The
> delivered v1 dashboard remains the implementation baseline until the pending
> v2 tasks pass review.

## 1. Project overview

**Name:** GeoCrop Narrative Atlas

**Description:** A source-backed interactive research story and analytical
explorer for GeoCrop's Corn Belt phenology, rotation, climate-extreme, and crop-
prediction results.

**Approved product direction:** Narrative Atlas — Story → Explore.

**Selected composition:** Chaptered Evidence Canvas for Story plus an Evidence
Lab for task-specific exploration.

**Goals:**

- Tell the paper as one four-act research story rather than four equal-weight
  dashboard tabs.
- Give every result its appropriate lead form: HSGP chart, sequence/map,
  paired maps, or model diagnostics.
- Repair the evidence integrity of the current HSGP and map presentations.
- Preserve exact values, sources, denominators, uncertainty, and limitations at
  the point where claims appear.
- Retain the useful v1 data, state, accessibility, and component foundations.
- Deliver an authored, artistic experience without unsupported data or
  unnecessary technical complexity.

**Primary reading paths:**

- First-time visitors, judges, and portfolio reviewers enter through Story.
- Agricultural analysts and data-science reviewers continue into Explore.
- Paper readers use the existing embedded paper/source surface.

## 2. Product and route architecture

The website remains a single Next.js route at `/` with two experience modes and
one reference action:

- **Story:** default when no `view` parameter exists; shows all four acts.
- **Explore:** `view=explore`; uses the existing `tab` parameter for the active
  task and task-local controls.
- **Paper:** a top-bar action that opens the existing paper reader drawer with
  open/download actions. It is not a URL mode or a third application state.

Each Story act ends with “Explore this evidence,” linking to
`?view=explore&tab=<task>` while preserving compatible task context. Existing
valid v1 task URLs normalize into Explore. Unsupported legacy map layers produce
a visible warning and a safe task default.

Story uses ordinary document scroll and section navigation. It must not use
scroll-jacking, parallax, or an animation-dependent reading path.

## 3. Story spine

### Opening — A landscape seen at three scales

- Lead with the research thesis, not artifact-row KPIs.
- Compare CDL 30 m, MODIS NDVI 250 m, and SMAP 9 km as a data-bearing resolution
  braid.
- Introduce the 13-state study region and the four acts.

### Act I — See the season

- Lead with aligned HSGP small multiples for corn, soybean, and winter wheat.
- Show posterior mean, posterior IQR, posterior 90% interval, empirical spatial
  Q25–Q75 boundaries, shared seasonal context, stage windows, and direct peak
  labels.
- Keep crop focus and season-window controls in Explore; no large default brush.
- Do not place a map beside or above the lead phenology figure.

### Act II — Read the land's memory

- Explain regular, monoculture, and irregular using clearly labeled schematic
  decade sequence strips.
- Show overall shares as a 100-cell composition field using dated Task 2 values.
- Then show measured regular-share geography across the 13 states and counties.
- Define irregular neutrally as outside the strict alternation template.
- Use only discrete source-supported threshold sensitivity values.

### Act III — Watch the system under stress

- Compare the 2019 flood and 2022 drought in matched Corn Belt frames.
- Use the same fixed diverging mean-z scale centered on zero.
- Keep the same crop selection visible in both frames.
- Distinguish anomaly magnitude from NIG-based confidence and retain the exact
  state × crop table in Explore.

### Act IV — Predict what comes next

- Show CDL, NDVI, and SMAP feeding LightGBM.
- Lead through incremental ablation, grouped SHAP importance, an annotated
  corn/soy confusion matrix, and rotation-regime accuracy.
- Do not call the result a pre-plant forecast.
- Do not add a prediction choropleth without browser-safe geographic evidence.

### Closing synthesis

Close on the evidence-backed interpretation that predictability is highest where
crop history repeats and lower for irregular histories. Keep model limitations
and coarse SMAP resolution alongside that conclusion.

## 4. Explore workspace

Explore keeps task tabs but removes the universal map and global six-control
wall. Controls belong to the active task.

| Task | Lead evidence | Supported controls | Supporting evidence |
|------|---------------|--------------------|---------------------|
| Phenology | Three-crop HSGP comparator | crop focus, season window | metrics, exact values, source |
| Rotation | Numeric regular-share map | geography, metric, discrete threshold | sequences, composition, ranking |
| Extremes | Paired event maps | crop, pinned state | exact table, magnitude/confidence notes |
| Prediction | Diagnostic evidence stack | feature or metric focus | ablation, SHAP, matrix, regime strip |

Story and Explore must share the same normalized selectors and visualization
components. Story changes composition and annotations, not data or chart logic.

## 5. Evidence contracts

### Phenology

- Aggregate empirical Q25/Q75 by crop and day of year across years, matching the
  paper-generation workflow.
- Deterministically aggregate posterior rows that collide after integer DOY
  rounding.
- Preserve posterior IQR and 90% interval fields.
- Never stitch repeated annual observations into one last-write-wins line.

### Rotation

- Use the 13-state Task 2 region table and county table as measured sources.
- Join counties by five-digit GEOID.
- Overall shares use the dated artifact values: 27.36% regular, 3.90%
  monoculture, 68.74% irregular across 2,084,112 eligible pixels.
- Root README percentages are not used while they conflict with the artifacts.

### Extremes

- Use state × crop summaries at state grain.
- Create shared source-derived domains for the paired event comparison.
- Keep mean z, NIG measure, denominator, and baseline caveat distinct.

### Prediction

- Use the existing ablation, SHAP, confusion, regime, split, and test metric
  artifacts.
- Surface the class-balanced 2023 test design and 1,000-pixel SHAP sample.
- Do not manufacture geographic prediction summaries.

Every displayed claim must retain a source path, date or version where known,
denominator where applicable, units, and an interpretation caveat.

## 6. Map contract

- Use installed `d3-geo`, `topojson-client`, and `us-atlas` geometry.
- Focus the primary frame on the 13-state study region in Albers projection.
- Use numeric source fields and a complete labeled legend.
- Permit state/county drill-down only for Task 2.
- Use state grain for Task 3.
- Do not map Tasks 1 or 4.
- Hover/focus previews and click/Enter/Space/tap pins.
- Escape and a visible reset clear the pinned state.
- The evidence lens shows metric, unit, rank where meaningful, denominator,
  source, and caveat.
- Essential values remain visible through direct labels, a pinned inspector, or
  an exact table; hover is optional.
- Do not simulate raster magnification or field-level detail.

The v1 hardcoded ten-state category registry and missing-state value fallback
must be removed.

## 7. Visual and interaction design

**Art direction:** Field notebook meets satellite atlas.

- Warm paper/soil neutrals and charcoal ink form the base.
- Crop colors remain consistent across all figures.
- Wet/dry uses one color-vision-safe diverging family.
- Selection uses a non-data high-contrast outline.
- Data-derived sequence cells, uncertainty bands, coordinate rules, and scale
  marks provide texture.
- Editorial typography carries claims; a legible sans carries controls, axes,
  values, and caveats.
- Cards are limited to bounded summaries and inspectors.

Allowed motion verbs are reveal, compare, accumulate, and pin. Motion does not
loop, hijack scrolling, or carry essential meaning. Reduced motion renders the
same evidence states immediately.

Generated imagery, generic gradient haze, decorative particles, fake 3D, and
ornamental scientific graphics without evidence meaning are prohibited.

## 8. Responsive and accessibility requirements

- Support 320 px and wider without document-level horizontal overflow.
- Mobile order is claim → primary visual → direct annotations → local controls
  disclosure → source/caveat → next act.
- Stack HSGP crop panels vertically with shared seasonal context.
- Use a portrait-focused Corn Belt map and tap-to-pin detail sheet.
- Maintain 44–48 px touch targets.
- Every hover path has keyboard and touch equivalents.
- Direct labels and visible summaries carry essential evidence.
- Preserve semantic heading, region, tab, dialog, form-label, and live-status
  relationships even if v1 accessible names change with the design.
- Return focus to the affected visual after a control sheet closes.
- Honor `prefers-reduced-motion`.
- Eliminate negative-size chart warnings, clipped tooltips, and labels that
  overlap at supported widths.

## 9. Technology and architecture

| Layer | Approved technology |
|-------|---------------------|
| Framework | Next.js 16, React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4 and existing design tokens |
| UI | Existing local shadcn-style/Radix-backed primitives |
| Charts | Recharts plus code-native HTML/SVG where simpler |
| Maps | D3 Geo, TopoJSON Client, `us-atlas` state/county geometry |
| Data | Static CSV/JSON artifact loading and typed normalization |
| State | URL search parameters for shareable analytical state |
| Testing | Vitest, Testing Library, build checks, desktop/mobile smoke |
| Hosting | Vercel |

No new dependency is planned. No backend, database, auth, external API, live
data, notebook execution, or browser delivery of raw Parquet/GeoTIFF is needed.

## 10. Content conflict policy

- Use dated artifacts for rotation values.
- Use neutral “GeoCrop research paper” wording until award and competition-year
  claims are verified from an authoritative source.
- Do not expose conflicting edit-distance or eligibility thresholds as settled
  method copy. Exact sensitivity rows may be shown with a discrepancy caveat.
- Do not link to the unrelated repository currently present in the paper source.
- Do not imply field precision from 9 km SMAP or the common analysis grid.
- Missing data produces a named empty state. It never substitutes another
  geography or an invented category.

## 11. Out of scope

- Rerunning notebooks, training, tuning, or live inference.
- Auth, payments, collaboration, saved remote views, or persistence services.
- Live remote-sensing feeds or real-time forecasting.
- Pixel/field interaction without a prepared browser-safe artifact.
- A Task 4 geographic layer synthesized from aggregate metrics.
- A new chart, map, state, or UI framework.
- Generated images or decorative media.
- Separate Story and Explore chart implementations.
- Unrelated refactoring, README correction outside dashboard handoff needs, or
  paper/source-data changes.

## 12. Delivery criteria

- Story communicates all four acts and their main findings without requiring
  control interaction.
- HSGP visual meaning matches the paper's three-crop comparison and uncertainty
  grammar.
- All map fills are numeric, source-backed, and geographically honest.
- Story-to-Explore handoff preserves act context and valid URL state.
- Sources, denominators, uncertainty, and limitations appear beside claims.
- Mouse, keyboard, touch, and reduced-motion paths expose equivalent evidence.
- Desktop and 320–390 px mobile have no horizontal overflow or chart sizing
  warnings.
- All focused and integration verification gates pass before v2 delivery.
- No new backend, dependency, generated image, unsupported data, or unrelated
  cleanup is introduced.

## 13. Design references

- `docs/intake.md`
- `docs/design/2026-08-19-narrative-atlas-mockups.md`
- `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md`
- `../artifacts/reports/neurips_2024.tex`
- `../artifacts/tables/`
- `../artifacts/figures/`
