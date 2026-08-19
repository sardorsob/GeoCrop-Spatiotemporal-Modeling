# GeoCrop Narrative Atlas Website Redesign

**Status:** Review-ready design package

**Date:** 2026-08-19

**Design source:** `docs/intake.md` and
`docs/design/2026-08-19-narrative-atlas-mockups.md`

## 1. Decision

GeoCrop v2 will use a **Narrative Atlas: Story → Explore** product structure.
The Story experience uses a **Chaptered Evidence Canvas** to guide a first-time
reader through the paper. The Explore experience is an **Evidence Lab** that
preserves task-specific comparison, filtering, exact values, and shareable URL
state.

“Atlas” means a collection of research evidence plates. It does not mean that a
map must lead every chapter:

- Phenology is chart-led.
- Rotation is sequence- and map-led.
- Extremes is paired-map-led.
- Prediction is diagnostic-chart-led.

This resolves the central design tension: the site gains narrative shape without
subordinating the HSGP figure or the other non-geographic results.

## 2. Audience and reading paths

The default Story path serves portfolio visitors, judges, and first-time readers
who need to understand the research before operating controls. Explore serves
agricultural analysts and data-science reviewers who need exact comparison,
filtering, sources, and caveats. Both paths use the same evidence components and
source contracts.

The top-level navigation contains two experience modes and one reference action:

- **Story** — default; all four acts in a deliberate reading order.
- **Explore** — task-specific analytical workspace.
- **Paper** — opens the existing paper reader drawer and source/download actions;
  it is not a URL mode.

The implementation remains on the existing `/` route. Story is the default when
no mode parameter exists. Explore uses `view=explore` and retains the existing
`tab` parameter for the active task. Paper opens a drawer and does not add URL
mode state. Each Story act links directly to its Explore counterpart with
“Explore this evidence.” Existing valid v1 task URLs normalize to Explore;
removed or unsupported map layers produce a visible warning and a safe task
default.

## 3. Story architecture

### Opening — A landscape seen at three scales

Lead with the thesis:

> The Corn Belt has a rhythm, a memory, and a breaking point. Three satellite
> records reveal how crops grow, how fields repeat, how weather interrupts, and
> why some landscapes are easier to read than others.

A compact resolution braid introduces CDL at 30 m, MODIS NDVI at 250 m, and
SMAP at 9 km. It is a data-bearing scale comparison, not decoration. It leads
into four numbered acts and establishes that different observations support
different levels of geographic precision.

### Act I — See the season

The HSGP comparison occupies the main evidence stage. Corn, soybean, and winter
wheat appear simultaneously as three aligned seasonal small multiples.

Each plot contains:

- month/day-of-year context on shared axes;
- crop-stage windows derived from the paper;
- posterior mean;
- darker posterior IQR;
- lighter posterior 90% interval;
- empirical Q25–Q75 spatial boundaries;
- direct crop, peak value, and peak timing labels;
- a concise accessible figure summary and exact-value focus path.

The default Story figure has no crop dropdown and no large brush. Explore may
focus a crop or season window, but must preserve the simultaneous comparison.
The y-scale is shared across crops and focused on the observed evidence range;
the axis and scale-break/truncation note remain visible.

### Act II — Read the land's memory

The chapter explains classification before geography:

1. Clearly labeled schematic ten-year crop-sequence strips illustrate regular
   alternation, monoculture, and a sequence outside the strict template.
2. A 100-cell proportional field shows the source-backed overall shares:
   27.36% regular, 3.90% monoculture, and 68.74% irregular across 2,084,112
   eligible pixels.
3. A measured state/county map shows a numeric field such as regular-rotation
   share. It never uses invented “dominant class” labels.

“Irregular” is always defined neutrally as outside the strict alternation
template. It is not described as disorder, failure, or poor management.

The state evidence lens contains exact regular/monoculture/irregular shares,
rank when meaningful, denominator, source date, and method caveat. Task 2 may
drill from state to county because both county summaries and installed county
geometry exist. Threshold sensitivity uses only discrete source rows or named
presets; the interface does not synthesize a continuous result.

