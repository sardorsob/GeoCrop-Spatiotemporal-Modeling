"use client";

import { useEffect, useMemo, useState } from "react";
import { Layers3, MapPin } from "lucide-react";

import { EvidenceLens } from "@/components/map/EvidenceLens";
import { UsChoropleth } from "@/components/map/UsChoropleth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  EVIDENCE_MAP_LAYERS,
  formatEvidenceValue,
  formatLegendValue,
  getEvidenceFill,
  getEvidenceGradient,
  getEvidenceMapLayer,
  normalizeEvidenceMapLayerId
} from "@/features/map/map-layers";
import {
  createCornBeltMapSelectionContext,
  createNoDataSelectionContext,
  type CornBeltMapSelectionContext
} from "@/features/map/map-selection";
import type { NormalizedDashboardData } from "@/lib/data/normalize";
import {
  selectEventMapEvidence,
  selectRotationMapEvidence,
  type MapEvidenceResult,
  type MapEvidenceValue
} from "@/lib/data/selectors";
import type {
  CropId,
  ExtremeEventId,
  MapLayerId
} from "@/lib/data/types";

interface GeographyReference {
  readonly id: string;
  readonly name: string;
}

export interface MapPanelProps {
  readonly activeLayerId: MapLayerId;
  readonly onLayerChange?: (layerId: MapLayerId) => void;
  readonly data?: Pick<NormalizedDashboardData, "task2" | "task3">;
  readonly selectedCrop?: CropId;
  readonly selectedEvent?: ExtremeEventId;
  readonly selectedGeographyId?: string;
  readonly onSelectionChange?: (context: CornBeltMapSelectionContext) => void;
  readonly showLayerControl?: boolean;
}

