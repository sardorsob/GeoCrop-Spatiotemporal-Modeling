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
