# GeoCrop

Next.js evidence website for the GeoCrop Spatiotemporal Modeling project. The
site opens directly into one source-backed analytical workspace for four
research tasks across the U.S. Corn Belt.

## Experience

- **Explore:** four shareable task tabs—phenology, rotation, extremes, and
  prediction—with controls beside the evidence they
  affect. There is no universal map or six-field global filter wall.
- **Maps:** measured regular-rotation share at state/county grain and matched
  state-grain flood/drought anomaly maps. Task 1 and Task 4 remain chart-led.
- **Evidence:** visible source paths, artifact dates, denominators, uncertainty,
  method caveats, limitations, and named missing-data states.
- **Paper:** a neutral `GeoCrop research paper` drawer with embedded reading,
  open, and download actions.
- **Compatibility:** old `view=story` / `view=explore` parameters are ignored
  and removed on the next state update while valid task/filter context remains;
  retired map layers show a warning and use measured regular-rotation share.

## Local Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No secrets, database, backend, or remote data
service are required.

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
python scripts/validate-task-statuses.py
python scripts/check-required-artifacts.py
```

Latest QA on 2026-08-19 after `TASK-024`:

- 15 test files and 67 tests passed.
- TypeScript and ESLint passed.
- The production build passed with Next.js 16.3.1. In the managed isolated
  worktree, `npm run build -- --webpack` avoids sandbox/Turbopack process-port
  restrictions.
- `npm audit --audit-level=high` reported zero vulnerabilities after a
  lockfile-only update within the existing manifest ranges.
- Workflow status and required-artifact validators passed.
- Browser Use smoke passed at 1440 and 320 px: the Rotation field and stacked
  summary rail balance at wide width; all five Extremes crop buttons remain
  intact at 320 px with 44 px minimum targets and no document overflow.

## Tech Stack

- Next.js 16.3.1, React 19, TypeScript 5.9, Tailwind CSS v4.
- Recharts for the HSGP comparator and diagnostic charts.
- D3 Geo, TopoJSON Client, and `us-atlas` for code-native Albers geography.
- Local Radix-backed UI primitives and Lucide icons.
- Static CSV/JSON artifact loading and URL-backed analytical state.
- Vitest and Testing Library.

## Data and Deployment

- Parent `../artifacts/tables/` CSV/JSON files are the result authority.
- The paper PDF is served from
  `public/papers/NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf`.
- Large Parquet and GeoTIFF artifacts are not shipped to the browser.
- The target host is Vercel; project settings are not configured in this repo.

## Known Boundaries

- Task 2 geography is aggregate state/county evidence, not field or pixel
  precision. Task 3 is state-grain only.
- Task 4 is a concurrent-season diagnostic conclusion, not a pre-plant forecast,
  and has no geographic prediction layer without a supporting browser-safe
  artifact.
- The paper reader uses the browser-native PDF viewer; no viewer package was
  added.
- No Playwright suite is included; component coverage and manual Browser Use
  smoke form the current interaction gate.

## Workflow

The repository follows `PROJECT.md`, `SCOPE.md`, `TASKS.md`, `AGENTS.md`,
`memory/`, and `logs/`. `TASK-015` through `TASK-024` were implemented and
committed sequentially, one task per commit. Merge remains deferred for final
user review.