export function MapPanel({
  activeLayerId,
  onLayerChange,
  data,
  selectedCrop = "corn",
  selectedEvent = "midwest_flood_2019",
  selectedGeographyId,
  onSelectionChange,
  showLayerControl = true
}: MapPanelProps) {
  const normalizedLayerId = normalizeEvidenceMapLayerId(activeLayerId);
  const activeLayer = getEvidenceMapLayer(normalizedLayerId);
  const [rotationGrain, setRotationGrain] = useState<"state" | "county">("state");
  const geographyKind = activeLayer.taskId === "task3" ? "state" : rotationGrain;
  const [preview, setPreview] = useState<GeographyReference>();
  const [pinned, setPinned] = useState<GeographyReference | undefined>(() =>
    selectedGeographyId
      ? { id: selectedGeographyId.replace(/^(state|county):/, ""), name: selectedGeographyId }
      : undefined
  );

  const evidence = useMemo<MapEvidenceResult>(() => {
    if (!data) {
      return emptyEvidence(activeLayer.unit);
    }

    return activeLayer.taskId === "task2"
      ? selectRotationMapEvidence(data.task2, {
          geographyKind,
          metric: "pctRegular"
        })
      : selectEventMapEvidence(data.task3, {
          eventId: selectedEvent,
          crop: selectedCrop
        });
  }, [activeLayer.taskId, activeLayer.unit, data, geographyKind, selectedCrop, selectedEvent]);

  const evidenceById = useMemo(
    () => new Map(evidence.values.map((value) => [value.geographyId, value])),
    [evidence.values]
  );
  const visibleReference = preview ?? pinned;
  const visibleContext = visibleReference
    ? createContext(visibleReference, evidenceById, activeLayer, evidence.values.length)
    : undefined;

  useEffect(() => {
    function clearPinned(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreview(undefined);
        setPinned(undefined);
      }
    }

    document.addEventListener("keydown", clearPinned);
    return () => document.removeEventListener("keydown", clearPinned);
  }, []);

  function clearSelection() {
    setPreview(undefined);
    setPinned(undefined);
  }

  function changeGrain(next: "state" | "county") {
    setRotationGrain(next);
    clearSelection();
  }

  function pinGeography(id: string, name: string) {
    const reference = { id, name };
    const context = createContext(reference, evidenceById, activeLayer, evidence.values.length);
    setPreview(undefined);
    setPinned(reference);
    onSelectionChange?.(context);
  }

  return (
    <Card asChild className="overflow-hidden border-rule bg-paper">
      <section aria-label="Corn Belt map surface">
        <div aria-label="Corn Belt evidence map" role="region">
          <header className="flex flex-col gap-4 border-b border-rule px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Corn Belt evidence map
                </h2>
                <Badge variant="outline" className="border-rule text-primary">
                  13 study states
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {activeLayer.description} Albers-projected boundaries keep area comparison honest.
              </p>
              {activeLayerId !== normalizedLayerId ? (
                <p className="mt-2 text-xs font-medium text-dry" role="status">
                  The legacy {activeLayerId} layer is unsupported; showing measured regular rotation share.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {activeLayer.taskId === "task2" ? (
                <div className="inline-flex rounded-full border border-rule bg-muted p-1">
                  {(["state", "county"] as const).map((kind) => (
                    <Button
                      aria-label={`${kind === "state" ? "State" : "County"} geography`}
                      aria-pressed={geographyKind === kind}
                      className="min-h-11 rounded-full"
                      key={kind}
                      onClick={() => changeGrain(kind)}
                      size="sm"
                      variant={geographyKind === kind ? "outline" : "ghost"}
                    >
                      {kind === "state" ? "States" : "Counties"}
                    </Button>
                  ))}
                </div>
              ) : null}

              {showLayerControl ? (
                <Select
                  onValueChange={(value) => {
                    clearSelection();
                    onLayerChange?.(value as MapLayerId);
                  }}
                  value={normalizedLayerId}
                >
                  <SelectTrigger aria-label="Map evidence layer" className="min-h-11 min-w-56 border-rule bg-paper">
                    <Layers3 className="size-4 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVIDENCE_MAP_LAYERS.map((layer) => (
                      <SelectItem key={layer.id} value={layer.id}>
                        {layer.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          </header>

          <CardContent className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-4">
              <UsChoropleth
                colorScale={(value) => getEvidenceFill(activeLayer, value, evidence.domain)}
                formatValue={(value) => formatEvidenceValue(value, activeLayer.unit)}
                geographyKind={geographyKind}
                onPin={pinGeography}
                onPreview={(id, name) => setPreview({ id, name })}
                onPreviewEnd={() => setPreview(undefined)}
                previewId={preview?.id}
                selectedId={pinned?.id}
                values={evidence.values}
              />

              {geographyKind === "county" ? (
                <p className="rounded-xl border border-rule bg-field/35 px-3 py-2 text-xs leading-5 text-muted-foreground">
                  County values are aggregate shares joined by five-digit GEOID. They do not imply pixel or field precision.
                </p>
              ) : null}

              <MapLegend layer={activeLayer} evidence={evidence} />

              <details className="rounded-xl border border-rule bg-paper p-3" open={evidence.values.length <= 20}>
                <summary className="cursor-pointer text-sm font-semibold text-ink">
                  Exact values ({evidence.values.length})
                </summary>
                <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1">
                  {evidence.values.map((value) => (
                    <li key={value.geographyId}>
                      <button
                        aria-label={`Pin ${value.geographyName}: ${formatEvidenceValue(value.value, activeLayer.unit)}`}
                        aria-pressed={pinned?.id === value.geographyId}
                        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-field/45 focus-visible:bg-field/45"
                        onClick={() => pinGeography(value.geographyId, value.geographyName)}
                        type="button"
                      >
                        <span>
                          <span className="block font-medium text-ink">{value.geographyName}</span>
                          <span className="block text-xs text-muted-foreground">
                            {value.geographyKind === "county"
                              ? `GEOID ${value.geographyId}`
                              : `Rank ${value.rank} of ${evidence.values.length}`}
                          </span>
                        </span>
                        <span className="font-mono font-semibold tabular-nums text-ink">
                          {formatEvidenceValue(value.value, activeLayer.unit)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            <div className="space-y-3">
              <EvidenceLens
                context={visibleContext}
                isPinned={pinned !== undefined && preview === undefined}
                onReset={clearSelection}
              />
              <div className="rounded-xl border border-rule/80 bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">
                <p className="font-semibold text-ink">Source and method</p>
                <p className="mt-1">{activeLayer.sourceNotes.map((source) => source.label).join(" · ")}</p>
                <p className="mt-2">{activeLayer.caveat}</p>
              </div>
            </div>
          </CardContent>
        </div>
      </section>
    </Card>
  );
}

function createContext(
  reference: GeographyReference,
  evidenceById: ReadonlyMap<string, MapEvidenceValue>,
  layer: ReturnType<typeof getEvidenceMapLayer>,
  evidenceCount: number
): CornBeltMapSelectionContext {
  const evidence = evidenceById.get(reference.id);

  return evidence
    ? createCornBeltMapSelectionContext(evidence, layer, evidenceCount)
    : createNoDataSelectionContext(reference.id, reference.name, layer, evidenceCount);
}

function emptyEvidence(unit: "%" | "z-score"): MapEvidenceResult {
  return {
    values: [],
    domain: unit === "%" ? [0, 100] : [-1, 1],
    unit,
    denominatorLabel: "No loaded evidence"
  };
}

function MapLegend({
  layer,
  evidence
}: {
  readonly layer: ReturnType<typeof getEvidenceMapLayer>;
  readonly evidence: MapEvidenceResult;
}) {
  const midpoint = (evidence.domain[0] + evidence.domain[1]) / 2;

  return (
    <ul aria-label="Map legend" className="grid grid-cols-3 gap-x-3 gap-y-2 text-xs text-muted-foreground">
      <li className="col-span-3 h-3 rounded-full border border-rule" style={{ background: getEvidenceGradient(layer) }} />
      <li>{formatLegendValue(evidence.domain[0], layer.unit)}</li>
      <li className="text-center">{formatLegendValue(midpoint, layer.unit)}</li>
      <li className="text-right">{formatLegendValue(evidence.domain[1], layer.unit)}</li>
      <li className="col-span-3 flex items-center gap-2">
        <span className="size-3 rounded-sm border border-rule bg-[#ded8cb]" />
        No data
      </li>
    </ul>
  );
}
