import type {
  CropId,
  GeographyKind,
  RotationClassId
} from "@/lib/data/types";

export const ROTATION_COPY = {
  eyebrow: "Rotation evidence",
  heading: "Task 2 rotation",
  summary:
    "Review valid-cropland rotation classes, geographic class shares, and Task 2 transition/sensitivity context.",
  classRegionLabel: "Rotation class summaries",
  geographyRegionLabel: "Geographic rotation summaries",
  sourceRegionLabel: "Task 2 rotation source notes",
  classEmptyState:
    "No rotation class summaries are available in the normalized Task 2 data.",
  geographyEmptyState:
    "No geographic rotation summaries are available. Confirm county or region Task 2 artifacts loaded before using map-linked comparisons.",
  noSelection:
    "No map geography is selected. Select a map region to compare it against the loaded geographic summaries.",
  methodCaveat:
    "Bayesian thresholding, Markov transition probabilities, and threshold sensitivity rows provide directional Task 2 evidence; class percentages depend on valid classified cropland pixels and the selected rotation thresholds."
} as const;

export const rotationClassLabels = {
  regular: "Regular rotation",
  monoculture: "Monoculture",
  irregular: "Irregular"
} as const satisfies Readonly<Record<RotationClassId, string>>;

export const rotationClassDescriptions = {
  regular: "Alternating crop patterns that meet the Task 2 regular-rotation threshold.",
  monoculture: "Repeated crop histories that remain in the same dominant crop class.",
  irregular: "Crop histories outside the regular and monoculture threshold definitions."
} as const satisfies Readonly<Record<RotationClassId, string>>;

export const cropLabels = {
  corn: "Corn",
  soybean: "Soybean",
  winter_wheat: "Winter wheat",
  oats: "Oats",
  other_cropland: "Other cropland"
} as const satisfies Readonly<Record<CropId, string>>;

export const geographyKindLabels = {
  state: "State",
  county: "County",
  region: "Region",
  pixel: "Pixel"
} as const satisfies Readonly<Record<GeographyKind, string>>;

export function formatPercent(value: number): string {
  return `${toPercentValue(value).toLocaleString("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  })}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0
  });
}

export function formatPixels(value: number): string {
  return `${formatCount(value)} pixels`;
}

export function formatAreaHa(value: number): string {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  })} ha`;
}

export function formatThreshold(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

export function toPercentValue(value: number): number {
  return Math.abs(value) <= 1 ? value * 100 : value;
}
