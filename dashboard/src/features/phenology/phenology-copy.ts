import type { CropId } from "@/lib/data/types";

export const CROP_LABELS = {
  corn: "Corn",
  soybean: "Soybean",
  winter_wheat: "Winter wheat",
  oats: "Oats",
  other_cropland: "Other cropland"
} as const satisfies Readonly<Record<CropId, string>>;

export const PHENOLOGY_COPY = {
  heading: "Task 1 phenology",
  eyebrow: "HSGP phenology evidence",
  summary:
    "Review crop-stage timing, model fit, and NDVI seasonality from normalized Task 1 artifacts.",
  missingHeading: "No Task 1 phenology data available",
  missingBody:
    "No normalized Task 1 metrics or NDVI series were provided to this panel.",
  metricsRegionLabel: "HSGP model metrics",
  chartRegionLabel: "NDVI phenology curve",
  uncertaintyLabel: "Uncertainty band: posterior 5-95 credible interval"
} as const;

export const STATIC_FALLBACK_FIGURES = [
  {
    src: "../artifacts/figures/task1/hsgp_phenology_crops.png",
    alt: "HSGP phenology crops static fallback",
    label: "HSGP phenology crops"
  },
  {
    src: "../artifacts/figures/task1/hsgp_phenology_corn_vs_soy.png",
    alt: "Corn and soybean phenology static fallback",
    label: "Corn vs soybean phenology"
  },
  {
    src: "../artifacts/figures/task1/calibration_diagnostics.png",
    alt: "Calibration diagnostics static fallback",
    label: "Calibration diagnostics"
  }
] as const;
