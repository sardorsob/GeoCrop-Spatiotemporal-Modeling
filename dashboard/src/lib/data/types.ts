export type DashboardTaskId = "task1" | "task2" | "task3" | "task4";

export type DashboardTab = "phenology" | "rotation" | "extremes" | "prediction";

export type SourceFormat = "csv" | "json";

export type ArtifactSourceStatus = "available" | "scoped" | "fallback-only";

export type ArtifactSourceId =
  | "task1-model-evaluation"
  | "task1-hsgp-posterior-phenology"
  | "task1-empirical-ndvi-by-crop"
  | "task2-areal-stats-by-class"
  | "task2-areal-stats-by-county"
  | "task2-areal-stats-by-region"
  | "task2-markov-transition-probs"
  | "task2-threshold-sensitivity-grid"
  | "task3-midwest-flood-2019-anomaly-stats"
  | "task3-plains-drought-2022-anomaly-stats"
  | "task4-ablation-results"
  | "task4-regime-stratified-metrics"
  | "task4-shap-feature-importance"
  | "task4-split-summary"
  | "task4-test-metrics";

export interface ArtifactSource {
  readonly id: ArtifactSourceId;
  readonly taskId: DashboardTaskId;
  readonly path: string;
  readonly format: SourceFormat;
  readonly label: string;
  readonly expectedColumns: readonly string[];
  readonly dateStamp?: string;
  readonly denominator?: string;
  readonly caveat: string;
  readonly statusText: string;
  readonly status: ArtifactSourceStatus;
}

export interface SourceNote {
  readonly sourceId: ArtifactSourceId;
  readonly taskId: DashboardTaskId;
  readonly path: string;
  readonly label: string;
  readonly caveat: string;
  readonly statusText: string;
  readonly dateStamp?: string;
  readonly denominator?: string;
}

export type CropId = "corn" | "soybean" | "winter_wheat" | "oats" | "other_cropland";

export type RotationClassId = "regular" | "monoculture" | "irregular";

export type RotationRegimeId = RotationClassId;

export type ExtremeEventId = "midwest_flood_2019" | "plains_drought_2022";

export type GeographyKind = "state" | "county" | "region" | "pixel";

export type MapLayerId =
  | "rotation-class"
  | "rotation-regular-probability"
  | "soil-moisture-anomaly"
  | "crop-prediction"
  | "prediction-agreement";

export interface DataPointSource {
  readonly sourceId: ArtifactSourceId;
  readonly rowCount?: number;
  readonly path?: string;
  readonly label?: string;
  readonly caveat?: string;
  readonly dateStamp?: string;
  readonly denominator?: string;
}

export interface PhenologySeries {
  readonly crop: CropId;
  readonly points: readonly PhenologyPoint[];
  readonly source: DataPointSource;
}

export interface PhenologyPoint {
  readonly dayOfYear: number;
  readonly posteriorMean?: number;
  readonly posteriorIqr25?: number;
  readonly posteriorIqr75?: number;
  readonly credibleInterval05?: number;
  readonly credibleInterval95?: number;
  readonly empiricalMeanNdvi?: number;
  readonly empiricalQ25Ndvi?: number;
  readonly empiricalQ75Ndvi?: number;
  readonly nPixels?: number;
}

export interface PhenologyModelEvaluation {
  readonly crop: CropId;
  readonly nObservations: number;
  readonly rmse: number;
  readonly mae: number;
  readonly coverage50: number;
  readonly coverage90: number;
  readonly meanCrps: number;
  readonly source: DataPointSource;
}

export interface RotationClassSummary {
  readonly rotationClass: RotationClassId;
  readonly pixelCount: number;
  readonly areaHa: number;
  readonly percentOfValid: number;
  readonly source: DataPointSource;
}

export interface RotationGeoSummary {
  readonly geographyId: string;
  readonly geographyName: string;
  readonly geographyKind: GeographyKind;
  readonly stateFips?: string;
  readonly countyFips?: string;
  readonly nPixels: number;
  readonly pctRegular: number;
  readonly pctMonoculture: number;
  readonly pctIrregular: number;
  readonly source: DataPointSource;
}

export interface MarkovTransition {
  readonly fromCrop: CropId;
  readonly toCrop: CropId;
  readonly probability: number;
  readonly source: DataPointSource;
}

export interface RotationThresholdSensitivity {
  readonly alternationMin: number;
  readonly patternDistanceMax: number;
  readonly pctRegular: number;
  readonly pctMonoculture: number;
  readonly pctIrregular: number;
  readonly nPixels: number;
  readonly source: DataPointSource;
}

export interface AnomalyStateCropSummary {
  readonly eventId: ExtremeEventId;
  readonly state: string;
  readonly crop: CropId;
  readonly meanZ: number;
  readonly maxZ: number;
  readonly fractionObservedZGreaterThan1: number;
  readonly fractionObservedZGreaterThan1p5: number;
  readonly nPixelWeeks: number;
  readonly meanNigPDrought: number;
  readonly fractionPDroughtBelow0p1: number;
  readonly source: DataPointSource;
}

export interface AblationResult {
  readonly ablationId: string;
  readonly name: string;
  readonly nFeatures: number;
  readonly overallAccuracy: number;
  readonly macroF1: number;
  readonly f1OtherCropland: number;
  readonly f1Corn: number;
  readonly f1Soybean: number;
  readonly f1WinterWheat: number;
  readonly source: DataPointSource;
}

export interface RegimeMetric {
  readonly rotationRegime: RotationRegimeId;
  readonly nPixels: number;
  readonly overallAccuracy: number;
  readonly macroF1: number;
  readonly f1OtherCropland: number;
  readonly f1Corn: number;
  readonly f1Soybean: number;
  readonly f1WinterWheat: number;
  readonly source: DataPointSource;
}

export interface ShapFeature {
  readonly feature: string;
  readonly meanAbsoluteShap: number;
  readonly source: DataPointSource;
}

export interface PredictionSplitSummary {
  readonly split: string;
  readonly years: string;
  readonly nPixels: number;
  readonly otherCropland: number;
  readonly corn: number;
  readonly soybean: number;
  readonly winterWheat: number;
  readonly source: DataPointSource;
}

export interface PredictionTestMetrics {
  readonly overallAccuracy: number;
  readonly macroF1: number;
  readonly perClassF1: Readonly<Record<CropId, number>>;
  readonly confusionMatrix?: readonly (readonly number[])[];
  readonly source: DataPointSource;
}

export interface MapLegendItem {
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly value?: number | string;
}

export interface MapLayer {
  readonly id: MapLayerId;
  readonly taskId: DashboardTaskId;
  readonly label: string;
  readonly sourceIds: readonly ArtifactSourceId[];
  readonly status: ArtifactSourceStatus;
  readonly legend: readonly MapLegendItem[];
  readonly caveat: string;
}

export interface MapSelection {
  readonly geographyKind: GeographyKind;
  readonly id: string;
  readonly label: string;
  readonly sourceId?: ArtifactSourceId;
}

export interface GeoSummary {
  readonly selection: MapSelection;
  readonly values: Readonly<Record<string, number | string>>;
  readonly source: DataPointSource;
}

export interface DashboardFilterState {
  readonly tab: DashboardTab;
  readonly mapLayer: MapLayerId;
  readonly state?: string;
  readonly crop?: CropId;
  readonly event?: ExtremeEventId;
  readonly rotationRegime?: RotationRegimeId;
  readonly selectedEntity?: string;
  readonly mapView?: {
    readonly center: readonly [longitude: number, latitude: number];
    readonly zoom: number;
  };
}
