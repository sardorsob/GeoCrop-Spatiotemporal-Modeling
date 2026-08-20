# Handoff Notes

Use this for session-to-session continuity. The polished delivery summary is in
`HANDOVER.md`.

## Current State

- GeoCrop is implemented through `TASK-024` on
  `codex/narrative-atlas-v2`, one task commit at a time.
- Explore is the only/default product surface and renders one shareable task
  workspace with task-local controls. Story and `view` state are removed.
- HSGP is the default task. The measured regular-share map lives only inside Rotation;
  Extremes owns its paired maps; Prediction has no unsupported geography.
- Legacy mode URLs preserve valid task/filter state and shed `view` on update.
  Retired map layers surface a visible warning and normalize to measured share.
- Rotation uses a wide field-plus-stacked-summary composition; Extremes uses
  five direct 44 px crop buttons and no crop dropdown.
- The global `CompactFilterBar` and universal overview map are gone.
- Paper copy is neutral and the unrelated source repository link is not exposed.
- The exact dependency graph is clean-installed from the patched lockfile and
  reports zero vulnerabilities at the high audit level.

## Verification Snapshot

- 15 test files / 67 tests passed.
- Typecheck and lint passed.
- Webpack production build passed with Next.js 16.3.1.
- Workflow status and artifact validators passed.
- Browser Use passed 1440 and 320 px composition, containment, and touch checks. The
  desktop/mobile screenshots were temporary under `/private/tmp` and are not
  committed.

## Next Best Action

Ask the user to review the completed Explore experience. Do not merge until the
user approves. Configure Vercel only with explicit deployment authorization.

## Boundaries To Preserve

- Do not reintroduce global controls or a map-first shell.
- Do not describe Task 4 as a pre-plant forecast or irregular rotation as poor
  management.
- Do not map a task beyond its artifact-supported geographic grain.
- Keep sources, dates, denominators, uncertainty, and limitations adjacent to
  qualified claims.
- Do not add generated imagery, backend services, notebook execution, or new
  map/chart dependencies without a scope update.
- A managed sandbox may require `npm run build -- --webpack` because Turbopack's
  CSS helper cannot bind an internal port there.
