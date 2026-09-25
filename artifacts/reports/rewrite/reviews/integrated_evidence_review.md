# Integrated evidence review

Reviewer: classification agent, in substantive-review mode. Scope: the complete integrated `artifacts/reports/geocrop_revised.tex`, all three included section files, `rewrite/make_figures.py`, all five rendered PNG figures, saved numeric artifacts, and targeted implementation/notebook checks. No manuscript edits or model runs.

Disposition after recheck: **PASS — all three integrated evidence findings resolved**. The original findings below are retained as an audit trail. No contradiction found in the principal saved results and no critical task was lost. Bibliography audit is recorded separately in `bibliography_review.md`; final PDF pagination remains with root. The reviewer authored the classification section earlier; that portion was checked again against source, but it is not independently authored review coverage.

## Resolution check

- **Enclosing footprint: resolved.** `geocrop_revised.tex:44` now says a region covering 13 states; line 61 explicitly reports the buffered rectangle, 66,107 outside cells (3.17%), whole-footprint rotation shares, and restricted named-state moisture summaries. The rotation caption at line 33 also states that outside cells are included.
- **Baseline ISO-week coverage: resolved.** `geocrop_revised.tex:59` now states that moisture references use matching ISO weeks for the selected event windows.
- **Classifier eligibility: resolved.** `sections/classification.tex:14–16` states selected codes 0--61 in at least three years during 2013--2022 and distinguishes this mask from rotation eligibility.
- **Optional SMAP precision: resolved.** `geocrop_revised.tex:115` now says historical percentile references are used “when available.”

These corrections preserve the reported outputs and accurately limit their population and temporal scope. No additional manuscript-level factual issue was found in this recheck.

## Prioritized findings

### P2 — Distinguish the enclosing raster footprint from the 13 named states

**Claim/location:** `artifacts/reports/geocrop_revised.tex:57` identifies the study through its 13-state list; the abstract at line 44 describes all analyses “across 13 U.S. Corn Belt states”; the rotation caption at line 33 and `rewrite/sections/phenology_rotation.tex:19–25` attach the total 2,084,112 and smoothed shares to that study without explaining the enclosing rectangle. Read together, these imply the reported grid population is confined to the named state boundaries.

**Evidence:** `src/utils/study_extent.py:63–79` computes the bounding rectangle of the state union and expands it by the configured buffer; `configs/study_extent.yaml` sets a 20,000 m buffer. `artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv` contains an explicit `outside_configured_states` row with **66,107 cells**. All rows sum to 2,084,112; the outside group is **3.17195%** of this eligible footprint. The figure generator (`make_figures.py:81–97`) displays the complete saved raster rather than clipping it to state polygons. This is not only a hypothetical consequence of a bounding-box download.

**Recommended fix:** Add a short study-design sentence distinguishing the buffered rectangular raster footprint from the named-state summaries, and clarify that whole-footprint rotation totals include the outside group. Retain the saved numbers. In the rotation caption, call it the “eligible raster footprint” or similar. The abstract can say “a region covering 13 Corn Belt states” if needed. No geographic reanalysis is required for accurate wording. Do not claim that exactly the same outside fraction applies to every task, since their eligibility and sampling differ.

### P2 — Correct the claim that the moisture baseline spans the entire calendar year

**Claim/location:** `artifacts/reports/geocrop_revised.tex:59`: “Moisture baselines use weekly observations throughout the year.”

**Evidence:** `notebooks/task3_soil_moisture/02_climatology_and_anomalies.ipynb`, cell 1, builds `iso_union` only from `event_week_columns` for the two selected event windows, then passes that set to `baseline_climatology_iso_weeks`. `src/modeling/task3_smap_anomalies.py:82–85` iterates only over the supplied ISO weeks. Calendar-year source availability should not be conflated with the weeks actually fitted for these analyses.

**Recommended fix:** Replace with “Moisture references use matching ISO weeks from 2015–2021 for the selected event windows,” or an equivalent sentence. This aligns the shared design with the already accurate moisture section and design table.

### P2 — Restore the classifier's distinct eligibility rule

