# Paper Review Source of Truth

Working title: NAFSI Predictive Modeling for Agricultural Resilience

Purpose of this file: collect the project story, methods, equations, result numbers, figure references, artifact paths, and rewrite notes in one place before rewriting the paper. This should be treated as a ground-truth briefing document, not polished manuscript prose.

Primary artifacts read:
- `context/*.md`, especially `TASK2_RESULTS.md`, `TASK3_RESULTS.md`, `TASK4_RESULTS.md`, `PROJECT_BRIEF.md`, `DATASETS.md`, `INTERFACES.md`, `STATUS.md`, and `structure.md`
- Current paper PDF: `NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf`
- Current paper source: `artifacts/reports/neurips_2024.tex`
- Results tables under `artifacts/tables/task1`, `artifacts/tables/task2`, `artifacts/tables/task3`, and `artifacts/tables/task4`
- Core code in `src/modeling/rotation_classifier.py`, `src/modeling/rotation_bayesian_dm.py`, `src/modeling/task3_nig_anomaly.py`, `src/preprocessing/task4_panel.py`, and `src/modeling/crop_type_model.py`
- Task configs under `configs/`

Important rewrite warning:
- The current compiled PDF includes `Code Repository: https://github.com/SatrunsDream/Wildfire-Property-Intelligence`, which appears unrelated to this GeoCrop/NAFSI repository and should be corrected or removed.
- The current paper is structurally useful but reads as a dense technical report pasted into a NeurIPS template. The rewrite should preserve the strong methods/results but make the narrative tighter, cleaner, and more credible.

## 1. One-Sentence Project Thesis

This project builds a reproducible geospatial pipeline for the 13-state U.S. Corn Belt that combines USDA CDL crop labels, MODIS NDVI phenology, and SMAP L4 soil moisture to analyze crop phenology, rotation behavior, hydrologic anomalies, and crop-type predictability.

Best concise pitch:

> We show that a shared CDL-NDVI-SMAP data spine can support four linked agricultural resilience analyses: Bayesian NDVI phenology, crop rotation mapping, Bayesian soil-moisture anomaly detection, and LightGBM crop-type prediction with interpretable ablations.

## 2. Study Area, Data Spine, and Preprocessing

Study area:
- 13-state U.S. Corn Belt: Illinois, Indiana, Iowa, Kansas, Kentucky, Michigan, Minnesota, Missouri, Nebraska, North Dakota, Ohio, South Dakota, Wisconsin.
- Common CRS: EPSG:5070, NAD83 / CONUS Albers Equal Area.
- Current analysis grid is coarse relative to native CDL: metadata for Task 2 areal export reports approximate grid resolution of 556.7 m and pixel area of 30.9876 ha.

Datasets:
- CDL: USDA NASS Cropland Data Layer, annual 30 m categorical crop/land-cover rasters. Used for crop labels, crop masks, multi-year history, rotation sequences, and test labels.
- MODIS NDVI: CropSmart weekly composites at 250 m. Values are scaled by dividing raw values by 250 to get physical NDVI range.
- SMAP L4 surface soil moisture: weekly, native approx. 9 km. Used for anomaly detection and crop mapping features.
- TIGER/Line boundaries: state/county overlays for maps and zonal summaries.

Data pipeline:
- Download raw GeoTIFFs: `scripts/download_data.py`
- Build interim NetCDF stacks: `scripts/build_interim_data.py`
- Convert to wide Parquet + JSON sidecars: `scripts/process_interim_to_parquet.py`
- Processed table convention: one row per `(iy, ix)` pixel; CDL columns are `cdl_{year}`; NDVI/SMAP weekly columns are `w000`, `w001`, etc.

Core interface docs:
- `context/DATASETS.md`
- `context/INTERFACES.md`
- `README.md`

## 3. Current Paper Structure and High-Level Assessment

Current paper sections:
- Abstract
- Introduction and Motivation
- Data
- Methodology
- Results
- Discussion and Conclusion

What is strong:
- The technical work is real and broad: four tasks, multiple datasets, reproducible configs, many saved artifacts.
- Bayesian framing is a nice unifying theme: HSGP for phenology, Dirichlet-Multinomial for rotation uncertainty, NIG for soil-moisture anomaly uncertainty.
- Task 4 has a good evaluation story: temporal holdout, ablation, SHAP, confusion matrix, regime stratification.

What needs rewriting:
- The paper is overstuffed. It tries to explain every implementation detail instead of selecting the most persuasive evidence.
- Some numbers/wording should be checked against dated artifacts, especially Task 2 raw vs smoothed shares.
- The abstract is too long and result-heavy. It should state contribution, method, and headline outcomes without becoming a mini report.
- The data section says "resampled to a shared 250 m pixel grid" in the paper, while Task 2/4 metadata describe approx. 557 m cells for current outputs. Resolve this before final paper.
- The current paper uses conference-template language ("NeurIPS 2024") that may not be appropriate for the challenge submission.
- The repo URL in the PDF appears wrong.

## 4. Recommended Rewrite Shape

Suggested story order:
1. Motivation: agricultural resilience needs interpretable, spatially explicit monitoring from public data.
2. Shared data spine: CDL + NDVI + SMAP aligned into a reproducible pixel-year/week table system.
3. Four linked modules:
   - phenology: what crops look like through NDVI
   - rotations: how crop sequences behave over a decade
   - extremes: where soil moisture deviates under flood/drought
   - prediction: how well multi-source features classify crop type in a held-out year
