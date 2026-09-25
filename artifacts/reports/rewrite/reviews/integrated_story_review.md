# Integrated scientific-story review

Reviewer: W1. Scope: `artifacts/reports/geocrop_revised.tex` and all three section drafts, read together with section evidence notes and selected source checks. No manuscript edits, analyses, or model reruns were made. Line references below refer to the reviewed source and may move during integration.

## Assessment

The four tasks now form a coherent report. The first three describe vegetation, crop histories, and moisture conditions; the fourth independently measures the value of source-derived features for crop classification. The workflow text explicitly separates descriptive fitted outputs from classifier inputs. The Discussion makes a useful connection between seasonal timing and the validation comparison without claiming that the HSGP explains the numerical gain. The moisture analysis remains a distinct monitoring example, and its modest classifier contribution is scoped to the selected features and validation year.

The method compression is generally successful. The reader can recover the units, time windows, crop classes, rotation rule, moisture percentile interpretation, temporal split, balanced evaluation, and major limitations. Do not restore the old derivations, prior tables in the main body, per-state rotation tables, or duplicate evaluation charts. One geographic scope correction and a few short provenance details would make the condensed account substantially stronger.

## Correction to make before acceptance

### Clarify the rotation headline's geographic denominator

The main text describes the study as covering 13 states (`geocrop_revised.tex`, Data opening and abstract), which can imply that the 2,084,112-cell rotation denominator is restricted to their polygons. The saved regional table proves otherwise: `artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv` includes **66,107 cells labeled `outside_configured_states`**, or **3.17%** of 2,084,112. The row counts sum exactly to the reported eligible total. The overall class CSV comes from the full smoothed raster and therefore includes this part of the footprint.

`configs/study_extent.yaml` specifies a bounding box around the state union plus a 20 km buffer. Task 2 notebook 04's aggregation source separately attaches state polygons after raster classification. This is a spatial-denominator issue, not a raw-versus-smoothed discrepancy: the eligible footprint is retained through smoothing.

**Minimal fix:** explain in Data that downloads cover a bounding analysis footprint around the 13 states and retain some eligible cells outside the state polygons. Call 27.36% a share of the **smoothed eligible analysis footprint**, including in the abstract/rotation caption. Keep all saved numbers unchanged. State-specific moisture summaries are explicitly grouped by state and can remain as written. Do not infer exact outside-state shares for Tasks 1 or 4 from the Task 2 number; their eligible populations differ.

## Small method additions with high value

### Define the classifier's eligible footprint

The classification section says samples are grid cells, while Data and Discussion mention a fixed 2013–2022 mask without defining its threshold. This determines the population to which accuracy applies and should not require opening code.

**Recommendation:** add one sentence: cells were eligible when CDL codes 0–61 occurred in at least three years during 2013–2022. Keep “selected-code footprint” or equivalent because this rule includes code 0. Evidence: `build_cropland_mask` in `src/preprocessing/task4_panel.py:71` and `configs/task4_crop_mapping.yaml` (`min_cropland_years_in_mask: 3`). The later-year information issue is already adequately explained in the shared Discussion.

### Explain the early training years' missing SMAP inputs

The classifier trains on 2013–2021, but SMAP features begin in 2015. The current concise description does not explain that mismatch. `assemble_training_panel` assigns all four SMAP features NaN for pre-2015 rows (`src/preprocessing/task4_panel.py`, approximately lines 649–667), and the model wrapper passes those columns directly to LightGBM.

**Recommendation:** add a short sentence in the classifier methods or reproducibility note saying that 2013–2014 training rows retained missing SMAP inputs. Do not imply that the entire 4.5-million-row training set has observed moisture features. This is especially relevant to the interpretation of the SMAP comparison, but it does not invalidate the saved metric as a description of the configured experiment.

### Preserve NDVI encoding and feature timing in reproducibility notes

