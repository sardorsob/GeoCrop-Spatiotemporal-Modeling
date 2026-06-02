# Project

## Identity

- **Name:** GeoCrop Interactive Dashboard
- **Owner / Client:** Sardor Sobirov / GeoCrop project
- **Repo:** `dashboard/` workspace inside `GeoCrop-Spatiotemporal-Modeling`
- **Primary stack:** Next.js, React, TypeScript, Vercel
- **Primary user:** Agricultural analysts and data science reviewers

## Phase

<!-- 0-Intake | 1-Scope | 2-Setup | 3-Development | 4-QA | 5-Delivery | 6-Maintenance -->

**Current:** 2-Setup

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
| Dashboard build | in-progress | `TASK-000` scaffold done; next task is `TASK-001` |

## Decisions

<!-- Append-only. Record non-obvious choices. -->

- 2026-06-02: Use the dev agentic workflow kit for the dashboard workspace: intake -> scope -> tasks -> Builder/QA -> handover.
- 2026-06-02: Treat Map Command Center with guided analytical tabs as the primary design direction until scope review changes it.
- 2026-06-02: Use Next.js + React + TypeScript hosted on Vercel for the dashboard stack.
- 2026-06-02: Generated 11 executable tasks with Builder/QA status fields and file ownership boundaries.

## Last Session

- **Date:** 2026-06-02
- **What was done:** Created dashboard workflow shell, imported the dashboard plan into `docs/intake.md`, selected Next.js/Vercel stack, populated `SCOPE.md` plus `memory/stack-guidance.md`, and generated `TASKS.md`.
- **What's next:** Start `TASK-001` to define artifact source registry and dashboard data types.
- **Blockers:** Map implementation fidelity, browser-ready geography inputs, Vercel project settings, and design concept asset handling are unresolved.

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
