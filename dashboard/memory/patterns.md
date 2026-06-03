# Patterns

> QA maintains this after completed tasks. Add only reusable patterns that match real code.

## Pattern Template

**Use when:** TBD

**Rule:** TBD

**Example:**

```text
TBD
```

---

## Manual Scaffold Preservation

**Use when:** Adding framework scaffold files into a folder that already contains workflow artifacts.

**Rule:** Prefer manual scaffold files over generator commands when a generator might overwrite `PROJECT.md`, `README.md`, `TASKS.md`, `memory/`, `logs/`, or workflow scripts.

**Example:**

```text
Create package/config/src files directly, keep workflow artifacts intact, and record any necessary ignore-rule updates in QA notes.
```

---

## Derived Source Notes

**Use when:** Adding dashboard source metadata that must appear in both internal registry code and user-facing caveat/source UI.

**Rule:** Store canonical source metadata in `artifactSources`, then derive note maps from that registry instead of duplicating source path, label, status, and caveat text.

**Example:**

```text
Build `sourceNotesById` from `artifactSources.map(...)` so registry changes propagate to source-note UI contracts.
```

---

## Code-Native Visuals

**Use when:** Designing dashboard visuals before final assets or browser-ready geospatial layers exist.

**Rule:** Implement placeholders, symbols, and visual structure in React/CSS/SVG code; do not use image generation or `gpt-image-2`.

**Example:**

```text
Use semantic regions, CSS grid placeholders, inline React markup, and source/caveat text instead of generated images.
```

---

## Artifact Header Aliases

**Use when:** Normalizing exported GeoCrop CSV/JSON artifacts into dashboard contracts.

**Rule:** Normalize against observed source headers and registry-friendly aliases together; exported tables may use research/table labels such as `RMSE`, `doy`, `pct_of_valid`, `GEOID`, or `mean_abs_shap`.

**Example:**

```text
Read Task 1 day-of-year from `day_of_year` or `doy`, and read Task 2 percent valid from `percent_of_valid` or `pct_of_valid`.
```

---

## URL State Codecs

**Use when:** A dashboard view state affects the analytical evidence or should be shareable.

**Rule:** Parse URL params into a typed normalized state plus warning objects, serialize in stable order, and omit defaults from the query string.

**Example:**

```text
Serialize non-default `tab`, `mapLayer`, filters, selected entity, and map view; normalize bad values to defaults or omissions with warnings.
```

---

## Schematic Map Fallback

**Use when:** Geospatial source artifacts exist, but browser-ready GeoJSON, TopoJSON, or vector tiles are not available.

**Rule:** Render a clearly labeled schematic substrate with selectable regions, direct legends, visible source text, and an explicit precision caveat so the UI does not imply county, raster, or field-level geometry.

**Example:**

```text
Use state tiles for Corn Belt orientation, emit typed selection context, and state that fine-grained map interaction waits on browser-ready geography.
```

---

## Source-Visible Visual Panels

**Use when:** Rendering research metrics, model diagnostics, uncertainty, or caveat-heavy evidence.

**Rule:** Keep headline values, sources, denominators, and caveats visible in the panel itself; do not make essential interpretation depend on hover.

**Example:**

```text
Pair NDVI curves, ablation rows, SHAP rankings, and confusion matrices with visible source cards and fallback messages for missing source slices.
```

---

## URL-Compatible Panel Props

**Use when:** A feature panel needs local controls before final shell integration.

**Rule:** Accept selected values and change callbacks using the same ids as `DashboardFilterState`, so TASK-010 can wire controls to URL-backed state without adapter code.

**Example:**

```text
Rotation accepts `selectedEntity`; extremes accepts `selectedEvent`, `selectedCrop`, and `selectedState` with matching callbacks.
```

---

## Server-Loaded Client Shell

**Use when:** A Next.js dashboard must read filesystem-backed static artifacts while also supporting interactive URL state.