4. Results: organize by question, not by every notebook.
5. Synthesis: each earlier task informs the supervised prediction model and the resilience interpretation.
6. Limitations: scale mismatch, short SMAP baseline, CDL labels as ground truth, temporal holdout but no spatial CV.

Potential new abstract arc:
- Sentence 1: Public satellite and crop-label products can support crop resilience analysis but require careful temporal/spatial integration.
- Sentence 2: We build a reproducible pipeline across the 13-state Corn Belt using CDL, MODIS NDVI, and SMAP L4.
- Sentence 3: We extract Bayesian NDVI phenology, rule-based and Bayesian crop-rotation metrics, NIG soil-moisture anomalies, and a LightGBM crop classifier.
- Sentence 4: Headline results: Task 1 RMSE 0.018-0.023; Task 2 27.36% regular, 3.90% monoculture, 68.74% irregular on smoothed eligible grid; Task 3 captures 2019 wet and 2022 dry anomalies; Task 4 79.2% OA and macro F1 0.791.
- Sentence 5: Main insight: NDVI adds most predictive value beyond CDL history; SMAP is more useful for anomaly interpretation than crop discrimination at coarse resolution.

## 5. Task 1: NDVI Phenology

Research question:
- How do corn, soybean, and winter wheat NDVI phenologies differ across the Corn Belt?

Inputs:
- CDL crop labels: corn code 1, soybean code 5, winter wheat code 24.
- MODIS NDVI weekly composites.
- Config: `configs/task1_ndvi_analysis.yaml`
- Notebooks:
  - `notebooks/task1_ndvi_timeseries/01_data_ingestion_cdl_ndvi.ipynb`
  - `notebooks/task1_ndvi_timeseries/02_ndvi_phenology_multi_year_cdl.ipynb`
  - `notebooks/task1_ndvi_timeseries/03_ndvi_phenology_hsgp_bayesian.ipynb`

Method:
- Merge CDL and NDVI by pixel coordinates `(iy, ix)`.
- Filter to target crops.
- Compute weekly mean and IQR NDVI by crop and year.
- Convert week index to day-of-year.
- Scale raw NDVI values by 250.
- Fit separate Hilbert Space Gaussian Process (HSGP) seasonal curves by crop.

Core model:
```text
NDVI(t) = mu + f(t) + epsilon
f ~ GP(0, k_SE)
epsilon ~ Normal(0, sigma^2)

k_SE(t, t') = alpha^2 * exp(-(t - t')^2 / (2 * ell^2))
```

HSGP approximation:
- Uses `m = 25` basis functions.
- Domain half-width: `L = 1.3 * max(|t - mean(t)|)`.
- Inference: stochastic variational inference with AutoNormal guide, Adam learning rate 0.005, 8000 steps.

Priors as described in current paper:
- `mu ~ Normal(0.65, 0.25)`
- `alpha ~ HalfNormal(0.4)`
- `ell ~ LogNormal(log(25), 0.5)`
- `sigma ~ HalfNormal(0.1)`

Actual Task 1 evaluation results from `artifacts/tables/task1/model_evaluation.csv`:
- Corn: n_obs 535, RMSE 0.0194, MAE 0.0146, 50% coverage 0.5944, 90% coverage 0.9009, mean CRPS 0.0107.
- Soy: n_obs 535, RMSE 0.0183, MAE 0.0141, 50% coverage 0.5664, 90% coverage 0.9121, mean CRPS 0.0101.
- Wheat: n_obs 535, RMSE 0.0232, MAE 0.0184, 50% coverage 0.5140, 90% coverage 0.9103, mean CRPS 0.0131.

Phenology claims in current paper discussion:
- Corn peaks around NDVI 0.930 near DOY 204.
- Soy peaks around NDVI 0.938 near DOY 226.
- Winter wheat peaks around NDVI 0.804 near DOY 147.
- These values should be verified from `hsgp_posterior_phenology.csv` or derived peak table before finalizing.

Key figures:
- `artifacts/figures/task1/hsgp_phenology_crops.png`: smooth crop-specific posterior NDVI curves.
- `artifacts/figures/task1/hsgp_phenology_corn_vs_soy.png`: direct corn vs soy comparison.
- `artifacts/figures/task1/phenological_features_by_year.png`: interannual phenology features.
- `artifacts/figures/task1/calibration_diagnostics.png`: PIT/coverage/residual/CRPS-style model diagnostics.

Code references:
- HSGP logic appears in notebooks, especially `03_ndvi_phenology_hsgp_bayesian.ipynb`.
- Config lives in `configs/task1_ndvi_analysis.yaml`.

Writing angle:
- Do not over-explain HSGP in the main text. Explain why it is used: smooth seasonal curves with uncertainty and lower computational cost than exact GP.
- Keep equations but move SVI implementation details to a short paragraph.
- Emphasize agricultural interpretation: wheat is earlier/cool-season; corn and soy overlap but differ in peak timing and seasonal shape.

## 6. Task 2: Crop Rotation Pattern Identification

Research question:
- What spatial patterns of crop rotation exist over a 10-year CDL sequence?

Inputs:
- CDL 2015-2024.
- Rotation-eligible pixels: at least 5 years as corn or soybean for metrics; strict regular rule requires at least 7 corn/soy years.
- Config: `configs/task2_crop_rotation.yaml`
- Notebooks:
  - `notebooks/task2_crop_rotation/01_cdl_timeseries_loading.ipynb`
  - `notebooks/task2_crop_rotation/02_rotation_metrics_computation.ipynb`
  - `notebooks/task2_crop_rotation/03_rotation_classification.ipynb`
  - `notebooks/task2_crop_rotation/04_spatial_maps_and_areal_export.ipynb`

