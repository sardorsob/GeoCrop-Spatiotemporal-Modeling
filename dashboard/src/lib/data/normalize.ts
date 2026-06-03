import { parseRequiredDashboardNumber } from "../format/number";
import type {
  AblationResult,
  AnomalyStateCropSummary,
  ArtifactSourceId,
  CropId,
  DataPointSource,
  ExtremeEventId,
  GeographyKind,
  MarkovTransition,
  PhenologyModelEvaluation,
  PhenologyPoint,
  PhenologySeries,
  PredictionSplitSummary,
  PredictionTestMetrics,
  RegimeMetric,
  RotationClassId,
  RotationClassSummary,
  RotationGeoSummary,
  RotationRegimeId,
  RotationThresholdSensitivity,
  ShapFeature,
  SourceNote
} from "./types";
import type {
  ArtifactLoadErrorCode,
  LoadedArtifact,
  LoadedArtifactError,
  LoadedArtifactSuccess,
  LoadedCsvArtifact,
  LoadedJsonArtifact,
  RawArtifactRow
} from "./loaders";

export interface DashboardDataLoadError {
  readonly sourceId: ArtifactSourceId;
  readonly path: string;
  readonly label: string;
  readonly caveat: string;
  readonly dateStamp?: string;
  readonly denominator?: string;
  readonly errorCode: ArtifactLoadErrorCode;
  readonly message: string;
}

export interface NormalizedDashboardData {
  readonly sources: readonly SourceNote[];
  readonly errors: readonly DashboardDataLoadError[];
  readonly task1: {
    readonly modelEvaluation: readonly PhenologyModelEvaluation[];
    readonly phenologySeries: readonly PhenologySeries[];
  };
  readonly task2: {
    readonly classSummaries: readonly RotationClassSummary[];
    readonly geographySummaries: readonly RotationGeoSummary[];
    readonly markovTransitions: readonly MarkovTransition[];
    readonly thresholdSensitivity: readonly RotationThresholdSensitivity[];
  };
  readonly task3: {
    readonly anomalySummaries: readonly AnomalyStateCropSummary[];
  };
  readonly task4: {
    readonly ablationResults: readonly AblationResult[];
    readonly regimeMetrics: readonly RegimeMetric[];
    readonly shapFeatures: readonly ShapFeature[];
    readonly splitSummaries: readonly PredictionSplitSummary[];
    readonly testMetrics?: PredictionTestMetrics;
  };
}

type RowValueAlias = readonly string[];

export function normalizeDashboardData(artifacts: readonly LoadedArtifact[]): NormalizedDashboardData {
  const modelEvaluation = getCsvArtifact(artifacts, "task1-model-evaluation");
  const posteriorPhenology = getCsvArtifact(artifacts, "task1-hsgp-posterior-phenology");
  const empiricalPhenology = getCsvArtifact(artifacts, "task1-empirical-ndvi-by-crop");
  const arealStatsByClass = getCsvArtifact(artifacts, "task2-areal-stats-by-class");
  const arealStatsByCounty = getCsvArtifact(artifacts, "task2-areal-stats-by-county");
  const arealStatsByRegion = getCsvArtifact(artifacts, "task2-areal-stats-by-region");
  const markovTransitions = getCsvArtifact(artifacts, "task2-markov-transition-probs");
  const thresholdSensitivity = getCsvArtifact(artifacts, "task2-threshold-sensitivity-grid");
  const floodAnomalies = getCsvArtifact(artifacts, "task3-midwest-flood-2019-anomaly-stats");
  const droughtAnomalies = getCsvArtifact(artifacts, "task3-plains-drought-2022-anomaly-stats");
  const ablationResults = getCsvArtifact(artifacts, "task4-ablation-results");
  const regimeMetrics = getCsvArtifact(artifacts, "task4-regime-stratified-metrics");
  const shapFeatures = getCsvArtifact(artifacts, "task4-shap-feature-importance");
  const splitSummary = getCsvArtifact(artifacts, "task4-split-summary");
  const testMetrics = getJsonArtifact(artifacts, "task4-test-metrics");

  return {
    sources: artifacts.map(toSourceNote),
    errors: artifacts.filter(isLoadError).map(toDataLoadError),
    task1: {
      modelEvaluation: normalizePhenologyModelEvaluation(modelEvaluation),
      phenologySeries: [
        ...normalizePosteriorPhenology(posteriorPhenology),
        ...normalizeEmpiricalPhenology(empiricalPhenology)
      ]
    },
    task2: {
      classSummaries: normalizeRotationClassSummaries(arealStatsByClass),
      geographySummaries: [
        ...normalizeRotationGeoSummaries(arealStatsByCounty, "county"),
        ...normalizeRotationGeoSummaries(arealStatsByRegion, "region")
      ],
      markovTransitions: normalizeMarkovTransitions(markovTransitions),
      thresholdSensitivity: normalizeThresholdSensitivity(thresholdSensitivity)
    },
    task3: {
      anomalySummaries: [
        ...normalizeAnomalySummaries(floodAnomalies),
        ...normalizeAnomalySummaries(droughtAnomalies)
      ]
    },
    task4: {
      ablationResults: normalizeAblationResults(ablationResults),
      regimeMetrics: normalizeRegimeMetrics(regimeMetrics),
      shapFeatures: normalizeShapFeatures(shapFeatures),
      splitSummaries: normalizeSplitSummaries(splitSummary),
      testMetrics: normalizeTestMetrics(testMetrics)
    }
  };
}