**Claim/location:** `artifacts/reports/geocrop_revised.tex:59` refers to a “fixed eligible footprint,” and line 115 names its 2013–2022 window, but neither the integrated main file nor `rewrite/sections/classification.tex:9–37` states how cells qualify. The reader has just seen a different five-corn/soy-year eligibility rule for rotation and its reuse for moisture, so the classifier population remains ambiguous.

**Evidence:** `configs/task4_crop_mapping.yaml`, `cdl.mask_years` and `min_cropland_years_in_mask`, sets 2013–2022 and a minimum of three years. `src/preprocessing/task4_panel.py:82–94` retains cells with codes **0–61 in at least three of those years**. This is separate from the rotation analysis's corn/soy eligibility. The residual code-0 issue is now handled correctly in the classification label definition, but the mask shares that inclusive range as well.

**Recommended fix:** Add one concrete sentence in the shared design or classification methods: “For classification, cells were eligible if they had a selected CDL code (0–61) in at least three years during 2013–2022.” Explicitly distinguish this from the rotation eligibility rule if placement makes that unclear. Avoid calling every selected code a crop. Keep the existing retrospective-mask limitation.

## Minor precision improvement (optional)

At `geocrop_revised.tex:115`, “training uses historical percentile references” can be narrowed to “training uses historical percentile references when available.” `_smap_gs_features_for_cell_block` falls back to each row's current-season percentiles if its parent-cell history is absent; early panel years therefore do not all use a historical reference. The important train/test discrepancy is already correctly disclosed, so this is not an additional material finding.

## Checks that passed

- **Task coverage and interpretation:** All four tasks remain, with sufficient purpose, method, result, and interpretation for a compact report. Omitting repeated state tables, extra diagnostic panels, and most equations does not lose the central empirical argument. Resilience is bounded as motivation; no yield/recovery outcome is claimed.
- **Phenology:** 2008–2025, 535 means per crop, HSGP settings, peak days/magnitudes, RMSE, and interval-coverage values match the saved CSVs and notebook source. Predictive bands are correctly distinguished from spatial field variation; fitting checks are correctly labeled in sample. The figure plots the intended saved means and 5th/95th predictive percentiles.
- **Rotation:** Eligibility, monoculture precedence, alternation denominator, distance rule, regular-class thresholds, smoothed counts/shares, and raw sensitivity shares agree with implementation and artifacts. The caption explicitly distinguishes smoothing stages. The displayed 500 km bar is calculated in projected kilometres. The saved area metadata supports approximately 556.7 m spacing; the manuscript correctly avoids applying that number universally.
- **Moisture:** Correct CDL 26 double-crop interpretation; empirical-Bayes prior wording matches the per-week regional mean and median variance functions; 2019 reference overlap is explicit; moisture percentile is not called drought probability. All retained state examples, thresholds, and pixel-week denominators match the dated event CSVs. Figure points and the 0.5 line match the text. The figure displays the 13 named states rather than the CSV's outside group.
- **Classification:** The table is clearly 2022 validation. All four accuracy/F1 pairs, the 1.74/0.07 percentage-point comparisons, 2023 full-model scores, confusion counts, regime counts/results, and SHAP ordering match saved evidence. The test confusion matrix sums to 500,000 with exactly 125,000 per class; regime supports sum to the same total. Residual label, current-season inputs, internal regime construction, class-mixture caveat, descriptive SHAP, and spatial-transfer limit are retained. No false weighting or causal claim remains.
- **Workflow and limitations:** Diagram and prose show source-derived features rather than HSGP/NIG outputs feeding the classifier. Neighborhood selection dependence, train/test NDVI-history coverage, SMAP reference mismatch, retrospective mask, reference-product labels, and lack of independent event outcomes are specified without claiming measured score inflation.
- **Figure provenance:** All seven files listed in `rewrite/figures/source_manifest.json` match their recorded SHA-256 hashes. Source peaks and confusion-derived accuracy were checked independently of generator assertions. No model was fitted and no raw analysis output was edited.

No other material factual contradiction was identified in this bounded review. Once the three revisions above are integrated, the evidence content is ready for final bibliography and rendered-PDF review.
