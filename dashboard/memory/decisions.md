# Decisions

Append-only record of non-obvious project decisions. Proposed directions remain
in `docs/intake.md` until approved; this file records only settled process and
evidence decisions.

## 2026-06-02 — Establish the v1 Map Command Center baseline

**Context:** The first dashboard milestone needed a source-driven interface over
checked-in GeoCrop artifacts without rerunning notebooks.

**Decision:** Use a static-data Next.js/React/TypeScript dashboard with four task
tabs, URL-backed state, code-native visuals, and no backend, database, auth, or
generated imagery.

**Reason:** This was the smallest useful, deployable surface supported by the
existing artifacts and repository workflow.

**Impact:** The completed v1 remains a preserved baseline. Redesign v2 may change
its experience only after design and scope approval.

## 2026-08-19 — Treat redesign v2 as an approval-gated architectural design

**Context:** The requested redesign changes storytelling, visualization meaning,
interaction grammar, art direction, and responsive composition rather than one
isolated component.

**Decision:** Use Superpowers brainstorming as the single primary process. This
phase may inspect the site and update context documents only. Formal spec, scope,
tasks, implementation, dependencies, generated assets, and tests wait for the
appropriate approval gates.

**Reason:** The design has material branches whose downstream implementation
would diverge. The repository workflow requires design agreement before scope
and task generation.

**Impact:** `SCOPE.md`, `memory/stack-guidance.md`, `TASKS.md`, implementation
files, and the final handover remain unchanged in this planning pass.

## 2026-08-19 — Use paper and dated artifacts as evidence authority

**Context:** The current map uses hardcoded category labels for 10 states, while
the Task 2 source table contains measured summaries for 13 states. Root README
rotation shares also differ from the dated artifact values.

**Decision:** Do not treat current map categories or conflicting summary copy as
research evidence for v2. Every mapped or narrated value must trace to the paper
and a checked-in result artifact, with discrepancies resolved before final copy.

**Reason:** A visually polished but unsupported encoding would make the research
story less accurate, not more understandable.

**Impact:** The v2 map must use real numeric fields at their honest geographic
grain. Unsupported Task 4 geography and pixel-level detail stay absent unless a
separate approved data-preparation task supplies them.

## 2026-08-19 — Preserve the no-generated-imagery dashboard rule

**Context:** The repository established code-native dashboard visuals, and the
redesign request permits browser screenshots and exploration but does not revise
that constraint.

**Decision:** Use data-derived graphics, typography, layout, interaction, and
code-native visual motifs for design exploration. Do not use image generation
for the dashboard.

**Reason:** The desired distinctiveness can come from the evidence and visual
system while preserving reproducibility and provenance.

**Impact:** Temporary screenshots may support critique, but generated concept art
and decorative synthetic assets are outside this design process.

## 2026-08-19 — Balance Narrative Atlas with an Evidence Lab

**Context:** The user approved the Narrative Atlas direction but raised the risk
that a map-centered story would crowd out the HSGP and other important graphs.

**Decision:** Use a Chaptered Evidence Canvas for the default Story path and a
sibling Evidence Lab for task-specific exploration. “Atlas” refers to a
collection of evidence plates: phenology is chart-led, rotation and extremes are
map-led, and prediction is diagnostic-chart-led.

**Reason:** This gives first-time readers an authored sequence while preserving
the current dashboard's analytical value. It also lets each research claim use
the visual form best supported by its data.

**Impact:** Story and Explore share task-specific selectors and figure
components. The universal map and global filter wall are not part of v2.

## 2026-08-19 — Keep the current stack and plan eight v2 tasks

**Context:** The existing application already has static artifact loading, URL
state, UI primitives, Recharts, D3 Geo, TopoJSON, and state/county geometry.

**Decision:** Add no planned dependency. Preserve completed `TASK-000` through
`TASK-014` and append `TASK-015` through `TASK-022` for visual grammar, evidence
contracts, map, four acts, and final Story/Explore integration.

**Reason:** The redesign's gaps are evidence shaping and composition, not a
missing framework or service.

**Impact:** Implementation can start with visual grammar and evidence contracts
in parallel after mockup/spec review. Backend, database, auth, and new map/chart
libraries remain outside scope.
