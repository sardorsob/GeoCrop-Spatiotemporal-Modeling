# Overview

## Project

- Name: GeoCrop
- Phase: 4-QA — awaiting final user check
- Current status: The redesign is complete through `TASK-024` on
  `codex/narrative-atlas-v2`. The empty URL opens the shareable Explore
  workspace; Story and its mode state are retired. The branch remains unmerged.

## Canonical References

- Repo: `GeoCrop-Spatiotemporal-Modeling/dashboard/`
- Scope: `SCOPE.md`
- Tasks: `TASKS.md` (`TASK-015`–`TASK-024` done)
- Layout decision: `docs/design/2026-08-19-narrative-atlas-mockups.md`
- Design specification:
  `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md`
- Paper source: `../artifacts/reports/neurips_2024.tex`
- Evidence: `../artifacts/tables/` and `../artifacts/figures/`
- Final handoff: `HANDOVER.md`

## Delivered Shape

- Explore exposes four task tabs and only task-local controls. HSGP remains the
  empty-route default task.
- The universal map and global six-control bar are removed. Numeric geography
  appears only in Rotation and Extremes at supported grain.
- Old mode URLs retain valid task/filter state and shed `view` on update;
  retired map layers warn and normalize to measured regular-rotation share.
- Rotation places its 100-cell field beside three stacked summaries at wide
  widths. Extremes exposes five direct crop buttons instead of a dropdown.
- The paper remains a neutral drawer/action with no unverified award/year copy
  or unrelated repository link.

## Final Gates

- 15 files / 67 tests passed.
- Typecheck and lint passed.
- Production build passed with Webpack in the managed sandbox.
- High-severity npm audit passed with zero vulnerabilities after an in-range,
  lockfile-only remediation and clean install.
- Workflow status and required-artifact validators passed.
- Browser Use passed at 1440 and 320 px with exact document-width containment,
  balanced Rotation composition, five unclipped Extremes crop buttons, and
  44 px minimum touch targets.

## Remaining External Work

- User visual/content review on real devices.
- Vercel project setup and deployment when explicitly authorized.
- Deployment-level E2E smoke after hosting is stable.
- New browser-safe artifacts before any field magnifier, raster delivery, or
  Task 4 geographic prediction layer.
