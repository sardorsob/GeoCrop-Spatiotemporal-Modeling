# Handoff Notes

Use this for session-to-session handoff before final `HANDOVER.md`.

## Current State

- The delivered v1 dashboard is intact. Website redesign v2 is in mockup/spec
  review; no implementation has started.
- `docs/intake.md` contains the redesign request, evidence audit, three product
  directions, provisional creative direction, success criteria, and open
  decisions.
- Selected working direction: Narrative Atlas with a Chaptered Evidence Canvas
  in Story and an Evidence Lab in Explore, using the four-act paper spine and a
  “field notebook meets satellite atlas” visual language.
- `docs/design/2026-08-19-narrative-atlas-mockups.md` records three layout
  directions and the desktop/mobile wireframes. The HSGP comparator leads Act I;
  maps lead only rotation and extremes.
- `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md` and the
  rewritten `SCOPE.md` define the review-ready v2 contract.
- `TASKS.md` preserves 15 completed v1 tasks and adds eight pending v2 tasks,
  `TASK-015`–`TASK-022`.
- High-priority evidence defects are documented: the hardcoded 10-state map and
  the HSGP chart's lossy row shaping/missing uncertainty bands.
- Temporary live-review screenshots were stored under `/tmp` only. The local dev
  server was stopped after inspection.

## Next Best Action

Ask the user to review the mockup comparison and selected Atlas + Lab detail.
If no revision is requested, begin `TASK-015` and `TASK-016` as independent
lanes. Do not start any v2 task before that review signal.

## Known Risks

- Rotation percentages conflict between the root README and dated source
  artifacts; use the artifacts only after explicit reconciliation.
- NeurIPS 2024, NAFSI 2025, and Spring 2026 labels and the award claim need a
  source-backed chronology. The paper source's repository link appears unrelated.
- Do not map a metric at county/pixel grain unless that task has a prepared,
  browser-safe artifact at that grain.
- Preserve essential evidence outside hover and provide keyboard/touch and
  reduced-motion equivalents.
- `memory/architecture.md`, `memory/patterns.md`, README, and final `HANDOVER.md`
  still describe the implemented v1 and must change only with reviewed v2 code,
  not during design planning.
- Do not generate imagery for dashboard design; use code-native, data-derived
  visual forms and browser screenshots.
