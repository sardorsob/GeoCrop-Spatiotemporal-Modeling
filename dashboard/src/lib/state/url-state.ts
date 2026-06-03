import type { DashboardFilterState } from "../data/types";
import {
  DEFAULT_DASHBOARD_FILTER_STATE,
  isCropId,
  isDashboardTab,
  isExtremeEventId,
  isMapLayerId,
  isRotationRegimeId,
  normalizeDashboardFilterState
} from "./dashboard-state";

export interface DashboardUrlStateWarning {
  readonly param: string;
  readonly value: string;
  readonly message: string;
}

export interface ParsedDashboardUrlState {
  readonly state: DashboardFilterState;
  readonly warnings: readonly DashboardUrlStateWarning[];
}

type DashboardSearchParams = Pick<URLSearchParams, "get" | "has">;
type DraftDashboardFilterState = {
  -readonly [Key in keyof DashboardFilterState]?: DashboardFilterState[Key];
};

const QUERY_PARAM_ORDER = [
  "tab",
  "mapLayer",
  "state",
  "crop",
  "event",
  "rotationRegime",
  "selectedEntity",
  "lng",
  "lat",
  "zoom"
] as const;

export function parseDashboardUrlState(
  searchParams: DashboardSearchParams
): ParsedDashboardUrlState {
  const warnings: DashboardUrlStateWarning[] = [];
  const state: DraftDashboardFilterState = {};

  parseTab(searchParams, state, warnings);
  parseMapLayer(searchParams, state, warnings);
  parseState(searchParams, state, warnings);
  parseCrop(searchParams, state, warnings);
  parseEvent(searchParams, state, warnings);
  parseRotationRegime(searchParams, state, warnings);
  parseSelectedEntity(searchParams, state, warnings);
  parseMapView(searchParams, state, warnings);

  return {
    state: normalizeDashboardFilterState(state),
    warnings
  };
}

export function serializeDashboardUrlState(
  inputState: DashboardFilterState
): string {
  const state = normalizeDashboardFilterState(inputState);
  const searchParams = new URLSearchParams();

  if (state.tab !== DEFAULT_DASHBOARD_FILTER_STATE.tab) {
    searchParams.set("tab", state.tab);
  }

  if (state.mapLayer !== DEFAULT_DASHBOARD_FILTER_STATE.mapLayer) {
    searchParams.set("mapLayer", state.mapLayer);
  }

  if (state.state) {
    searchParams.set("state", state.state);
  }

  if (state.crop) {
    searchParams.set("crop", state.crop);
  }

  if (state.event) {
    searchParams.set("event", state.event);
  }

  if (state.rotationRegime) {
    searchParams.set("rotationRegime", state.rotationRegime);
  }

  if (state.selectedEntity) {
    searchParams.set("selectedEntity", state.selectedEntity);
  }

  if (state.mapView) {
    searchParams.set("lng", formatNumber(state.mapView.center[0]));
    searchParams.set("lat", formatNumber(state.mapView.center[1]));
    searchParams.set("zoom", formatNumber(state.mapView.zoom));
  }

  return searchParams.toString();
}

export function updateDashboardUrlSearchParams(
  currentParams: URLSearchParams,
  state: DashboardFilterState
): URLSearchParams {
  const nextParams = new URLSearchParams(currentParams);
  for (const param of QUERY_PARAM_ORDER) {
    nextParams.delete(param);
  }

  const dashboardParams = new URLSearchParams(serializeDashboardUrlState(state));
  for (const [key, value] of dashboardParams.entries()) {
    nextParams.append(key, value);
  }

  return nextParams;
}

function parseTab(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("tab");
  if (value === null) {
    return;
  }

  if (isDashboardTab(value)) {
    state.tab = value;
    return;
  }

  warnings.push({
    param: "tab",
    value,
    message: `Invalid tab "${value}"; using default "${DEFAULT_DASHBOARD_FILTER_STATE.tab}".`
  });
}

