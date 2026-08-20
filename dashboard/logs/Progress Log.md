# Progress Log

Log real sessions. Include time, shipped work, blockers, cuts, verification, and AI tools used.

---

## 2026-08-19 — TASK-020 paired flood and drought evidence chapter

**Work performed:**

- Replaced single-event switching with matched 2019 flood and 2022 drought
  state frames driven by the same crop, projection, extent, legend, and one
  crop-wide symmetric mean-z domain.
- Added one shared hover/focus preview and click/keyboard pin; pinned evidence
  reports exact event, state, crop, signed mean z, NIG posterior-predictive
  percentile, pixel-week denominator, source, and limitation for both events.
- Made missing state × crop combinations and missing NIG values explicit rather
  than substituting another event/crop or treating missingness as zero.
- Reframed the paper semantics so mean z owns map magnitude/direction and NIG is
  a distinct posterior context, explicitly not a confidence interval around z.
- Added paired weighted comparison anchors and moved the complete exact table,
  now including Event, behind a keyboard-focusable Explore disclosure.
- Scoped the shell integration test to the overview-map region now that the
  chapter contains two additional legitimate “Select Iowa” controls.

**Verification:**

- TDD red: all 5 initial TASK-020 comparison tests failed against the v1
  single-event layout.
- Focused green: 1 file and 7 tests passed, including absent NIG with present z
  and external state selection replacing a local map pin.
- Checker full suite: 15 files and 64 tests passed.
- `npm run typecheck`, `npm run lint -- --quiet`, and `git diff --check` passed.
- Browser Use confirmed identical `−1.3373` to `+1.3373` domains with real data
  at 1280px; at 320px both 288px map frames stacked and document overflow was
  false.
- Ponytail review: `Lean already. Ship.`

**Blockers / cuts:**

- Final Story/Explore route wiring and removal/recomposition of the v1 universal
  map/filter shell remain owned by `TASK-022`.
- No new dependency, generated image, interpolated event value, invented
  geographic grain, or decorative animation was added.

**AI tools and skills used:**

- Codex
- Superpowers execution, TDD, and verification workflow
- Ponytail implementation and simplification review
- Cartographic/geovisualization and statistical uncertainty guidance
- Browser Use desktop/mobile visual inspection

---

## 2026-08-19 — TASK-019 rotation memory chapter

**Work performed:**

- Reordered Task 2 around rule → composition → measured geography rather than
  leading with methodology and KPI cards.
- Added three ten-year crop-code strips with a visible “schematic, not observed”
  label on every example and neutral irregular-class language.
- Replaced separate class cards with a largest-remainder 100-cell field tied to
  the dated 27.36% / 3.90% / 68.74% artifact and 2,084,112-pixel denominator.
- Rebuilt geographic evidence as responsive state-or-county ranking rows with
  within-grain competition ranks, equal-rank handling, prefix-safe map pin
  matching, and a pinned exact-share/denominator detail.
- Added a composition slot for the shared Task 2 map so final integration can
  place it after the class result without cloning cartographic logic.
- Added a discrete sensitivity selector containing complete exported rows only
  and visibly separated the sensitivity experiment from the dated class result.

**Verification:**

- TDD red: all 5 story/composition/geography/sensitivity tests failed against
  the v1 card/table/caveat layout.
- Focused green: 1 file and 5 tests passed.
- Checker full suite: 15 files and 60 tests passed.
- `npm run typecheck`, `npm run lint`, and `git diff --check` passed.
- Browser Use confirmed readable sequence strips and composition at desktop and
  320px; the mobile document width equaled its viewport with no overflow.
- Ponytail review: `Lean already. Ship.`

**Blockers / cuts:**

- The shared map remains one component from `TASK-017`; final Story/Explore
  insertion and URL state wiring are owned by `TASK-022`.
- No continuous threshold slider, invented sequence sample, mixed-grain rank,
  new dependency, or generated image was added.

**AI tools and skills used:**

- Codex
- Superpowers execution, TDD, and verification workflow
- Ponytail implementation and simplification review
- Cartographic/geovisualization and statistical uncertainty guidance
- Browser Use desktop/mobile visual inspection

---

## 2026-08-19 — TASK-018 paper-faithful HSGP comparator

**Work performed:**

- Replaced the single selected-crop chart with vertically aligned corn,
  soybean, and winter-wheat rows in Story.
- Matched the paper notebook's figure semantics: posterior 5–95% and 25–75%
  fills, posterior mean, empirical spatial Q25/Q75 boundaries, crop colors, and
  crop-specific growth-stage windows.