### Act III — Watch the system under stress

The 2019 flood and 2022 drought appear in matched Corn Belt frames with the same
projection, extent, crop selection, and fixed diverging mean-z scale centered on
zero. This permits honest visual comparison.

Pinned state/crop evidence distinguishes:

- anomaly magnitude;
- the NIG probability/percentile measure;
- denominator and baseline limitation;
- the difference between an extreme estimate and confidence in that estimate.

The exact state × crop table remains available in Explore. The Story view uses
direct annotations for a small number of paper-supported anchors rather than a
wall of KPI cards.

### Act IV — Predict what comes next

The chapter begins with a compact evidence braid showing CDL history, seasonal
NDVI, and SMAP inputs flowing into LightGBM. It then presents:

- incremental ablation bars, emphasizing NDVI's approximately 1.7 percentage-
  point gain and SMAP's marginal gain;
- grouped feature importance by source family;
- an annotated confusion matrix centered on the main corn/soy error mode;
- a direct rotation-regime comparison: monoculture 95.5%, regular 87.4%, and
  irregular 70.9% accuracy.

The closing claim is about legibility rather than model triumph: the land is
easiest to predict where history repeats. Task 4 is not described as a pre-plant
forecast because NDVI and SMAP include the concurrent growing season. The test
set's class balancing and the SHAP subsample remain visible caveats.

No interactive geographic prediction layer appears without a prepared,
browser-safe artifact at a truthful geographic grain. The existing static
true-versus-predicted figure may be shown as a sourced paper figure, not
reinterpreted as state-level data.

## 4. Explore architecture

Explore keeps four task tabs but removes the universal map and six-field global
filter row. Every task owns one lead visual and only its relevant controls:

| Task | Lead evidence | Local controls | Supporting evidence |
|------|---------------|----------------|---------------------|
| Phenology | Three-row HSGP comparator | crop focus, season window | model metrics, exact values, source |
| Rotation | measured regular-share map | geography, metric, discrete threshold | sequence rules, composition, ranking |
| Extremes | paired event maps | crop, pinned state | exact table, magnitude/confidence explanation |
| Prediction | diagnostic evidence stack | feature grouping or metric focus | ablation, SHAP, matrix, regime strip |

Story and Explore use the same normalized selectors and visual components. Story
changes composition and annotation density; it does not maintain a second set of
charts. This prevents content drift and keeps the redesign within the existing
static application architecture.

## 5. Map contract

The map is task-specific evidence, not a global navigation ornament.

- Use `d3-geo`, `topojson-client`, and installed `us-atlas` geometry.
- Focus the primary frame on the 13-state study region in Albers projection.
- Include a quiet national locator only when it improves orientation.
- Fill geography from numeric source fields with units and a complete legend.
- Use state grain for Task 3.
- Permit county grain only for Task 2, joined by five-digit county GEOID.
- Do not present Task 1 or Task 4 as choropleths.
- Hover/focus previews; click, Enter/Space, or tap pins; Escape or a visible
  reset clears the pin.
- The evidence lens shows metric, unit, rank when applicable, denominator,
  source, and caveat.
- Essential values, legend meaning, and selection state remain available
  without hover.
- A circular raster magnifier is excluded until a real browser-safe raster is
  prepared. A state evidence card must not imitate field-level zoom.

The hardcoded ten-state category registry and missing-state Minnesota fallback
are removed rather than restyled.

## 6. Visual language

The art direction is **field notebook meets satellite atlas**.

- Warm paper and soil neutrals form the base.
- Charcoal/ink typography carries narrative and labels.
- Corn, soybean, and winter-wheat identities remain stable across the site.
- Wet/dry anomaly uses one color-vision-safe diverging family.
- Focus and selection use a high-contrast non-data outline.
- Data-derived sequence cells, uncertainty bands, coordinate rules, raster-scale
  marks, and crop curves supply texture.
- Narrative typography may use an editorial display face; controls, axes,
  values, and caveats retain a highly legible sans face.
