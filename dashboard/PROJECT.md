# Project

## Identity

- **Name:** GeoCrop Interactive Dashboard
- **Owner / Client:** Sardor Sobirov / GeoCrop project
- **Repo:** `dashboard/` workspace inside `GeoCrop-Spatiotemporal-Modeling`
- **Primary stack:** Next.js, React, TypeScript, Vercel
- **Primary user:** First-time research visitors, agricultural analysts, and data science reviewers

## Phase

<!-- 0-Intake | 1-Scope | 2-Setup | 3-Development | 4-QA | 5-Delivery | 6-Maintenance -->

**Current:** 5-Delivery — Narrative Atlas v2 complete

The approved Narrative Atlas v2 graph is implemented through `TASK-022`, checked,
and ready for product review and deployment handoff.

## Source Docs

- `docs/intake.md` - source input for dashboard scope
- `../README.md` - GeoCrop project overview and artifact inventory
- `../artifacts/reports/neurips_2024.tex` - paper source
- `../artifacts/tables/` - source result tables
- `../artifacts/figures/` - figure and map assets
- `SCOPE.md` - canonical scope after intake
- `TASKS.md` - executable task list after scope parsing
- `docs/design/2026-08-19-narrative-atlas-mockups.md` - three layout directions and selected composition
- `docs/superpowers/specs/2026-08-19-geocrop-website-redesign-design.md` - review-ready v2 design specification

## Features

| Feature | Status | Notes |
|---------|--------|-------|
| Intake capture | done | Dashboard plan imported into `docs/intake.md` |
| Scope generation | done | `SCOPE.md` and `memory/stack-guidance.md` populated from intake |
| Task generation | done | `TASKS.md` generated from approved scope |
| Dashboard build | done | `TASK-000` through `TASK-010` are implemented and committed locally pending user push |
| UI redesign | done | `TASK-011` replaces flat code-native shell with shadcn-style primitives, Recharts NDVI, d3-geo + us-atlas US choropleth, collapsible Rotation table |
| HSGP season-window zoom | done | `TASK-012` adds local Full / Green-up / Peak / Senescence / custom DOY zoom controls to the Task 1 NDVI chart |
| NAFSI paper reader | done | `TASK-013` replaces the old Prediction hero KPI with a `NAFSI 2025 winning paper` CTA, embedded PDF reader, and open/download actions |
| Sprout favicon | done | `TASK-014` adds a public SVG favicon using the current top-bar plant mark |
| Website redesign v2 | done | `TASK-015`–`TASK-022` deliver the shared grammar, evidence contracts/map, four chapters, default Story, task-scoped Explore, compatibility, and handoff |
| Act I HSGP comparator | done | Story aligns corn, soybean, and winter wheat with nested posterior intervals, empirical spatial IQR, paper growth stages, direct peaks, and an explicit focused NDVI scale; Explore adds one shared compact season window |
| Act II rotation memory | done | Schematic decade strips lead into a dated 100-cell composition, measured within-grain geography ranking/map slot, and discrete source-only threshold sensitivity |
| Act III paired extremes | done | Matched 2019 flood and 2022 drought state maps share crop and mean-z scale; one state pin exposes event-specific NIG posterior context, denominator, source, and no-data honestly |
| Act IV prediction conclusion | done | CDL/NDVI/SMAP feed a source-backed ablation and grouped-SHAP story, annotated corn/soy errors, and a denominator-aware regime close with forecast/spatial limits |

## Decisions

<!-- Append-only. Record non-obvious choices. -->