- Added direct modeled peak timing/value, month context, and an explicit note
  that the shared 0.50–1.00 NDVI axis is focused rather than zero-based.
- Replaced the permanent chart brush with one shared compact Explore disclosure;
  crop focus never removes the other two comparison rows.
- Reframed model metrics as a responsive three-crop table and retained named
  empty, fallback-figure, source, denominator, and caveat paths.
- Added a safe initial Recharts dimension for SSR/container startup and removed
  obsolete brush-index code.

**Verification:**

- TDD red: 4 of 5 comparator tests failed against v1's single-crop chart; the
  season helper test passed independently.
- Focused green: 2 files and 9 tests passed.
- Checker full suite: 15 files and 57 tests passed.
- `npm run typecheck`, `npm run lint`, and `git diff --check` passed.
- Browser Use confirmed nested uncertainty and stage readability at 800px and
  320px; the 320px document width equaled the viewport with no horizontal
  overflow.
- Ponytail review: `Lean already. Ship.`

**Blockers / cuts:**

- Final Story/Explore route wiring and whole-app mobile smoke remain owned by
  `TASK-022`; this task verified both modes directly at component level.
- No dependency, generated image, animation system, raw-observation layer, or
  separate per-crop controller was added.

**AI tools and skills used:**

- Codex
- Superpowers execution, TDD, and verification workflow
- Ponytail implementation and simplification review
- Statistical uncertainty and missingness visualization guidance
- Browser Use desktop/mobile visual inspection

---

## 2026-08-19 — TASK-017 honest Task 2/3 evidence map

**Work performed:**

- Replaced the ten-state hardcoded category registry with source-backed numeric
  Task 2 and Task 3 evidence.
- Cropped the installed Albers atlas geometry to all 13 canonical study states
  and added Task 2 county geometry joined by five-digit GEOID.
- Added a sequential regular-share ramp, one fixed crop-specific diverging
  event domain centered on zero, and a separate neutral no-data fill.
- Added a bounded evidence lens with value, unit, rank, denominator, artifact
  path/date, and caveat, plus a complete legend and exact-value list.
- Unified hover/focus preview and click/Enter/Space/tap pin behavior; Escape and
  the visible reset clear the same state.
- Removed Task 4 map offerings and visibly normalizes unsupported legacy layer
  IDs to the measured Task 2 regular-share layer.

**Verification:**

- TDD red: focused tests failed against the v1 nationwide pseudo-data map and
  missing study geometry/lens modules.
- Focused green: 2 files and 8 tests passed.
- Checker full suite: 15 files and 57 tests passed.
- `npm run typecheck`, `npm run lint`, and `git diff --check` passed.
- Cartographic checks covered rate normalization, projection/extent, fixed
  comparable anomaly endpoints, neutral no-data, 13 state identities, and
  county GEOID integrity.
- Ponytail review: `Lean already. Ship.`

**Blockers / cuts:**

- County detail remains an aggregate polygon view and explicitly rejects
  pixel/field precision.
- The app-level data wiring and final mobile/browser visual smoke remain owned
  by `TASK-022`; this task verified the shared map component directly.

**AI tools and skills used:**

- Codex
- Superpowers execution, TDD, and verification workflow
- Ponytail implementation and simplification review
- GeoAI cartography/geovisualization and web geospatial specialist guidance

---

## 2026-08-19 — TASK-016 scientific evidence contracts

**Work performed:**

- Replaced row-order phenology output with deterministic crop + DOY grouping.
- Matched the paper notebook's across-year empirical mean workflow for Q25/Q75,
  retained posterior IQR and 90% intervals, and ignored missing contributors
  rather than turning them into zero.
- Canonicalized all 13 study states to USPS/FIPS identities, normalized county
  GEOIDs to five digits, and removed non-study `outside` rows from geographic
  evidence.
- Added typed Task 2 rotation and Task 3 event-map selectors with numeric
  values, ranks, denominators, source metadata, and one crop-specific domain
  shared across flood and drought.
- Added compile-time guard coverage proving Task 4 cannot be passed to either
  geographic selector.

**Verification:**

- TDD red: duplicate-DOY, canonical geography, and missing-selector assertions
  failed against the v1 normalization path.
- Focused green: 2 files and 11 tests passed.
- Checker full suite: 14 files and 52 tests passed.
- `npm run typecheck`, `npm run lint`, and `git diff --check` passed.
- Data-quality pass reconciled the implementation with the paper notebook's
  `groupby("doy").mean()` empirical interval workflow and raw artifact grains.
