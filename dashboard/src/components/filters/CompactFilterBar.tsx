"use client";

import { ChevronDown, Filter, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type {
  CropId,
  DashboardFilterState,
  ExtremeEventId,
  MapLayerId,
  RotationRegimeId
} from "@/lib/data/types";
import {
  CROP_OPTIONS,
  DEFAULT_DASHBOARD_FILTER_STATE,
  EXTREME_EVENT_OPTIONS,
  MAP_LAYER_OPTIONS,
  ROTATION_REGIME_OPTIONS,
  getDashboardOptionLabel,
  normalizeDashboardFilterState,
  type DashboardFilterKey
} from "@/lib/state/dashboard-state";
import type { DashboardUrlStateWarning } from "@/lib/state/url-state";

export interface CompactFilterBarProps {
  readonly value: DashboardFilterState;
  readonly onChange: (state: DashboardFilterState) => void;
  readonly warnings?: readonly DashboardUrlStateWarning[];
  readonly onReset?: () => void;
}

interface ActiveChip {
  readonly key: DashboardFilterKey;
  readonly label: string;
  readonly value: string;
}

const SELECT_CLASS =
  "h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500";

const INPUT_CLASS =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500";

function NativeSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={SELECT_CLASS} {...props}>{children}</select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
    </div>
  );
}