function normalizePhenologyModelEvaluation(
  artifact: LoadedCsvArtifact | undefined
): readonly PhenologyModelEvaluation[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.flatMap((row) => {
    const crop = normalizeCrop(readString(row, ["crop"]));

    if (!crop) {
      return [];
    }

    return [
      {
        crop,
        nObservations: readNumber(row, ["n_observations", "n_obs"]),
        rmse: readNumber(row, ["rmse", "RMSE"]),
        mae: readNumber(row, ["mae", "MAE"]),
        coverage50: readNumber(row, ["coverage_50", "50% coverage"]),
        coverage90: readNumber(row, ["coverage_90", "90% coverage"]),
        meanCrps: readNumber(row, ["mean_crps", "mean CRPS"]),
        source
      }
    ];
  });
}

function normalizePosteriorPhenology(artifact: LoadedCsvArtifact | undefined): readonly PhenologySeries[] {
  if (!artifact) {
    return [];
  }

  return groupPhenologyRows(artifact, (row): PhenologyPoint => ({
    dayOfYear: readNumber(row, ["day_of_year", "doy"]),
    posteriorMean: readNumber(row, ["posterior_mean"]),
    posteriorIqr25: readNumber(row, ["posterior_iqr_25"]),
    posteriorIqr75: readNumber(row, ["posterior_iqr_75"]),
    credibleInterval05: readNumber(row, ["credible_interval_05", "ci_05"]),
    credibleInterval95: readNumber(row, ["credible_interval_95", "ci_95"])
  }));
}

function normalizeEmpiricalPhenology(artifact: LoadedCsvArtifact | undefined): readonly PhenologySeries[] {
  if (!artifact) {
    return [];
  }

  return groupPhenologyRows(artifact, (row): PhenologyPoint => ({
    dayOfYear: readNumber(row, ["day_of_year", "doy"]),
    empiricalMeanNdvi: readNumber(row, ["empirical_mean_ndvi", "mean_ndvi"]),
    empiricalQ25Ndvi: readNumber(row, ["empirical_q25_ndvi", "q25_ndvi"]),
    empiricalQ75Ndvi: readNumber(row, ["empirical_q75_ndvi", "q75_ndvi"]),
    nPixels: readNumber(row, ["n_pixels"])
  }));
}

function groupPhenologyRows(
  artifact: LoadedCsvArtifact,
  mapPoint: (row: RawArtifactRow) => PhenologyPoint
): readonly PhenologySeries[] {
  const grouped = new Map<CropId, PhenologyPoint[]>();

  for (const row of artifact.rows) {
    const crop = normalizeCrop(readString(row, ["crop"]));

    if (!crop) {
      continue;
    }

    const points = grouped.get(crop) ?? [];
    points.push(mapPoint(row));
    grouped.set(crop, points);
  }

  const source = toDataPointSource(artifact);

  return [...grouped.entries()].map(([crop, points]) => ({
    crop,
    points,
    source
  }));
}

