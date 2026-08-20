# Overview

## Project

- Name: GeoCrop Narrative Atlas
- Phase: 5-Delivery
- Current status: Narrative Atlas v2 is complete through `TASK-022`. The empty
  URL opens a four-act Story; Explore is a shareable task-specific workspace.
  Both use the same source-backed evidence components.

## Canonical References

- Repo: `GeoCrop-Spatiotemporal-Modeling/dashboard/`
- Scope: `SCOPE.md`
- Tasks: `TASKS.md` (`TASK-015`–`TASK-022` done)
- Layout decision: `docs/design/2026-08-19-narrative-atlas-mockups.md`
- Design specification:
  `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md`
- Paper source: `../artifacts/reports/neurips_2024.tex`
- Evidence: `../artifacts/tables/` and `../artifacts/figures/`
- Final handoff: `HANDOVER.md`

## Delivered Shape

- Story leads with the three native observation scales and the HSGP comparator,
  then rotation memory, matched climate extremes, and prediction diagnostics.
- Explore exposes four task tabs and only task-local controls.
- The universal map and global six-control bar are removed. Numeric geography
  appears only in Rotation and Extremes at supported grain.
- Valid v1 analytical URLs infer Explore; retired map layers warn and normalize
  to measured regular-rotation share.
- The paper remains a neutral drawer/action with no unverified award/year copy
  or unrelated repository link.

## Final Gates

- 15 files / 68 tests passed.
- Typecheck and lint passed.
- Production build passed with Webpack in the managed sandbox.
- High-severity npm audit passed with zero vulnerabilities after an in-range,
  lockfile-only remediation and clean install.
- Workflow status and required-artifact validators passed.
- Browser Use passed at 1440, 390, and 320 px with exact document-width
  containment, no negative-size chart warnings, and 44 px visible controls.

## Remaining External Work

- User visual/content review on real devices.
- Vercel project setup and deployment when explicitly authorized.
- Deployment-level E2E smoke after hosting is stable.
- New browser-safe artifacts before any field magnifier, raster delivery, or
  Task 4 geographic prediction layer.