function parseMapLayer(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("mapLayer");
  if (value === null) {
    return;
  }

  if (isMapLayerId(value)) {
    state.mapLayer = value;
    return;
  }

  warnings.push({
    param: "mapLayer",
    value,
    message: `Invalid mapLayer "${value}"; using default "${DEFAULT_DASHBOARD_FILTER_STATE.mapLayer}".`
  });
}

function parseState(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("state");
  if (value === null) {
    return;
  }

  const normalized = normalizeTextParam(value);
  if (normalized) {
    state.state = normalized.toUpperCase();
    return;
  }

  warnings.push({
    param: "state",
    value,
    message: `Invalid state "${value}"; omitting filter.`
  });
}

function parseCrop(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("crop");
  if (value === null) {
    return;
  }

  if (isCropId(value)) {
    state.crop = value;
    return;
  }

  warnings.push({
    param: "crop",
    value,
    message: `Invalid crop "${value}"; omitting filter.`
  });
}

function parseEvent(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("event");
  if (value === null) {
    return;
  }

  if (isExtremeEventId(value)) {
    state.event = value;
    return;
  }

  warnings.push({
    param: "event",
    value,
    message: `Invalid event "${value}"; omitting filter.`
  });
}

function parseRotationRegime(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("rotationRegime");
  if (value === null) {
    return;
  }

  if (isRotationRegimeId(value)) {
    state.rotationRegime = value;
    return;
  }

  warnings.push({
    param: "rotationRegime",
    value,
    message: `Invalid rotationRegime "${value}"; omitting filter.`
  });
}

function parseSelectedEntity(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  const value = searchParams.get("selectedEntity");
  if (value === null) {
    return;
  }

  const normalized = normalizeTextParam(value);
  if (normalized) {
    state.selectedEntity = normalized;
    return;
  }

  warnings.push({
    param: "selectedEntity",
    value,
    message: `Invalid selectedEntity "${value}"; omitting filter.`
  });
}

function parseMapView(
  searchParams: DashboardSearchParams,
  state: DraftDashboardFilterState,
  warnings: DashboardUrlStateWarning[]
) {
  if (
    !searchParams.has("lng") &&
    !searchParams.has("lat") &&
    !searchParams.has("zoom")
  ) {
    return;
  }

  const longitude = parseMapViewNumber({
    param: "lng",
    label: "longitude",
    min: -180,
    max: 180,
    searchParams,
    warnings
  });
  const latitude = parseMapViewNumber({
    param: "lat",
    label: "latitude",
    min: -90,
    max: 90,
    searchParams,
    warnings
  });
  const zoom = parseMapViewNumber({
    param: "zoom",
    label: "zoom",
    min: 0,
    max: 22,
    searchParams,
    warnings
  });

  if (longitude.valid && latitude.valid && zoom.valid) {
    state.mapView = {
      center: [longitude.value, latitude.value],
      zoom: zoom.value
    };
  }
}

interface MapViewNumberConfig {
  readonly param: "lng" | "lat" | "zoom";
  readonly label: "longitude" | "latitude" | "zoom";
  readonly min: number;
  readonly max: number;
  readonly searchParams: DashboardSearchParams;
  readonly warnings: DashboardUrlStateWarning[];
}

type MapViewNumberResult =
  | { readonly valid: true; readonly value: number }
  | { readonly valid: false };

function parseMapViewNumber({
  param,
  label,
  min,
  max,
  searchParams,
  warnings
}: MapViewNumberConfig): MapViewNumberResult {
  const value = searchParams.get(param);
  if (value === null) {
    warnings.push({
      param,
      value: "",
      message: `Missing map view ${label}; omitting map view.`
    });
    return { valid: false };
  }

  const numberValue = Number(value);
  if (
    value.trim() === "" ||
    !Number.isFinite(numberValue) ||
    numberValue < min ||
    numberValue > max
  ) {
    warnings.push({
      param,
      value,
      message: `Invalid map view ${label} "${value}"; omitting map view.`
    });
    return { valid: false };
  }

  return { valid: true, value: numberValue };
}

function normalizeTextParam(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : String(value);
}