- Ponytail review: `Lean already. Ship.`

**Blockers / cuts:**

- No Task 4 geography selector or synthetic raster/pixel evidence was added.
- Loader/source registration remained unchanged because all required artifacts
  were already present and correctly registered.

**AI tools and skills used:**

- Codex
- Superpowers execution, TDD, and verification workflow
- Ponytail implementation and simplification review
- Data-quality and analytical-validation guidance

---

## 2026-08-19 — TASK-015 Narrative Atlas visual grammar

**Work performed:**

- Created a reusable four-act navigator, act header, figure frame, evidence
  caption, and server-rendered Story/Explore switch.
- Extended the existing Tailwind v4 theme with explicit crop, anomaly, focus,
  neutral, ink, paper, field, and rule roles.
- Reworked the top bar around the Narrative Atlas identity while preserving
  artifact health indicators and existing task data.
- Added keyboard focus, 320 px continuation, and reduced-motion rules without
  adding a package or generated asset.

**Verification:**

- TDD red: the focused story-primitives suite failed on missing modules.
- Focused green: 1 file and 4 tests passed.
- Checker full suite: 13 files and 48 tests passed.
- `npm run typecheck`, `npm run lint`, and `git diff --check` passed.
- Ponytail review: `Lean already. Ship.`

**Blockers / cuts:**

- Task-specific charts, maps, selectors, and data were intentionally untouched;
  their work begins in `TASK-016`–`TASK-021`.
- No imagery, motion library, design-system package, or duplicate UI stack was
  introduced.

**AI tools and skills used:**

- Codex
- Superpowers execution, TDD, and verification workflow
- Ponytail implementation and simplification review
- Web data-visualization composition and mobile guidance

---

## 2026-08-19 — Narrative Atlas mockups, v2 scope, and task graph

**Work performed:**

- Interpreted the user's Narrative Atlas approval as a request to balance an
  authored story with the existing analytical dashboard rather than make every
  chapter map-led.
- Created three code-native layout directions: Ribbon Chapters, Atlas + Lab,
  and Evidence Desk. Selected Atlas + Lab, with a Chaptered Evidence Canvas in
  Story and an Evidence Lab in Explore.
- Created a second detailed mockup showing the HSGP comparator as the full Act I
  evidence stage and the Story/Explore handoff.
- Added durable text wireframes at
  `docs/design/2026-08-19-narrative-atlas-mockups.md`.
- Wrote the review-ready design specification at
  `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md`.
- Replaced the stale v1 Map Command Center scope with the canonical v2 Narrative
  Atlas scope and synchronized `memory/stack-guidance.md`.
- Preserved completed `TASK-000`–`TASK-014` and appended eight pending v2 tasks,
  `TASK-015`–`TASK-022`, with dependencies, owned files, acceptance criteria,
  test cases, and verification expectations.
- Updated project, decision, overview, progress, and handoff context. No
  application source, data, dependency, test, generated image, or final v1
  handover file was changed.

**Design resolution:**

- “Atlas” means a collection of evidence plates. Phenology is chart-led;
  rotation and extremes are map-led; prediction is diagnostic-chart-led.
- Story and Explore will share the same task-specific selectors and figure
  components to avoid duplicated logic.
- The existing stack is sufficient; no new dependency is planned.

**Verification:**

- Rendered both in-conversation HTML mockup fragments into standalone preview
  wrappers to catch malformed fragment structure.
- Reviewed the context-only diff, task counts/statuses, spec placeholder scan,
  and cross-document references.
- No application tests, typecheck, lint, build, audit, or app smoke were run;
  this was a design/documentation phase.

**AI tools and skills used:**

- Codex with parallel read-only design/task critique
- Superpowers brainstorming
- Ponytail scope control
- Web visualization and browser-inspection guidance

---

## 2026-08-19 — Website redesign v2 planning audit

**Work performed:**

- Followed the repository's personal workflow with Superpowers brainstorming as
  the single primary design process, supported by Ponytail scope control,
  cartography/geovisualization guidance, and meaning-preserving web data
  visualization guidance.
- Read the dashboard context, paper source, relevant checked-in tables and
  figures, current map and phenology implementation, and local design workflow
  references for dashboards, maps, scrollytelling, exploratory graphics, and
  art-directed visual stories.
- Inspected the live dashboard at desktop and 390 px mobile widths, including
  default/hover/pinned map states and the HSGP season view. Captured temporary
  planning screenshots under `/tmp`; no design asset was added to the repo.
