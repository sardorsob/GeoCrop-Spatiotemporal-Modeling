# Stack Guidance

> Operational guidance for Builders working on the GeoCrop dashboard.

## Status

Stack direction selected during intake-to-scope on 2026-06-02. Treat this as
the default unless the scope changes through the workflow.

## Stack Summary

- Framework: Next.js with React and TypeScript.
- Hosting: Vercel.
- Styling: Tailwind CSS with small project-specific design tokens.
- UI primitives: shadcn/ui where it speeds up accessible controls, dialogs,
  tabs, sheets, and panels.
- Charts: Observable Plot or D3. Prefer the simplest truthful chart; use D3 when
  direct labels, custom annotations, or matrix/legend control require it.
- Maps: MapLibre GL JS for interactive map surfaces. Use static image/SVG
  fallbacks if true browser-safe geospatial data is not ready.
- Data: static artifact ingestion from parent-repo CSV/JSON into typed,
  dashboard-friendly data structures.
- Persistence: URL search params for meaningful shareable state. No database for
  MVP.
- Tests: Vitest for transforms and small logic; Playwright can be added for
  browser smoke once the app shell exists.

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

Recommended file ownership once implementation begins:

- `app/` or `src/app/`: routes and page composition.
- `src/components/`: reusable UI and visualization components.
- `src/features/<task>/`: task-specific panels and charts.
- `src/lib/data/`: source registry, CSV/JSON loaders, normalization, and typed
  contracts.
- `src/lib/state/`: URL param codecs and dashboard state helpers.
- `src/lib/format/`: number, percent, date, label, and caveat formatting.
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
  task notes.
- Do not let dashboard visuals imply pixel-level precision if the source view is
  state/county summary or static image fallback.
- Do not hide denominators, caveats, or source dates behind hover.