Primary denominator:
- 2,084,112 rotation-eligible pixels in the 13-state run.
- Current areal metadata: approx. 556.7 m grid cells, 30.9876 ha per cell.

Core metrics:

1. Alternation score:
```text
A_p = (1 / valid adjacent corn/soy transitions) *
      sum_t 1[{c_t, c_{t+1}} = {corn, soy}]
```
- In code, denominator counts only valid adjacent transitions where both years are corn or soy.
- Implemented in `src/modeling/rotation_classifier.py` as `alternation_score` and `alternation_score_batch`.

2. Pattern edit distance:
```text
d_p = min over canonical patterns sum_t 1[c_t != p*_t]
```
- Canonical patterns are corn-soy alternating and soy-corn alternating over length 10.
- Implemented as Hamming distance in `pattern_edit_distance`.

3. Maximum run length:
```text
R_p = longest consecutive run of identical crop code
```
- Implemented as `max_run_length`.

4. Shannon entropy:
```text
H_p = - sum_k pi_k * log2(pi_k)
```
- Implemented as `shannon_entropy`.

5. Crop share:
- Fraction of years occupied by modal crop code.

Rule-based classes:
- Code 0 = regular rotation.
- Code 1 = monoculture.
- Code 2 = irregular.

Rule order in code:
- Monoculture first: `max_run_length >= 7` or `crop_share >= 0.80`.
- Regular second: `alternation_score >= 0.70`, `pattern_distance <= 3`, `n_cornsoy >= 7`, and not monoculture.
- Everything else: irregular.

Important paper nuance:
- The current paper text sometimes says regular is checked before monoculture. The code applies monoculture first. This should be described accurately.

Bayesian Dirichlet-Multinomial uncertainty layer:
- Code: `src/modeling/rotation_bayesian_dm.py`
- Each pixel gets a 3x3 transition count matrix with states 0=corn, 1=soy, 2=other.
- Independent Dirichlet posteriors are used for transition rows.
- Default prior: Jeffreys pseudo-count 0.5 per transition category.
- Monte Carlo draws: 256 per pixel.
- Alternation proxy:
```text
alt_draw = (P(corn -> soy) + P(soy -> corn)) / 2
dm_p_regular = fraction of posterior draws where alt_draw >= 0.70
dm_alt_posterior_std = posterior std of alt_draw
```
- This is not the same thing as probability of class 0 under the full deterministic rules. It only measures transition-based alternation uncertainty.

Actual Task 2 results:
- Smoothed areal class summary from `artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv`:
  - Regular rotation: 570,202 pixels, 17,669,192.4 ha, 27.36%.
  - Monoculture: 81,308 pixels, 2,519,539.9 ha, 3.90%.
  - Irregular: 1,432,602 pixels, 44,392,900.1 ha, 68.74%.
- Raw primary YAML classification is approximately 28% regular, 6% monoculture, 66% irregular.
- Use smoothed values for map/areal headline; use raw values for threshold/grid discussion.

Markov transition probabilities from `artifacts/tables/task2/task2__markov_transition_probs.csv`:
```text
from corn  -> corn 0.307915, soy 0.554221, other 0.137864
from soy   -> corn 0.599573, soy 0.237948, other 0.162479
from other -> corn 0.339043, soy 0.299798, other 0.361159
```

Threshold sensitivity from `artifacts/tables/task2/task2__threshold_sensitivity_grid.csv`:
- At alternation_min 0.70, pattern_dist_max 3: 28.15% regular, 6.04% monoculture, 65.81% irregular.
- At 0.70, 6: 39.37% regular.
- At 0.50, 5: 56.58% regular.
- At 0.50, 6: 60.33% regular.
- Monoculture stays fixed at 6.04% across the grid because the monoculture rule is orthogonal to the regularity threshold sweep.

Per-state rotation shares from `artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv`:
- Illinois: 40.35% regular, 5.07% monoculture, 54.58% irregular.
- Iowa: 39.87% regular, 6.93% monoculture, 53.20% irregular.
- Nebraska: 27.13% regular, 11.96% monoculture, 60.91% irregular.
- North Dakota: 11.29% regular, 2.81% monoculture, 85.90% irregular.
- Wisconsin: 13.55% regular, 5.45% monoculture, 81.00% irregular.

Bayesian DM aggregate from context:
- `dm_p_regular` mean approx. 0.23, median approx. 0.11, IQR approx. [0.02, 0.38].
- About 17.2% of pixels exceed 0.5 posterior P(regular).
- Median `dm_alt_posterior_std` approx. 0.134.

