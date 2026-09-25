# Claims and sources

Primary audit: ../paper_rewrite_assessment.md. Source links below are repository-relative from root.

| Claim | Evidence | Disposition |
|---|---|---|
| Phenology peaks at DOY 204/226/147 | artifacts/tables/task1/hsgp_posterior_phenology.csv | retain as regional modeled curves |
| HSGP RMSE 0.0183–0.0232 | artifacts/tables/task1/model_evaluation.csv; fitting/evaluation notebook | describe in-sample checks |
| Rotation shares 27.36/3.90/68.74% | artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv | label smoothed eligible grid |
| Analysis cells about 556.7 m | companion April 12 metadata JSON | applies to saved Task 2 area products, Task 4 documented grid; avoid universal 250 m claim |
| Task 2 actual rule | configs/task2_crop_rotation.yaml; src/modeling/rotation_classifier.py | eligibility ≥5; regular ≥7, distance ≤3; valid C/S edge denominator; monoculture first |
| Moisture case studies | Task 3 event CSVs, config, NIG code | retrospective percentiles; 2019 in baseline; crop 26 is double crop |
| 2022 ablation accuracies | artifacts/tables/task4/task4_ablation_results.csv | validation only; observed differences without significance claim |
| 2023 accuracy 0.792056 and macro F1 0.791448 | artifacts/tables/task4/task4__test_metrics__20260413.json | balanced sample, agreement with CDL |
| Regime accuracies | artifacts/tables/task4/task4_regime_stratified_metrics.csv | descriptive; class mixtures differ; internally computed historical regimes |
| SHAP ranks | artifacts/tables/task4/task4_shap_feature_importance.csv | descriptive attribution, not causal evidence |
| Resilience/early warning/false-positive reduction | no direct evaluation in saved artifacts | remove as achieved results |
| Perfectly leakage-free/deployable model | feature construction concerns in audit | remove; explain limitations |

External verification already completed: USDA CDL class table confirms 24/26 distinction; Nandan publisher record corrects DOI to 10.1016/j.jag.2026.105208 and authors Rohit Nandan, Varaprasad Bandaru; LightGBM is_unbalance is not a general multiclass weighting mechanism.
