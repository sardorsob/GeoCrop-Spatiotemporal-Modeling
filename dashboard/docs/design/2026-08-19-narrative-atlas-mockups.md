# Narrative Atlas Layout Mockups

> Design comparison for GeoCrop website redesign v2. These are structural
> mockups, not production components. They deliberately use real research
> content instead of placeholder marketing sections.

## Design question

How can GeoCrop tell a guided research story without turning every chapter into
a map or sacrificing the existing analytical dashboard?

The answer is to treat an **atlas as a collection of evidence plates**, not as a
collection of maps. Each act receives the visual form that best carries its
claim. Maps lead only when geography is the evidence.

## Direction 1 — Ribbon Chapters

```text
┌────────────────────── GEOCROP / STORY ───────────────────────┐
│ The Corn Belt has a rhythm, a memory, and a breaking point.  │
│  01 Season ─── 02 Memory ─── 03 Stress ─── 04 Prediction    │
├───────────────────────┬──────────────────────────────────────┤
│ 01 SEE THE SEASON     │ CORN      ╭────────╮                 │
│ Every crop keeps time │ SOY         ╭────────╮               │
│                       │ WHEAT   ╭──────╮                       │
│ key claim + annotation│ HSGP mean + IQR + 90% + empirical IQR│
├───────────────────────┴──────────────────────────────────────┤
│ sequence strips → rotation composition → measured county map│
├──────────────────────────────────────────────────────────────┤
│ paired flood / drought maps                                  │
├──────────────────────────────────────────────────────────────┤
│ ablation → SHAP → confusion → regime performance             │
└──────────────────────────────────────────────────────────────┘
```

Strengths:

- Most coherent single reading experience.
- Gives the HSGP figure the same visual authority as a map.
- Makes the research pipeline understandable on a first visit.

Risks:

- A long page can become exhausting if every act behaves like a full-screen
  scrollytelling scene.
- Cross-chapter comparison and deep-linked filters are less discoverable.
- Sticky copy and scroll-triggered transitions can fight dense charts.

Use if the website is primarily a portfolio or judging presentation.

## Direction 2 — Atlas + Lab

```text
┌──────────────────────────────────────────────────────────────┐
│ GEOCROP / NARRATIVE ATLAS       [Story] [Explore] [Paper]    │
├──────────────────────────────────────────────────────────────┤
│ STORY                                                        │
│ Chaptered Evidence Canvas                                    │
│ thesis → HSGP plate → rotation plate → climate plate → model │
│ Every act ends with [Explore this evidence →]                │
├──────────────────────────────────────────────────────────────┤
│ EXPLORE                                                      │
│ [Phenology] [Rotation] [Extremes] [Prediction]               │
│ task-local controls │ task-specific lead visual              │
│ pinned evidence     │ exact values / supporting diagnostics  │
└──────────────────────────────────────────────────────────────┘
```

Story view uses the Ribbon Chapters composition. Explore view reuses the current
typed data, URL state, task panels, and accessible tab foundation, but removes
the universal map and global six-control wall.

Strengths:

- Best balance between an authored first visit and serious data exploration.
- Preserves useful v1 architecture without letting dashboard chrome dominate.
- Lets each task choose its lead evidence: chart, map, paired map, or matrix.
- Existing deep links can normalize into Explore instead of breaking.

Risks:

- Story and Explore can duplicate content unless they share figure components.
- The handoff must be obvious and preserve the active act.
- The Explore interface can regress into the old control wall without strict
  chapter-local ownership.

This is the selected working direction.

## Direction 3 — Evidence Desk

```text
┌──────────────────────────────────────────────────────────────┐
│ GEOCROP / EVIDENCE DESK                    Methods · Paper   │
├──────────────────────────────────────────────────────────────┤
│ [Phenology] [Rotation] [Extremes] [Prediction]               │
├─────────────────────────────────┬────────────────────────────┤
│ ACTIVE EVIDENCE CANVAS          │ WHAT TO NOTICE             │
│ HSGP / map / comparison / model │ interpretation + caveat    │
│                                 │ selected evidence          │
├─────────────────────────────────┴────────────────────────────┤
│ supporting charts, exact table, sources                      │
└──────────────────────────────────────────────────────────────┘
```

Strengths:

- Most efficient for data-science reviewers.
- Closest to the current layout and lowest implementation risk.
- Persistent interpretation improves chart reading.

Risks:

- Still reads primarily as a dashboard.
- The research sequence remains optional rather than felt.
- Least distinctive and least effective as a portfolio story.

Use if expert analytical efficiency becomes more important than first-visit
storytelling.

## Selected desktop composition

The selected Atlas + Lab direction uses a **Chaptered Evidence Canvas** for
Story:

```text
Top bar: wordmark · Story / Explore · Paper / Methods

Opening:
  editorial thesis (left)
  CDL 30 m / NDVI 250 m / SMAP 9 km resolution braid (right)

Act I — Phenology:
  30% argument and direct finding
  70% aligned corn / soybean / winter-wheat HSGP figure
  no map

Act II — Rotation:
  crop-sequence rule strips
  100-cell class composition
  measured 13-state / county map with evidence lens

Act III — Extremes:
  matched 2019 flood and 2022 drought maps
  state × crop lens and magnitude-versus-confidence explainer

Act IV — Prediction:
  data-source braid → ablation → grouped SHAP
  annotated confusion matrix + regime accuracy strip
  no geographic prediction map without a supporting artifact

Closing:
  “The land is easiest to read where history repeats.”
  monoculture 95.5% · regular 87.4% · irregular 70.9%
```

## Selected mobile composition

```text
Top bar
Story / Explore
four-act progress row

chapter claim
primary visual
two direct annotations
[Explore controls] → bottom sheet
source + caveat disclosure
next chapter
```

- The three HSGP crop plots stack vertically on a shared seasonal axis.
- The Corn Belt fills the map viewport; tap pins a state and opens a compact
  detail sheet.
- Story contains no global filter wall. Explore controls belong to the active
  act and remain below or beside its visual.
- Hover is an enhancement only; focus, tap, direct labels, and pinned state carry
  the same information.
- The page never requires horizontal scrolling, landscape orientation, or
  scroll-jacking.

## Visual language mockup

- **Voice:** scientific field notebook edited like an atlas.
- **Surfaces:** warm paper/soil neutrals with quiet rules rather than stacked
  floating cards.
- **Typography:** editorial display face for claims; existing legible sans for
  controls, labels, values, and caveats.
- **Texture:** data-derived sequence cells, fine coordinate rules, uncertainty
  bands, and raster-scale motifs. No generic gradient haze or decorative
  particles.
- **Color:** crop identity stays stable; wet/dry uses one fixed diverging family;
  map fills never reuse selection color; focus uses a non-data outline.
- **Motion:** reveal, compare, accumulate, and pin only. No looping animation,
  parallax spectacle, or scroll hijacking. Reduced motion shows the same key
  states immediately.

## Shared component rule

Story and Explore render the same task-specific figure components with different
composition and control density. They do not maintain separate chart or map
implementations. Story supplies the authored annotation; Explore exposes the
full supported controls and exact-value paths.
