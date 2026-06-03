"use client";

import type { MapLayerId } from "@/lib/data/types";
import {
  CORN_BELT_MAP_LAYERS,
  type CornBeltMapLayer
} from "@/features/map/map-layers";

export interface MapLayerControlProps {
  readonly value: MapLayerId;
  readonly onChange: (layerId: MapLayerId) => void;
  readonly layers?: readonly CornBeltMapLayer[];
  readonly className?: string;
}

export function MapLayerControl({
  value,
  onChange,
  layers = CORN_BELT_MAP_LAYERS,
  className
}: MapLayerControlProps) {
  return (
    <section
      aria-label="Layer controls"
      className={["border border-slate-200 bg-white p-3", className ?? ""].join(
        " "
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Layers</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Rotation, extremes, and prediction layers share the same fallback
            map contract.
          </p>
        </div>
        <span className="shrink-0 border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
          Fallback only
        </span>
      </div>

      <div aria-label="Map layer" className="mt-3 grid gap-2" role="radiogroup">
        {layers.map((layer) => (
          <label
            className={[
              "grid cursor-pointer gap-1 border px-3 py-2 text-sm",
              value === layer.id
                ? "border-emerald-700 bg-emerald-50 text-emerald-950"
                : "border-slate-200 bg-white text-slate-700"
            ].join(" ")}
            key={layer.id}
          >
            <span className="flex items-center gap-2">
              <input
                checked={value === layer.id}
                className="h-4 w-4 accent-emerald-700"
                name="corn-belt-map-layer"
                onChange={() => onChange(layer.id)}
                type="radio"
                value={layer.id}
              />
              <span className="font-medium text-slate-950">{layer.label}</span>
            </span>
            <span className="ml-6 text-xs leading-5 text-slate-600">
              {layer.group} - {layer.sourceIds.length} source
              {layer.sourceIds.length === 1 ? "" : "s"}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