Key figures:
- `artifacts/figures/task2/task2__ncornsoy_histogram.png`: eligibility cutoff.
- `artifacts/figures/task2/task2__markov_corn_soy_other.png`: Markov transition heatmap.
- `artifacts/figures/task2/task2__metric_histograms.png`: distributions of rotation metrics.
- `artifacts/figures/task2/task2__alt_vs_distance.png`: alternation vs distance.
- `artifacts/figures/task2/task2__threshold_sensitivity_regular_pct.png`: regular percentage under threshold sweep.
- `artifacts/figures/task2/task2__rotation_map__raw__20260412.png`: raw map.
- `artifacts/figures/task2/task2__rotation_map__smoothed__20260412.png`: smoothed map.
- `artifacts/figures/task2/task2__rotation_map__core_belt__20260412.png`: IA/IL/IN/NE zoom.
- `artifacts/figures/task2/task2__per_state_rotation_classes.png`: state shares.
- `artifacts/figures/task2/task2__rotation_dm_p_regular__20260412.png`: posterior P(regular).
- `artifacts/figures/task2/task2__rotation_dm_alt_posterior_std__20260412.png`: posterior uncertainty.
- County choropleths: `task2__rotation_class_by_county__20260412.png` and `task2__rotation_class_by_county_core4__20260412.png`.

Writing angle:
- The key story is not "most fields rotate regularly." The strict metric says most eligible pixels are irregular under a hard 10-year alternation template.
- This is still valuable: it shows spatial heterogeneity and sensitivity to definition.
- Use threshold sensitivity to avoid overclaiming: strict regular is 27-28%, but relaxed definitions reach 56-60%.
- Use the Bayesian DM layer as an innovation/uncertainty add-on, not as a replacement for the class map.

## 7. Task 3: SMAP Soil Moisture Anomaly Detection

Research question:
- Where and when did soil moisture anomalies occur during the 2019 Midwest flood and 2022 Plains drought?

Inputs:
- SMAP L4 weekly surface soil moisture.
- Baseline years: 2015-2021.
- Events:
  - `midwest_flood_2019`: 2019-04-01 to 2019-07-31, 18 weeks, wet-above duration mode with z > 1.5.
  - `plains_drought_2022`: 2022-06-01 to 2022-08-31, 13 weeks, dry-below duration mode with z < -1.5.
- Spatial footprint: same approx. 2.08M rotation-eligible pixels as Task 2.
- Config: `configs/task3_soil_moisture.yaml`
- Notebooks:
  - `notebooks/task3_soil_moisture/01_pixel_panel_smap_cdl.ipynb`
  - `notebooks/task3_soil_moisture/02_climatology_and_anomalies.ipynb`
  - `notebooks/task3_soil_moisture/03_maps_timeseries_tables.ipynb`

Frequentist baseline:
```text
z = (observed - mean_baseline) / std_baseline
```
- Computed per pixel and ISO week.
- Z-scores are clipped to +/-5 in the pipeline.

Normal-Inverse-Gamma model:
- Code: `src/modeling/task3_nig_anomaly.py`
- Goal: account for uncertainty in the weekly baseline mean and variance when only 5-7 baseline observations are available.

Prior:
- `mu_0`: regional grand mean for each ISO week.
- `lambda_0 = 1.0`
- `alpha_0 = 2.0`
- `beta_0 = regional_var(week) * (alpha_0 - 0.5)`

Posterior update for baseline sample size n, sample mean xbar, sample std s:
```text
lambda_n = lambda_0 + n
mu_n = (lambda_0 * mu_0 + n * xbar) / lambda_n
alpha_n = alpha_0 + n / 2
beta_n = beta_0 + ((n - 1) * s^2) / 2
         + (n * lambda_0 * (xbar - mu_0)^2) / (2 * lambda_n)
```

Posterior predictive:
```text
x_new | data ~ StudentT(df = 2 * alpha_n,
                        loc = mu_n,
                        scale = sqrt(beta_n * (1 + 1/lambda_n) / alpha_n))
```

Anomaly scores:
- `nig_p_anomaly`: two-tailed p-value; near 0 means extreme in either direction.
- `nig_p_drought`: one-tailed CDF; near 0 means very dry, near 1 means very wet.
- `nig_posterior_scale`: predictive std; larger means more epistemic uncertainty.
- `nig_df`: degrees of freedom.

Aggregate Task 3 results from `context/TASK3_RESULTS.md`:
- Median posterior df: 11.0.
- Median predictive scale: 0.0454 m^3/m^3.
- 2019 flood median NIG P(drought): 0.817; two-tailed p < 0.05 fraction 0.2%.
- 2022 drought median NIG P(drought): 0.292; two-tailed p < 0.05 fraction 4.9%.

2019 Midwest flood state/crop highlights from `artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv`:
- South Dakota soybean: mean z 1.1618, frac z > 1.5 = 23.76%, mean NIG P(drought) 0.8537.
- South Dakota corn: mean z 1.1588, frac z > 1.5 = 23.93%, mean NIG P(drought) 0.8512.
- Minnesota corn: mean z 1.0065, frac z > 1.5 = 15.05%, mean NIG P(drought) 0.8089.
- Iowa corn: mean z approx. 0.914, frac z > 1.5 approx. 17.8%, mean NIG P(drought) approx. 0.803.
- Iowa soybean: mean z approx. 0.909, frac z > 1.5 approx. 18.0%, mean NIG P(drought) approx. 0.801.

2022 Great Plains drought highlights from `artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv`:
- Kentucky winter wheat: mean z -1.5715, mean NIG P(drought) 0.2340, frac P(drought) < 0.1 = 41.96%.
- Kentucky corn: mean z -1.3373, mean NIG P(drought) 0.2812, frac P(drought) < 0.1 = 37.10%.
- Kentucky soybean: mean z -1.2500, mean NIG P(drought) 0.2980, frac P(drought) < 0.1 = 35.23%.
- Kansas winter wheat: mean z -1.0602, mean NIG P(drought) 0.2547, frac P(drought) < 0.1 = 41.65%.
- Nebraska soybean: mean z -1.0514, mean NIG P(drought) 0.2391, frac P(drought) < 0.1 = 40.54%.
- Nebraska corn: mean z -1.0213, mean NIG P(drought) 0.2378, frac P(drought) < 0.1 = 36.99%.
- North Dakota soybean is wet/positive during the 2022 event: mean z 0.2859, mean NIG P(drought) 0.5466.