export function CompactFilterBar({
  value,
  onChange,
  warnings = [],
  onReset
}: CompactFilterBarProps) {
  function update(patch: Partial<DashboardFilterState>) {
    onChange(normalizeDashboardFilterState({ ...value, ...patch }));
  }

  const chips = getActiveChips(value);

  function removeChip(key: DashboardFilterKey) {
    switch (key) {
      case "mapLayer":
        update({ mapLayer: DEFAULT_DASHBOARD_FILTER_STATE.mapLayer });
        break;
      case "state":
        update({ state: undefined });
        break;
      case "crop":
        update({ crop: undefined });
        break;
      case "event":
        update({ event: undefined });
        break;
      case "rotationRegime":
        update({ rotationRegime: undefined });
        break;
      case "selectedEntity":
        update({ selectedEntity: undefined });
        break;
      case "mapView":
        update({ mapView: undefined });
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <Field label="Crop">
          <NativeSelect
            value={value.crop ?? ""}
            onChange={(e) => update({ crop: (e.currentTarget.value || undefined) as CropId | undefined })}
          >
            <option value="">All crops</option>
            {CROP_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Extreme event">
          <NativeSelect
            value={value.event ?? ""}
            onChange={(e) => update({ event: (e.currentTarget.value || undefined) as ExtremeEventId | undefined })}
          >
            <option value="">All events</option>
            {EXTREME_EVENT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Rotation regime">
          <NativeSelect
            value={value.rotationRegime ?? ""}
            onChange={(e) => update({ rotationRegime: (e.currentTarget.value || undefined) as RotationRegimeId | undefined })}
          >
            <option value="">All regimes</option>
            {ROTATION_REGIME_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="State">
          <input
            className={INPUT_CLASS}
            placeholder="IA"
            value={value.state ?? ""}
            onChange={(e) => update({ state: e.currentTarget.value.trim() || undefined })}
          />
        </Field>

        <Field label="Map layer">
          <NativeSelect
            value={value.mapLayer}
            onChange={(e) => update({ mapLayer: e.currentTarget.value as MapLayerId })}
          >
            {MAP_LAYER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Selected entity">
          <input
            className={INPUT_CLASS}
            placeholder="state:IA"
            value={value.selectedEntity ?? ""}
            onChange={(e) => update({ selectedEntity: e.currentTarget.value.trim() || undefined })}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="size-3.5" />
              Advanced
              {chips.length > 0 && (
                <Badge variant="primary" className="ml-1 h-5 px-1.5 py-0 text-[10px]">
                  {chips.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Map view coordinates</SheetTitle>
              <SheetDescription>Fine-tune the map viewport coordinates and zoom.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6 py-5">
              <fieldset className="grid gap-1.5">
                <legend className="text-xs font-medium uppercase tracking-wide text-slate-500">Map view</legend>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    aria-label="Longitude"
                    type="number"
                    inputMode="decimal"
                    placeholder="lon"
                    className={INPUT_CLASS}
                    value={value.mapView?.center[0] ?? ""}
                    onChange={(e) => updateMapView(value, update, { lon: parseOptionalNumber(e.currentTarget.value) })}
                  />
                  <input
                    aria-label="Latitude"
                    type="number"
                    inputMode="decimal"
                    placeholder="lat"
                    className={INPUT_CLASS}
                    value={value.mapView?.center[1] ?? ""}
                    onChange={(e) => updateMapView(value, update, { lat: parseOptionalNumber(e.currentTarget.value) })}
                  />
                  <input
                    aria-label="Zoom"
                    type="number"
                    inputMode="decimal"
                    placeholder="zoom"
                    min={0}
                    className={INPUT_CLASS}
                    value={value.mapView?.zoom ?? ""}
                    onChange={(e) => updateMapView(value, update, { zoom: parseOptionalNumber(e.currentTarget.value) })}
                  />
                </div>
              </fieldset>
            </div>
          </SheetContent>
        </Sheet>

        <div className={cn("flex flex-wrap items-center gap-1.5", chips.length === 0 && "hidden")}>
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => removeChip(chip.key)}
              className="group inline-flex h-7 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              <span className="text-emerald-600">{chip.label}:</span>
              <span>{chip.value}</span>
              <X className="size-3 text-emerald-500 group-hover:text-emerald-700" />
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-slate-500 hover:text-slate-700"
            onClick={() => (onReset ? onReset() : onChange(DEFAULT_DASHBOARD_FILTER_STATE))}
          >
            Clear all
          </Button>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <span className="font-semibold">URL filters were partially reset.</span>{" "}
          {warnings.map((w) => w.message).join(" · ")}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { readonly label: string; readonly children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function getActiveChips(state: DashboardFilterState): readonly ActiveChip[] {
  const chips: ActiveChip[] = [];
  if (state.mapLayer !== DEFAULT_DASHBOARD_FILTER_STATE.mapLayer) {
    chips.push({ key: "mapLayer", label: "Layer", value: getDashboardOptionLabel(MAP_LAYER_OPTIONS, state.mapLayer) });
  }
  if (state.state) chips.push({ key: "state", label: "State", value: state.state });
  if (state.crop) chips.push({ key: "crop", label: "Crop", value: getDashboardOptionLabel(CROP_OPTIONS, state.crop) });
  if (state.event) chips.push({ key: "event", label: "Event", value: getDashboardOptionLabel(EXTREME_EVENT_OPTIONS, state.event) });
  if (state.rotationRegime) chips.push({ key: "rotationRegime", label: "Regime", value: getDashboardOptionLabel(ROTATION_REGIME_OPTIONS, state.rotationRegime) });
  if (state.selectedEntity) chips.push({ key: "selectedEntity", label: "Selection", value: state.selectedEntity });
  return chips;
}

function parseOptionalNumber(v: string): number | undefined {
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function updateMapView(
  state: DashboardFilterState,
  update: (patch: Partial<DashboardFilterState>) => void,
  patch: { lon?: number; lat?: number; zoom?: number }
) {
  const lon = "lon" in patch ? patch.lon : state.mapView?.center[0];
  const lat = "lat" in patch ? patch.lat : state.mapView?.center[1];
  const zoom = "zoom" in patch ? patch.zoom : state.mapView?.zoom;
  if (lon === undefined || lat === undefined || zoom === undefined) {
    update({ mapView: undefined });
    return;
  }
  update({ mapView: { center: [lon, lat], zoom } });
}
