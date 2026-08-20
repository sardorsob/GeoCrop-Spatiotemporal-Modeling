# Project

## Identity

- **Name:** GeoCrop Interactive Dashboard
- **Owner / Client:** Sardor Sobirov / GeoCrop project
- **Repo:** `dashboard/` workspace inside `GeoCrop-Spatiotemporal-Modeling`
- **Primary stack:** Next.js, React, TypeScript, Vercel
- **Primary user:** First-time research visitors, agricultural analysts, and data science reviewers

## Phase

<!-- 0-Intake | 1-Scope | 2-Setup | 3-Development | 4-QA | 5-Delivery | 6-Maintenance -->

**Current:** 3-Development — Narrative Atlas v2 implementation

The v1 dashboard remains the preserved baseline. The approved Narrative Atlas
v2 task graph is now executing sequentially with one task commit at a time.

## Source Docs

- `docs/intake.md` - source input for dashboard scope
- `../README.md` - GeoCrop project overview and artifact inventory
- `../artifacts/reports/neurips_2024.tex` - paper source
- `../artifacts/tables/` - source result tables
- `../artifacts/figures/` - figure and map assets
- `SCOPE.md` - canonical scope after intake
- `TASKS.md` - executable task list after scope parsing
- `docs/design/2026-08-19-narrative-atlas-mockups.md` - three layout directions and selected composition
- `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md` - review-ready v2 design specification

## Features

| Feature | Status | Notes |
|---------|--------|-------|
| Intake capture | done | Dashboard plan imported into `docs/intake.md` |
| Scope generation | done | `SCOPE.md` and `memory/stack-guidance.md` populated from intake |
| Task generation | done | `TASKS.md` generated from approved scope |
| Dashboard build | done | `TASK-000` through `TASK-010` are implemented and committed locally pending user push |
| UI redesign | done | `TASK-011` replaces flat code-native shell with shadcn-style primitives, Recharts NDVI, d3-geo + us-atlas US choropleth, collapsible Rotation table |
| HSGP season-window zoom | done | `TASK-012` adds local Full / Green-up / Peak / Senescence / custom DOY zoom controls to the Task 1 NDVI chart |
| NAFSI paper reader | done | `TASK-013` replaces the old Prediction hero KPI with a `NAFSI 2025 winning paper` CTA, embedded PDF reader, and open/download actions |
| Sprout favicon | done | `TASK-014` adds a public SVG favicon using the current top-bar plant mark |
| Website redesign v2 | in progress | `TASK-015`–`TASK-017` establish the shared grammar, deterministic evidence contracts, and honest Task 2/3 evidence map; Act I HSGP work begins in `TASK-018` |

## Decisions

<!-- Append-only. Record non-obvious choices. -->

- 2026-06-02: Use the dev agentic workflow kit for the dashboard workspace: intake -> scope -> tasks -> Builder/QA -> handover.
- 2026-06-02: Treat Map Command Center with guided analytical tabs as the primary design direction until scope review changes it.
- 2026-06-02: Use Next.js + React + TypeScript hosted on Vercel for the dashboard stack.
- 2026-06-02: Generated 11 executable tasks with Builder/QA status fields and file ownership boundaries.
- 2026-06-02: Keep dashboard visual work code-native only; do not use image generation or `gpt-image-2`.
- 2026-06-02: Added `TASK-011` UI redesign in response to user feedback that the flat code-native shell was visually unusable (squished map, dense filter wall, basic SVG charts). Authorized adding Radix primitives, Recharts, Lucide, and us-atlas/d3-geo as the minimum viable design-system bump; rule against image generation remains in force.
- 2026-06-02: Replaced the schematic state-tile fallback with a true Albers-projection US choropleth driven by `us-atlas/states-albers-10m.json`.
- 2026-06-02: Completed cleanup pass after QA review: removed orphaned old map/filter components, pruned unused reserved dependencies, moved `d3-geo` into runtime dependencies, added `MapPanel` regression coverage, and linked active tabs to a real `tabpanel`.
- 2026-06-03: Added Task 1 HSGP season-window zoom as local chart state rather than URL state for the first experiment; presets and numeric DOY inputs provide a keyboard-accessible path while the Recharts brush provides direct plot zoom.
- 2026-06-03: Added the NAFSI 2025 winning paper as a static public PDF and used browser-native PDF embedding instead of adding a PDF viewer package; Open PDF and Download PDF links are available as fallbacks.
- 2026-06-03: Added the GeoCrop sprout favicon as a code-native SVG under `public/favicon.svg`; no generated image assets or new packages were used.
- 2026-08-19: Opened an approval-gated website redesign phase. Planning may update context files and inspect the live UI, but application code, tests, dependencies, data, and generated assets remain untouched until the design is approved.
- 2026-08-19: Use Superpowers brainstorming as the primary design process, with Ponytail, cartographic, and web-data-visualization guidance as supporting constraints. Do not stack a second full interview process while the same design tree is being resolved.
- 2026-08-19: Treat the paper and dated artifacts as the evidence authority. The current hardcoded map categories are a v1 placeholder, not scientific state results to carry into v2.
- 2026-08-19: Use Narrative Atlas as the v2 product structure, with a Chaptered Evidence Canvas in Story and a sibling Evidence Lab in Explore. “Atlas” describes a collection of evidence plates; maps lead only rotation and extremes.
- 2026-08-19: Share task-specific figure components and selectors between Story and Explore. Keep the current stack and add no dependency unless an implementation task proves a concrete gap.
- 2026-08-19: Preserve `TASK-000`–`TASK-014` as v1 history and append eight pending v2 tasks (`TASK-015`–`TASK-022`). No v2 task may start before mockup/spec review.

## Last Session

- **Date:** 2026-08-19
- **What was done:** Completed `TASK-017`: removed the hardcoded fallback registry and Task 4 map claims, focused the Albers frame on 13 study states, added honest Task 2 state/county and Task 3 state fills, and implemented a source-visible evidence lens with pointer, keyboard, touch, Escape, reset, legend, and exact-value paths.
- **What's next:** Execute `TASK-018` to rebuild Act I as the paper-faithful three-crop HSGP comparator.
- **Blockers:** No implementation blocker. Content inconsistencies in rotation thresholds, challenge chronology, award wording, and the paper's repository link remain final-copy gates; the scope defines safe fallback wording and behavior.

## Environment

- **Local setup:** Run `npm install`, then `npm run dev` inside `dashboard/`.
- **Secrets:** No secrets expected for MVP; use `.env.example` if any future services require configuration.
- **External services:** None expected for MVP.

## Workflow

- Intake: `dev-agentic-workflow-kit/skills/intake-to-scope`
- Task generation: `dev-agentic-workflow-kit/skills/scope-to-tasks`
- Build: `dev-agentic-workflow-kit/skills/build-task`
- QA: `dev-agentic-workflow-kit/skills/qa-gate`
- Handoff: `dev-agentic-workflow-kit/skills/handover-sync`