Processed data artifacts:
- `data/processed/task3/task3_pixel_panel.parquet`: 2,084,112 rows.
- `data/processed/task3/smap_climatology.parquet`: approx. 45.8M rows.
- `data/processed/task3/smap_anomaly_midwest_flood_2019.parquet`: 37,514,016 pixel-weeks.
- `data/processed/task3/smap_anomaly_plains_drought_2022.parquet`: 27,093,456 pixel-weeks.

Key figures:
- `artifacts/figures/task3/task3__midwest_flood_2019__anomaly_map_4panel__20260412.png`
- `artifacts/figures/task3/task3__midwest_flood_2019__anomaly_timeseries_cropland__20260412.png`
- `artifacts/figures/task3/task3__midwest_flood_2019__duration_fraction__20260412.png`
- `artifacts/figures/task3/task3__midwest_flood_2019__nig_p_drought_4panel__20260412.png`
- `artifacts/figures/task3/task3__midwest_flood_2019__nig_uncertainty__20260412.png`
- `artifacts/figures/task3/task3__midwest_flood_2019__zscore_vs_nig_scatter__20260412.png`
- `artifacts/figures/task3/task3__plains_drought_2022__anomaly_map_4panel__20260412.png`
- `artifacts/figures/task3/task3__plains_drought_2022__anomaly_timeseries_cropland__20260412.png`
- `artifacts/figures/task3/task3__plains_drought_2022__duration_fraction__20260412.png`
- `artifacts/figures/task3/task3__plains_drought_2022__nig_p_drought_4panel__20260412.png`
- `artifacts/figures/task3/task3__plains_drought_2022__nig_uncertainty__20260412.png`
- `artifacts/figures/task3/task3__plains_drought_2022__zscore_vs_nig_scatter__20260412.png`

Writing angle:
- This is one of the cleanest methodological contributions. The NIG framework is simple, closed-form, and well matched to the short SMAP baseline problem.
- Explain the z-score first, then say why it is insufficient with only seven years.
- The practical interpretation is strong: P(drought) is percentile-like and directly interpretable.
- Avoid claiming "first published application" unless you are comfortable defending a literature search. Safer phrasing: "a lightweight conjugate Bayesian alternative to z-score anomaly scoring."

## 8. Task 4: Crop-Type Prediction

Research question:
- Can crop type be predicted from multi-year CDL history, NDVI phenology, and SMAP soil moisture?

Inputs:
- CDL history and current-year labels.
- NDVI weekly phenology features.
- SMAP growing-season and spring soil moisture features.
- Rotation metrics/regime for stratified evaluation.
- Config: `configs/task4_crop_mapping.yaml`
- Notebooks:
  - `notebooks/task4_crop_mapping/01_feature_panel_construction.ipynb`
  - `notebooks/task4_crop_mapping/02_model_training_and_ablation.ipynb`
  - `notebooks/task4_crop_mapping/02b_hyperparameter_tuning.ipynb`
  - `notebooks/task4_crop_mapping/03_feature_importance_and_regime_analysis.ipynb`
  - `notebooks/task4_crop_mapping/04_spatial_maps_and_discussion.ipynb`

Target classes:
- 0 = other cropland, CDL codes 1-61 excluding corn, soybean, winter wheat.
- 1 = corn, CDL code 1.
- 2 = soybean, CDL code 5.
- 3 = winter wheat, CDL code 24.

Split:
- Train: 2013-2021, 4,500,000 rows.
- Validation: 2022, 500,000 rows.
- Test: 2023, 500,000 rows.
- Each year uses stratified sample of 500,000 pixels, 125,000 per class.

Model:
- LightGBM multiclass classifier.
- Code: `src/modeling/crop_type_model.py`
- Hyperparameters from `configs/task4_crop_mapping.yaml`:
  - `n_estimators = 500`
  - `learning_rate = 0.05`
  - `max_depth = 7`
  - `num_leaves = 63`
  - `subsample = 0.8`
  - `colsample_bytree = 0.8`
  - `is_unbalance = true`
  - `random_state = 42`
  - early stopping = 50 rounds.

Feature engineering:
- Code: `src/preprocessing/task4_panel.py`

CDL history features:
- `cdl_t1` to `cdl_t5`
- transition counts: `n_corn_to_soy`, `n_soy_to_corn`, `n_corn_corn`, `n_soy_soy` in code, though result docs summarize transition counts as 3 groups.
- `time_since_last_corn`, `time_since_last_soy`
- `frac_years_corn`, `frac_years_soy`
- `max_run_length`
- `alternation_score`
- `pattern_distance`
- `sequence_entropy`
- `neigh_frac_corn`, `neigh_frac_soy`
- `rotation_regime` used for stratified evaluation, not model input.

NDVI features:
- `ndvi_base`
- `ndvi_peak`
- `ndvi_amplitude`
- `ndvi_mean`
- `ndvi_integral`
- `ndvi_peak_week`
- `ndvi_greenup_week`
- `ndvi_greenup_slope`
- `ndvi_early_mean`, `ndvi_mid_mean`, `ndvi_late_mean`
- `ndvi_peak_hist_mean`, `ndvi_peak_hist_std`
- `ndvi_peak_week_hist_mean`, `ndvi_peak_week_hist_std`

