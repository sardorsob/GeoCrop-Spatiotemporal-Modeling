# Paper rewrite assessment

Reviewed 2026-09-24. This is an editorial and evidence review, not a rewritten manuscript or a fresh reproduction of the experiments.

## Recommendation

Rebuild the manuscript's argument and structure. Preserve the useful experiments, verified tables, and selected figures. Shortening sentences alone will not solve the problem: the current paper gives four tasks nearly equal narrative weight, mixes implementation documentation with scientific argument, and sometimes describes stronger validation or integration than the inspected implementation establishes.

The clearest empirical story is the different roles of crop history, vegetation phenology, and soil moisture. Crop history supplies a strong classification baseline; seasonal NDVI improves it in the reported validation experiment; adding SMAP provides little classification improvement in that experiment, while a separate analysis uses SMAP to characterize wet and dry conditions. Rotation history helps describe where classification is difficult, subject to differences in class composition between regimes.

The title's agricultural-resilience framing is broader than the measured outcomes. The project measures crop patterns, crop-label classification, and soil-moisture anomalies. It does not directly estimate yield losses, recovery, adaptation benefits, or a resilience outcome. Use resilience as motivation, or define and evaluate an explicit outcome before making it the primary contribution.

## What was read and checked

- `paper_review.m2`, README, full manuscript LaTeX, bibliography, and the 23-page paper PDF's extracted text. Selected PDF pages were rendered for layout inspection.
- The challenge brief, task configurations, saved result CSV/JSON files, and targeted implementation/notebook cells.
- Graphify code extraction over 117 files, followed by graph queries and explanations of feature-panel construction. Persistent outputs are in `graphify-out/`; the clustered graph has 1,034 nodes and 2,168 edges. This is a code map, not a semantic index of the PDFs or notebooks.
- Primary-source spot checks of the CDL crop codes, the Nandan rotation reference, and LightGBM parameter behavior.

The separate `context/` directory cited in the briefing is absent from this checkout. The briefing is useful orientation but contains inherited errors and should not be treated as independently verified ground truth. No models were retrained, data reacquired, or analysis code changed.

## Why it feels dense

The PDF has 23 pages, including two reference pages. The LaTeX contains 16 figure environments, eight tables, and eight numbered equations. The abstract is approximately 208 words, so its main problem is the number of methods and claims packed into it, rather than an extraordinary word count.

The structure presents four methods, then four results, then revisits all four in the discussion. Readers repeatedly reconstruct the relationship between a question, method, and finding. Tables and charts sometimes repeat the same numbers: the state rotation table and stacked bars, and the ablation table and bar chart, are clear opportunities for consolidation. Task 3 repeats the mirror-image-validation passage and the z-score/NIG comparison.

The introduction supplies broad agricultural motivation but little precise statement of the gap or the paper's central question. Methods introduce technical machinery before establishing why readers need it. The discussion largely recites results instead of explaining their limits and implications.

Layout contributes too: the rendered pages contain small map annotations, technical variable names in charts, and large spaces between floats. The opening page also contains an unrelated Wildfire-Property-Intelligence repository URL and a NeurIPS 2024 conference footer. The PDF and LaTeX are not perfectly synchronized: the wrong repository URL is visible in the PDF but absent from the inspected LaTeX source.

## Keep, compress, or remove

| Component | Recommended treatment | Reason |
|---|---|---|
| Shared study area and data preparation | Keep one compact table and one actual workflow diagram | Essential to interpreting all results; explain native resolution separately from analysis-grid spacing |
| Crop phenology | Keep one comparison figure and a short interpretation | It explains what seasonal information NDVI contributes |
| HSGP equations, priors, optimizer settings, calibration panels | Move most to supplement | Useful reproducibility detail; not yet demonstrated to be necessary for the classifier |
| Rotation geography | Keep one map with compact shares | Useful spatial context |
| Rotation threshold sensitivity | Keep visibly, possibly as a panel with the map | Prevents “irregular” being mistaken for poor management or failed rotation |
| Dirichlet transition uncertainty | Supplement unless it becomes a tested research question | Adds complexity without a demonstrated downstream improvement |
| SMAP wet/dry case studies | Keep one combined figure for a four-task report; move out of a focused classification paper | A separate monitoring application, with several interpretation issues to correct |
| Feature-group ablations | Make central | Direct evidence of incremental information from each source |
| Test confusion matrix and regime performance | Keep | Explain failure modes; include class supports when interpreting regime differences |
| SHAP | Compress to a small panel or supplement | Supports interpretation but does not establish causal mechanisms |
| Full state tables, metric histograms, duplicate maps | Supplement | Useful reference material, weak main-text narrative value |
| Speculative tuning gains, untested causal stories, repeated conclusions | Remove | Claims need results; repetition obscures the actual findings |