- Identified that the current map uses hardcoded categories for 10 states rather
  than measured study values, and that the HSGP chart overwrites same-DOY rows
  while omitting available empirical and posterior interval fields.
- Established a paper-led four-act story spine: Phenology → Rotation → Extremes
  → Prediction.
- Compared three product directions and recorded Editorial Story → Analytical
  Explorer as the provisional recommendation, with “field notebook meets
  satellite atlas” as the provisional art direction.
- Updated planning/context documents only. Preserved the delivered v1 scope,
  source, tests, packages, data, generated assets, task history, and handover.

**Verification:**

- No tests, lint, typecheck, build, audit, or implementation verification was
  run, by explicit user instruction.
- Reviewed repository status and the context-only diff to confirm the planning
  boundary.

**Open approval gate:**

- User approval or revision of the product direction, audience priority, art
  direction, and interaction emphasis is required before writing the formal
  design spec or changing canonical v2 scope.

**AI tools and skills used:**

- Codex repository and live-browser inspection
- Superpowers brainstorming
- Ponytail scope control
- GeoAI cartography/geovisualization
- Meaning-preserving web data visualization

---

## 2026-06-03 (0.15 hrs) - Codex QA Favicon Polish

**Work performed:**

- Added `TASK-014` for the GeoCrop sprout favicon.
- Added `dashboard/public/favicon.svg` using the same sprout path as the current top-bar brand mark.
- Centralized site metadata in `src/app/site-metadata.ts` and re-exported it from `layout.tsx`.
- Added metadata/favicon regression coverage in `src/app/__tests__/site-metadata.test.ts`.
- Updated README, HANDOVER, PROJECT, TASKS, and this log.

**Verification:**

- TDD red: `npx vitest run src/app/__tests__/site-metadata.test.ts` failed because `site-metadata.ts` and `public/favicon.svg` did not exist.
- Focused green: `npx vitest run src/app/__tests__/site-metadata.test.ts` passed: 1 file, 1 test.
- Full suite: `npm run test` passed: 12 files, 44 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- `npm audit --audit-level=high` exited 0; two moderate Next/PostCSS advisories remain.
- HTTP smoke at `http://localhost:3000` returned 200 and linked `/favicon.svg`; `/favicon.svg` returned 200 and included the sprout title.

**Blockers / cuts:**

- No PNG/ICO fallback was added; this pass uses modern browser SVG favicon support.
- In-app browser smoke was attempted once but remains blocked by `windows sandbox failed: spawn setup refresh`.

**AI tools used:**

- Codex QA

---

## 2026-06-03 (0.30 hrs) - Codex QA Paper Reference CTA

**Work performed:**

- Added `TASK-013` for the NAFSI 2025 winning paper reader CTA.
- Copied `NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf` into `dashboard/public/papers/` for Vercel-safe static serving.
- Replaced the old Prediction Ready hero KPI with a `NAFSI 2025 winning paper` button.
- Added a Sheet-based paper reader with browser-native PDF embed plus Open PDF and Download PDF actions.
- Updated Sheet title/description wrappers to Radix dialog primitives for accessible dialog naming.
- Updated README, HANDOVER, PROJECT, TASKS, and memory patterns.

**Verification:**

- TDD red: `npx vitest run src/components/layout/DashboardShell.test.tsx` failed because the `NAFSI 2025 winning paper` button did not exist.
- Focused green: `npx vitest run src/components/layout/DashboardShell.test.tsx` passed: 1 file, 3 tests.
- Full suite: `npm run test` passed: 11 files, 43 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- `npm audit --audit-level=high` exited 0; two moderate Next/PostCSS advisories remain.
- HTTP smoke at `http://localhost:3000` returned 200 and included `NAFSI 2025 winning paper`.
- HTTP smoke for `/papers/NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf` returned 200 and 6,403,041 bytes.

**Blockers / cuts:**

- No PDF viewer package was added. The sheet uses browser-native PDF embedding with Open/Download fallbacks; a PDF.js/react-pdf viewer can be added later if annotation, page thumbnails, or custom paging become necessary.
- In-app browser smoke was attempted once but remains blocked by `windows sandbox failed: spawn setup refresh`.

**AI tools used:**

- Codex QA

---

## 2026-06-03 (0.35 hrs) - Codex QA HSGP Season Window

**Work performed:**