SMAP features:
- `smap_mean_gs`
- `smap_spring_sm`
- `smap_pct_wet_weeks` in code; result docs sometimes call this `smap_frac_wet_weeks`.
- `smap_pct_dry_weeks` in code; result docs sometimes call this `smap_frac_dry_weeks`.
- For final paper, use the actual code/table names or define aliases consistently.

Ablations from `artifacts/tables/task4/task4_ablation_results.csv`:
- A, CDL only, 19 features: accuracy 0.805894, macro F1 0.808039.
- B, CDL + NDVI, 34 features: accuracy 0.823280, macro F1 0.824483.
- C, CDL + SMAP, 23 features: accuracy 0.806576, macro F1 0.808649.
- D, CDL + NDVI + SMAP, 38 features: accuracy 0.822626, macro F1 0.823913.

Value-add:
- NDVI over CDL-only: +1.7386 percentage points accuracy, +1.6444 pp macro F1.
- SMAP over CDL-only: +0.0682 pp accuracy, +0.0610 pp macro F1.
- Full model over CDL-only: +1.6732 pp accuracy, +1.5874 pp macro F1.
- Key conclusion: NDVI is the primary added predictive signal; SMAP adds little for crop discrimination at this grid/resolution.

Final test metrics from `artifacts/tables/task4/task4__test_metrics__20260413.json`:
- Overall accuracy: 0.792056.
- Macro F1: 0.791448.
- Per-class F1:
  - other cropland: 0.892613.
  - corn: 0.725955.
  - soybean: 0.734708.
  - winter wheat: 0.812517.

Test confusion matrix, rows true and columns predicted:
```text
                other   corn    soy   wheat
true other     111765   3265   1801    8169
true corn        4751  97694   9894   12661
true soy         4748  30935  81305    8012
true wheat       4158  12252   3326  105264
```

Main confusion:
- Soybean predicted as corn: 30,935.
- Corn predicted as soybean: 9,894.
- Corn-soy confusion is the dominant error mode.

Rotation-regime stratified metrics from `artifacts/tables/task4/task4_regime_stratified_metrics.csv`:
- Irregular: 310,108 pixels, accuracy 0.709198, macro F1 0.657560.
- Monoculture: 124,318 pixels, accuracy 0.955453, macro F1 0.801708.
- Regular: 65,574 pixels, accuracy 0.874127, macro F1 0.558732.
- Interpretation: monoculture is easiest because history is near-deterministic; irregular is hardest because sequence history is less predictive; regular has strong corn/soy F1 but low macro F1 due to rarity of other/wheat in that stratum.

Top SHAP features from `artifacts/tables/task4/task4_shap_feature_importance.csv`:
1. `cdl_t1`: 0.454836
2. `ndvi_mid_mean`: 0.436564
3. `ndvi_peak_week`: 0.424018
4. `ndvi_late_mean`: 0.362489
5. `ndvi_early_mean`: 0.354104
6. `ndvi_peak`: 0.239505
7. `cdl_t5`: 0.224989
8. `smap_mean_gs`: 0.195756
9. `ndvi_integral`: 0.192334
10. `time_since_last_soy`: 0.166393

Key figures:
- `artifacts/figures/task4/task4_class_distribution.png`
- `artifacts/figures/task4/task4_rotation_regimes.png`
- `artifacts/figures/task4/task4_missing_values.png`
- `artifacts/figures/task4/task4_feature_violins.png`
- `artifacts/figures/task4/task4_feature_correlation.png`
- `artifacts/figures/task4/task4_ablation_comparison.png`
- `artifacts/figures/task4/task4_confusion_matrices.png`
- `artifacts/figures/task4/task4_test_confusion_matrix.png`
- `artifacts/figures/task4/task4_shap_importance.png`
- `artifacts/figures/task4/task4_shap_beeswarm.png`
- `artifacts/figures/task4/task4_regime_comparison.png`
- `artifacts/figures/task4/task4_regime_confusion_matrices.png`
- `artifacts/figures/task4/task4_crop_maps_pred_vs_true.png`
- `artifacts/figures/task4/task4_agreement_map.png`

Writing angle:
- Task 4 should be the anchor of the "predictive modeling" paper if the title keeps "predictive."
- Make the ablation the central evidence for why multi-source data matter.
- Be honest that SMAP is valuable for event anomaly analysis but weak as crop-type predictor at 9 km native resolution.
- The strongest single result is not just 79.2% accuracy; it is the combination of temporal holdout, ablation, SHAP, and rotation-regime stratification.

## 9. Cross-Task Synthesis

Best integrated story:
- Task 1 characterizes crop phenology and justifies using NDVI timing/shape features in Task 4.
- Task 2 converts CDL history into rotation structure and provides both features and evaluation strata for Task 4.
- Task 3 demonstrates that SMAP soil moisture can identify hydrologic stress and offers an uncertainty-aware anomaly layer.
- Task 4 combines CDL history, NDVI phenology, and SMAP soil context to predict crop type and quantify each data source's value.

Strong synthesis claims:
- Prior-year CDL is the strongest predictor of crop type, showing persistence in agricultural decision-making.
- NDVI adds real predictive signal by capturing within-season phenology not present in CDL history.
- SMAP adds limited crop-type discrimination but provides strong event-level resilience diagnostics.
- Irregular rotations are the hardest prediction setting, confirming why rotation context matters for model evaluation.