**Rule:** Load artifacts in the server page, pass normalized data into a client shell, and wrap the client shell in Suspense when it uses `useSearchParams`.

**Example:**

```text
`page.tsx` calls `loadDashboardData()`, then renders `<DashboardShell data={data} />` inside Suspense; the shell owns filter, map, and tab URL updates.
```

---

## Local shadcn-Style Primitive Layer

**Use when:** A dashboard needs polished accessible UI controls (cards, buttons, badges, selects, tabs, sheets, popovers) without adopting a full external component library or runtime tokens system.

**Rule:** Build local components under `src/components/ui/` that wrap Radix primitives where accessibility benefits, and use `class-variance-authority` + `clsx` + `tailwind-merge` (via a `cn()` helper in `src/lib/utils.ts`) for variant-driven Tailwind class composition. Keep each primitive a single small file; export both the component and any variant builder where useful.

**Example:**

```text
`Button` is a Radix `Slot`-backed `forwardRef` component with `cva({ variants: { variant, size } })` and `cn(buttonVariants({ variant, size, className }))`. `Card` supports `asChild` so callers can swap the wrapper for a semantic `<section>` while keeping the styling.
```

---

## Test-Stable Accessibility Tree Under Redesign

**Use when:** Replacing a previously shipped UI without rewriting the existing test suite.

**Rule:** Preserve the accessible-name surface (heading text, `role="region"` aria-labels, `getByLabelText` targets, exact-string assertions) even when the visual layer is fully replaced. Use `Card asChild` + `<section aria-label="...">` wrappers, hidden `<h1 className="sr-only">` elements, and styled native `<select>` / `<input>` with proper `<label>` association so existing `getByText` and `getByLabelText` matchers keep working.

**Example:**

```text
`DashboardShell` keeps a hidden `<h1>GeoCrop Interactive Dashboard</h1>` for the integration test, wraps the filters card with `<section aria-label="Dashboard filters">`, wraps the map card with `<section aria-label="Corn Belt map surface">`, and exposes each state path on the choropleth with `role="button"` + `aria-label="Select ${name}"` to keep the prior tablist/region/button assertions green.
```

---

## Choropleth From us-atlas + d3-geo

**Use when:** A dashboard needs a real interactive U.S. choropleth without standing up a map tile service.

**Rule:** Import `us-atlas/states-albers-10m.json` directly (allowed by `resolveJsonModule`), decode with `topojson-client.feature`, and render `<path>` elements using `d3-geo.geoPath()`. Pass values in by state code, and a `colorScale(value)` function for color mapping. Expose each state as a keyboard-activatable `role="button"` with `aria-label="Select ${name}"`, paint state labels at centroid with white stroke for legibility, and place a positioned tooltip on hover.

**Example:**

```text
`UsChoropleth` accepts `{ values, colorScale, selectedState, onSelect, format }`. `MapPanel` maps categorical layer values (legend index) to a discrete color from the layer's legend, with a soft slate for `undefined` (no data).
```

---

## Recharts ComposedChart For Posterior + Empirical Curves

**Use when:** A dashboard needs to plot a model posterior with a credible interval and an overlaid empirical series.

**Rule:** Build chart rows keyed by the x-axis value (e.g. day-of-year) and merge posterior / band / empirical fields from multiple normalized series into the same row map. Render with a Recharts `ComposedChart` containing an `Area` for the band (using `dataKey: "band"` with a `[low, high]` tuple), a `Line` for the posterior mean, and a dashed `Line` for the empirical series. Provide a static legend row outside the chart so direct labels are not hover-only. If the chart supports zooming, pair the Recharts `Brush` with non-drag controls such as preset buttons and numeric inputs.

**Example:**

```text
`NdviCurveChart` builds `{ dayOfYear, posteriorMean?, band?: [low, high], empirical? }` rows, renders Area + Line + Line, and pairs the chart with peak summary tiles. The wrapping `<div role="img" aria-label="${cropLabel} NDVI phenology curve">` keeps the chart announced as a single accessible image for tests.
```

