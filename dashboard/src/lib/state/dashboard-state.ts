import type {
  CropId,
  DashboardFilterState,
  DashboardTab,
  ExtremeEventId,
  MapLayerId,
  RotationRegimeId
} from "../data/types";

export interface DashboardOption<TId extends string = string> {
  readonly id: TId;
  readonly label: string;
}

export type DashboardFilterKey =
  | "tab"
  | "mapLayer"
  | "state"
  | "crop"
  | "event"
  | "rotationRegime"
  | "selectedEntity"
  | "mapView";

export const DASHBOARD_TABS = [
  "phenology",
  "rotation",
  "extremes",
  "prediction"
] as const satisfies readonly DashboardTab[];

export const MAP_LAYER_IDS = [
  "rotation-class",
  "rotation-regular-probability",
  "soil-moisture-anomaly",
  "crop-prediction",
  "prediction-agreement"
] as const satisfies readonly MapLayerId[];

export const CROP_IDS = [
  "corn",
  "soybean",
  "winter_wheat",
  "oats",
  "other_cropland"
] as const satisfies readonly CropId[];

export const EXTREME_EVENT_IDS = [
  "midwest_flood_2019",
  "plains_drought_2022"
] as const satisfies readonly ExtremeEventId[];

export const ROTATION_REGIME_IDS = [
  "regular",
  "monoculture",
  "irregular"
] as const satisfies readonly RotationRegimeId[];

export const DEFAULT_DASHBOARD_FILTER_STATE: DashboardFilterState = {
  tab: "phenology",
  mapLayer: "rotation-class"
};

export const DASHBOARD_TAB_OPTIONS: readonly DashboardOption<DashboardTab>[] = [
  { id: "phenology", label: "Phenology" },
  { id: "rotation", label: "Rotation" },
  { id: "extremes", label: "Extremes" },
  { id: "prediction", label: "Prediction" }
];

export const MAP_LAYER_OPTIONS: readonly DashboardOption<MapLayerId>[] = [
  { id: "rotation-class", label: "Rotation class" },
  {
    id: "rotation-regular-probability",
    label: "Regular rotation probability"
  },
  { id: "soil-moisture-anomaly", label: "Soil moisture anomaly" },
  { id: "crop-prediction", label: "Crop prediction" },
  { id: "prediction-agreement", label: "Prediction agreement" }
];

export const CROP_OPTIONS: readonly DashboardOption<CropId>[] = [
  { id: "corn", label: "Corn" },
  { id: "soybean", label: "Soybean" },
  { id: "winter_wheat", label: "Winter wheat" },
  { id: "oats", label: "Oats" },
  { id: "other_cropland", label: "Other cropland" }
];

export const EXTREME_EVENT_OPTIONS: readonly DashboardOption<ExtremeEventId>[] = [
  { id: "midwest_flood_2019", label: "Midwest flood 2019" },
  { id: "plains_drought_2022", label: "Plains drought 2022" }
];

export const ROTATION_REGIME_OPTIONS: readonly DashboardOption<RotationRegimeId>[] = [
  { id: "regular", label: "Regular" },
  { id: "monoculture", label: "Monoculture" },
  { id: "irregular", label: "Irregular" }
];

export function isDashboardTab(value: string): value is DashboardTab {
  return includesString(DASHBOARD_TABS, value);
}

export function isMapLayerId(value: string): value is MapLayerId {
  return includesString(MAP_LAYER_IDS, value);
}

export function isCropId(value: string): value is CropId {
  return includesString(CROP_IDS, value);
}

export function isExtremeEventId(value: string): value is ExtremeEventId {
  return includesString(EXTREME_EVENT_IDS, value);
}

export function isRotationRegimeId(value: string): value is RotationRegimeId {
  return includesString(ROTATION_REGIME_IDS, value);
}

export function getDashboardOptionLabel<TId extends string>(
  options: readonly DashboardOption<TId>[],
  id: TId
): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

export function normalizeDashboardFilterState(
  state: Partial<DashboardFilterState>
): DashboardFilterState {
  return {
    ...DEFAULT_DASHBOARD_FILTER_STATE,
    ...state,
    state: normalizeOptionalText(state.state)?.toUpperCase(),
    selectedEntity: normalizeOptionalText(state.selectedEntity),
    mapView: normalizeMapView(state.mapView)
  };
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeMapView(
  mapView: DashboardFilterState["mapView"]
): DashboardFilterState["mapView"] {
  if (!mapView) {
    return undefined;
  }

  const [longitude, latitude] = mapView.center;
  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(mapView.zoom) ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90 ||
    mapView.zoom < 0 ||
    mapView.zoom > 22
  ) {
    return undefined;
  }

  return mapView;
}

function includesString<TValue extends string>(
  values: readonly TValue[],
  value: string
): value is TValue {
  return values.includes(value as TValue);
}