function normalizeRotationClassSummaries(
  artifact: LoadedCsvArtifact | undefined
): readonly RotationClassSummary[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.flatMap((row) => {
    const rotationClass = normalizeRotationClass(readString(row, ["rotation_class"]));

    if (!rotationClass) {
      return [];
    }

    return [
      {
        rotationClass,
        pixelCount: readNumber(row, ["pixel_count"]),
        areaHa: readNumber(row, ["area_ha"]),
        percentOfValid: readNumber(row, ["percent_of_valid", "pct_of_valid"]),
        source
      }
    ];
  });
}

function normalizeRotationGeoSummaries(
  artifact: LoadedCsvArtifact | undefined,
  geographyKind: GeographyKind
): readonly RotationGeoSummary[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.map((row) => {
    const geographyName = readString(row, ["geography_name", "NAMELSAD", "region"]);
    const geographyId = readString(row, ["geography_id", "GEOID", "region"]) ?? geographyName ?? "";

    return {
      geographyId,
      geographyName: geographyName ?? geographyId,
      geographyKind,
      stateFips: readString(row, ["state_fips", "STATEFP"]),
      countyFips: readString(row, ["county_fips", "COUNTYFP"]),
      nPixels: readNumber(row, ["n_pixels", "N_pixels"]),
      pctRegular: readNumber(row, ["pct_regular"]),
      pctMonoculture: readNumber(row, ["pct_monoculture"]),
      pctIrregular: readNumber(row, ["pct_irregular"]),
      source
    };
  });
}

function normalizeMarkovTransitions(artifact: LoadedCsvArtifact | undefined): readonly MarkovTransition[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.flatMap((row) => {
    const fromCrop = normalizeCrop(row[""]);

    if (!fromCrop) {
      return [];
    }

    return Object.entries(row).flatMap(([toCropLabel, probability]) => {
      if (toCropLabel === "") {
        return [];
      }

      const toCrop = normalizeCrop(toCropLabel);

      if (!toCrop) {
        return [];
      }

      return [
        {
          fromCrop,
          toCrop,
          probability: parseRequiredDashboardNumber(probability),
          source
        }
      ];
    });
  });
}

function normalizeThresholdSensitivity(
  artifact: LoadedCsvArtifact | undefined
): readonly RotationThresholdSensitivity[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.map((row) => ({
    alternationMin: readNumber(row, ["alternation_min"]),
    patternDistanceMax: readNumber(row, ["pattern_distance_max", "pattern_dist_max"]),
    pctRegular: readNumber(row, ["pct_regular"]),
    pctMonoculture: readNumber(row, ["pct_monoculture"]),
    pctIrregular: readNumber(row, ["pct_irregular"]),
    nPixels: readNumber(row, ["n_pixels"]),
    source
  }));
}

function normalizeAnomalySummaries(
  artifact: LoadedCsvArtifact | undefined
): readonly AnomalyStateCropSummary[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);
  const fallbackEventId = eventIdFromSourceId(artifact.sourceId);

  return artifact.rows.flatMap((row) => {
    const crop = normalizeCrop(readString(row, ["crop"]));
    const eventId = normalizeEventId(readString(row, ["event_id"])) ?? fallbackEventId;

    if (!crop || !eventId) {
      return [];
    }

    return [
      {
        eventId,
        state: readString(row, ["state"]) ?? "",
        crop,
        meanZ: readNumber(row, ["mean_z"]),
        maxZ: readNumber(row, ["max_z"]),
        fractionObservedZGreaterThan1: readNumber(row, [
          "fraction_observed_z_greater_than_1",
          "frac_obs_z_gt_1"
        ]),
        fractionObservedZGreaterThan1p5: readNumber(row, [
          "fraction_observed_z_greater_than_1p5",
          "frac_obs_z_gt_1p5"
        ]),
        nPixelWeeks: readNumber(row, ["n_pixel_weeks"]),
        meanNigPDrought: readNumber(row, ["mean_nig_p_drought"]),
        fractionPDroughtBelow0p1: readNumber(row, [
          "fraction_p_drought_below_0p1",
          "frac_pdrought_lt_0p1"
        ]),
        source
      }
    ];
  });
}