- Added `TASK-012` for the Task 1 HSGP season-window zoom enhancement.
- Added `src/features/phenology/season-window.ts` helpers for day-of-year bounds, clamping, row filtering, brush indexes, and presets.
- Added season-window controls to `NdviCurveChart`: Full season, Green-up, Peak, Senescence, custom start/end DOY inputs, visible span text, and a controlled Recharts brush.
- Updated selected-span peak summary cards so reviewers can inspect green-up, peak, and senescence windows without changing source data.
- Updated README, HANDOVER, PROJECT, TASKS, memory patterns, and decisions.

**Verification:**

- TDD red: focused phenology tests failed because `season-window.ts` was missing and the chart had no `Season window controls` region.
- Focused green: `npx vitest run src/features/phenology/__tests__/season-window.test.ts src/features/phenology/__tests__/phenology-panel.test.tsx` passed: 2 files, 9 tests.
- Full suite: `npm run test` passed: 11 files, 42 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- `npm audit --audit-level=high` exited 0; two moderate Next/PostCSS advisories remain.
- HTTP smoke at `http://localhost:3000` returned 200 and the prerendered page included `GeoCrop Interactive Dashboard`, `Season window`, and `Full season`.

**Blockers / cuts:**

- Season-window state is local to the chart for this experiment; URL-backed HSGP span sharing is a possible follow-up.
- In-app browser smoke was attempted twice but remains blocked by `windows sandbox failed: spawn setup refresh`.

**AI tools used:**

- Codex QA

---

## 2026-06-02 (0.45 hrs) - Codex QA Cleanup

**Work performed:**

- Ran a no-UI-change cleanup pass on the Claude redesign after QA review.
- Added tab-panel regression coverage in `DashboardShell.test.tsx` and made the active task section a matching `role="tabpanel"` with `id="tabpanel-{tab}"`.
- Added `src/components/map/__tests__/MapPanel.test.tsx` so the shipped choropleth map path is covered directly.
- Removed orphaned old schematic map/filter files (`CornBeltMap`, `MapLayerControl`, `MapLegend`, `CornBeltMap.test`, `FilterBar`, `ActiveFilterChips`) plus the unused Radix Tabs primitive.
- Pruned unused reserved dependencies (`maplibre-gl`, `react-map-gl`, `tw-animate-css`, unused Radix packages, `@next/env`) and moved `d3-geo` into runtime dependencies.
- Removed the unused `cn` import from `RotationGeoRanking`.
- Updated handover, README, project memory, stack guidance, task notes, and decision notes to reflect the cleaned dependency/file set.

**Verification:**

- Red/green: focused `npx vitest run src/components/layout/DashboardShell.test.tsx src/components/map/__tests__/MapPanel.test.tsx` failed before the tab-panel fix and passed after it.
- `npm run test` passed: 10 files, 37 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- `npm audit --audit-level=high` exited 0; two moderate Next/PostCSS advisories remain.

**Blockers / cuts:**

- In-app browser screenshot smoke remains blocked by the existing Windows sandbox runtime issue; no UI redesign or image generation was attempted in this cleanup.
- Vector-tile / MapLibre work remains a future scope item pending browser-ready geography.

**AI tools used:**

- Codex QA

---

## 2026-06-02 (2.50 hrs) - Claude Sonnet 4.6 Builder/QA + User Feedback Loop

**Work performed:**

