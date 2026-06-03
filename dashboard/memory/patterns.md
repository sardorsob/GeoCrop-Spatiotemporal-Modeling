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
