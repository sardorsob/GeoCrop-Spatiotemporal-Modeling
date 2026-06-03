"use client";

import type { DashboardFilterState } from "@/lib/data/types";
import {
  CROP_OPTIONS,
  DASHBOARD_TAB_OPTIONS,
  DEFAULT_DASHBOARD_FILTER_STATE,
  EXTREME_EVENT_OPTIONS,
  getDashboardOptionLabel,
  MAP_LAYER_OPTIONS,
  ROTATION_REGIME_OPTIONS,
  type DashboardFilterKey
} from "@/lib/state/dashboard-state";

interface ActiveFilterChip {
  readonly key: DashboardFilterKey;
  readonly label: string;
  readonly value: string;
}

export interface ActiveFilterChipsProps {
  readonly value: DashboardFilterState;
  readonly onRemoveFilter?: (filter: DashboardFilterKey) => void;
  readonly onClearAll?: () => void;
  readonly className?: string;
}

export function ActiveFilterChips({
  value,
  onRemoveFilter,
  onClearAll,
  className
}: ActiveFilterChipsProps) {
  const chips = getActiveFilterChips(value);

  return (
    <div
      aria-label="Active filters"
      className={["flex flex-wrap items-center gap-2", className ?? ""].join(
        " "
      )}
    >
      {chips.length === 0 ? (
        <p className="text-sm text-slate-600">No active filters</p>
      ) : (
        chips.map((chip) =>
          onRemoveFilter ? (
            <button
              aria-label={`Remove ${chip.label} filter`}
              className="inline-flex min-h-9 items-center gap-2 border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              key={chip.key}
              onClick={() => onRemoveFilter(chip.key)}
              type="button"
            >
              <span className="font-medium text-slate-950">{chip.label}</span>
              <span>{chip.value}</span>
              <span aria-hidden="true" className="text-slate-500">
                x
              </span>
            </button>
          ) : (
            <span
              className="inline-flex min-h-9 items-center gap-2 border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800"
              key={chip.key}
            >
              <span className="font-medium text-slate-950">{chip.label}</span>
              <span>{chip.value}</span>
            </span>
          )
        )
      )}
      {chips.length > 0 && onClearAll ? (
        <button
          className="min-h-9 border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          onClick={onClearAll}
          type="button"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

function getActiveFilterChips(
  value: DashboardFilterState
): readonly ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (value.tab !== DEFAULT_DASHBOARD_FILTER_STATE.tab) {
    chips.push({
      key: "tab",
      label: "Tab",
      value: getDashboardOptionLabel(DASHBOARD_TAB_OPTIONS, value.tab)
    });
  }

  if (value.mapLayer !== DEFAULT_DASHBOARD_FILTER_STATE.mapLayer) {
    chips.push({
      key: "mapLayer",
      label: "Layer",
      value: getDashboardOptionLabel(MAP_LAYER_OPTIONS, value.mapLayer)
    });
  }

  if (value.state) {
    chips.push({ key: "state", label: "State", value: value.state });
  }

  if (value.crop) {
    chips.push({
      key: "crop",
      label: "Crop",
      value: getDashboardOptionLabel(CROP_OPTIONS, value.crop)
    });
  }

  if (value.event) {
    chips.push({
      key: "event",
      label: "Event",
      value: getDashboardOptionLabel(EXTREME_EVENT_OPTIONS, value.event)
    });
  }

  if (value.rotationRegime) {
    chips.push({
      key: "rotationRegime",
      label: "Regime",
      value: getDashboardOptionLabel(
        ROTATION_REGIME_OPTIONS,
        value.rotationRegime
      )
    });
  }

  if (value.selectedEntity) {
    chips.push({
      key: "selectedEntity",
      label: "Selection",
      value: value.selectedEntity
    });
  }

  if (value.mapView) {
    chips.push({
      key: "mapView",
      label: "Map view",
      value: `${value.mapView.center[0]}, ${value.mapView.center[1]} @ ${value.mapView.zoom}`
    });
  }

  return chips;
}
