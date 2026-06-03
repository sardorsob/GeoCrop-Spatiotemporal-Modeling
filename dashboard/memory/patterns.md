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
