# Phenology and rotation draft — W1 handover

Status: **ready-for-check**. Mode: rewrite-with-notes. Only the two assigned files were written. No analysis code, bibliography, main manuscript, or model outputs were changed; no analyses were rerun.

Draft: `../sections/phenology_rotation.tex`

## Scope and structure

The draft has two integrated sections. Phenology explains why seasonal timing matters, how crop-specific regional means were fitted, what differs between the saved curves, and what the fitting checks establish. Rotation explains the sequence rule once, reports the smoothed map shares, and interprets the raw threshold sweep. Equations, prior tables, duplicate metric panels, unsupported stage labels, and purported independent NDVI validation have been removed.

There are no figure environments or tables. The draft invokes the root-defined `\phenologyfigure` macro immediately before the crop-history section and `\rotationfigure` at the end. The macros should supply assets labeled `fig:phenology` and `fig:rotation`. Citations use existing keys `riutort2023hsgp` and `sahajpal2014recruit`.

## Retained numbers and direct evidence

| Draft claim | Source read directly | Verification |
| --- | --- | --- |
| Phenology spans 2008–2025 | `artifacts/tables/task1/empirical_ndvi_by_crop.csv`; Task 1 HSGP notebook, cells 3 and 5 | CSV contains every year in this range; saved notebook output reports 18 years. |
| Corn 1, soybean 5, winter wheat 24 | `configs/task1_ndvi_analysis.yaml`; HSGP notebook cell 3 | Configuration and saved printed codes agree. |
| Regional means use matching annual crop labels | HSGP notebook cell 5 | Year-specific `cdl_y` is merged on `iy, ix`, then grouped by current crop code. The notebook also computes spatial quartiles, omitted from this main-text version because the figure displays predictive bands only. |
| 535 regional weekly means per crop | `artifacts/tables/task1/model_evaluation.csv`; HSGP notebook cells 5 and 19 | `n_obs=535` for all three crops; empirical CSV has 1,605 rows. |
| 25 HSGP basis functions; squared-exponential covariance; normal residuals; variational inference | HSGP notebook cells 8–10 | `make_hsgp_model(..., m=25)`, `hsgp_squared_exponential`, Normal likelihood, SVI with AutoNormal. The fit pools all recorded years by crop without a year term. |
| Corn peak DOY 204, NDVI 0.930; soybean DOY 226, NDVI 0.938; wheat DOY 147, NDVI 0.804 | `artifacts/tables/task1/hsgp_posterior_phenology.csv` | Maxima of `posterior_mean` within crop: 204/0.93020; 226/0.93801; 147/0.80377. Text rounds NDVI to three decimals. Difference in saved peak days is 22. |
| RMSE 0.0194/0.0183/0.0232 and 90% interval coverage 90.09–91.21% | `artifacts/tables/task1/model_evaluation.csv`; HSGP notebook cells 9 and 19 | Corn/soy/wheat rows verified. Evaluation reuses stored `doy_raw`/`ndvi_raw` from training, so these are in-sample posterior predictive checks. |
| 2015–2024 rotation window; five-year eligibility; 2,084,112 eligible cells | `configs/task2_crop_rotation.yaml`; Task 2 notebook 02 cell 1; `task2__threshold_sensitivity_grid.csv`; smoothed class CSV | Eligibility code filters `ncs >= MIN_CS`, where MIN_CS is 5. Saved output and table denominator agree. Smoothed class counts sum to the same total. |
| Valid corn/soy adjacent-pair denominator | `src/modeling/rotation_classifier.py:28` and `:46` | `valid` counts only pairs with corn/soy at both ends; zero valid pairs return score zero. No fixed nine-transition denominator. |
| Template distance counts mismatched years | `src/modeling/rotation_classifier.py:83` and `:114`; Task 2 notebook 02 cell 1 | Hamming-style substitution count against both strict templates. Default templates are entirely corn/soy, so the mask includes every template position and other observed labels count as mismatches. |
| Monoculture first; run ≥7 or share ≥0.80; regular A ≥0.70, distance ≤3, corn/soy years ≥7 | `src/modeling/rotation_classifier.py:214`; configuration; Task 2 notebook 03 cells 1–2 | Batch rule tests monoculture first. Notebook supplies fixed `mono_share = 0.80`; in ten years, this is eight or more occurrences. The older YAML metric comment `max_mismatches: 2` is not the classifier setting. |
| 3×3 smoothing and smoothed shares 27.36%/3.90%/68.74% | Configuration; `majority_smooth_classes` at source line 280; `artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv`; companion metadata | Class counts 570,202/81,308/1,432,602. Metadata names `rotation_class_map_smoothed.tif`; smoother leaves center nodata cells nodata. |
| Approximately 556.7 m cells | `artifacts/tables/task4/task2__areal_stats_by_class__20260412__metadata.json` | `approx_grid_resolution_m=556.7`; square-root area equivalent based on raster affine transform, and `pixel_area_ha=30.9876`. No universal 250 m or native 30 m analysis-grid claim retained. |
| Raw regular share 28.15%, rising to 60.33% at A ≥0.50 and distance ≤6 | `artifacts/tables/task2/task2__threshold_sensitivity_grid.csv`; Task 2 notebook 03 cell 1 | Rows (0.70, 3) and (0.50, 6) verified; both denominator 2,084,112. The sweep keeps `cs_min`, `mono_run`, `mono_share` unchanged and does not smooth classifications. |
| Peripheral diagnostic definition, retained only in these notes | `src/modeling/rotation_bayesian_dm.py`; Task 2 config | The Dirichlet–multinomial output uses corn/soy/other transition counts and independent Dirichlet rows with default (0.5, 0.5, 0.5) prior. Its posterior threshold probability concerns the mean of corn→soy and soy→corn probabilities, not satisfaction of the complete deterministic rotation rule. This diagnostic has been removed from main text. |

