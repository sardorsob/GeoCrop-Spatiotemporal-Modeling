# Additional method notes

These details document the existing implementation behind the revised paper. They introduce no new results and do not constitute a fresh reproduction. Paths below are relative to the repository root.

## Regional HSGP phenology

Source: `notebooks/task1_ndvi_timeseries/03_ndvi_phenology_hsgp_bayesian.ipynb`, cells 8–10 and 19; seed configuration in `configs/task1_ndvi_analysis.yaml`.

| Component | Verified setting |
| --- | --- |
| Model | Separate crop models; squared-exponential HSGP with 25 basis functions, `non_centered=True`; Normal residuals |
| Domain | DOY centered at the midpoint of its observed minimum and maximum; domain half-width = 1.3 × maximum absolute centered DOY |
| Priors | Intercept Normal(mean 0.65, SD 0.25); amplitude HalfNormal(scale 0.4); length-scale LogNormal(log-location ln 25, log-scale 0.5); residual SD HalfNormal(scale 0.1) |
| Inference | NumPyro SVI; AutoNormal mean-field guide; Trace_ELBO; Adam step size 0.005; 8,000 steps per crop; seed 42 |
| Curve prediction | 2,000 draws on 300 equally spaced DOYs, extending three days beyond each observed endpoint; seed 43 |
| Fit checks | 2,000 predictive draws at training DOYs; seed 141; comparison with the same regional means used for fitting |

Curve values average latent `mu` draws. Interval columns use predictive `obs` draws and therefore include modeled residual variation. The recorded Normal prior's second parameter is an SD, not a variance. The saved notebook output loaded cached crop summaries; its current source sets `FORCE_RECOMPUTE=True`. The revision uses the saved summaries and results without rerunning that cell.

## Encoded NDVI and classifier week indices

Task 4 divides stored weekly NDVI by 250 (`configs/task4_crop_mapping.yaml`; `compute_ndvi_features` in `src/preprocessing/task4_panel.py`). The HSGP notebook instead checks the maximum aggregated mean: if it exceeds 1.5, it divides the means and spatial quartiles by 250 when that maximum is at most 255, or by 10,000 otherwise. The saved empirical HSGP table is already normalized. These are implementation-specific conversions of downloaded values; /250 is not asserted to be the general native MODIS product scale.

HSGP dates come from each year's metadata and are expressed as DOY. Task 4 timing features use zero-based positions in numerically sorted weekly columns:

- Peak week is the maximum of a three-week moving mean with endpoint replication.
- Green-up week is the first smoothed value at or above the seasonal tenth-percentile baseline plus 20% of the unsmoothed peak-minus-baseline amplitude.
- Green-up slope is the largest positive difference between consecutive smoothed values.
- Early, middle, and late means use unsmoothed column slices `0:7`, `7:16`, and `16:end`, shortened where necessary.

These indices and slices are relative to the available weekly series, not independently validated calendar growth stages. Four historical features summarize the mean and standard deviation of prior peak magnitude and peak-week index; the paper describes the differing training/test history coverage.

## Moisture reference and empirical-Bayes prior

Sources: `notebooks/task3_soil_moisture/02_climatology_and_anomalies.ipynb` and `src/modeling/task3_nig_anomaly.py`. Baseline summaries use 2015–2021 observations for the ISO weeks matched to the two event windows. The prior mean is the weekly regional mean of cell baseline means. The prior mean-precision multiplier is `lambda_0 = 1`, and inverse-gamma shape is `alpha_0 = 2`. The code sets `beta_0` to the weekly regional median of squared cell standard deviations multiplied by `max(alpha_0 - 0.5, 0.1)`, hence 1.5 times the median variance here. These exact settings are retained outside the prose to avoid unexplained symbols in the paper.

The conjugate posterior predictive Student-t CDF evaluated at observed moisture supplies the percentile score. Its scale includes variability and parameter uncertainty and is not the Student-t standard deviation. Saved column names containing `p_drought` are interpreted as moisture percentiles, not posterior probabilities of a drought event.

## Peripheral transition diagnostic

`src/modeling/rotation_bayesian_dm.py` groups transitions into corn, soybean, and other states. The configured Jeffreys prior adds `(0.5, 0.5, 0.5)` to each origin row. Independent posterior draws for the corn and soybean rows give an alternation proxy equal to `[P(corn→soybean) + P(soybean→corn)] / 2`. The saved configuration uses 256 draws, seed 42, a proxy threshold of 0.70, and at least one transition originating in corn or soybean. The reported threshold probability concerns this proxy; it is not the probability of satisfying the full deterministic rotation-class rule. The revised main text omits this peripheral output.
