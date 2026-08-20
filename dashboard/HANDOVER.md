# Handover

## Status

The Narrative Atlas v2 redesign is complete through `TASK-022`. Story is the
default four-act reading experience, Explore is a task-scoped and shareable
evidence workspace, and both paths use the same source-backed task components.

## Delivered

- A field-notebook / satellite-atlas visual grammar with accessible act
  navigation, figure framing, evidence captions, focus treatment, and reduced-
  motion fallback.
- Deterministic Task 1–4 evidence contracts that preserve sources, dates,
  denominators, uncertainty, and limitations.
- A three-crop HSGP comparator with aligned corn, soybean, and winter-wheat
  seasonality, posterior intervals, empirical spatial IQR, direct peaks, paper
  stages, and a shared Explore season window.
- Rotation sequence rules, dated 100-cell composition, measured state/county
  regular-share map and evidence lens, within-grain ranking, exact sensitivity
  rows, and Markov context.
- Matched 2019 flood and 2022 drought state maps with a shared crop/domain, one
  pin, separate mean-z and NIG posterior context, complete Explore table, and
  honest no-data behavior.
- A prediction conclusion from CDL/NDVI/SMAP input braid through branch-aware
  ablation, lossless grouped SHAP, annotated four-class confusion, regime
  comparison, and concurrent-season/spatial/sample limits.
- Default Story composition containing all four acts, plus one Explore panel at
  a time with relevant local controls only.
- URL `view` state, safe v1 analytical-link normalization, visible warnings for
  retired map layers, and preservation of unrelated URL parameters.
- A neutral `GeoCrop research paper` drawer with embedded, open, and download
  paths. Unverified award/year claims and the unrelated paper-source repository
  link are not exposed.
- The retired global `CompactFilterBar` and universal overview map are removed.
- Existing dependency ranges resolve to an audited Next.js 16.3.1 graph; no
  feature dependency was added.

## Verification

Latest run on 2026-08-19:

- `npm run test`: 15 files, 68 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build -- --webpack`: passed. The managed sandbox blocks a Turbopack
  helper process from binding a port; this is an environment restriction, not a
  source/build error.
- `npm audit --audit-level=high`: zero vulnerabilities after lockfile-only
  in-range remediation and a clean install.
- `python scripts/validate-task-statuses.py`: passed.
- `python scripts/check-required-artifacts.py`: passed.
- Browser Use: Story at 1440 and 320 px and Explore at 390/320 px had exact
  document-width containment, no negative-size chart warnings, one rotation map
  in its task context, no global controls, visible legacy warning, and 44 px
  visible touch controls. Paper dialog keyboard activation succeeded.
- Automated map coverage verifies pointer preview, keyboard pin, touch/click
  pin, Escape/reset, and exact-value fallback paths.

## Run Locally

```bash
cd dashboard
npm install
npm run dev
```

Open <http://localhost:3000>. No environment secrets are currently required.

## Important Boundaries

- Source artifacts are read from `../artifacts/tables/`; displayed paths stay
  repo-relative.
- Task 2 state/county fills are aggregates, not field-level classification.
  Task 3 remains state-grain. Task 1 and Task 4 deliberately have no map.
- Task 4 uses concurrent growing-season signals and is not an operational
  pre-plant forecast.
- Missing or malformed sources keep the chapter visible and produce a named
  load/empty state.
- Large Parquet/GeoTIFF files, notebook execution, backend, auth, live inference,
  and generated imagery remain outside the website.

## Remaining Product Work

- Review final content and visual pacing with the user on real desktop/mobile
  devices.
- Configure and connect the Vercel project when deployment is authorized.
- Add deployment-level E2E smoke only after hosting is stable.
- Prepare new browser-safe evidence artifacts before adding any county raster,
  field magnifier, or Task 4 geographic prediction view.
