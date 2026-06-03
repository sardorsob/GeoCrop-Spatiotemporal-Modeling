# Project

## Identity

- **Name:** GeoCrop Interactive Dashboard
- **Owner / Client:** Sardor Sobirov / GeoCrop project
- **Repo:** `dashboard/` workspace inside `GeoCrop-Spatiotemporal-Modeling`
- **Primary stack:** Next.js, React, TypeScript, Vercel
- **Primary user:** Agricultural analysts and data science reviewers

## Phase

<!-- 0-Intake | 1-Scope | 2-Setup | 3-Development | 4-QA | 5-Delivery | 6-Maintenance -->

**Current:** 4-QA

## Source Docs

- `docs/intake.md` - source input for dashboard scope
- `../README.md` - GeoCrop project overview and artifact inventory
- `../artifacts/reports/neurips_2024.tex` - paper source
- `../artifacts/tables/` - source result tables
- `../artifacts/figures/` - figure and map assets
- `SCOPE.md` - canonical scope after intake
- `TASKS.md` - executable task list after scope parsing

## Features

| Feature | Status | Notes |
|---------|--------|-------|
| Intake capture | done | Dashboard plan imported into `docs/intake.md` |
| Scope generation | done | `SCOPE.md` and `memory/stack-guidance.md` populated from intake |
| Task generation | done | `TASKS.md` generated from approved scope |
| Dashboard build | done | `TASK-000` through `TASK-010` are implemented and committed locally pending user push |
| UI redesign | done | `TASK-011` replaces flat code-native shell with shadcn-style primitives, Recharts NDVI, d3-geo + us-atlas US choropleth, collapsible Rotation table |
| HSGP season-window zoom | done | `TASK-012` adds local Full / Green-up / Peak / Senescence / custom DOY zoom controls to the Task 1 NDVI chart |

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

## Last Session

- **Date:** 2026-06-03
- **What was done:** Added `TASK-012` HSGP season-window zoom to the Task 1 NDVI chart. The Recharts chart now has local Full season, Green-up, Peak, Senescence, and custom start/end DOY controls; the brush and direct peak summary cards update to the selected span. Focused red/green tests and typecheck passed.
- **What's next:** User review at `http://localhost:3000`, then push to GitHub and configure Vercel. Optional follow-up: promote the HSGP season window to URL-backed state if shareable deep links become important, or add browser-ready vector-tile geography if county/pixel-level fidelity becomes a priority.
- **Blockers:** Vercel project settings unresolved. In-app browser screenshot smoke remains blocked by `windows sandbox failed: spawn setup refresh`; Chrome MCP extension was also unreachable in the last session.

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