Avoid overclaiming:
- Do not claim field-level accuracy; the analysis grid is coarse relative to fields.
- Do not claim independent ground truth; CDL is both feature source and label source in several places.
- Do not claim spatial generalization; no spatial block CV was run.
- Do not claim causal impacts of flood/drought on yields; Task 3 quantifies soil moisture anomalies, not yield losses.

## 10. Limitations To Include

Must include:
- Resolution mismatch: CDL 30 m, NDVI 250 m, SMAP approx. 9 km; current analysis grid approx. 557 m.
- Mixed-pixel effects and boundary noise, especially for CDL-derived labels and NDVI aggregation.
- SMAP baseline is short: 2015-2021 gives only seven years, and some pixel-week baselines have fewer valid observations.
- SMAP is a model-assimilation product; anomalies reflect modeled soil moisture, not direct field measurements.
- CDL labels are treated as ground truth but contain classification errors and year/crop-specific uncertainty.
- Temporal holdout does not prove spatial transferability.
- "Other cropland" is heterogeneous and not agronomically uniform.
- Task 2 thresholds are defensible but definition-sensitive; sensitivity grid should be shown or discussed.

Optional limitations:
- No full hyperparameter tuning in final reported Task 4 results, although `02b_hyperparameter_tuning.ipynb` exists.
- No independent yield or crop insurance loss validation.
- No soil, irrigation, precipitation, GDD, or field-boundary features in the final model.

## 11. Best Figures To Use In A Rewritten Paper

If the rewritten paper needs to be concise, use these:

1. Pipeline/data spine diagram
- Current paper has methods flowcharts in LaTeX, but a cleaner custom diagram may be better.
- Goal: show raw data -> processed Parquet -> Tasks 1-4 -> artifacts.

2. Task 1 phenology figure
- `artifacts/figures/task1/hsgp_phenology_crops.png`
- Shows seasonal separability of crops.

3. Task 2 rotation map or state bar chart
- Main: `artifacts/figures/task2/task2__rotation_map__smoothed__20260412.png`
- Alternative/companion: `artifacts/figures/task2/task2__per_state_rotation_classes.png`
- If space permits: threshold sensitivity `task2__threshold_sensitivity_regular_pct.png`.

4. Task 3 two-event figure pair
- Use one flood and one drought figure.
- Best: NIG P(drought) 4-panel maps for 2019 and 2022, or z-score/NIG scatter for methodology.

5. Task 4 ablation bar chart
- `artifacts/figures/task4/task4_ablation_comparison.png`
- This is essential for the predictive-modeling claim.

6. Task 4 confusion matrix
- `artifacts/figures/task4/task4_test_confusion_matrix.png`
- Shows where the classifier succeeds/fails.

7. Task 4 SHAP importance
- `artifacts/figures/task4/task4_shap_importance.png`
- Supports interpretability claim.

8. Task 4 regime performance
- `artifacts/figures/task4/task4_regime_comparison.png`
- Supports the irregular-rotation narrative.

If limited to 4 figures:
- Pipeline diagram
- Task 1 phenology curves
- Task 3 flood/drought anomaly maps
- Task 4 ablation + SHAP or confusion matrix composite

## 12. Tables To Preserve

High-value tables:
- Dataset summary table: CDL/NDVI/SMAP resolution, temporal coverage, role.
- Task 1 model evaluation: RMSE/MAE/coverage/CRPS.
- Task 2 class shares: regular/monoculture/irregular and maybe state extremes.
- Task 3 event summaries: median P(drought), p<0.05 fraction, top affected state/crop.
- Task 4 ablation table.
- Task 4 test metrics/confusion matrix or per-class F1.

Likely too much for main paper:
- Full Task 2 per-state table.
- Full Task 3 state x crop table.
- Full top-20 SHAP table.
- Long feature list tables. Summarize feature groups instead.

## 13. Code and Artifact Crosswalk

Task 1:
- Config: `configs/task1_ndvi_analysis.yaml`
- Notebooks: `notebooks/task1_ndvi_timeseries/`
- Tables: `artifacts/tables/task1/`
- Figures: `artifacts/figures/task1/`

Task 2:
- Config: `configs/task2_crop_rotation.yaml`
- Core code: `src/modeling/rotation_classifier.py`, `src/modeling/rotation_bayesian_dm.py`
- Notebooks: `notebooks/task2_crop_rotation/`
- Tables: `artifacts/tables/task2/`, plus Task 2 areal exports under `artifacts/tables/task4/`
- Figures: `artifacts/figures/task2/`

Task 3:
- Config: `configs/task3_soil_moisture.yaml`
- Core code: `src/modeling/task3_nig_anomaly.py`, `src/modeling/task3_smap_anomalies.py`, `src/modeling/task3_aggregate.py`, `src/viz/task3_maps.py`
- Notebooks: `notebooks/task3_soil_moisture/`
- Tables: `artifacts/tables/task3/`
- Figures: `artifacts/figures/task3/`

Task 4:
- Config: `configs/task4_crop_mapping.yaml`
- Core code: `src/preprocessing/task4_panel.py`, `src/modeling/crop_type_model.py`, `src/viz/prediction_maps.py`
- Notebooks: `notebooks/task4_crop_mapping/`
- Model: `artifacts/models/task4/crop_type_model.joblib`
- Tables: `artifacts/tables/task4/`
- Figures: `artifacts/figures/task4/`

