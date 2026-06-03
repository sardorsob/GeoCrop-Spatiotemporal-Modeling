import { sourceNotesById } from "@/lib/data/source-notes";
import type {
  ArtifactSourceId,
  MapLayer,
  MapLayerId,
  SourceNote
} from "@/lib/data/types";

export type CornBeltMapLayerGroup = "Rotation" | "Extremes" | "Prediction";

export interface CornBeltMapLayer extends MapLayer {
  readonly description: string;
  readonly fallbackReason: string;
  readonly group: CornBeltMapLayerGroup;
  readonly sourceNotes: readonly SourceNote[];
}

const fallbackReason =
  "No browser-ready GeoJSON/TopoJSON is available; this layer uses a code-native Corn Belt schematic backed by exported task artifacts.";

export const CORN_BELT_MAP_LAYERS = [
  defineLayer({
    id: "rotation-class",
    taskId: "task2",
    label: "Rotation class",
    group: "Rotation",
    description:
      "Dominant rotation class from Task 2 areal summaries, shown as a schematic fallback.",
    sourceIds: [
      "task2-areal-stats-by-class",
      "task2-areal-stats-by-county",
      "task2-areal-stats-by-region"
    ],
    legend: [
      { id: "regular", label: "Regular", color: "#047857" },
      { id: "monoculture", label: "Monoculture", color: "#d97706" },
      { id: "irregular", label: "Irregular", color: "#be123c" }
    ],
    caveat:
      "Rotation colors summarize exported class percentages; the map is not pixel-precise."
  }),
  defineLayer({
    id: "rotation-regular-probability",
    taskId: "task2",
    label: "Regular rotation probability",
    group: "Rotation",
    description:
      "Regular rotation share from Task 2 geography summaries, grouped into broad bins.",
    sourceIds: [
      "task2-areal-stats-by-county",
      "task2-areal-stats-by-region"
    ],
    legend: [
      { id: "high", label: "High regular share", color: "#065f46" },
      { id: "moderate", label: "Moderate regular share", color: "#16a34a" },
      { id: "low", label: "Low regular share", color: "#f59e0b" }
    ],
    caveat:
      "Regular rotation probability is represented with broad fallback classes until map geometry is available."
  }),
  defineLayer({
    id: "soil-moisture-anomaly",
    taskId: "task3",
    label: "Soil moisture anomaly",
    group: "Extremes",
    description:
      "Task 3 flood and drought anomaly statuses summarized by state and crop.",
    sourceIds: [
      "task3-midwest-flood-2019-anomaly-stats",
      "task3-plains-drought-2022-anomaly-stats"
    ],
    legend: [
      { id: "flood", label: "Flood anomaly watch", color: "#0284c7" },
      { id: "drought", label: "Drought anomaly watch", color: "#b45309" },
      { id: "mixed", label: "Mixed anomaly signal", color: "#7c3aed" },
      { id: "stable", label: "Lower anomaly signal", color: "#475569" }
    ],
    caveat:
      "Extreme-event values are state and crop summaries, not a continuous soil-moisture raster."
  }),
  defineLayer({
    id: "crop-prediction",
    taskId: "task4",
    label: "Crop prediction",
    group: "Prediction",
    description:
      "Prediction class emphasis from Task 4 split and held-out metric summaries.",
    sourceIds: ["task4-split-summary", "task4-test-metrics"],
    legend: [
      { id: "corn", label: "Corn", color: "#ca8a04" },
      { id: "soybean", label: "Soybean", color: "#16a34a" },
      { id: "winter-wheat", label: "Winter wheat", color: "#2563eb" },
      { id: "other", label: "Other cropland", color: "#64748b" }
    ],
    caveat:
      "Prediction labels indicate aggregate model context; this fallback is not an inference tile grid."
  }),
  defineLayer({
    id: "prediction-agreement",
    taskId: "task4",
    label: "Prediction agreement",
    group: "Prediction",
    description:
      "Agreement status from Task 4 held-out metrics and regime-stratified summaries.",
    sourceIds: ["task4-test-metrics", "task4-regime-stratified-metrics"],
    legend: [
      { id: "agreement", label: "Agreement", color: "#059669" },
      { id: "review", label: "Review", color: "#d97706" },
      { id: "disagreement", label: "Disagreement risk", color: "#dc2626" }
    ],
    caveat:
      "Agreement status is an interpretive dashboard layer derived from aggregate prediction artifacts."
  })
] as const satisfies readonly CornBeltMapLayer[];

const layersById = Object.fromEntries(
  CORN_BELT_MAP_LAYERS.map((layer) => [layer.id, layer])
) as Readonly<Record<MapLayerId, CornBeltMapLayer>>;

export function getCornBeltMapLayer(layerId: MapLayerId): CornBeltMapLayer {
  return layersById[layerId];
}

function defineLayer(
  layer: Omit<CornBeltMapLayer, "fallbackReason" | "sourceNotes" | "status">
): CornBeltMapLayer {
  return {
    ...layer,
    fallbackReason,
    sourceNotes: layer.sourceIds.map(getSourceNote),
    status: "fallback-only"
  };
}

function getSourceNote(sourceId: ArtifactSourceId): SourceNote {
  return sourceNotesById[sourceId];
}
