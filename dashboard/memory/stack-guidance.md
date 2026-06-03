# Stack Guidance

> Operational guidance for Builders working on the GeoCrop dashboard.

## Status

Stack direction selected during intake-to-scope on 2026-06-02 and refined after
the `TASK-011` UI redesign on 2026-06-02. Treat this as the default unless the
scope changes through the workflow.

## Stack Summary

- Framework: Next.js 16 with React 19 and TypeScript 5.9.
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
- Maps: `d3-geo` + `topojson-client` + `us-atlas/states-albers-10m.json` for
  the U.S. Albers choropleth in `UsChoropleth`. Add a tile/map library only
  when browser-ready GeoJSON/TopoJSON or vector tiles are produced.
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
- Avoid hidden notebook execution or runtime data science work in the web app.
- Prefer static generation/build-time preprocessing where possible.
- URL state should own active tab, selected map layer, filters, and selected
  entity when those choices change the evidence.

## File And Module Conventions

Recommended file ownership:

- `app/` or `src/app/`: routes and page composition.
- `src/components/ui/`: local shadcn-style primitives (cards, buttons, badges,
  inputs, selects, popovers, sheets). Each primitive is a single small
  file; build new ones only when several callers need the same control.
- `src/components/layout/`: top bar, dashboard shell, hero, KPI, and other
  shell-level layout components.
- `src/components/filters/`: dashboard filter UI.
- `src/components/map/`: choropleth + map card. `UsChoropleth` is the rendering
  primitive; `MapPanel` is the dashboard-facing card.
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
- Preserve source path, date stamp, denominator, and caveat for visible outputs.
- Use stable ids in URL params rather than display labels.
- Omit default state from the URL and validate incoming params before rendering.
- Keep localStorage optional and limited to user preferences, not analytical
  state.
- No remote API, auth, or database should be introduced without a scope update.

## UI And UX Guidance

- The dashboard is an analytical workspace, not a marketing landing page.
- Main evidence map should remain the first-viewport anchor.
- Keep source/caveat information visible or one click away from each chart.
- Use direct labels and compact legends. Avoid hover-only essentials.
- On mobile, show the insight summary and map before secondary controls.
- Use bottom sheets/drawers for mobile filters; after applying filters, return
  focus to the affected visualization.
- Color roles:
  - corn: orange
  - soybean: green
  - winter wheat: purple
  - wet/dry anomaly: blue/red only
  - selection/focus: independent high-contrast accent or outline
- Avoid decorative gradients, bokeh/orb backgrounds, and generic atmospheric
  visuals that do not carry evidence.

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
- Do not let dashboard visuals imply pixel-level precision if the source view is
  state/county summary. The current choropleth is categorical-by-state; do not
  add per-county or per-pixel layers until the modeling pipeline ships
  browser-ready geometry.
- Do not hide denominators, caveats, or source dates behind hover.
- Do not break the existing accessibility tree when redesigning UI: keep the
  hidden `<h1>GeoCrop Interactive Dashboard</h1>`, the `role="region"`
  aria-labels ("Dashboard filters", "Corn Belt map surface"), the
  `role="tablist"` aria-label ("Research tasks"), the visible `<label>`
  associations for "Map layer" / "State" / "Crop" / "Selected entity", and the
  `role="button" aria-label="Select ${name}"` on each state path. The test
  suite encodes these contracts, including the tab `aria-controls` to active
  `role="tabpanel"` relationship.
