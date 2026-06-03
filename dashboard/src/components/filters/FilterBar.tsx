"use client";

import type {
  CropId,
  DashboardFilterState,
  DashboardTab,
  ExtremeEventId,
  MapLayerId,
  RotationRegimeId
} from "@/lib/data/types";
import {
  CROP_OPTIONS,
  DASHBOARD_TAB_OPTIONS,
  DEFAULT_DASHBOARD_FILTER_STATE,
  EXTREME_EVENT_OPTIONS,
  MAP_LAYER_OPTIONS,
  normalizeDashboardFilterState,
  ROTATION_REGIME_OPTIONS,
  type DashboardFilterKey
} from "@/lib/state/dashboard-state";
import type { DashboardUrlStateWarning } from "@/lib/state/url-state";

import { ActiveFilterChips } from "./ActiveFilterChips";

export interface FilterBarProps {
  readonly value: DashboardFilterState;
  readonly onChange: (state: DashboardFilterState) => void;
  readonly warnings?: readonly DashboardUrlStateWarning[];
  readonly onReset?: () => void;
  readonly className?: string;
}

const inputClassName =
  "w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600";

export function FilterBar({
  value,
  onChange,
  warnings = [],
  onReset,
  className
}: FilterBarProps) {
  function updateState(patch: Partial<DashboardFilterState>) {
    onChange(normalizeDashboardFilterState({ ...value, ...patch }));
  }

  function removeFilter(filter: DashboardFilterKey) {
    switch (filter) {
      case "tab":
        updateState({ tab: DEFAULT_DASHBOARD_FILTER_STATE.tab });
        break;
      case "mapLayer":
        updateState({ mapLayer: DEFAULT_DASHBOARD_FILTER_STATE.mapLayer });
        break;
      case "state":
        updateState({ state: undefined });
        break;
      case "crop":
        updateState({ crop: undefined });
        break;
      case "event":
        updateState({ event: undefined });
        break;
      case "rotationRegime":
        updateState({ rotationRegime: undefined });
        break;
      case "selectedEntity":
        updateState({ selectedEntity: undefined });
        break;
      case "mapView":
        updateState({ mapView: undefined });
        break;
    }
  }

  return (
    <section
      aria-label="Dashboard filters"
      className={["border border-slate-200 bg-white p-4", className ?? ""].join(
        " "
      )}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Active tab
          <select
            className={inputClassName}
            onChange={(event) =>
              updateState({ tab: event.currentTarget.value as DashboardTab })
            }
            value={value.tab}
          >
            {DASHBOARD_TAB_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Map layer
          <select
            className={inputClassName}
            onChange={(event) =>
              updateState({
                mapLayer: event.currentTarget.value as MapLayerId
              })
            }
            value={value.mapLayer}
          >
            {MAP_LAYER_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          State
          <input
            className={inputClassName}
            onChange={(event) =>
              updateState({ state: optionalText(event.currentTarget.value) })
            }
            placeholder="IA"
            type="text"
            value={value.state ?? ""}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Crop
          <select
            className={inputClassName}
            onChange={(event) =>
              updateState({
                crop: optionalText(event.currentTarget.value) as
                  | CropId
                  | undefined
              })
            }
            value={value.crop ?? ""}
          >
            <option value="">All crops</option>
            {CROP_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Extreme event
          <select
            className={inputClassName}
            onChange={(event) =>
              updateState({
                event: optionalText(event.currentTarget.value) as
                  | ExtremeEventId
                  | undefined
              })
            }
            value={value.event ?? ""}
          >
            <option value="">All events</option>
            {EXTREME_EVENT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Rotation regime
          <select
            className={inputClassName}
            onChange={(event) =>
              updateState({
                rotationRegime: optionalText(event.currentTarget.value) as
                  | RotationRegimeId
                  | undefined
              })
            }
            value={value.rotationRegime ?? ""}
          >
            <option value="">All regimes</option>
            {ROTATION_REGIME_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Selected entity
          <input
            className={inputClassName}
            onChange={(event) =>
              updateState({
                selectedEntity: optionalText(event.currentTarget.value)
              })
            }
            placeholder="county:19001"
            type="text"
            value={value.selectedEntity ?? ""}
          />
        </label>

        <fieldset className="grid gap-2 border border-slate-200 p-3">
          <legend className="px-1 text-sm font-medium text-slate-700">
            Map view
          </legend>
          <div className="grid grid-cols-3 gap-2">
            <label className="grid gap-1 text-xs font-medium text-slate-600">
              Longitude
              <input
                className={inputClassName}
                inputMode="decimal"
                onChange={(event) =>
                  updateMapView(value, updateState, {
                    longitude: optionalNumber(event.currentTarget.value)
                  })
                }
                type="number"
                value={value.mapView?.center[0] ?? ""}
              />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600">
              Latitude
              <input
                className={inputClassName}
                inputMode="decimal"
                onChange={(event) =>
                  updateMapView(value, updateState, {
                    latitude: optionalNumber(event.currentTarget.value)
                  })
                }
                type="number"
                value={value.mapView?.center[1] ?? ""}
              />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600">
              Zoom
              <input
                className={inputClassName}
                inputMode="decimal"
                min={0}
                onChange={(event) =>
                  updateMapView(value, updateState, {
                    zoom: optionalNumber(event.currentTarget.value)
                  })
                }
                type="number"
                value={value.mapView?.zoom ?? ""}
              />
            </label>
          </div>
        </fieldset>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
        <ActiveFilterChips
          onClearAll={onReset ?? (() => onChange(DEFAULT_DASHBOARD_FILTER_STATE))}
          onRemoveFilter={removeFilter}
          value={value}
        />

        {warnings.length > 0 ? (
          <div
            aria-live="polite"
            className="border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            role="status"
          >
            <p className="font-medium">Some URL filters were reset.</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {warnings.map((warning) => (
                <li key={`${warning.param}-${warning.value}`}>
                  {warning.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const numberValue = Number(trimmed);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function updateMapView(
  value: DashboardFilterState,
  updateState: (patch: Partial<DashboardFilterState>) => void,
  patch: {
    readonly longitude?: number;
    readonly latitude?: number;
    readonly zoom?: number;
  }
) {
  const longitude =
    "longitude" in patch ? patch.longitude : value.mapView?.center[0];
  const latitude =
    "latitude" in patch ? patch.latitude : value.mapView?.center[1];
  const zoom = "zoom" in patch ? patch.zoom : value.mapView?.zoom;

  if (
    longitude === undefined ||
    latitude === undefined ||
    zoom === undefined
  ) {
    updateState({ mapView: undefined });
    return;
  }

  updateState({
    mapView: {
      center: [longitude, latitude],
      zoom
    }
  });
}