The revised prose no longer mentions how encoded NDVI is converted to the reported scale. Task 4 divides the stored weekly values by 250 (`compute_ndvi_features`, line 352; `scale_to_physical: 250.0` in configuration). The HSGP notebook conditionally applies a /250 factor to byte-scale means (and a /10000 fallback for larger values). Saved empirical HSGP values are already normalized. Do not present /250 as the general native MODIS product scale.

A compact reproducibility note should give this distinction and point to the code defining classifier timing features. Peak week and green-up timing use a three-week moving mean; green-up crosses baseline plus 20% of amplitude; early/middle/late means use column slices 0:7, 7:16, and 16:end. These details do not need to enter the main narrative, but otherwise a reader could incorrectly assume standard calendar-stage definitions. Exact HSGP optimizer, priors, domain, seeds, and predictive settings are now condensed in `phenology_rotation.md`.

## Minor precision and flow recommendations

- Abstract: “four complementary analyses” is slightly clearer than “four linked analyses,” because the actual links are shared inputs and interpretation. The body already makes this distinction well.
- Phenology caption: use “posterior mean curves” for the lines. The CSV line values average latent `mu` draws, whereas shading uses predictive `obs` draws. Their model expectations coincide under zero-mean Normal noise, so the current wording is not a numerical contradiction, but this label matches the saved construction exactly.
- Regime discussion: the regular group's four-class macro F1 of 0.559 is striking next to its 0.879/0.907 corn/soy F1 values. A short explanation that macro F1 also weights the other two classes would make this number useful rather than puzzling. Alternatively, omit this secondary statistic. Do not assert near-absence of a class without support counts; the saved regime CSV gives F1 scores and total group sizes, not class counts.
- The final two sentences on moisture monitoring remain conditional and appropriately bounded. No change is needed merely because the moisture task is less central to the classifier's empirical result.
- The opening Discussion says “value of seasonal timing,” then correctly acknowledges that the ablation does not isolate timing. “Value of seasonal vegetation information” would align the leading claim even more closely with the actual feature-group comparison.

## Scientific safeguards already handled well

The rewritten text correctly treats HSGP metrics as in-sample regional checks; preserves the five-year/seven-year rotation distinction and valid-edge denominator; identifies 27.36% as smoothed versus 28.15% raw in the detailed section; distinguishes Task 3 code 26 from Task 1/4 code 24; discloses the 2019 baseline overlap; defines the CDF score as a moisture percentile; calls 2022 ablations validation results; reports balanced CDL agreement rather than area-representative field accuracy; and records concrete feature-construction discrepancies without inventing their effect size. No unsupported resilience, causality, independent NDVI validation, or operational forecasting achievement remains in the reviewed narrative.

Recommendation: accept the overall structure. Correct the footprint description, add the short mask/missing-input details, and keep remaining implementation specifics in reproducibility notes. Bibliography and PDF-layout acceptance remain with the coordinator.

## Final acceptance check

**Accepted for scientific-story integration.** Re-read the updated main source and section drafts. Data now identifies the buffered rectangle and the 66,107 outside-state cells; the rotation caption explicitly retains them in the full-footprint denominator. Classification defines its separate three-year, codes-0–61 eligibility mask and discloses missing 2013–2014 SMAP inputs. The phenology caption correctly separates posterior mean curves from predictive bands. The peripheral Dirichlet–multinomial paragraph is absent from the main text, while the deterministic rotation rule and raw/smoothed sensitivity distinction remain intact. All four tasks retain their questions, methods, results, and scope limits.

The verified HSGP settings, NDVI encoding and relative week-index definitions, and transition diagnostic definition are now recorded in `../METHOD_NOTES.md`. No material recommendation from this story review remains unresolved. This acceptance concerns the narrative and verified implementation descriptions; it does not resolve the scientific limitations already disclosed, certify a new analysis reproduction, or replace the coordinator's bibliography/build/layout checks. No manuscript edits were made during this final check.
