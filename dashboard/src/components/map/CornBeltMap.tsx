"use client";

import { useMemo, useState } from "react";

import { MapLayerControl } from "./MapLayerControl";
import { MapLegend } from "./MapLegend";
import {
  CORN_BELT_MAP_LAYERS,
  getCornBeltMapLayer
} from "@/features/map/map-layers";
import {
  CORN_BELT_FALLBACK_GEOGRAPHIES,
  createCornBeltMapSelectionContext,
  type CornBeltFallbackGeography,
  type CornBeltMapSelectionContext
} from "@/features/map/map-selection";
import type { MapLayerId } from "@/lib/data/types";
import { DEFAULT_DASHBOARD_FILTER_STATE } from "@/lib/state/dashboard-state";

export interface CornBeltMapProps {
  readonly activeLayerId?: MapLayerId;
  readonly selectedGeographyId?: string;
  readonly onLayerChange?: (layerId: MapLayerId) => void;
  readonly onSelectionChange?: (context: CornBeltMapSelectionContext) => void;
  readonly className?: string;
}

export function CornBeltMap({
  activeLayerId,
  selectedGeographyId,
  onLayerChange,
  onSelectionChange,
  className
}: CornBeltMapProps) {
  const [uncontrolledLayerId, setUncontrolledLayerId] = useState<MapLayerId>(
    DEFAULT_DASHBOARD_FILTER_STATE.mapLayer
  );
  const [uncontrolledSelectionId, setUncontrolledSelectionId] =
    useState<string>("state:IA");

  const currentLayerId = activeLayerId ?? uncontrolledLayerId;
  const activeLayer = getCornBeltMapLayer(currentLayerId);
  const currentSelectionId = selectedGeographyId ?? uncontrolledSelectionId;
  const selectedGeography =
    CORN_BELT_FALLBACK_GEOGRAPHIES.find(
      (geography) => geography.id === currentSelectionId
    ) ?? CORN_BELT_FALLBACK_GEOGRAPHIES[0];
  const selectionContext = useMemo(
    () => createCornBeltMapSelectionContext(selectedGeography, activeLayer),
    [activeLayer, selectedGeography]
  );

  function handleLayerChange(nextLayerId: MapLayerId) {
    if (activeLayerId === undefined) {
      setUncontrolledLayerId(nextLayerId);
    }

    onLayerChange?.(nextLayerId);
  }

  function handleGeographySelect(geography: CornBeltFallbackGeography) {
    if (selectedGeographyId === undefined) {
      setUncontrolledSelectionId(geography.id);
    }

    onSelectionChange?.(
      createCornBeltMapSelectionContext(geography, activeLayer)
    );
  }

  return (
    <section
      aria-label="Corn Belt map surface"
      className={[
        "grid gap-4 border border-slate-200 bg-white p-4",
        className ?? ""
      ].join(" ")}
    >
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            TASK-005 map
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Corn Belt map
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This is a source-backed fallback map surface. It uses exported
            dashboard artifacts and a schematic state tile layout because no
            browser-ready GeoJSON or TopoJSON is available yet.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Tap a state tile or tab to it and press Enter to send selected
            geography and active layer context to downstream panels. The
            fallback is not pixel-precise and should not be read as county
            boundary, raster, or field-level geometry.
          </p>
        </div>
        <div className="border border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
          <p className="font-semibold">Fallback limitation</p>
          <p>
            Mobile touch is supported through the state tiles; fine-grained
            county or pixel interaction waits on browser-ready map geometry.
          </p>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <MapLayerControl
          layers={CORN_BELT_MAP_LAYERS}
          onChange={handleLayerChange}
          value={currentLayerId}
        />

        <figure className="grid gap-3">
          <div className="border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {activeLayer.label}
                </p>
                <p className="text-xs leading-5 text-slate-600">
                  {activeLayer.description}
                </p>
              </div>
              <p className="text-xs font-medium text-slate-500">
                Schematic state fallback
              </p>
            </div>

            <div
              aria-label={`${activeLayer.label} fallback state tiles`}
              className="grid min-h-[24rem] grid-cols-6 grid-rows-5 gap-2"
            >
              {CORN_BELT_FALLBACK_GEOGRAPHIES.map((geography) => {
                const isSelected = geography.id === currentSelectionId;
                const color = getGeographyColor(geography, activeLayer.id);

                return (
                  <button
                    aria-label={`Select ${geography.label}`}
                    aria-pressed={isSelected}
                    className={[
                      "grid min-h-20 content-between border-2 p-2 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2",
                      isSelected ? "bg-white" : "bg-white/80"
                    ].join(" ")}
                    key={geography.id}
                    onClick={() => handleGeographySelect(geography)}
                    style={{
                      borderColor: color,
                      boxShadow: isSelected
                        ? `0 0 0 3px ${hexToRgba(color, 0.18)}`
                        : undefined,
                      gridColumn: `${geography.gridColumn} / span ${
                        geography.gridColumnSpan ?? 1
                      }`,
                      gridRow: `${geography.gridRow} / span ${
                        geography.gridRowSpan ?? 1
                      }`
                    }}
                    type="button"
                  >
                    <span className="text-sm font-semibold text-slate-950">
                      {geography.stateCode}
                    </span>
                    <span className="text-xs font-medium leading-5 text-slate-700">
                      {geography.values[activeLayer.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <figcaption className="text-sm leading-6 text-slate-600">
            Source-backed fallback: state tile placement is schematic and
            intentionally avoids implying county boundaries, raster pixels, or
            field-level precision.
          </figcaption>

          <section
            aria-label="Selected map context"
            className="grid gap-2 border border-slate-200 bg-white p-3"
          >
            <h3 className="text-sm font-semibold text-slate-950">
              Selected context
            </h3>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Geography
                </dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  {selectionContext.selection.label}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Layer value
                </dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  {selectionContext.displayValue}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Selection id
                </dt>
                <dd className="mt-1 font-mono text-xs text-slate-700">
                  {selectionContext.selection.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Source
                </dt>
                <dd className="mt-1 text-slate-700">
                  {selectionContext.sourceLabel}
                </dd>
              </div>
            </dl>
          </section>
        </figure>

        <MapLegend layer={activeLayer} />
      </div>
    </section>
  );
}

function getGeographyColor(
  geography: CornBeltFallbackGeography,
  layerId: MapLayerId
): string {
  const layer = getCornBeltMapLayer(layerId);
  const legendItemId = geography.legendItemIds[layerId];

  return (
    layer.legend.find((item) => item.id === legendItemId)?.color ?? "#64748b"
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
