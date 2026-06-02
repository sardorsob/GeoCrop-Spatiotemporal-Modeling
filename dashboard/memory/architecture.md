# Architecture Memory

> QA updates this after tasks are approved done.

## Current Structure

- `package.json` defines the Next.js 16 + React 19 + TypeScript scaffold and verification scripts.
- `src/app/layout.tsx` defines the root HTML shell and metadata.
- `src/app/page.tsx` renders the minimal GeoCrop scaffold landing page.
- `src/app/globals.css` imports Tailwind CSS and sets global font/body defaults.
- `src/lib/scaffold/home-copy.ts` stores minimal scaffold copy for the landing page.
- `src/lib/scaffold/home-copy.test.ts` verifies the scaffold title and four research lanes.
- `next.config.ts` pins `turbopack.root` to the dashboard folder so local builds do not infer a parent lockfile as the workspace root.
- `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `postcss.config.mjs`, and `tsconfig.json` provide scaffold tooling.

## Data Flow

- TASK-000 has no artifact data ingestion yet.
- The landing page consumes local scaffold copy only.
- Future data flow starts in TASK-001/TASK-002 with typed source registry and artifact normalization.

## Important Boundaries

- Workflow artifacts (`PROJECT.md`, `SCOPE.md`, `TASKS.md`, `AGENTS.md`, `memory/`, `logs/`, `scripts/`) remain outside the app runtime.
- The scaffold does not include backend, database, auth, MapLibre, D3, Observable Plot, or shadcn/ui yet.
- Generated folders `dashboard/node_modules/`, `dashboard/.next/`, and `dashboard/tsconfig.tsbuildinfo` are ignored.

## Known Caveats

- `npm audit --audit-level=high` reports no high/critical advisories, but npm install/audit reports two moderate advisories in Next/PostCSS with only breaking `npm audit fix --force` remediation suggested.
- The current page is only a scaffold confirmation, not the final dashboard shell.
