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

## 2026-08-19 — Separate Task 3 anomaly magnitude from NIG posterior context

**Context:** Task 3 exports both state × crop mean standardized anomalies and an
NIG posterior-predictive percentile. Presenting the latter as generic confidence
or using it in the same color encoding would misstate the paper's model.

**Decision:** Hold crop, projection, extent, and a symmetric mean-z color domain
constant across the 2019 flood and 2022 drought frames. Show NIG only in pinned
details and summaries, labeled as a posterior-predictive percentile: near zero
is the dry tail and near one is the wet tail. It is not a confidence interval
around mean z.

**Reason:** A stable visual frame makes wet/dry magnitude comparable while the
separate label preserves what the NIG quantity actually measures under a short
baseline.

**Impact:** One pin drives both maps. Missing event/state/crop or NIG values stay
no-data, and the complete event × state × crop table is an Explore disclosure.

## 2026-08-19 — Make Task 4 a diagnostic conclusion, not a forecast map

**Context:** Task 4 combines three feature sources at different native scales,
evaluates alternative ablations, computes SHAP on a 1,000-pixel subsample, and
reports four-class test and rotation-regime results. Its NDVI and SMAP features
include the concurrent growing season, and browser-safe geographic aggregates
are not exported.

**Decision:** Tell Act IV from feature sources to model behavior to error mode to
regime context. Treat CDL+NDVI and CDL+SMAP as alternative branches from CDL,
compare the full model to CDL+NDVI, retain every SHAP row in a source family,
and render only the four confusion classes present in the matrix. Do not add a
prediction choropleth or call this a pre-plant forecast.

**Reason:** This mirrors the experiment rather than manufacturing an additive
feature story, a fifth class, geographic precision, or operational timing the
artifacts do not support.

**Impact:** The close names the 95.5% / 87.4% / 70.9% regime accuracies and their
unequal denominators, while class balance, SHAP sample, SMAP 9 km resolution,
the common ~557 m grid, and concurrent-season timing stay adjacent.

## 2026-08-19 — Normalize v1 analytics into Explore

**Context:** Story needed the empty URL, but existing tab/filter links still had
to restore a useful analytical experience. Several v1 map-layer ids no longer
represented supported numeric evidence.

**Decision:** `/` opens Story. If `view` is absent and at least one valid legacy
analytical parameter parses, infer Explore and preserve its task/filter context.
Recognized retired layers normalize to measured regular-rotation share with a
visible compatibility notice. Explicit `view` always wins.

**Reason:** This preserves useful shared links without allowing old placeholder
layers to masquerade as research evidence or sacrificing the first-visit story.

**Impact:** `DashboardFilterState` owns `view`; serialization writes explicit
Story when non-default analytics are present; unrelated query parameters remain
untouched.

## 2026-08-19 — Keep maps inside the task that owns them

**Context:** The v1 universal map and six-control wall made geography look like
the organizing principle for every result and pushed the HSGP evidence down the
page.

**Decision:** Delete the global `CompactFilterBar`, remove the universal map,
and inject the measured regular-share map only into Rotation. Extremes keeps its
own paired maps; Phenology and Prediction have no map.

**Reason:** Controls and maps should appear only where their data grain and
research question support them.

**Impact:** Story presents all four shared task components in order, with HSGP
first. Explore renders one task component and its local controls at a time.

## 2026-08-19 — Patch the audited graph without adding feature scope

**Context:** The final live npm audit reported newly published high-severity
advisories against the previously locked Next/PostCSS toolchain even though no
dependency was added by the redesign.

**Decision:** Run npm's lockfile-only remediation within existing manifest
ranges, then clean-install and re-run the complete gates. This resolved to
Next.js 16.3.1 and patched transitive versions with zero reported vulnerabilities.

**Reason:** The required audit gate should close on the exact deliverable graph,
but a forced major upgrade or unrelated dependency sweep would exceed scope.

**Impact:** `package.json` is unchanged, `package-lock.json` carries the patched
graph, and tests/typecheck/lint/build were repeated against the clean install.

## 2026-08-19 — Retire Story and make GeoCrop Explore-only

**Context:** During live review, the user approved the Explore workspace but
rejected the duplicated Story surface and the `Narrative Atlas` product name.

**Decision:** Make `/` open Explore directly, remove Story composition and mode
controls, remove `view` from domain state, and identify the product as GeoCrop
with U.S. Corn Belt context. Ignore old `view` values while preserving supported
task/filter state, then delete the retired parameter on the next update.

**Reason:** Maintaining a second rejected surface would duplicate presentation
logic without adding user value. The approved task workspace already provides
the desired layout, evidence, and interactivity.

**Impact:** This supersedes the earlier default-Story and `view` decisions.
Three Story-only primitives were deleted; all four evidence tasks, the paper,
sources, caveats, and compatible analytical links remain.

## 2026-08-19 — Fill evidence whitespace without inventing behavior

**Context:** Live review identified unused space beside the Rotation 100-cell
composition and an unnecessarily hidden five-option crop selector in Extremes.
The same review withdrew map-click auto-scroll and found no need to force a year
control.

**Decision:** Pair the 100-cell field with a stacked exact-summary rail at wide
widths and expose the five crop options as direct pressed buttons. Keep the
mobile fallbacks stacked, preserve every scientific value, and add neither
auto-scroll nor a year selector.

**Reason:** These changes increase density and discoverability using existing
evidence and callbacks. The Rotation artifact is a dated aggregate result and
does not support a truthful year-by-year map control.

**Impact:** The visual layout changes without changing calculations, URL crop
state, map behavior, dependencies, or data claims.
