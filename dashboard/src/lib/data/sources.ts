import type {
  ArtifactSource,
  ArtifactSourceId,
  DashboardTaskId
} from "./types";

export const artifactSources = [
  {
    id: "task1-model-evaluation",
    taskId: "task1",
    path: "../artifacts/tables/task1/model_evaluation.csv",
    format: "csv",
    label: "Task 1 model evaluation",
    expectedColumns: ["crop", "n_observations", "rmse", "mae", "coverage_50", "coverage_90", "mean_crps"],
    caveat: "Phenology model metrics are scoped to the exported Task 1 evaluation artifact.",
    statusText: "Available from Task 1 artifact export.",
    status: "available"
  },
  {
    id: "task1-hsgp-posterior-phenology",
    taskId: "task1",
    path: "../artifacts/tables/task1/hsgp_posterior_phenology.csv",
    format: "csv",
    label: "Task 1 HSGP posterior phenology",
    expectedColumns: [
      "crop",
      "day_of_year",
      "posterior_mean",
      "posterior_iqr_25",
      "posterior_iqr_75",
      "credible_interval_05",
      "credible_interval_95"
    ],
    caveat: "Posterior phenology summaries represent modeled NDVI seasonality, not raw pixel observations.",
    statusText: "Available from Task 1 artifact export.",
    status: "available"
  },
  {
    id: "task1-empirical-ndvi-by-crop",
    taskId: "task1",
    path: "../artifacts/tables/task1/empirical_ndvi_by_crop.csv",
    format: "csv",
    label: "Task 1 empirical NDVI by crop",
    expectedColumns: ["crop", "day_of_year", "mean_ndvi", "q25_ndvi", "q75_ndvi", "n_pixels"],
    caveat: "Empirical NDVI summaries are aggregated by crop and day of year for dashboard display.",
    statusText: "Available from Task 1 artifact export.",
    status: "available"
  },
  {
    id: "task2-areal-stats-by-class",
    taskId: "task2",
    path: "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv",
    format: "csv",
    label: "Task 2 areal statistics by class",
    expectedColumns: ["rotation_class", "pixel_count", "area_ha", "percent_of_valid"],
    dateStamp: "2026-04-12",
    denominator: "Valid classified cropland pixels",
    caveat: "Areal percentages use the valid classified cropland denominator from the exported artifact.",
    statusText: "Available from dated Task 2/4 artifact export.",
    status: "available"
  },
  {
    id: "task2-areal-stats-by-county",
    taskId: "task2",
    path: "../artifacts/tables/task4/task2__areal_stats_by_county__20260412.csv",
    format: "csv",
    label: "Task 2 areal statistics by county",
    expectedColumns: [
      "geography_id",
      "geography_name",
      "state_fips",
      "county_fips",
      "n_pixels",
      "pct_regular",
      "pct_monoculture",
      "pct_irregular"
    ],
    dateStamp: "2026-04-12",
    denominator: "Valid classified cropland pixels within county",
    caveat: "County summaries are scoped to counties present in the exported rotation artifact.",
    statusText: "Available from dated Task 2/4 artifact export.",
    status: "available"
  },
  {
    id: "task2-areal-stats-by-region",
    taskId: "task2",
    path: "../artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv",
    format: "csv",
    label: "Task 2 areal statistics by region",
    expectedColumns: ["geography_id", "geography_name", "n_pixels", "pct_regular", "pct_monoculture", "pct_irregular"],
    dateStamp: "2026-04-12",
    denominator: "Valid classified cropland pixels within region",
    caveat: "Regional summaries are derived from the exported rotation classification artifact.",
    statusText: "Available from dated Task 2/4 artifact export.",
    status: "available"
  },
  {
    id: "task2-markov-transition-probs",
    taskId: "task2",
    path: "../artifacts/tables/task2/task2__markov_transition_probs.csv",
    format: "csv",
    label: "Task 2 Markov transition probabilities",
    expectedColumns: ["from_crop", "to_crop", "probability"],
    caveat: "Transition probabilities summarize observed crop-to-crop transitions in the scoped Task 2 artifact.",
    statusText: "Available from Task 2 artifact export.",
    status: "available"
  },
  {
    id: "task2-threshold-sensitivity-grid",
    taskId: "task2",
    path: "../artifacts/tables/task2/task2__threshold_sensitivity_grid.csv",
    format: "csv",
    label: "Task 2 threshold sensitivity grid",
    expectedColumns: [
      "alternation_min",
      "pattern_distance_max",
      "pct_regular",
      "pct_monoculture",
      "pct_irregular",
      "n_pixels"
    ],
    denominator: "Valid classified cropland pixels",
    caveat: "Sensitivity rows show how class percentages vary under alternate rotation thresholds.",
    statusText: "Available from Task 2 artifact export.",
    status: "available"
  },
  {
    id: "task3-midwest-flood-2019-anomaly-stats",
    taskId: "task3",
    path: "../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv",
    format: "csv",
    label: "Task 3 Midwest flood 2019 anomaly statistics",
    expectedColumns: [
      "event_id",
      "state",
      "crop",
      "mean_z",
      "max_z",
      "fraction_observed_z_greater_than_1",
      "fraction_observed_z_greater_than_1p5",
      "n_pixel_weeks",
      "mean_nig_p_drought",
      "fraction_p_drought_below_0p1"
    ],
    dateStamp: "2026-04-12",
    caveat: "Anomaly summaries are aggregated by state and crop for the 2019 Midwest flood event window.",
    statusText: "Available from dated Task 3 artifact export.",
    status: "available"
  },
  {
    id: "task3-plains-drought-2022-anomaly-stats",
    taskId: "task3",
    path: "../artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv",
    format: "csv",
    label: "Task 3 Plains drought 2022 anomaly statistics",
    expectedColumns: [
      "event_id",
      "state",
      "crop",
      "mean_z",
      "max_z",
      "fraction_observed_z_greater_than_1",
      "fraction_observed_z_greater_than_1p5",
      "n_pixel_weeks",
      "mean_nig_p_drought",
      "fraction_p_drought_below_0p1"
    ],
    dateStamp: "2026-04-12",
    caveat: "Anomaly summaries are aggregated by state and crop for the 2022 Plains drought event window.",
    statusText: "Available from dated Task 3 artifact export.",
    status: "available"
  },
  {
    id: "task4-ablation-results",
    taskId: "task4",
    path: "../artifacts/tables/task4/task4_ablation_results.csv",
    format: "csv",
    label: "Task 4 ablation results",
    expectedColumns: [
      "ablation_id",
      "name",
      "n_features",
      "overall_accuracy",
      "macro_f1",
      "f1_other_cropland",
      "f1_corn",
      "f1_soybean",
      "f1_winter_wheat"
    ],
    caveat: "Ablation results compare scoped feature sets in the Task 4 prediction experiment.",
    statusText: "Available from Task 4 artifact export.",
    status: "available"
  },
  {
    id: "task4-regime-stratified-metrics",
    taskId: "task4",
    path: "../artifacts/tables/task4/task4_regime_stratified_metrics.csv",
    format: "csv",
    label: "Task 4 regime-stratified metrics",
    expectedColumns: [
      "rotation_regime",
      "n_pixels",
      "overall_accuracy",
      "macro_f1",
      "f1_other_cropland",
      "f1_corn",
      "f1_soybean",
      "f1_winter_wheat"
    ],
    denominator: "Prediction evaluation pixels within rotation regime",
    caveat: "Regime metrics are stratified by the rotation classes available in the prediction evaluation export.",
    statusText: "Available from Task 4 artifact export.",
    status: "available"
  },
  {
    id: "task4-shap-feature-importance",
    taskId: "task4",
    path: "../artifacts/tables/task4/task4_shap_feature_importance.csv",
    format: "csv",
    label: "Task 4 SHAP feature importance",
    expectedColumns: ["feature", "mean_absolute_shap"],
    caveat: "Feature importance is summarized by mean absolute SHAP value for the scoped prediction model.",
    statusText: "Available from Task 4 artifact export.",
    status: "available"
  },
  {
    id: "task4-split-summary",
    taskId: "task4",
    path: "../artifacts/tables/task4/task4_split_summary.csv",
    format: "csv",
    label: "Task 4 split summary",
    expectedColumns: ["split", "years", "n_pixels", "other_cropland", "corn", "soybean", "winter_wheat"],
    denominator: "Pixels in each prediction split",
    caveat: "Split counts document the exported train, validation, and test partitions for Task 4.",
    statusText: "Available from Task 4 artifact export.",
    status: "available"
  },
  {
    id: "task4-test-metrics",
    taskId: "task4",
    path: "../artifacts/tables/task4/task4__test_metrics__20260413.json",
    format: "json",
    label: "Task 4 test metrics",
    expectedColumns: ["overall_accuracy", "macro_f1", "per_class_f1", "confusion_matrix"],
    dateStamp: "2026-04-13",
    denominator: "Task 4 held-out test split",
    caveat: "Test metrics summarize held-out prediction performance for the scoped Task 4 model artifact.",
    statusText: "Available from dated Task 4 artifact export.",
    status: "available"
  }
] as const satisfies readonly ArtifactSource[];

export const taskSourceIds = {
  task1: artifactSources.filter((source) => source.taskId === "task1").map((source) => source.id),
  task2: artifactSources.filter((source) => source.taskId === "task2").map((source) => source.id),
  task3: artifactSources.filter((source) => source.taskId === "task3").map((source) => source.id),
  task4: artifactSources.filter((source) => source.taskId === "task4").map((source) => source.id)
} as const satisfies Readonly<Record<DashboardTaskId, readonly ArtifactSourceId[]>>;

const artifactSourcesById = Object.fromEntries(
  artifactSources.map((source) => [source.id, source])
) as unknown as Readonly<Record<ArtifactSourceId, ArtifactSource>>;

export function getArtifactSource(id: ArtifactSourceId): ArtifactSource {
  return artifactSourcesById[id];
}