- 2026-06-02: Use the dev agentic workflow kit for the dashboard workspace: intake -> scope -> tasks -> Builder/QA -> handover.
- 2026-06-02: Treat Map Command Center with guided analytical tabs as the primary design direction until scope review changes it.
- 2026-06-02: Use Next.js + React + TypeScript hosted on Vercel for the dashboard stack.
- 2026-06-02: Generated 11 executable tasks with Builder/QA status fields and file ownership boundaries.
- 2026-06-02: Keep dashboard visual work code-native only; do not use image generation or `gpt-image-2`.
- 2026-06-02: Added `TASK-011` UI redesign in response to user feedback that the flat code-native shell was visually unusable (squished map, dense filter wall, basic SVG charts). Authorized adding Radix primitives, Recharts, Lucide, and us-atlas/d3-geo as the minimum viable design-system bump; rule against image generation remains in force.
- 2026-06-02: Replaced the schematic state-tile fallback with a true Albers-projection US choropleth driven by `us-atlas/states-albers-10m.json`.
- 2026-06-02: Completed cleanup pass after QA review: removed orphaned old map/filter components, pruned unused reserved dependencies, moved `d3-geo` into runtime dependencies, added `MapPanel` regression coverage, and linked active tabs to a real `tabpanel`.
- 2026-06-03: Added Task 1 HSGP season-window zoom as local chart state rather than URL state for the first experiment; presets and numeric DOY inputs provide a keyboard-accessible path while the Recharts brush provides direct plot zoom.
- 2026-06-03: Added the NAFSI 2025 winning paper as a static public PDF and used browser-native PDF embedding instead of adding a PDF viewer package; Open PDF and Download PDF links are available as fallbacks.
- 2026-06-03: Added the GeoCrop sprout favicon as a code-native SVG under `public/favicon.svg`; no generated image assets or new packages were used.
- 2026-08-19: Opened an approval-gated website redesign phase. Planning may update context files and inspect the live UI, but application code, tests, dependencies, data, and generated assets remain untouched until the design is approved.
- 2026-08-19: Use Superpowers brainstorming as the primary design process, with Ponytail, cartographic, and web-data-visualization guidance as supporting constraints. Do not stack a second full interview process while the same design tree is being resolved.
- 2026-08-19: Treat the paper and dated artifacts as the evidence authority. The current hardcoded map categories are a v1 placeholder, not scientific state results to carry into v2.
- 2026-08-19: Use Narrative Atlas as the v2 product structure, with a Chaptered Evidence Canvas in Story and a sibling Evidence Lab in Explore. “Atlas” describes a collection of evidence plates; maps lead only rotation and extremes.
- 2026-08-19: Share task-specific figure components and selectors between Story and Explore. Keep the current stack and add no dependency unless an implementation task proves a concrete gap.
- 2026-08-19: Preserve `TASK-000`–`TASK-014` as v1 history and append eight pending v2 tasks (`TASK-015`–`TASK-022`). No v2 task may start before mockup/spec review.
- 2026-08-19: Keep the Task 1 story as one three-row comparator on a shared 0.50–1.00 NDVI scale. Encode the paper's posterior IQR, 90% interval, empirical Q25/Q75, and crop-specific stages directly; reserve shared season-window controls for Explore.
- 2026-08-19: Teach Task 2 classes with explicitly schematic decade strips before showing dated composition or geography. Keep the dated class result separate from the threshold-sensitivity experiment, and allow sensitivity changes only by selecting complete exported rows.
- 2026-08-19: Compare the 2019 flood and 2022 drought in matched state frames with one crop-wide symmetric mean-z scale. Treat the paper's NIG quantity as a posterior-predictive percentile that contextualizes baseline uncertainty, never as the map color or a confidence interval around mean z.
- 2026-08-19: Present Task 4 ablations as two alternative CDL-baseline branches plus the full model, not as additive steps. Preserve every SHAP source row within a named family, use only the four exported test classes, and close on descriptive regime predictability while keeping unequal denominators and concurrent-season limitations visible.
- 2026-08-19: Make Story the empty-URL default and normalize valid v1 analytical URLs into Explore. Retire the universal map and global control wall; place the measured regular-share map only inside Rotation and warn visibly when old unsupported map layers are normalized.
- 2026-08-19: Replace unverified award/year wording with `GeoCrop research paper`; keep the existing reader/open/download action and exclude the unrelated repository link.
- 2026-08-19: Accept npm's lockfile-only, manifest-range-preserving security remediation so the final audit resolves to Next.js 16.3.1 and zero reported vulnerabilities without adding a feature dependency.

## Last Session

- **Date:** 2026-08-19
- **What was done:** Completed `TASK-022`: integrated the four source-backed acts into default Story and task-scoped Explore, retired the global map/filter wall, added view compatibility and visible legacy warnings, neutralized paper copy, completed responsive/accessibility/browser QA, and remediated the dependency audit within existing ranges.
- **What's next:** User product review, then configure deployment if authorized.
- **Blockers:** No implementation blocker. Vercel project configuration and deployment remain outside the completed redesign task graph.

## Environment

- **Local setup:** Run `npm install`, then `npm run dev` inside `dashboard/`.
- **Secrets:** No secrets expected for MVP; use `.env.example` if any future services require configuration.
- **External services:** None expected for MVP.

## Workflow

- Intake: `dev-agentic-workflow-kit/skills/intake-to-scope`
- Task generation: `dev-agentic-workflow-kit/skills/scope-to-tasks`
- Build: `dev-agentic-workflow-kit/skills/build-task`
- QA: `dev-agentic-workflow-kit/skills/qa-gate`
- Handoff: `dev-agentic-workflow-kit/skills/handover-sync`
