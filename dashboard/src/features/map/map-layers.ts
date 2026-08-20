import { sourceNotesById } from "@/lib/data/source-notes";
import type {
  ArtifactSourceId,
  DashboardTaskId,
  MapLayerId,
  SourceNote
} from "@/lib/data/types";

export type EvidenceMapLayerId =
  | "rotation-regular-probability"
  | "soil-moisture-anomaly";

export interface EvidenceMapLayer {
  readonly id: EvidenceMapLayerId;
  readonly taskId: Extract<DashboardTaskId, "task2" | "task3">;
  readonly label: string;
  readonly metricLabel: string;
  readonly description: string;
  readonly unit: "%" | "z-score";
  readonly colorMode: "sequential" | "diverging";
  readonly sourceIds: readonly ArtifactSourceId[];
  readonly sourceNotes: readonly SourceNote[];
  readonly caveat: string;
}

export const NO_DATA_COLOR = "#ded8cb";

export const EVIDENCE_MAP_LAYERS = [
  defineLayer({
    id: "rotation-regular-probability",
    taskId: "task2",
    label: "Regular rotation share",
    metricLabel: "Regular rotation share",
    description:
      "Measured share of valid classified cropland pixels assigned to the regular rotation class.",
    unit: "%",
    colorMode: "sequential",
    sourceIds: [
      "task2-areal-stats-by-region",
      "task2-areal-stats-by-county"
    ],
    caveat:
      "State and county fills are aggregate shares from dated Task 2 tables, not pixel- or field-level classifications."
  }),
  defineLayer({
    id: "soil-moisture-anomaly",
    taskId: "task3",
    label: "Mean soil-moisture anomaly",
    metricLabel: "Mean standardized anomaly",
    description:
      "State × crop mean z-score for the selected extreme-event window.",
    unit: "z-score",
    colorMode: "diverging",
    sourceIds: [
      "task3-midwest-flood-2019-anomaly-stats",
      "task3-plains-drought-2022-anomaly-stats"
    ],
    caveat:
      "Task 3 is shown only at state grain; positive and negative values use one crop-specific scale centered on zero."
  })
] as const satisfies readonly EvidenceMapLayer[];

const layersById = Object.fromEntries(
  EVIDENCE_MAP_LAYERS.map((layer) => [layer.id, layer])
) as Readonly<Record<EvidenceMapLayerId, EvidenceMapLayer>>;

export function normalizeEvidenceMapLayerId(layerId: MapLayerId): EvidenceMapLayerId {
  return layerId === "soil-moisture-anomaly"
    ? "soil-moisture-anomaly"
    : "rotation-regular-probability";
}

export function getEvidenceMapLayer(layerId: MapLayerId): EvidenceMapLayer {
  return layersById[normalizeEvidenceMapLayerId(layerId)];
}

export function getEvidenceFill(
  layer: EvidenceMapLayer,
  value: number | undefined,
  domain: readonly [number, number]
): string {
  if (value === undefined) {
    return NO_DATA_COLOR;
  }

  if (layer.colorMode === "sequential") {
    const span = Math.max(domain[1] - domain[0], Number.EPSILON);
    const t = clamp((value - domain[0]) / span);
    return mixHex("#edf1e3", "#2f6f4e", t);
  }

  if (value < 0) {
    return mixHex("#f4f0e6", "#b85f35", clamp(value / domain[0]));
  }

  return mixHex("#f4f0e6", "#24789a", clamp(value / domain[1]));
}

export function getEvidenceGradient(layer: EvidenceMapLayer): string {
  return layer.colorMode === "sequential"
    ? "linear-gradient(90deg, #edf1e3 0%, #8eaa78 52%, #2f6f4e 100%)"
    : "linear-gradient(90deg, #b85f35 0%, #f4f0e6 50%, #24789a 100%)";
}

export function formatEvidenceValue(value: number, unit: EvidenceMapLayer["unit"]): string {
  return unit === "%" ? `${value.toFixed(2)}%` : `${formatSigned(value)} z`;
}

export function formatLegendValue(value: number, unit: EvidenceMapLayer["unit"]): string {
  if (unit === "%") {
    return `${value.toFixed(2)}%`;
  }

  return formatSigned(value);
}

function defineLayer(
  layer: Omit<EvidenceMapLayer, "sourceNotes">
): EvidenceMapLayer {
  return {
    ...layer,
    sourceNotes: layer.sourceIds.map((sourceId) => sourceNotesById[sourceId])
  };
}

function formatSigned(value: number): string {
  if (value === 0) {
    return "0";
  }

  return `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(2)}`;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function mixHex(start: string, end: string, t: number): string {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  const mixed = startRgb.map((channel, index) =>
    Math.round(channel + (endRgb[index] - channel) * t)
  );

  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(value: string): readonly [number, number, number] {
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16)
  ];
}