- Completed `TASK-011` major UI redesign after user feedback that the prior Wave 5 polish pass was visually unusable and that the Corn Belt map was not rendering as a real map.
- Added dependencies: `recharts`, `lucide-react`, `maplibre-gl`, `react-map-gl`, `us-atlas`, `topojson-client`, `d3-geo`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, and Radix primitives (`react-slot`, `react-tabs`, `react-select`, `react-popover`, `react-dialog`, `react-tooltip`, `react-separator`, `react-scroll-area`). Dev: `@types/topojson-client`, `@types/d3-geo`.
- Created local shadcn-style primitive layer under `src/components/ui/` (Card, Button, Badge, Input, Select, Tabs, Popover, Sheet) plus `cn()` helper at `src/lib/utils.ts`.
- Rewrote `src/app/globals.css` with Tailwind v4 `@theme` design tokens, MapLibre CSS import, font smoothing, soft body gradient, scrollbar styling, MapLibre popup tweaks, and a fade-in keyframe.
- Added new layout components: `src/components/layout/TopBar.tsx` (sticky brand bar with live source/task/load-issue badges) and rewrote `src/components/layout/DashboardShell.tsx` (Hero + KPI grid + filters Card + MapPanel + TaskTabs + active panel + DataLoadStatus).
- Replaced the dashboard's filter UI with `src/components/filters/CompactFilterBar.tsx` (6-up filter row, removable chips, advanced sheet drawer for map view coordinates).
- Replaced the squished schematic state-tile fallback with `src/components/map/UsChoropleth.tsx` (`d3-geo` + `us-atlas/states-albers-10m.json` Albers choropleth with hover tooltip, click-to-select state paths, and keyboard-activatable `role="button"` aria-labels) plus `src/components/map/MapPanel.tsx` (Card wrapper with layer select, info popover, legend, selected-context block).
- Rewrote `src/features/phenology/NdviCurveChart.tsx` on a Recharts `ComposedChart` (Area band for the credible interval, posterior Line, dashed empirical Line, hover tooltips, peak summary tiles).
- Rewrote `src/features/phenology/PhenologyMetrics.tsx` with tone-coded metric tiles (emerald RMSE/MAE, sky Coverage, violet CRPS) and a Lucide icon.
- Rewrote `src/features/phenology/PhenologyPanel.tsx` with a Card-based `PanelHeader`, styled native crop `<select>` (so existing `getByLabelText("Crop")` keeps passing), and gradient SourceNotes cards.
- Added a compact-view disclosure to `src/features/rotation/RotationGeoRanking.tsx`: default 5 visible rows + a Lucide-chevron "Show N more" / "Show less" toggle. After the first attempt collapsed the entire section, user clarified ("you completly removed it I was more refering to the fact its there but it maybe has like a arrows button to see further down becuase normally it is compact"), and the disclosure was scoped to additional table rows only.
- Replaced an inline `data:image/svg+xml` chevron with an absolutely positioned Lucide `<ChevronDown />` overlay inside a `NativeSelect` helper after Lightning CSS surfaced a parser warning on the inline SVG background during `npm run build`.
- Replaced the Radix `<Tabs>` shell with a controlled button-based tablist after `fireEvent.click` did not reliably propagate the controlled-state change through Radix under React 19 + JSDOM. Radix Tabs primitive remains under `src/components/ui/tabs.tsx` for future use.
- Preserved the existing accessibility tree intentionally (`<h1 className="sr-only">`, named `role="region"` sections, named `role="tablist"`, `role="status"` for the data load card, `<label>`-wrapped inputs for "Map layer" / "State" / "Crop" / "Selected entity", `role="button" aria-label="Select ${name}"` on each choropleth state path) so all 38 prior tests pass without modification.
- Updated all `.md` docs after redesign: `PROJECT.md`, `TASKS.md` (added `TASK-011` block; bumped Total/Done from 11 to 12), `HANDOVER.md`, `README.md`, `memory/architecture.md`, `memory/patterns.md` (7 new patterns), `memory/decisions.md` (new decision entry), `memory/stack-guidance.md`, `logs/Overview.md`, `logs/Handoff Notes.md`, and this log.

**Verification:**

- `npm run typecheck` passed.
- `npm run lint` passed with 0 errors and 0 warnings (removed an unused `CardContent` import in `PhenologyMetrics.tsx` after lint flagged it).
- `npm run test` passed: 10 files, 38 tests. Test count is unchanged from `TASK-010` (no tests added, no tests skipped).
- `npm run build` passed cleanly after the chevron data-URL fix (the prior Lightning CSS warning was resolved).
- HTTP smoke on the existing local dev server `http://localhost:3000` returned 200 for the redesigned shell.

**Blockers / cuts:**

- Could not delete the orphaned old-shell files (`src/components/map/CornBeltMap.tsx`, `MapLayerControl.tsx`, `MapLegend.tsx`, `__tests__/CornBeltMap.test.tsx`, `src/components/filters/FilterBar.tsx`, `ActiveFilterChips.tsx`): the auto-mode classifier blocked the `rm` without explicit user authorization naming the targets. The files are no longer imported by any production code; `CornBeltMap.test.tsx` still passes locally against its own colocated component. Recommend deletion in a follow-up commit.
- In-app browser screenshot smoke was attempted but blocked by `windows sandbox failed: spawn setup refresh`; the Chrome MCP extension was also unreachable in this session. Fell back to HTTP smoke and the component/integration test suite.
- `maplibre-gl` and `react-map-gl` are installed but unused; they are reserved for the future vector-tile swap and remain in `package.json`.

**AI tools used:**

- Claude Sonnet 4.6 (interactive Builder/QA loop, with user-driven feedback iterations on the rotation table disclosure semantics and the visual scope of the redesign).

---

## 2026-06-02 (0.40 hrs) - Codex Orchestrator/QA + Builder Agents