- Rules and whitespace organize sections. Cards are reserved for bounded
  summaries or interactive inspectors, not every block.

Do not use generated imagery, generic gradient haze, bokeh/orbs, decorative
particles, fake 3D, or ornamental scientific marks without data meaning. The
redesign adds no dependency unless an implementation task proves that the
existing stack cannot satisfy an approved requirement.

## 7. Motion and interaction

Every transition must use one of four explanatory verbs:

- **Reveal** a source-backed annotation.
- **Compare** two aligned states or events.
- **Accumulate** a sequence or part-to-whole result.
- **Pin** evidence for continued reading.

Motion never loops and never blocks reading. The site does not hijack scrolling,
parallax the map, or animate initial chart appearance for spectacle. Reduced
motion renders the same key states immediately.

Direct labels carry the main claim. Tooltips add exact values but do not contain
essential definitions, caveats, or conclusions. Touch and keyboard paths expose
the same evidence as pointer hover.

## 8. Responsive composition

Mobile is a sibling composition rather than a scaled desktop canvas:

1. chapter label and claim;
2. primary visual;
3. two direct annotations;
4. “Explore controls” disclosure or bottom sheet;
5. source and caveat;
6. next chapter.

The HSGP plots stack vertically with shared seasonal context. Maps use a focused
portrait Corn Belt frame; tapping geography pins a detail sheet. Controls have
44–48 px touch targets, return focus to the affected visual, and never require
landscape orientation. The page supports 320 px and wider without document-level
horizontal overflow, clipped labels, or negative-size chart warnings.

## 9. Evidence and content policy

The paper and dated artifacts are the source authority. Website values must map
to a source path, field, denominator, and interpretation caveat.

Where current sources conflict:

- Use the dated Task 2 artifacts for published rotation shares; do not reuse the
  conflicting root README percentages.
- Use neutral “GeoCrop research paper” wording unless the challenge year and
  winning/first-place claim are verified from an authoritative source.
- Do not expose the edit-distance/eligibility threshold as an interactive method
  claim while the paper's 2-versus-3 and 7-versus-5 inconsistencies remain.
  Source-backed sensitivity rows may still be shown with their exact column
  labels and a discrepancy caveat.
- Do not link visitors to the unrelated repository currently embedded in the
  paper source.
- Never imply field precision from 9 km SMAP or the common analysis grid.

Missing, malformed, or unavailable data produces a named empty state with the
source and limitation. It never silently substitutes a different state's values,
invents a category, or displays a no-data geography as selectable evidence.

## 10. Technical boundaries

- Retain Next.js 16, React 19, TypeScript, Tailwind v4, Recharts, D3 Geo,
  TopoJSON, `us-atlas`, existing Radix-backed primitives, and URL state.
- Retain static artifact loading and deterministic normalization.
- Add no backend, database, authentication, remote API, live inference, notebook
  execution, or runtime GeoTIFF/Parquet delivery.
- Reuse the current source registry, loaders, formatters, paper drawer, and local
  UI primitives.
- Replace only evidence logic and presentation that the redesign actually
  touches. Unrelated refactoring is outside scope.
- Do not create a second Story-specific visualization implementation.

## 11. Acceptance criteria

- A first-time visitor can state the four-act research story and the primary
  finding of each act without opening controls.
- The HSGP figure compares all three crops and preserves empirical and posterior
  uncertainty semantics from the paper.
- Every map fill traces to a numeric source field at an honest geographic grain.
- Story is the default; Explore is discoverable from every act and preserves
  task context.
- Existing valid v1 task links normalize safely into Explore.
- Essential values and caveats are visible without hover.
- Keyboard, touch, pointer, and reduced-motion paths expose equivalent evidence.
- Desktop and 320–390 px mobile layouts have no horizontal overflow, clipped
  essential labels, or negative-size chart warnings.
- No new backend, dependency, generated image, unsupported data, or unrelated
  cleanup enters the redesign.
- All implementation tasks pass their focused checks and the final integration
  gate before any v2 task is marked done.