Report:
- Current source: `artifacts/reports/neurips_2024.tex`
- Current compiled PDF: `NAFSI_Predictive_Modeling_for_Agricultural_Resilience.pdf`
- Bibliography: `artifacts/reports/references.bib`

## 14. Specific Rewrite Fix List

Content fixes:
- Correct/remove wrong repository URL in PDF.
- Resolve grid-resolution statement: current outputs say approx. 557 m, while paper says shared 250 m grid.
- Confirm whether CDL years should be described as 2008-2025 globally or task-specific windows: Task 2 uses 2015-2024, Task 4 uses history around 2013-2023.
- Describe Task 2 rule order according to code: monoculture screen first, then regular, then irregular.
- Make raw vs smoothed Task 2 percentages explicit.
- Use `smap_pct_wet_weeks` / `smap_pct_dry_weeks` or `smap_frac_*` consistently.
- Avoid "first published application" unless supported by literature search.
- Clarify that Task 4 labels are CDL-derived, not independent field-survey labels.
- Remove "No AI-generated prose" conflict from final paper if this rewrite process uses AI assistance; at minimum do not include that statement in the manuscript.

Style fixes:
- Shorten introduction by half.
- Move long method implementation details into appendix or compress.
- Reduce equation count if page-limited; keep only the HSGP model, rotation metrics, NIG posterior predictive, and maybe LightGBM feature-group definition.
- Use one consistent term: "Corn Belt" rather than alternating "CONUS" when the actual analysis is 13-state.
- Replace vague claims like "strong" with artifact-backed values.

Narrative fixes:
- Put the predictive model and ablation earlier in the results if the title remains "Predictive Modeling."
- Use Task 1-3 as supporting modules feeding interpretability and resilience context.
- Make limitations feel integrated, not apologetic.

## 15. Candidate Final Paper Outline

Title:
- "Interpretable Multi-Source Remote Sensing for Crop Phenology, Rotation, Soil Moisture Extremes, and Crop-Type Prediction"
- Or keep: "Predictive Modeling for Agricultural Resilience with CDL, MODIS NDVI, and SMAP"

Abstract:
- 150-220 words.
- Include 4 headline numbers max.

1. Introduction
- Food/agriculture resilience motivation.
- Public remote-sensing products are rich but fragmented.
- Contribution: one reproducible data spine + four linked analyses.

2. Data and Study Area
- 13-state Corn Belt.
- CDL, NDVI, SMAP table.
- Alignment and Parquet representation.

3. Methods
- 3.1 NDVI phenology with HSGP.
- 3.2 CDL rotation metrics and DM uncertainty.
- 3.3 SMAP z-score and NIG anomaly scoring.
- 3.4 LightGBM crop-type prediction, feature groups, temporal split, ablations.

4. Results
- 4.1 Phenology separation and calibration.
- 4.2 Rotation geography and sensitivity.
- 4.3 Flood/drought soil-moisture anomalies.
- 4.4 Crop prediction performance, ablation, SHAP, and regime stratification.

5. Discussion
- Cross-task synthesis.
- Why NDVI matters more than SMAP for crop labels.
- Why SMAP matters more for resilience/external stress monitoring.
- Rotation irregularity as a performance stress test.

6. Limitations and Future Work
- Scale, labels, validation, baseline length, spatial CV, weather/soil features, hyperparameter tuning.

7. Conclusion
- One paragraph returning to reproducible public-data pipeline and actionable crop resilience monitoring.

## 16. Highest-Confidence Headline Results

Use these in the rewrite:
- Task 1: HSGP RMSE ranges 0.0183-0.0232, with 90% coverage around 0.90-0.91.
- Task 2: On the smoothed 2026-04-12 eligible grid, 27.36% regular rotation, 3.90% monoculture, 68.74% irregular.
- Task 2: Corn->soy transition probability 0.554; soy->corn 0.600; other->other 0.361.
- Task 3: 2019 flood median NIG P(drought) 0.817; 2022 drought median 0.292.
- Task 3: Kentucky winter wheat in 2022: mean z -1.5715; 41.96% of pixel-weeks had P(drought) < 0.10.
- Task 4: 2023 test OA 0.792056 and macro F1 0.791448.
- Task 4: NDVI adds about +1.74 pp validation accuracy over CDL-only; SMAP adds about +0.07 pp.
- Task 4: Monoculture accuracy 95.5%, regular 87.4%, irregular 70.9%.
- Task 4: top SHAP features are `cdl_t1`, `ndvi_mid_mean`, `ndvi_peak_week`, `ndvi_late_mean`, `ndvi_early_mean`.

## 17. What To Do Before Rewriting The Final Paper

Checklist:
- Verify Task 1 peak DOY/NDVI values directly from the posterior or empirical tables.
- Decide whether final paper reports raw or smoothed Task 2 class shares; likely use smoothed for map/areal headline and raw for rule sensitivity.
- Decide whether to keep the NeurIPS template or switch to a cleaner challenge report format.
- Fix repository URL.
- Confirm final figure set and whether all figure paths compile from LaTeX.
- Decide whether to include county-level Task 2 maps or leave them as supplementary.
- Replace "250 m shared grid" with accurate current grid language.
- Run a final search for inconsistent values: "27%", "28%", "2.08", "557", "250", "smap_frac", "smap_pct".