## Verified saved results and their scope

From `artifacts/tables/task4/task4_ablation_results.csv`, the 2022 validation accuracies are:

| Features | Accuracy |
|---|---:|
| CDL | 80.5894% |
| CDL + NDVI | 82.3280% |
| CDL + SMAP | 80.6576% |
| CDL + NDVI + SMAP | 82.2626% |

NDVI adds 1.7386 percentage points over CDL alone; SMAP adds 0.0682 points. The full model is slightly below CDL + NDVI in this saved validation run. These are observed differences, not estimates of statistical significance or general improvements across years. All variants need comparable test evaluation if the rewrite makes a test-year claim about their relative value.

The saved 2023 full-model result is 79.2056% accuracy and 0.791448 macro F1. The confusion matrix has exactly 125,000 observations per class. State clearly that this is performance on a class-balanced sample, not an area-weighted accuracy estimate across the Corn Belt.

The saved regime accuracies are 95.55% for monoculture, 87.41% for regular rotation, and 70.92% for irregular histories. Their class mixtures differ. The contrast is useful descriptive evidence, but does not isolate a causal effect of rotation complexity. Show per-class results/supports or a standardized comparison before attributing the entire gap to management history.

The saved HSGP posterior peaks match the paper: corn DOY 204 and NDVI 0.93020; soybean DOY 226 and 0.93801; wheat DOY 147 and 0.80377. These are modeled regional seasonal summaries, not field-level planting-stage estimates.

## Corrections before reusing claims

### 1. Task 3 crop labels are wrong

`src/modeling/task3_aggregate.py:19` maps CDL code 26 to `winter_wheat`; the Task 3 config and manuscript repeat it. USDA identifies code 24 as winter wheat and 26 as double-cropped winter wheat/soybeans. Therefore the saved “winter wheat” drought rows cannot be interpreted as winter wheat alone. If code 26 was intended, relabel and reinterpret; if winter wheat alone was intended, recompute the summaries using code 24. Do not reuse the Kentucky winter-wheat headline unchanged.