---

## Local-First Analytical Zoom Controls

**Use when:** A chart interaction is useful for exploration but not yet important enough to become a shareable dashboard filter.

**Rule:** Keep the zoom window in local component state, treat it as a view transform rather than data filtering, and keep source/caveat text visible. Provide at least one keyboard-accessible path, usually preset buttons plus numeric range inputs, before relying on drag gestures such as a chart brush.

**Example:**

```text
`NdviCurveChart` stores the selected HSGP season window locally, offers Full season / Green-up / Peak / Senescence presets plus start/end DOY inputs, and syncs those controls with a Recharts `Brush`. If reviewers later need shareable links to selected spans, promote the range into `DashboardFilterState` and URL codecs.
```

---

## Public Static PDF Reference

**Use when:** A deployed dashboard needs to show a paper, report, or other static PDF from the repo.

**Rule:** Copy the PDF into `public/` and reference it with an app-root URL such as `/papers/file.pdf`; do not link to parent repo paths because Vercel cannot serve them. Prefer browser-native PDF embedding plus explicit Open and Download links before adding a PDF viewer dependency.

**Example:**

```text
`DashboardShell.PaperReferenceCard` opens a Sheet with `<iframe src="/papers/NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf">`, plus Open PDF and Download PDF anchor actions.
```

---

## Compact-View Disclosure For Long Tables

**Use when:** A panel includes a ranked or long table where the first few rows carry most of the analytical signal.

**Rule:** Default to a compact view of the top N rows (typically 5) and render a "Show N more" / "Show less" button at the bottom of the table that toggles `isExpanded`. Always keep the section header, description, and selection pill visible — the disclosure must reveal more rows of the same table, not collapse the whole section. Add a small total-count badge next to the title so users can see scale even while collapsed.

**Example:**

```text
`RotationGeoRanking` exports `COMPACT_ROW_COUNT = 5`, computes `visibleGeographies = !hasOverflow || isExpanded ? rankedGeographies : rankedGeographies.slice(0, COMPACT_ROW_COUNT)`, and renders a Lucide `<ChevronDown />` button labeled "Show N more" / "Show less" with `aria-expanded={isExpanded}`.
```

---

## Controlled Button Tablist Over Radix Tabs Under React 19 + JSDOM

**Use when:** A shell needs controlled tab state that must remain testable with `fireEvent.click` and `screen.getByRole("tab", { name })` in Vitest + JSDOM + React 19.

**Rule:** Prefer a simple `<nav role="tablist">` + `<button role="tab" aria-selected aria-controls>` controlled by parent state, and render only the active panel. Reserve Radix `Tabs` for cases where its keyboard model is required; under React 19 + JSDOM the controlled-state propagation through `fireEvent.click` was unreliable in this project.

**Example:**

```text
`DashboardShell.TaskTabs` renders one `<button>` per `TAB_META` entry, sets `aria-selected={isActive}` and `aria-controls={"tabpanel-" + id}`, calls `onTabChange(id)` on click, and the shell conditionally renders the active panel below as `<section id={"tabpanel-" + activeTab} role="tabpanel">`.
```

---

## Lucide Overlay Chevron For Styled Native Selects

**Use when:** A styled native `<select>` needs a custom chevron without using an inline `data:image/svg+xml` URL in Tailwind classes.

**Rule:** Wrap the `<select>` in a `relative` container, add `appearance-none` + right padding, and absolutely-position a Lucide `<ChevronDown />` over the right edge with `pointer-events-none`. Avoids Lightning CSS parser warnings on data-URL backgrounds at build time.

**Example:**

```text
`NativeSelect` in `CompactFilterBar` is a small helper: `<div className="relative"><select className={SELECT_CLASS} {...props} /><ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" /></div>`.
```
