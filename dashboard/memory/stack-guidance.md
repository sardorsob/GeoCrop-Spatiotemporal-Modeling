# Stack Guidance

> Operational guidance for Builders working on the GeoCrop dashboard.

## Status

Stack direction selected during intake-to-scope on 2026-06-02 and retained
through the completed Narrative Atlas v2 redesign on 2026-08-19. The redesign
changed evidence contracts, composition, and interaction without a new
framework, backend, or feature dependency. Treat this as the delivered default
unless canonical scope changes through the workflow.

## Stack Summary

- Framework: Next.js 16.3.1 with React 19 and TypeScript 5.9. Patched transitive
  versions are locked by `package-lock.json`.
- Hosting: Vercel.
- Styling: Tailwind CSS v4 with `@theme` design tokens in
  `src/app/globals.css`, `class-variance-authority` for variant composition,
  and `clsx` + `tailwind-merge` (via `cn()` in `src/lib/utils.ts`) for class
  merging.
- UI primitives: Local shadcn-style components under `src/components/ui/`
  (`Card`, `Button`, `Badge`, `Input`, `Select`, `Popover`, `Sheet`) backed by
  Radix where needed (`react-slot`, `react-select`, `react-popover`,
  `react-dialog`).
- Icons: `lucide-react`.
- Charts: `recharts` for the NDVI seasonality `ComposedChart` (Area band +
  posterior Line + empirical Line). Other panels keep code-native HTML/SVG
  tables and bars where the data shape is simpler. Use a single chart library
  per surface; do not mix Recharts with Observable Plot / D3 plotting in the
  same view.
- Maps: `d3-geo` + `topojson-client` + installed `us-atlas` state/county Albers
  geometry. Task 2 may join source-backed county summaries by five-digit GEOID;
  Task 3 remains state-grain. Add a tile/map library only when an approved task
  produces browser-ready raster/vector layers that the current stack cannot
  render honestly.
- Data: static artifact ingestion from parent-repo CSV/JSON into typed,
  dashboard-friendly data structures (`src/lib/data/`).
- Persistence: URL search params for meaningful shareable state
  (`src/lib/state/`). No database for MVP.
- Tests: Vitest + Testing Library for transforms, codecs, components, and the
  shell integration test. Playwright can be added for browser smoke once the
  deployment is configured.

## Architecture Defaults

- Keep the app source in a conventional Next.js structure once scaffolded.
- Separate data normalization from React components.
- Keep task-specific data adapters small and typed.
- Keep visual components source-backed: every metric panel should know its
  source path/date/caveat.
- Story and Explore share task-specific selectors and figure components. Story
  changes composition and annotation density; it does not fork chart logic.
- Avoid hidden notebook execution or runtime data science work in the web app.
- Prefer static generation/build-time preprocessing where possible.
- URL state should own `view=explore`, active task tab, supported task-local
  filters, and pinned evidence when those choices change the evidence. Story is
  the default when `view` is omitted. Transient hover and scroll position remain
  local.

## File And Module Conventions

Recommended file ownership:

- `app/` or `src/app/`: routes and page composition.
- `src/components/ui/`: local shadcn-style primitives (cards, buttons, badges,
  inputs, selects, popovers, sheets). Each primitive is a single small
  file; build new ones only when several callers need the same control.
- `src/components/layout/`: top bar, dashboard shell, hero, KPI, and other
  shell-level layout components.
- `src/components/story/`: shared act headings, navigation, figure framing,
  evidence captions, and Story/Explore switching. Do not put task-specific data
  transforms here.
- `src/components/filters/`: reserved for genuinely shared task-local filter
  primitives only. The global `CompactFilterBar` was deleted; do not recreate a
  universal filter wall.
- `src/components/map/`: projected geography, task-specific map composition,
  evidence lens, and geometry helpers. `UsChoropleth` remains the rendering
  primitive; map values must come from typed selectors rather than a fallback
  registry.
- `src/features/<task>/`: task-specific panels and charts.
- `src/lib/data/`: source registry, CSV/JSON loaders, normalization, and typed
  contracts.
- `src/lib/state/`: URL param codecs and dashboard state helpers.
- `src/lib/format/`: number, percent, date, label, and caveat formatting.
- `src/lib/utils.ts`: `cn()` class-merge helper. Keep this file tiny.
- `public/`: static image fallbacks or copied dashboard assets.

