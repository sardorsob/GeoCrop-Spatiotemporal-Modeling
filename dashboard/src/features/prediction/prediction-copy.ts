import type { CropId, RotationRegimeId } from "@/lib/data/types";

export const predictionCopy = {
  title: "Task 4 prediction diagnostics",
  summary:
    "Follow crop history, seasonal greenness, and soil moisture into the model—then inspect what they add, where the model confuses crops, and when history makes the next crop more legible.",
  emptyState:
    "No Task 4 prediction diagnostics are available yet. Confirm the Task 4 normalized artifacts loaded before using this chapter.",
  missingMetrics:
    "Headline test metrics are unavailable in the normalized Task 4 data.",
  ablationBranchCaveat:
    "NDVI and SMAP configurations are separate branches from the same CDL baseline; their lifts are not additive. The full model is compared back to CDL + NDVI.",
  cornSoyCaveat:
    "Corn and soybean are the dominant cross-confusion pair. Counts and row shares remain printed so the comparison does not depend on color or hover.",
  regimeCaveat:
    "These strata have unequal denominators and different crop histories. The gap describes this evaluation; it does not prove that a rotation regime causes accuracy.",
  confusionFallback:
    "Confusion counts are unavailable in the normalized test metrics. Use the documented fallback figure for matrix review.",
  confusionFallbackPath: "../artifacts/figures/task4/task4_test_confusion_matrix.png"
} as const;

export const cropOrder: readonly CropId[] = [
  "other_cropland",
  "corn",
  "soybean",
  "winter_wheat",
  "oats"
];

export const cropLabels: Readonly<Record<CropId, string>> = {
  other_cropland: "Other cropland",
  corn: "Corn",
  soybean: "Soybean",
  winter_wheat: "Winter wheat",
  oats: "Oats"
};

export const regimeLabels: Readonly<Record<RotationRegimeId, string>> = {
  regular: "Regular",
  monoculture: "Monoculture",
  irregular: "Irregular"
};

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatPercentagePointDelta(value: number): string {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${Math.abs(value).toFixed(2)} pp`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatShapValue(value: number): string {
  return value.toFixed(3);
}

export function formatFeatureLabel(feature: string): string {
  const words = feature
    .trim()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();

      if (["cdl", "ndvi", "shap", "smap"].includes(lower)) {
        return lower.toUpperCase();
      }

      if (index === 0) {
        return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
      }

      return lower;
    });

  return words.join(" ");
}
