# Project

## Identity

- **Name:** GeoCrop Interactive Dashboard
- **Owner / Client:** Sardor Sobirov / GeoCrop project
- **Repo:** `dashboard/` workspace inside `GeoCrop-Spatiotemporal-Modeling`
- **Primary stack:** UNKNOWN - to be selected during scope
- **Primary user:** Agricultural analysts and data science reviewers

## Phase

<!-- 0-Intake | 1-Scope | 2-Setup | 3-Development | 4-QA | 5-Delivery | 6-Maintenance -->

**Current:** 0-Intake

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
| Intake capture | in-progress | Dashboard plan imported into `docs/intake.md`; ready for `intake-to-scope` |
| Scope generation | pending | Run after intake review |
| Task generation | pending | Run after scope approval |
| Dashboard build | pending | Builder/QA loop only after tasks exist |

## Decisions

<!-- Append-only. Record non-obvious choices. -->

- 2026-06-02: Use the dev agentic workflow kit for the dashboard workspace: intake -> scope -> tasks -> Builder/QA -> handover.
- 2026-06-02: Treat Map Command Center with guided analytical tabs as the primary design direction until scope review changes it.

## Last Session

- **Date:** 2026-06-02
- **What was done:** Created dashboard workflow shell from `dev-agentic-workflow-kit/templates/project` and imported the dashboard plan into `docs/intake.md`.
- **What's next:** Run the `intake-to-scope` workflow to produce `SCOPE.md` and `memory/stack-guidance.md`.
- **Blockers:** Stack choice, map implementation fidelity, deployment target, and nested repo vs parent-tracked folder are unresolved.

## Environment

- **Local setup:** UNKNOWN until stack selection
- **Secrets:** No secrets expected for MVP; use `.env.example` if any future services require configuration.
- **External services:** None expected for MVP.

## Workflow

- Intake: `dev-agentic-workflow-kit/skills/intake-to-scope`
- Task generation: `dev-agentic-workflow-kit/skills/scope-to-tasks`
- Build: `dev-agentic-workflow-kit/skills/build-task`
- QA: `dev-agentic-workflow-kit/skills/qa-gate`
- Handoff: `dev-agentic-workflow-kit/skills/handover-sync`
