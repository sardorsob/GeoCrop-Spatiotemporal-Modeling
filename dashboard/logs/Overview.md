# Overview

## Project

- Name: GeoCrop Interactive Dashboard — website redesign v2
- Phase: 1-Scope (mockup/spec review)
- Current status: Narrative Atlas is the approved product frame. Three layout directions, a selected Chaptered Evidence Canvas + Evidence Lab composition, canonical v2 scope, a design specification, and eight pending tasks are ready for review. The shipped v1 dashboard remains the implementation baseline.

## Links

- Repo: `GeoCrop-Spatiotemporal-Modeling/dashboard/`
- Intake: `docs/intake.md`
- Canonical v2 scope: `SCOPE.md`
- Layout mockups: `docs/design/2026-08-19-narrative-atlas-mockups.md`
- Design specification: `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md`
- Pending implementation graph: `TASKS.md` (`TASK-015`–`TASK-022`)
- Paper source: `../artifacts/reports/neurips_2024.tex`
- Evidence: `../artifacts/tables/` and `../artifacts/figures/`
- Deployment: unresolved; no deployment work is in the current planning phase
- Design: Narrative Atlas with a Chaptered Evidence Canvas in Story, an Evidence Lab in Explore, and “field notebook meets satellite atlas” art direction

## Current Risks

- The current map hardcodes 10 categorical state values rather than displaying measured 13-state study results.
- The current HSGP chart data shaping and missing uncertainty bands prevent paper-faithful comparison.
- Browser-ready geographic detail is uneven: Task 2 supports county summaries, Task 3 supports state × crop summaries, and Task 4 lacks a comparable geographic result table.
- Mobile inspection found horizontal overflow and evidence appearing after a dense control/map stack.
- Root README rotation shares conflict with the paper/artifacts.
- NeurIPS 2024, NAFSI 2025, and Spring 2026 labels are not yet reconciled, and the paper source links to an unrelated repository.
- No v2 implementation task may start until the user reviews the mockup/spec package.
