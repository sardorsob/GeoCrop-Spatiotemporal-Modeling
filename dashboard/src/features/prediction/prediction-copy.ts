import type { CropId, RotationRegimeId } from "@/lib/data/types";

export const predictionCopy = {
  title: "Task 4 prediction diagnostics",
  summary:
    "Held-out crop prediction metrics, ablation comparisons, SHAP feature ranking, and rotation-regime checks.",
  emptyState:
    "No Task 4 prediction diagnostics are available yet. Confirm the Task 4 normalized artifacts loaded before using this panel.",
  missingMetrics:
    "Headline test metrics are unavailable in the normalized Task 4 data.",
  cornSoyCaveat:
    "Corn and soybean classes remain the primary confusion pair; compare both off-diagonal directions before interpreting aggregate accuracy.",
  irregularRegimeCaveat:
    "Irregular rotation strata have fewer evaluation pixels and mixed crop histories, so treat those scores as directional diagnostics rather than standalone model quality.",
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

      if (lower === "ndvi" || lower === "shap") {
        return lower.toUpperCase();
      }

      if (index === 0) {
        return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
      }

      return lower;
    });

  return words.join(" ");
}
