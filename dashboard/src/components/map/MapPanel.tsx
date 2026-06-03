"use client";

import { useMemo } from "react";
import { Info, Layers, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UsChoropleth } from "./UsChoropleth";
import {
  CORN_BELT_MAP_LAYERS,
  getCornBeltMapLayer
} from "@/features/map/map-layers";
import {
  CORN_BELT_FALLBACK_GEOGRAPHIES,
  createCornBeltMapSelectionContext,
  type CornBeltMapSelectionContext
} from "@/features/map/map-selection";
import type { MapLayerId } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export interface MapPanelProps {
  readonly activeLayerId: MapLayerId;
  readonly onLayerChange: (layerId: MapLayerId) => void;
  readonly selectedGeographyId?: string;
  readonly onSelectionChange?: (context: CornBeltMapSelectionContext) => void;
}

export function MapPanel({
  activeLayerId,
  onLayerChange,
  selectedGeographyId,
  onSelectionChange
}: MapPanelProps) {
  const activeLayer = getCornBeltMapLayer(activeLayerId);

  const selectedGeography =
    CORN_BELT_FALLBACK_GEOGRAPHIES.find((g) => g.id === selectedGeographyId) ??
    CORN_BELT_FALLBACK_GEOGRAPHIES[0];

  const selectionContext = useMemo(
    () => createCornBeltMapSelectionContext(selectedGeography, activeLayer),
    [activeLayer, selectedGeography]
  );

  const valuesByStateCode = useMemo<Record<string, number | undefined>>(() => {
    const map: Record<string, number | undefined> = {};
    for (const geography of CORN_BELT_FALLBACK_GEOGRAPHIES) {
      const legendItemId = geography.legendItemIds[activeLayerId];
      const idx = activeLayer.legend.findIndex((item) => item.id === legendItemId);
      if (idx >= 0) map[geography.stateCode] = idx;
    }
    return map;
  }, [activeLayerId, activeLayer]);

  const cornBeltStateCount = useMemo(() => {
    const set = new Set<string>();
    for (const g of CORN_BELT_FALLBACK_GEOGRAPHIES) set.add(g.stateCode);
    return set.size;
  }, []);

  function colorScale(value: number | undefined): string {
    if (value === undefined) return "#f1f5f9"; // soft slate for no-data
    // categorical: pick the legend color
    const idx = Math.max(0, Math.min(activeLayer.legend.length - 1, Math.round(value)));
    return activeLayer.legend[idx]?.color ?? "#cbd5e1";
  }

  function handleSelect(stateCode: string, stateName: string) {
    const geography = CORN_BELT_FALLBACK_GEOGRAPHIES.find(
      (g) => g.stateCode === stateCode
    );
    if (!geography) {
      onSelectionChange?.(
        createCornBeltMapSelectionContext(
          { ...CORN_BELT_FALLBACK_GEOGRAPHIES[0], id: `state:${stateCode}`, stateCode, label: stateName },
          activeLayer
        )
      );
      return;
    }
    onSelectionChange?.(createCornBeltMapSelectionContext(geography, activeLayer));
  }

  return (
    <Card asChild className="overflow-hidden">
      <section aria-label="Corn Belt map surface">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-900">Corn Belt geographic surface</h2>
            <Badge variant="amber" className="ml-1 px-2 text-[10px]">Schematic fallback</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Click a state to push selection to the panels below. Coloring uses{" "}
            <span className="font-medium text-slate-700">{activeLayer.label}</span> from
            exported Task 1–4 artifacts.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Select value={activeLayerId} onValueChange={(v) => onLayerChange(v as MapLayerId)}>
            <SelectTrigger className="h-9 w-auto min-w-52 gap-1">
              <Layers className="size-3.5 text-slate-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CORN_BELT_MAP_LAYERS.map((layer) => (
                <SelectItem key={layer.id} value={layer.id}>{layer.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Info className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96">
              <p className="text-sm font-semibold text-slate-900">{activeLayer.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{activeLayer.description}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {activeLayer.caveat} {activeLayer.fallbackReason}
              </p>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sources</p>
                <ul className="mt-2 grid gap-1.5">
                  {activeLayer.sourceNotes.map((s) => (
                    <li key={s.sourceId} className="text-xs text-slate-600">
                      <span className="font-medium text-slate-800">{s.label}</span>
                      <span className="ml-1.5 text-slate-400">· {s.statusText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <CardContent className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <UsChoropleth
          values={valuesByStateCode}
          colorScale={colorScale}
          selectedState={extractStateCode(selectedGeography.id)}
          onSelect={handleSelect}
          format={(v) => activeLayer.legend[Math.round(v)]?.label ?? v.toString()}
        />

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Legend</p>
            <ul className="mt-2 grid gap-1.5">
              {activeLayer.legend.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="size-3.5 shrink-0 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.label}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm">
                <span className="size-3.5 shrink-0 rounded border border-slate-200 bg-slate-100" />
                <span className="text-slate-500">No data</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Selection</p>
            <p className="mt-1.5 text-base font-semibold text-slate-900">
              {selectionContext.selection.label}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              {selectionContext.selection.id}
            </p>
            <div className="mt-3 border-t border-slate-100 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {activeLayer.label}
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {selectionContext.displayValue}
              </p>
            </div>
            <div className="mt-2 border-t border-slate-100 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Source</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{selectionContext.sourceLabel}</p>
            </div>
          </div>

          <p className={cn("text-[10px] leading-4 text-slate-400", cornBeltStateCount === 0 && "hidden")}>
            Corn Belt coverage: {cornBeltStateCount} states. Other states render as no-data.
          </p>
        </div>
      </CardContent>
      </section>
    </Card>
  );
}

function extractStateCode(geographyId: string): string | undefined {
  const match = geographyId.match(/^state:([A-Z]{2})/);
  return match?.[1];
}
