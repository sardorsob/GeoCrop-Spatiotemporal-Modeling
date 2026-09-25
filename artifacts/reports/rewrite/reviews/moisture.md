# W2 soil-moisture section receipt

Status: ready-for-check

Mode: rewrite-with-notes. Maker: moisture. Independent acceptance remains with the coordinator/reviewer.

## Deliverable and scope

- Owned prose: `artifacts/reports/rewrite/sections/moisture.tex`.
- Owned notes: this file.
- Approximately 489 words after root-requested final cuts under a command-stripped whitespace count; no displayed equation, table, or figure environment.
- One figure reference: `fig:moisture`, supplied by root. Root confirmed it shows state-level corn/soybean mean empirical-Bayes moisture percentiles (CDF scores) in both saved event windows, with a reference line at 0.5. Prose now matches that scale and uses z=1.5 only for the separate Iowa threshold result.
- One citation key: `murphy2007conjugate`, for the conjugate Normal--Inverse-Gamma/Student-t derivation. Existing bib metadata and implementation cite this source; root owns final reference verification and bibliography.
- No new experiments, source-code fixes, or raw-artifact relabeling were performed. Only manuscript interpretation of CDL 26 was corrected.

## Evidence read

- `configs/task3_soil_moisture.yaml`: 2015–2021 reference, April–July 2019 and June–August 2022 windows, SMAP L4 surface moisture, rotation-eligible pixel subset.
- `src/modeling/task3_smap_anomalies.py`: same-ISO-week mean/sample standard deviation, event-year label attachment, z-score clipping to ±5.
- `notebooks/task3_soil_moisture/02_climatology_and_anomalies.ipynb`, source cell 1: actual event-year `attach_cdl_year`; regional priors; lambda0=1 and alpha0=2; event output construction.
- `src/modeling/task3_nig_anomaly.py`: NIG sufficient-statistic updates, week-level regional prior mean, beta0 based on median cell baseline variance, Student-t CDF, predictive scale versus standard deviation distinction.
- `src/modeling/task3_aggregate.py`: state/crop grouping, row-count denominator, mean z-score, fraction beyond z=1.5, fraction with moisture CDF below 0.1. Its `winter_wheat` label for code 26 is incorrect and was not copied into the prose.
- Both dated event CSVs in `artifacts/tables/task3/` below.
- Original `artifacts/reports/neurips_2024.tex`, soil-moisture method and results sections, used as editorial context rather than independent evidence.
- Shared brief, voice profile, claims table, and assessment; writing-workflow skill plus kit/core/profile and hygiene/voice notes.

## Numeric claims retained

| Prose claim | Saved source | Exact field(s) |
|---|---|---|
| Corn and soybean mean moisture percentiles exceed 0.5 in all 13 study states in 2019 | `task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv` | all 26 named-state corn/soybean `mean_nig_p_drought` > 0.5; `outside` excluded |
| South Dakota corn mean moisture percentile=0.85 | same | `mean_nig_p_drought=0.8512` |
| Iowa corn wet fraction 17.75% of 2,901,150 pixel-weeks | same | `frac_obs_z_gt_1p5=0.1775`; `n_pixel_weeks=2901150` |
| Nebraska soybean mean moisture percentile=0.24; 40.54% of 947,648 pixel-weeks below tenth predictive percentile | `task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv` | `mean_nig_p_drought=0.2391`; `frac_pdrought_lt_0p1=0.4054`; `n_pixel_weeks=947648` |
| North Dakota corn mean moisture percentile=0.52 | same | `mean_nig_p_drought=0.5184` |
| Kentucky winter wheat/soybean double crop: 41.96% of 49,543 pixel-weeks below tenth predictive percentile | same, saved `crop=winter_wheat` row | `frac_pdrought_lt_0p1=0.4196`; `n_pixel_weeks=49543`; code 26 reinterpreted per verified USDA class table in shared assessment |

## Retained and rejected interpretations

Retained: retrospective event descriptions, relative moisture percentiles, short weekly reference, parameter uncertainty represented by a Student-t predictive distribution, state/crop differences with pixel-week denominators, conceptual use alongside NDVI.

Rejected: P(drought) naming; winter-wheat-only inference from code 26; symmetric held-out validation; interpreting threshold exceedance as flooding or soil saturation; pure epistemic uncertainty or standard-deviation labels for the predictive scale; USDM-category equivalence; demonstrated false-positive reduction; crop-specific causal agronomy; yield damage; predictive vegetation lead times; linkage of NIG outputs to Task 4 classifier.

The paragraph on data support notes that neighboring cells can share native 9 km SMAP information. The fraction denominator is repeated pixel-weeks, not affected farms, fields, or independent satellite samples. No severity ranking is inferred from small code-26 strata.

## Revision after figure feedback

Root requested alignment with the plotted CDF scale and less repetitive qualification. Changed the figure explanation and the illustrative state means to moisture percentiles; retained the Iowa z-score threshold as a separate statistic. Named the regional data-informed prior setup empirical Bayes. Removed the predictive-scale discussion because the revised section does not report that output. Kept the retrospective baseline overlap, explicit distinction from drought probability, and correct code-26 double-crop label. Recast most negative caveats as positive statements about scope or the evidence required for a stronger claim.

## Final prose revision

At root's request, removed the two concluding sentences about future vegetation/yield and independent-label evaluation; those qualifications remain in the integrated discussion. Simplified the baseline-overlap wording and introduced ISO week as calendar week. Removed unexplained prior-setting symbols from the prose while preserving its empirical-Bayes explanation.

The exact implementation settings retained here are `lambda_0 = 1.0` (prior mean precision multiplier), `alpha_0 = 2.0` (inverse-gamma shape), weekly `mu_0` equal to the regional mean of baseline cell means, and weekly `beta_0` equal to the regional median of baseline cell variances times `(alpha_0 - 0.5)`, hence 1.5 times that median. Source: notebook 02 source cell 1 and `regional_prior_mu0` / `regional_prior_beta0` in `src/modeling/task3_nig_anomaly.py`. No settings or numerical results changed.

Fresh reread: the section moves from purpose and crop strata to weekly reference, predictive percentile, aggregation, event findings, and monitoring context. No unresolved prose issue found. The main-document discussion must retain the independent-outcome validation limits removed from this ending.

## Checks and open integration work

- Maker source and copy passes completed: purpose precedes machinery; methods and findings are adjacent; no stock dramatic language or unsupported causal sentence retained.
- Numeric checks: direct Python CSV assertions against the six entries above and the 26-state/crop mean-percentile statement pass.
- Structural checks: balanced LaTeX braces, no display equation or figure environment, one expected figure reference, one citation key; no draft markers.
- No standalone compilation: root owns the main document, bibliography and figure placement.
- Root/reviewer should confirm final figure content matches the text and verify the Murphy source metadata. No unresolved substantive source gap in the retained local-result claims.

Awaiting independent review and targeted feedback.