**Work performed:**

- Re-dispatched code-only Builder agents with explicit no-image-generation and no-`gpt-image-2` guardrails.
- Completed `TASK-001` typed artifact source registry for scoped Task 1-4 CSV/JSON inputs.
- Completed `TASK-003` responsive Map Command Center shell with task tabs, main evidence slot, selected context rail, filter/layer controls, and analytical summary band.
- Added `AGENTS.md`, `PROJECT.md`, `TASKS.md`, and memory updates so the workflow reflects the completed lanes and the no-image-generation rule.

**Verification:**

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- Local HTTP smoke at `http://localhost:3000` returned 200 and included the dashboard heading plus major region labels.

**Blockers / cuts:**

- `TASK-002` data loading/normalization remains next.
- Map data is still not browser-ready; no MapLibre/data-backed map layer was implemented in this task pair.
- In-app browser smoke was attempted twice but the browser runtime failed during sandbox startup; HTTP smoke and automated tests covered this checkpoint.

**AI tools used:**

- Codex QA/Orchestrator
- Builder agent Banach for `TASK-001`
- Builder agent Franklin for `TASK-003`

---

## 2026-06-02 (0.35 hrs) - Codex QA + Builder Agent

**Work performed:**

- Completed `TASK-002` static artifact loaders and normalized dashboard data.
- Added typed CSV/JSON loading for scoped source registry entries.
- Added Task 1-4 normalizers with observed source-header alias handling.
- Added number parsing helpers and representative artifact tests.

**Verification:**

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.

**Blockers / cuts:**

- Loader is server/test filesystem-oriented; later UI integration must avoid importing it into client components.
- Browser-ready GeoJSON remains unavailable, so map work still needs a fallback strategy.

**AI tools used:**

- Codex QA/Orchestrator
- Builder agent Schrodinger for `TASK-002`

---

## 2026-06-02 (0.25 hrs) - Codex QA + Builder Agent

**Work performed:**

- Completed `TASK-004` URL-backed dashboard filter and selection state.
- Added typed dashboard defaults, options, type guards, parse/serialize/update helpers, and URL warning records.
- Added accessible filter controls and active-filter chips for visible shareable state.

**Verification:**

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.

**Blockers / cuts:**

- Filter controls are implemented as reusable components; full shell wiring waits for map/panel integration.
- No localStorage or remote persistence added.

**AI tools used:**

- Codex QA/Orchestrator
- Builder agent Hilbert for `TASK-004`

---

## 2026-06-02 (0.50 hrs) - Codex QA + Builder Agents

**Work performed:**

- Completed `TASK-005` code-native Corn Belt fallback map surface with layer controls, legends, schematic selectable state tiles, and source/caveat text.
- Completed `TASK-006` phenology panel with Task 1 metric cards, NDVI SVG curve, crop selector, HSGP uncertainty copy, source notes, and empty state.
- Completed `TASK-009` prediction diagnostics panel with headline test metrics, ablation view, SHAP ranking, regime metrics, confusion matrix, source notes, and visible model caveats.
- Updated task QA notes, architecture memory, and reusable visualization patterns for source-visible panels and schematic map fallbacks.

**Verification:**

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.

**Blockers / cuts:**

- Feature components are built and tested, but TASK-010 still needs to wire them into the dashboard shell.
- Browser-ready geography is still unavailable, so TASK-005 intentionally ships a schematic fallback rather than MapLibre or county geometry.
- Rotation and extremes panels remain pending for the next parallel Builder wave.

**AI tools used:**

- Codex QA/Orchestrator
- Builder agent Singer for `TASK-005`
- Builder agent Anscombe for `TASK-006`
- Builder agent Dewey for `TASK-009`

---

## 2026-06-02 (0.45 hrs) - Codex QA + Builder Agents

**Work performed:**

- Completed `TASK-007` rotation panel with class summary cards, geographic ranking, selected geography state, Markov/threshold caveat band, source notes, and tests.
- Completed `TASK-008` soil moisture extremes panel with event selector, URL-state-compatible crop/state filters, anomaly summary cards, state x crop table, NIG/z-score caveats, source notes, and tests.
- Updated task QA notes, architecture memory, and reusable URL-compatible panel prop pattern.

**Verification:**

- Focused rotation/extremes test run passed: 2 files, 5 tests.
- `npm run test` passed: 10 files, 37 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- Non-ASCII scan over rotation/extremes source folders returned no matches after QA cleanup.

**Blockers / cuts:**