function normalizeAblationResults(artifact: LoadedCsvArtifact | undefined): readonly AblationResult[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.map((row) => ({
    ablationId: readString(row, ["ablation_id"]) ?? "",
    name: readString(row, ["name"]) ?? "",
    nFeatures: readNumber(row, ["n_features"]),
    overallAccuracy: readNumber(row, ["overall_accuracy"]),
    macroF1: readNumber(row, ["macro_f1"]),
    f1OtherCropland: readNumber(row, ["f1_other_cropland"]),
    f1Corn: readNumber(row, ["f1_corn"]),
    f1Soybean: readNumber(row, ["f1_soybean"]),
    f1WinterWheat: readNumber(row, ["f1_winter_wheat"]),
    source
  }));
}

function normalizeRegimeMetrics(artifact: LoadedCsvArtifact | undefined): readonly RegimeMetric[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.flatMap((row) => {
    const rotationRegime = normalizeRotationClass(readString(row, ["rotation_regime"]));

    if (!rotationRegime) {
      return [];
    }

    return [
      {
        rotationRegime,
        nPixels: readNumber(row, ["n_pixels"]),
        overallAccuracy: readNumber(row, ["overall_accuracy"]),
        macroF1: readNumber(row, ["macro_f1"]),
        f1OtherCropland: readNumber(row, ["f1_other_cropland"]),
        f1Corn: readNumber(row, ["f1_corn"]),
        f1Soybean: readNumber(row, ["f1_soybean"]),
        f1WinterWheat: readNumber(row, ["f1_winter_wheat"]),
        source
      }
    ];
  });
}

function normalizeShapFeatures(artifact: LoadedCsvArtifact | undefined): readonly ShapFeature[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.map((row) => ({
    feature: readString(row, ["feature"]) ?? "",
    meanAbsoluteShap: readNumber(row, ["mean_absolute_shap", "mean_abs_shap"]),
    source
  }));
}

function normalizeSplitSummaries(
  artifact: LoadedCsvArtifact | undefined
): readonly PredictionSplitSummary[] {
  if (!artifact) {
    return [];
  }

  const source = toDataPointSource(artifact);

  return artifact.rows.map((row) => ({
    split: readString(row, ["split", "Split"]) ?? "",
    years: readString(row, ["years", "Years"]) ?? "",
    nPixels: readNumber(row, ["n_pixels", "N_pixels"]),
    otherCropland: readNumber(row, ["other_cropland"]),
    corn: readNumber(row, ["corn"]),
    soybean: readNumber(row, ["soybean"]),
    winterWheat: readNumber(row, ["winter_wheat"]),
    source
  }));
}

function normalizeTestMetrics(artifact: LoadedJsonArtifact | undefined): PredictionTestMetrics | undefined {
  if (!artifact || !isRecord(artifact.json)) {
    return undefined;
  }

  const source = toDataPointSource(artifact);
  const perClassF1 = readPerClassF1(artifact.json);

  return {
    overallAccuracy: parseRequiredDashboardNumber(artifact.json.overall_accuracy),
    macroF1: parseRequiredDashboardNumber(artifact.json.macro_f1),
    perClassF1,
    confusionMatrix: readConfusionMatrix(artifact.json.confusion_matrix),
    source
  };
}

function readPerClassF1(json: Readonly<Record<string, unknown>>): Readonly<Record<CropId, number>> {
  const named = isRecord(json.per_class_f1_named) ? json.per_class_f1_named : undefined;
  const indexed = isRecord(json.per_class_f1) ? json.per_class_f1 : undefined;

  return {
    other_cropland: parseRequiredDashboardNumber(named?.other_cropland ?? indexed?.["0"]),
    corn: parseRequiredDashboardNumber(named?.corn ?? indexed?.["1"]),
    soybean: parseRequiredDashboardNumber(named?.soybean ?? indexed?.["2"]),
    winter_wheat: parseRequiredDashboardNumber(named?.winter_wheat ?? indexed?.["3"]),
    oats: parseRequiredDashboardNumber(named?.oats ?? indexed?.["4"])
  };
}

