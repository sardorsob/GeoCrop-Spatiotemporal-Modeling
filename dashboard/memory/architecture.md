# Architecture Memory

> QA updates this after tasks are approved done.

## Current Structure

- `package.json` defines the Next.js 16 + React 19 + TypeScript scaffold and verification scripts.
- `src/app/layout.tsx` defines the root HTML shell and metadata.
- `src/app/page.tsx` renders `DashboardShell`.
- `src/app/globals.css` imports Tailwind CSS and sets global font/body defaults.
- `src/components/layout/DashboardShell.tsx` defines the responsive Map Command Center shell with task tabs, main evidence region, selected context rail, layer/filter controls, and analytical summary band.
- `src/components/layout/DashboardShell.test.tsx` verifies the shell landmarks and four task tabs.
- `src/lib/data/types.ts` exports dashboard source, phenology, rotation, extremes, prediction, map, and filter types.
- `src/lib/data/sources.ts` defines the ordered Task 1-4 artifact source registry and typed lookup API.
- `src/lib/data/source-notes.ts` derives user-facing source notes from the registry.
- `src/lib/data/loaders.ts` resolves parent artifact paths from the dashboard root and loads CSV/JSON files into typed success/error states for server/test use.
- `src/lib/data/normalize.ts` converts loaded Task 1-4 artifacts into dashboard-ready phenology, rotation, extremes, and prediction structures.
- `src/lib/data/dashboard-data.ts` assembles all registered artifacts and returns normalized dashboard data.
- `src/lib/data/__tests__/sources.test.ts` verifies registry completeness, stable ids, source paths, source notes, and compile-time invalid id rejection.
- `src/lib/data/__tests__/normalize.test.ts` verifies representative source loads, missing-source errors, header aliases, row counts, and normalized Task 1-4 values.
- `src/lib/format/number.ts` provides safe numeric parsing for CSV/JSON values.
- `src/lib/scaffold/home-copy.ts` stores minimal scaffold copy for the landing page.
- `src/lib/scaffold/home-copy.test.ts` verifies the scaffold title and four research lanes.
- `next.config.ts` pins `turbopack.root` to the dashboard folder so local builds do not infer a parent lockfile as the workspace root.
- `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `postcss.config.mjs`, and `tsconfig.json` provide scaffold tooling.

## Data Flow

- TASK-001 defines artifact source contracts only; it does not read, parse, or copy source data files.
- `artifactSources` is the canonical source metadata list for Task 1-4 scoped CSV/JSON inputs.
- `sourceNotesById` is derived from `artifactSources` so user-facing caveats remain aligned with registry metadata.
- TASK-002 adds deterministic CSV/JSON loaders and typed normalization for all scoped Task 1-4 source registry entries.
- Loader outputs preserve source id, path, label, caveat, date stamp, denominator, row count, and typed load errors.
- Normalizers account for observed artifact header aliases instead of assuming registry-friendly column names.

## Important Boundaries

- Workflow artifacts (`PROJECT.md`, `SCOPE.md`, `TASKS.md`, `AGENTS.md`, `memory/`, `logs/`, `scripts/`) remain outside the app runtime.
- The current shell does not include backend, database, auth, MapLibre, D3, Observable Plot, or shadcn/ui yet.
- Dashboard visual assets are code-native only for now; do not use image generation or `gpt-image-2`.
- Generated folders `dashboard/node_modules/`, `dashboard/.next/`, and `dashboard/tsconfig.tsbuildinfo` are ignored.

## Known Caveats

- `npm audit --audit-level=high` reports no high/critical advisories, but npm install/audit reports two moderate advisories in Next/PostCSS with only breaking `npm audit fix --force` remediation suggested.
- The current dashboard shell still uses placeholder evidence blocks; source-backed charts and maps consume normalized data in later feature tasks.