## Verified HSGP fitting settings for reproducibility

Verified against `notebooks/task1_ndvi_timeseries/03_ndvi_phenology_hsgp_bayesian.ipynb`, cells 8–10 and 19, plus seed 42 in configuration and saved cell 3 output. Compact settings for the coordinator's reproducibility note:

| Component | Exact setting |
| --- | --- |
| Model | Separate crop models; squared-exponential HSGP, 25 basis functions, `non_centered=True`; Normal residuals |
| Domain | DOY centered at the midpoint of its observed minimum/maximum; half-width = 1.3 × maximum absolute centered DOY |
| Priors | Intercept Normal(0.65, SD 0.25); amplitude HalfNormal(scale 0.4); length-scale LogNormal(log-location ln 25, log-scale 0.5); residual SD HalfNormal(scale 0.1) |
| Fitting | NumPyro SVI, AutoNormal mean-field guide, Trace_ELBO; Adam step size 0.005; 8,000 steps per crop; seed 42 |
| Prediction | 2,000 draws; 300 equally spaced DOYs spanning observed minimum minus 3 through maximum plus 3; prediction seed 43 |
| In-sample checks | 2,000 predictive draws at training DOYs; seed 141; metrics calculated against the same regional means used to fit |

Normal's second prior parameter is an SD, not a variance. Centering uses the DOY range midpoint, not mean DOY. These are verified notebook settings, not a newly rerun fit.

## Citation checks

The [HSGP authors' arXiv record](https://arxiv.org/abs/2004.11408) confirms the basis-function approximation and author list. The [Sahajpal et al. publisher record](https://www.sciencedirect.com/science/article/pii/S016816991400204X) and [PNNL author-institution record](https://www.pnnl.gov/publications/identifying-representative-crop-rotation-patterns-and-grassland-loss-us-western-corn) confirm the use of multi-year CDL sequences to describe rotations. The draft cites this as precedent, not as proof that the project's fixed Hamming rule implements the full RECRUIT algorithm. Bibliography corrections remain the coordinator's responsibility.

## Integration cautions and remaining limits

- A newly noticed source distinction: Task 2 notebook 04 cell 7 computes the overall class table from the **smoothed raster**, but state proportions from the **raw classified metrics Parquet**. The draft avoids state percentages. If the figure includes state statistics, label them raw and do not call them a decomposition of the smoothed overall shares.
- The HSGP figure's `posterior_iqr_25`, `posterior_iqr_75`, `ci_05`, and `ci_95` come from sampled `obs`, not only the latent mean. Label them **posterior predictive intervals for weekly spatial means**, not latent-function credible intervals or uncertainty about individual fields.
- Main-text references to empirical spatial quartiles were removed because the revised figure only shows predictive bands. If spatial quartiles are reinstated elsewhere, the original plotting cell averages the per-year spatial quartiles by DOY; these are not quantiles of pooled individual-cell observations across all years.
- The analysis grid's approximately 556.7 m figure is supported for Task 2 saved area products. Task 1's exact analysis-grid metadata is not established here, so the section deliberately makes no spacing claim.
- Saved HSGP notebook output says it loaded cached statistics, while its current source has `FORCE_RECOMPUTE=True`. The tabulated curves and fit metrics agree with the saved output. This rewrite does not claim a fresh reproduction.
- No supported quantitative claim remains marked unresolved in the draft. Held-out HSGP calibration and field precision are bounded in one closing paragraph. No independent rotation validation is claimed.

## Copy and hygiene pass

Applied the writing kit's substantive → structural → copy → polish sequence. Each section begins with its purpose, connects tools to that purpose, and keeps interpretation next to results. Cut claims of novelty, field-level precision, independent NDVI validation, resilience, and decision-support performance. Avoided invented voice quirks and stock transition language.

Revision after source review: consolidated the phenology cautions into one closing paragraph while retaining methods and numerical results; condensed the peripheral Dirichlet–multinomial diagnostic to two sentences; preserved the raw/smoothed distinction; added the two requested figure macros and verified fitting settings above.

Second writing pass at the coordinator's request: simplified annual crop-mask wording; removed empirical-spatial-quartile material to match the predictive-band-only figure; cut the repeated classifier handoff sentence; removed the peripheral Dirichlet–multinomial paragraph, preserving its correct definition above. All main methods, peak/fit results, deterministic rotation rules, shares, sensitivity results, and figure macros remain.

Exact body word count after the requested further cuts: **764 words** — phenology **336**, rotation **428**. Count excludes section headings, labels, citations, figure-reference commands, and the two figure macros; normalizes TeX nonbreaking spaces and mathematical wrappers; counts whitespace-separated tokens (hyphenated terms and numeric ranges each count once). No captions or tables are present. `git diff --check` passed for both assigned files. Figure macro positions were checked. Full LaTeX build and figure integration belong to the coordinator.

Ready for independent substantive/style review and iterative revision.