- TASK-010 still needs final shell integration, URL share/restore smoke, handover updates, and local browser/HTTP smoke.
- Browser-ready geography remains unavailable; map layer fidelity remains schematic.

**AI tools used:**

- Codex QA/Orchestrator
- Builder agent Pascal for `TASK-007`
- Builder agent Popper for `TASK-008`

---

## 2026-06-02 (0.65 hrs) - Codex QA / Integration

**Work performed:**

- Completed `TASK-010` final shell integration after the integration Builder lane was closed without a handoff.
- Wired `src/app/page.tsx` to server-load normalized data and render the client shell inside Suspense.
- Replaced the placeholder shell with URL-backed filters, task tabs, Corn Belt map, selected context, visible data-load status, analytical summary, and all four source-backed task panels.
- Added integration tests for tab switching, URL share/restore, map selected-entity updates, source/caveat visibility, and missing-source status.
- Updated README and HANDOVER with run instructions, verification commands, caveats, and next steps.

**Verification:**

- TDD red: `npx vitest run src/components/layout/DashboardShell.test.tsx` failed against the placeholder shell.
- Focused green: `npx vitest run src/components/layout/DashboardShell.test.tsx` passed.
- `npm run test` passed: 10 files, 38 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed after wrapping the search-param client shell in Suspense.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- HTTP smoke passed on existing local dev server `http://localhost:3000` for representative extremes, prediction, and rotation URLs.

**Blockers / cuts:**

- In-app browser visual smoke was attempted but failed with `windows sandbox failed: spawn setup refresh`.
- No Playwright/Puppeteer package is installed, so no screenshot-based desktop/mobile smoke was captured in this environment.
- Map remains a schematic state-tile fallback until browser-ready geospatial data is produced.

**AI tools used:**

- Codex QA/Orchestrator

---

## YYYY-MM-DD (0.00 hrs) - Agent / Human

**Work performed:**

- TBD

**Verification:**

- TBD

**Blockers / cuts:**

- TBD

**AI tools used:**

- TBD

---

## 2026-06-02 (0.20 hrs) - Codex Orchestrator/QA

**Work performed:**

- Selected Next.js + React + TypeScript on Vercel as the dashboard stack.
- Populated `SCOPE.md` from `docs/intake.md`.
- Populated `memory/stack-guidance.md` with operational Builder guidance.
- Updated `PROJECT.md`, `docs/intake.md`, and `memory/decisions.md` to reflect the stack decision.

**Verification:**

- Manual artifact review completed for scope consistency.
- Task generation not run yet; `TASKS.md` remains the template until scope review.

**Blockers / cuts:**

- Browser-ready geography inputs are unresolved.
- Vercel project settings are not configured yet.
- Need user approval of scope before generating tasks.

**AI tools used:**

- Codex

---

## 2026-06-02 (0.15 hrs) - Codex Orchestrator/QA

**Work performed:**

- Generated `TASKS.md` from the approved dashboard scope.
- Created 11 task blocks covering scaffold, data contracts, normalization, shell, URL state, map, four task panels, and integration/handover.
- Added dependencies and file ownership boundaries to support safe parallel Builder assignment after shared contracts exist.
- Updated `PROJECT.md` to phase `2-Setup`.

**Verification:**

- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.
- `python scripts\update-task-counts.py` confirmed 11 pending tasks.

**Blockers / cuts:**

- No code implementation started yet.
- First executable Builder task is `TASK-000`.

**AI tools used:**

- Codex

---

## 2026-06-02 (0.55 hrs) - Codex Builder + QA

**Work performed:**

- Completed `TASK-000` Next.js scaffold.
- Added Next.js 16, React 19, TypeScript, Tailwind v4, ESLint flat config, and Vitest.
- Added minimal GeoCrop scaffold page with four research lanes.
- Added `.env.example` and dashboard `README.md`.
- Updated `.gitignore` for dashboard generated folders.
- QA approved `TASK-000` and updated memory.

**Verification:**

- TDD red: `npm run test -- src/lib/scaffold/home-copy.test.ts` failed on expected title assertion before implementation.
- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm audit --audit-level=high` passed with no high/critical advisories; two moderate advisories remain.
- `python scripts\validate-task-statuses.py` passed.
- `python scripts\check-required-artifacts.py` passed.

**Blockers / cuts:**

- Remaining moderate npm advisories are upstream Next/PostCSS and require breaking-force remediation according to npm.
- This task only creates the scaffold; artifact source registry begins in `TASK-001`.

**AI tools used:**

- Codex
