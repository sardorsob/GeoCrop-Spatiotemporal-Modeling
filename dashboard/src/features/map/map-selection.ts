import { sourceNotesById } from "@/lib/data/source-notes";
import type {
  ArtifactSourceId,
  MapSelection
} from "@/lib/data/types";
import type { MapEvidenceValue } from "@/lib/data/selectors";

import {
  formatEvidenceValue,
  type EvidenceMapLayer,
  type EvidenceMapLayerId
} from "./map-layers";

export interface CornBeltMapSelectionContext {
  readonly layerId: EvidenceMapLayerId;
  readonly selection: MapSelection;
  readonly geographyId: string;
  readonly displayValue: string;
  readonly metricLabel: string;
  readonly unit: EvidenceMapLayer["unit"];
  readonly rank?: number;
  readonly evidenceCount: number;
  readonly denominator?: number;
  readonly denominatorLabel: string;
  readonly sourceIds: readonly ArtifactSourceId[];
  readonly sourceLabel: string;
  readonly sourcePath?: string;
  readonly sourceDate?: string;
  readonly caveat: string;
}

export function createCornBeltMapSelectionContext(
  value: MapEvidenceValue,
  layer: EvidenceMapLayer,
  evidenceCount: number
): CornBeltMapSelectionContext {
  const registeredSource = sourceNotesById[value.source.sourceId];
  const prefix = value.geographyKind === "county" ? "county" : "state";

  return {
    layerId: layer.id,
    selection: {
      geographyKind: value.geographyKind,
      id: `${prefix}:${value.geographyId}`,
      label: value.geographyName,
      sourceId: value.source.sourceId
    },
    geographyId: value.geographyId,
    displayValue: formatEvidenceValue(value.value, layer.unit),
    metricLabel: layer.metricLabel,
    unit: layer.unit,
    rank: value.rank,
    evidenceCount,
    denominator: value.denominator,
    denominatorLabel:
      value.geographyKind === "county"
        ? "Valid classified cropland pixels within county"
        : layer.taskId === "task2"
          ? "Valid classified cropland pixels within state"
          : "Pixel-weeks in the selected event, state, and crop window",
    sourceIds: layer.sourceIds,
    sourceLabel: value.source.label ?? registeredSource.label,
    sourcePath: value.source.path ?? registeredSource.path,
    sourceDate: value.source.dateStamp ?? registeredSource.dateStamp,
    caveat: value.source.caveat ?? layer.caveat
  };
}

export function createNoDataSelectionContext(
  geographyId: string,
  geographyName: string,
  layer: EvidenceMapLayer,
  evidenceCount: number
): CornBeltMapSelectionContext {
  const source = layer.sourceNotes[0];

  return {
    layerId: layer.id,
    selection: {
      geographyKind: "state",
      id: `state:${geographyId}`,
      label: geographyName,
      sourceId: source.sourceId
    },
    geographyId,
    displayValue: "No measured value",
    metricLabel: layer.metricLabel,
    unit: layer.unit,
    evidenceCount,
    denominatorLabel:
      layer.taskId === "task2"
        ? "Valid classified cropland pixels within state"
        : "Pixel-weeks in the selected event, state, and crop window",
    sourceIds: layer.sourceIds,
    sourceLabel: source.label,
    sourcePath: source.path,
    sourceDate: source.dateStamp,
    caveat: layer.caveat
  };
}
