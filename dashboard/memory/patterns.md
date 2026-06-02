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
