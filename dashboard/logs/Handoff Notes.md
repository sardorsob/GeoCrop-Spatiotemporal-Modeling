# Handoff Notes

Use this for session-to-session continuity. The polished delivery summary is in
`HANDOVER.md`.

## Current State

- Narrative Atlas v2 is implemented through `TASK-022` on
  `codex/narrative-atlas-v2`, one task commit at a time.
- Story is the default and renders all four shared evidence chapters. Explore
  renders one shareable task workspace and task-local controls.
- HSGP leads Act I. The measured regular-share map lives only inside Rotation;
  Extremes owns its paired maps; Prediction has no unsupported geography.
- Valid v1 analytical URLs infer Explore. Retired map layers surface a visible
  warning and normalize to measured regular share.
- The global `CompactFilterBar` and universal overview map are gone.
- Paper copy is neutral and the unrelated source repository link is not exposed.
- The exact dependency graph is clean-installed from the patched lockfile and
  reports zero vulnerabilities at the high audit level.

## Verification Snapshot

- 15 test files / 68 tests passed.
- Typecheck and lint passed.
- Webpack production build passed with Next.js 16.3.1.
- Workflow status and artifact validators passed.
- Browser Use passed 1440, 390, and 320 px containment and touch checks. The
  desktop/mobile screenshots were temporary under `/private/tmp` and are not
  committed.

## Next Best Action

Ask the user to review the completed Story and Explore experiences. If accepted,
configure Vercel only with explicit deployment authorization.

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