function readConfusionMatrix(value: unknown): readonly (readonly number[])[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.map((row) => {
    if (!Array.isArray(row)) {
      return [];
    }

    return row.map((cell) => parseRequiredDashboardNumber(cell));
  });
}

function readNumber(row: RawArtifactRow, aliases: RowValueAlias): number {
  return parseRequiredDashboardNumber(readString(row, aliases));
}

function readString(row: RawArtifactRow, aliases: RowValueAlias): string | undefined {
  const exactAlias = aliases.find((alias) => row[alias] !== undefined);

  if (exactAlias) {
    return emptyToUndefined(row[exactAlias]);
  }

  const normalizedAliases = new Set(aliases.map(normalizeHeaderKey));

  for (const [key, value] of Object.entries(row)) {
    if (normalizedAliases.has(normalizeHeaderKey(key))) {
      return emptyToUndefined(value);
    }
  }

  return undefined;
}

function normalizeHeaderKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/%/g, "percent")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function normalizeCrop(value: string | undefined): CropId | undefined {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "corn":
      return "corn";
    case "soy":
    case "soybeans":
    case "soybean":
      return "soybean";
    case "wheat":
    case "winter_wheat":
      return "winter_wheat";
    case "oats":
      return "oats";
    case "other":
    case "other_cropland":
      return "other_cropland";
    default:
      return undefined;
  }
}

function normalizeRotationClass(value: string | undefined): RotationClassId | RotationRegimeId | undefined {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "regular":
    case "regular_rotation":
      return "regular";
    case "monoculture":
      return "monoculture";
    case "irregular":
      return "irregular";
    default:
      return undefined;
  }
}

function normalizeEventId(value: string | undefined): ExtremeEventId | undefined {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "midwest_flood_2019":
      return "midwest_flood_2019";
    case "plains_drought_2022":
      return "plains_drought_2022";
    default:
      return undefined;
  }
}

function eventIdFromSourceId(sourceId: ArtifactSourceId): ExtremeEventId | undefined {
  if (sourceId === "task3-midwest-flood-2019-anomaly-stats") {
    return "midwest_flood_2019";
  }

  if (sourceId === "task3-plains-drought-2022-anomaly-stats") {
    return "plains_drought_2022";
  }

  return undefined;
}

function toDataPointSource(artifact: LoadedArtifactSuccess): DataPointSource {
  return {
    sourceId: artifact.sourceId,
    rowCount: artifact.rowCount,
    path: artifact.path,
    label: artifact.label,
    caveat: artifact.caveat,
    dateStamp: artifact.dateStamp,
    denominator: artifact.denominator
  };
}

function toSourceNote(artifact: LoadedArtifact): SourceNote {
  return {
    sourceId: artifact.sourceId,
    taskId: artifact.taskId,
    path: artifact.path,
    label: artifact.label,
    caveat: artifact.caveat,
    statusText: artifact.source.statusText,
    dateStamp: artifact.dateStamp,
    denominator: artifact.denominator
  };
}

function toDataLoadError(artifact: LoadedArtifactError): DashboardDataLoadError {
  return {
    sourceId: artifact.sourceId,
    path: artifact.path,
    label: artifact.label,
    caveat: artifact.caveat,
    dateStamp: artifact.dateStamp,
    denominator: artifact.denominator,
    errorCode: artifact.errorCode,
    message: artifact.message
  };
}

function getCsvArtifact(
  artifacts: readonly LoadedArtifact[],
  sourceId: ArtifactSourceId
): LoadedCsvArtifact | undefined {
  return artifacts.find(
    (artifact): artifact is LoadedCsvArtifact =>
      artifact.status === "success" && artifact.sourceId === sourceId && "rows" in artifact
  );
}

function getJsonArtifact(
  artifacts: readonly LoadedArtifact[],
  sourceId: ArtifactSourceId
): LoadedJsonArtifact | undefined {
  return artifacts.find(
    (artifact): artifact is LoadedJsonArtifact =>
      artifact.status === "success" && artifact.sourceId === sourceId && "json" in artifact
  );
}

function isLoadError(artifact: LoadedArtifact): artifact is LoadedArtifactError {
  return artifact.status === "error";
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