Primary source: [USDA-hosted CDL class table](https://www.nass.usda.gov/Research_and_Science/Cropland/docs/2017_Measuring%20land-use%20and%20land-cover%20change.pdf).

### 2. Grid resolution and area statements contradict each other

The data section claims a shared 250 m grid. Task 2 claims native 30 m processing and 900 square metres per pixel. Task 4 and the limitations identify approximately 557 m cells. The April 12 areal metadata reports 556.7 m and 30.9876 hectares per cell. Reconcile each task with its actual raster metadata and downloaded product. A shared coordinate reference system alone is not proof of a shared grid. Resampling SMAP does not create new fine-scale soil-moisture observations.

### 3. Task 2 methods do not describe the current implementation

The source uses an eligibility threshold of five corn/soy years for the metric population, seven for the regular-class rule, and a pattern-distance ceiling of three. The methods instead describe seven-year eligibility and a ceiling of two. `alternation_score` divides by valid adjacent corn/soy transitions, whereas the manuscript equation divides by all nine transitions. The Bayesian code has three states (corn, soy, other); the methods give a two-category prior. Monoculture takes priority in code. Entropy is computed across observed categories, explaining why results can exceed one bit despite the binary formula in the manuscript.

Describe the rule actually run. Distinguish raw from smoothed shares. The Bayesian alternation-threshold probability is not the probability of satisfying the complete deterministic regular-class definition.

### 4. HSGP metrics are fitting diagnostics

Notebook `03_ndvi_phenology_hsgp_bayesian.ipynb`, cells 9 and 19, fits the pooled crop observations and then evaluates on the same stored `doy_raw` and `ndvi_raw`. Report RMSE, CRPS, and interval coverage as in-sample posterior predictive checks. They do not establish held-out predictive calibration. The observations are regional weekly means; their uncertainty must not be presented as uncertainty about individual fields.

### 5. The event baseline is asymmetric

Task 3 uses 2015–2021 for both events, including 2019 when assessing the 2019 flood. The 2022 drought is outside the baseline. This is acceptable as a declared retrospective descriptive reference, but not as symmetric out-of-sample validation. Event inclusion can dampen its own anomaly. Use leave-event-year-out reference estimates for retrospective comparisons, or explicitly define a prior-only baseline for an operational scenario.

### 6. “P(drought)” is a misleading label

`nig_predictive_scores` computes the Student-t CDF at the observed moisture value. A value near zero means unusually dry relative to the fitted reference distribution; it is not a low posterior probability that drought exists. Rename it a posterior predictive moisture percentile. The returned Student-t scale is also not its standard deviation, and it is not a pure measure of epistemic uncertainty.

Heavier tails and fewer flagged observations do not alone demonstrate fewer false positives. Independent labels or a calibrated simulation would be needed. The claims of preventing false positives should become a qualified explanation of conservative tail scoring. Likewise, a z-score versus negative-log-p plot has no general “agreement diagonal”: these are different scales, and a two-tailed p-value depends on absolute departure.

### 7. Classification is not preseason forecasting

Task 4 uses concurrent growing-season NDVI and SMAP, including late-season information. The temporal split tests a later year, but does not establish a model available before planting or early in the season. Frame this as crop mapping/classification using seasonal observations; an early-season claim requires a feature cutoff and corresponding evaluation.

Temporal holdout also does not establish transfer to unseen geography. CDL provides labels and historical features, so distinguish agreement with CDL from validation against independent field observations.

### 8. Integration is overstated

Graphify directed attention to `assemble_training_panel` and `compute_cdl_history_features`; source inspection shows that Task 4 computes NDVI summary features directly from weekly values. It does not consume the fitted HSGP posterior curves. It also computes historical rotation regimes internally, rather than simply loading the 2015–2024 Task 2 map; definitions differ. The classifier does not consume Task 3's NIG anomaly scores.

The modules share data and ideas, but the manuscript should not depict them as a fully connected chain of fitted models. The proposed workflow diagram should show actual dependencies.

### 9. Additional model checks are warranted before stronger claims

The feature builder calculates neighborhood fractions after sampling pixels by the target-year class, fills unsampled cells with zero, and then applies a spatial filter. Thus neighborhood values depend on the sampled mask. Audit this for dependence on target-based selection and for mismatch with full-map inference; ideally calculate spatial context on the complete historical grid before sampling. This is a source-level concern, not a measured estimate of performance inflation.

The 2013–2022 cropland mask also uses information later than some training years. Explain the retrospective population definition or reconstruct it by prediction date before claiming a fully historical deployment simulation. Training and test NDVI-history construction use different caching/coverage paths and deserve a consistency check.

The manuscript claims `is_unbalance` reweights the multiclass classes, but LightGBM documents it for binary and multiclass one-versus-all objectives. Verify the saved model objective; do not assert inverse-frequency reweighting from this flag alone. [LightGBM parameter documentation](https://lightgbm.readthedocs.io/en/stable/Parameters.html#is_unbalance).

## Bibliography assessment

The `.bib` file has 41 entries but 39 unique keys: `roberts2017cv` appears three times. There is also a stray URL outside an entry. More substantively, the Nandan record has incorrect author/DOI metadata: the publisher lists Rohit Nandan and Varaprasad Bandaru, the title ending “at regional scale,” and DOI `10.1016/j.jag.2026.105208`. [Publisher record](https://www.sciencedirect.com/science/article/pii/S156984322600124X).

An Otkin 2018 review is cited for a specific 2022 event progression, which requires a 2022 event source. Relevant references already present but uncited in the inspected LaTeX include the MODIS product guide, Reichle's SMAP validation paper, Murphy's conjugate-Gaussian derivation, TIMESAT, and Roberts on structured validation. Use references to support product processing, exact methods, evaluation design, and event claims; do not add citations simply to make the paper look more scholarly. This was a targeted reference check, not a full verification of every bibliography entry.

## Proposed rewrite routes

For a standalone research or portfolio paper, narrow the central question to what seasonal remote sensing adds beyond crop history, and how performance varies with crop-history patterns. A possible working title is “What Does Seasonal Remote Sensing Add to Crop-History-Based Mapping in the U.S. Corn Belt?” Retain phenology and rotation as supporting analyses. Move the full SMAP anomaly study to a companion report or supplement unless a tested connection to classification is added.

An editorial target is 6–8 main-text pages, roughly 3,000–4,000 words depending on layout, and four or five figures: workflow, phenology, rotation context/sensitivity, ablation and test errors, and regime performance. This is a writing target, not a confirmed venue limit. Organize around the question, data and evaluation, evidence, and implications. Avoid promising novelty from merely assembling established methods.

For a challenge report, retain all four tasks because the supplied brief requires them. Aim for 8–10 main-text pages with a shared data/workflow section, four compact question–method–finding sections, and a short synthesis/limitations section. The brief also asks for a workflow diagram, which the current figure set lacks. The historical challenge brief specifies original student writing and disallows AI-produced report prose; this assessment is feedback, and the intended destination of any later rewrite should be established separately.

## Suggested sequence

1. Select the audience and central question.
2. Reconcile grid, crop-code, baseline, and feature-construction facts; decide which claims need reruns and which only need narrower wording.
3. Choose the essential figures before drafting prose.
4. Write a new outline and claim–evidence table without copying the current section structure.
5. Draft from that outline; transfer detailed methods and secondary outputs to a supplement.

Preserve the original manuscript as a record. A new manuscript should be built from verified evidence rather than treating all current prose as material that must survive.
