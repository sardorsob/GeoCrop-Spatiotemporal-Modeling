import type {
  CropId,
  GeographyKind,
  RotationClassId
} from "@/lib/data/types";

export const ROTATION_COPY = {
  eyebrow: "Act II · Read the land's memory",
  heading: "Task 2 rotation",
  summary:
    "A decade of crop choices leaves a sequence. First read the classification rule, then its overall composition, and only then the measured geography.",
  sequenceRegionLabel: "Schematic rotation rules",
  classRegionLabel: "Rotation class composition",
  geographyRegionLabel: "Geographic rotation ranking",
  thresholdRegionLabel: "Discrete threshold sensitivity",
  sourceRegionLabel: "Task 2 rotation source notes",
  classEmptyState:
    "No dated rotation class summary is available in the normalized Task 2 data.",
  geographyEmptyState:
    "No measured state or county rotation summaries are available.",
  noSelection:
    "No map geography is pinned. The state ranking is shown as an exact-value path.",
  methodCaveat:
    "The dated class summary and the threshold-sensitivity grid are separate exports. Their percentages need not match: use the class artifact for the reported composition and the grid only to compare its discrete source rows."
} as const;

export const rotationClassLabels = {
  regular: "Regular rotation",
  monoculture: "Monoculture",
  irregular: "Irregular"
} as const satisfies Readonly<Record<RotationClassId, string>>;

export const rotationClassDescriptions = {
  regular: "Meets the strict repeating alternation template used by Task 2.",
  monoculture: "Remains in the same dominant crop class across the sequence.",
  irregular:
    "Outside the strict alternation and monoculture templates; this label does not imply poor management or field condition."
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

export function formatExactPercent(value: number): string {
  return `${toPercentValue(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
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
