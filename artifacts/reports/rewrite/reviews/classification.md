# Classification section handover

Mode: rewrite-with-notes. Status: ready for independent substantive and voice check.

Length after final section edits: approximately 720 prose words excluding the ablation table (770 whitespace-delimited words in the TeX source). Brace balance checked; external references limited to `tab:ablation` and root-owned `fig:prediction`. All previously reported numerical results were checked for retention.

Owned files: `sections/classification.tex` and this note only. No analysis rerun, model retraining, other source edits, or commit.

## Structure and editorial changes

- Integrated the classification question, actual inputs, temporal split, validation comparison, test errors, regime comparison, and SHAP interpretation in one section.
- Explained the purpose before model machinery. Kept a single compact ablation table rather than duplicating it with a bar chart.
- Used `tab:ablation`, `sec:classification`, and one reference to the root-owned `fig:prediction` (test confusion matrix and regime results). No figure environment; no ablation figure needed.
- Cites existing bibliography keys `ke2017lightgbm` and `lundberg2017shap`. Root owns bibliography metadata verification and final compilation.
- Removed unsupported inverse-frequency multiclass weighting, irrigation identification, strict leakage-free evaluation, causal management claims, and the claim that HSGP/NIG outputs feed the classifier.

## Evidence checked

| Retained claim | Source |
|---|---|
| Four target labels; model settings; year split; 500,000 samples/year | `configs/task4_crop_mapping.yaml`; `src/modeling/crop_type_model.py`; `artifacts/tables/task4/task4_split_summary.csv` |
| 19 CDL, 15 NDVI, four SMAP features | `src/preprocessing/task4_panel.py`; saved notebook 02 cell 5 output; ablation CSV |
| History uses prior years; NDVI is direct weekly feature extraction; HSGP and NIG outputs absent | `compute_cdl_history_features`, `compute_ndvi_features`, `_smap_gs_features_for_cell_block`, and both frame builders in `src/preprocessing/task4_panel.py` |
| 2022 accuracy and macro F1 for four configurations | `artifacts/tables/task4/task4_ablation_results.csv`; notebook 02 cell 7 predicts `val_df` |
| NDVI gain 1.7386 pp; SMAP gain 0.0682 pp | Differences calculated from ablation CSV and rounded to 1.74 and 0.07 pp |
| Wheat validation F1 0.848616 to 0.880727 | Same ablation CSV, rounded to 0.849 and 0.881 |
| 2023 accuracy 0.792056; macro F1 0.791448; per-class scores and confusion counts | `artifacts/tables/task4/task4__test_metrics__20260413.json` |
| Regime definitions | `compute_cdl_history_features` in `src/preprocessing/task4_panel.py`: regular `alt>=0.7` and `pdist<=3`; monoculture priority `mxrun>=7` or corn/soy fraction `>=0.8`; no Task 2 eligibility rule imported |
| Regime counts, accuracies, class F1 and macro F1 | `artifacts/tables/task4/task4_regime_stratified_metrics.csv` |
| SHAP rank order and sample design | `artifacts/tables/task4/task4_shap_feature_importance.csv`; notebook 03 cell 5 uses a random (not stratified) 1,000-row sample; cell 7 averages absolute attribution across observations/classes |

Original manuscript classification methods/results were read for context, then corrected against implementation and artifacts. Also read the local brief, voice profile, claims table, prior assessment, writing-workflow skill, workflow kit, workflow reference, hygiene notes, Sardor voice notes, and copy-sweeps checklist.

## Scientific caveats for root integration

1. The ablations are 2022 validation results. Only the full model's 2023 result is retained as a test result. No significance or cross-year feature ranking claim.
2. The full model includes concurrent late-season features; it is crop classification, not preseason forecasting. The test sample is exactly balanced by CDL class. Spatial transfer and independent field-label validation were not performed.
3. **Code 0 scope issue:** the residual label follows implementation codes 0--61 excluding 1, 5, and 24, and therefore includes code 0. The section now calls this label “Other” and states its operational definition, avoiding a claim that every selected residual pixel is a crop. The archived output label `other_cropland` is not proof of agricultural land cover for every included code. Root should use “Other” consistently in new figures/tables and address the selection rule if discussing land-cover scope.
4. Regimes are computed internally from the preceding historical window. They differ from Task 2's 2015--2024 map and deterministic eligibility rules. Monoculture can include a long run of any observed code, not only corn/soy. Class mixtures differ across regimes; reported OA gaps are descriptive. The low regular-group four-class macro F1 is included to make the compositional issue visible.
5. Neighborhood values are computed after target-class sampling and zero filling. Thus the sampled mask affects supposedly historical spatial context; this is a source-level concern, not a measured estimate of score inflation.
6. Training NDVI history caches only sampled rows from prior panel years; test NDVI history loads available prior-year observations at the chosen test pixels. Coverage differs.
7. **Additional mismatch found:** training accumulates parent-cell SMAP history and uses its 20th/80th percentiles when available. `build_test_year_frame` passes `hist_gs=None` to `_smap_gs_features_for_cell_block`, so test wet/dry-week features use the target year's own per-row percentiles. Root notified. The shared Discussion owns the full explanation; the section's redundant forward-reference paragraph was removed in final polish.
8. The shared cropland mask uses 2013--2022; it defines a retrospective population for earlier training years. Root discussion owns this detail.
9. The model is configured as `multiclass`; `is_unbalance` should not be described as inverse multiclass weighting. I omitted that claim entirely. `subsample=0.8` is also omitted because the code does not explicitly set a positive subsample frequency, and a configured fraction is not proof that row subsampling occurred.
10. SHAP explains this fitted model, with correlated features; no irrigation or crop-choice causality claim. No strong agronomic explanation inferred from the residual class's high score.

## QA

Substantive sweep: every numerical result tied to saved CSV/JSON; methods checked against implementation and executed notebook source/output. Copy sweep: direct purpose-led opening, bounded interpretation, no stock claims of robustness or resilience outcomes. Awaiting independent reviewer and root integration feedback.

Final root-requested edits completed after the integrated writing review:

- Shortened the opening to the purpose of testing seasonal inputs beyond preceding crop labels.
- Restored the distinct classifier eligibility rule: selected CDL codes 0--61 in at least three years during 2013--2022, explicitly separate from rotation eligibility. This resolves the section-owned population-definition finding in `integrated_evidence_review.md`.
- Retained “Other” with code 0 explicit, concurrent late-season scope, balanced evaluation, validation/test separation, and class-mixture qualifications.
- Removed repeated HSGP/NIG non-input statements because the shared workflow retains them.
- Applied the writing review's explanation that the regular group's high accuracy masks uneven class performance, retaining all F1 values and supports.
- Led SHAP with its interpretive purpose and retained its fitted-model attribution scope; removed the unprompted irrigation caveat.
- Removed the final forward-reference limitation paragraph. The shared Discussion retains the concrete construction discrepancies and absence of a geographic-transfer evaluation.

Read the resulting section once for flow, ambiguity, and claim scope. All numerical findings and model settings are preserved; numerical retention assertions and brace-balance check passed. No new source or model claim was added. Root owns the remaining integrated geographic-footprint and baseline-week corrections and the “when available” SMAP wording.