Builders must only edit files listed in their task block. If a task needs a new
cross-cutting module, stop and ask the Orchestrator/QA to update task ownership.

## Data, State, And API Guidance

- Parent GeoCrop artifacts are the source of truth.
- Do not ship large Parquet or GeoTIFF files directly to the browser for MVP.
- Normalize CSV/JSON artifacts into stable typed structures before rendering.
- Aggregate repeated phenology DOYs deterministically; never let rounded keys
  or row order create last-write-wins scientific series.
- Join Task 2 county records by five-digit GEOID and Task 2/3 states by canonical
  state code.
- Preserve source path, date stamp, denominator, and caveat for visible outputs.
- Use stable ids in URL params rather than display labels.
- Omit default state from the URL and validate incoming params before rendering.
- Keep localStorage optional and limited to user preferences, not analytical
  state.
- No remote API, auth, or database should be introduced without a scope update.

## UI And UX Guidance

- Story is the default first-visit path; Explore is the analytical workspace.
- Treat the atlas as a collection of evidence plates, not a map-first template.
  Phenology and prediction are chart-led; rotation and extremes use maps where
  geography carries the result.
- Keep one lead visual per act and move secondary diagnostics into the natural
  reading sequence or an Explore disclosure.
- End each Story act with an explicit “Explore this evidence” handoff that
  preserves task context.
- Keep source, denominator, uncertainty, and caveat beside the claim they
  qualify. Do not hide them in a generic footer or tooltip.
- Use direct labels and compact legends. Hover may preview but never owns
  essential evidence.
- Give each Explore task only its relevant controls; do not restore a global
  six-field control wall.
- On mobile, order claim → primary visual → annotations → local controls sheet →
  source/caveat. After applying controls, return focus to the affected visual.
- Use ordinary document scrolling. Motion may reveal, compare, accumulate, or
  pin, but never loop, hijack scroll, or carry essential meaning.
- Color roles:
  - corn: orange
  - soybean: green
  - winter wheat: purple
  - wet/dry anomaly: blue/red only
  - selection/focus: independent high-contrast accent or outline
- Avoid decorative gradients, bokeh/orb backgrounds, and generic atmospheric
  visuals that do not carry evidence.
- Use warm paper/soil neutrals, charcoal ink, restrained rules, editorial type
  for narrative claims, and evidence-derived sequence/raster/curve motifs. Cards
  are for bounded summaries and inspectors rather than every section.

## Testing Guidance

- Add unit tests for data normalization and URL state codecs as soon as those
  modules exist.
- Run typecheck before Builder handoff.
- Run lint if configured; if lint is absent, Builder/QA must document it.
- For UI tasks, perform manual smoke on desktop and mobile portrait viewports.
- Verify that missing or malformed source data produces explicit empty/error
  states.
- Verify no secrets are introduced and no source artifact paths expose local
  machine-specific absolute paths in app code.

## Avoid

- Do not add a backend, database, auth, or live data stream for MVP.
- Do not rerun notebooks from the app.
- Do not commit generated caches, `.superpowers/`, or the dev workflow kit copy.
- Do not use `any` without a recorded reason.
- Do not add dependencies casually; justify every map/chart/UI dependency in the
  task notes. Post-`TASK-011` the approved set is Radix + `recharts` +
  `lucide-react` + `d3-geo` + `topojson-client` + `us-atlas` + `cva` + `clsx` +
  `tailwind-merge`. Add MapLibre or another map-tile dependency only when
  browser-ready GeoJSON or vector tiles exist.
- Do not retain the hardcoded ten-state categorical registry or missing-state
  Minnesota fallback. Task 2 may use measured county summaries with installed
  county geometry; Task 3 remains state-grain. Do not add Task 1/4 maps or
  per-pixel interaction without supporting browser-safe evidence.
- Do not hide denominators, caveats, or source dates behind hover.
- Do not preserve stale accessible names merely to keep old tests green. Preserve
  the semantic contract instead: one page heading, named Story/Explore regions,
  linked tabs and tabpanels, visible form labels, named figures, keyboard-
  activatable geography, focus visibility, dialogs with titles/descriptions,
  and live status for data errors. Update tests with the approved copy.
- Do not describe Task 4 as a pre-plant forecast or “irregular” as poor
  management. Do not publish unverified award/year wording.
