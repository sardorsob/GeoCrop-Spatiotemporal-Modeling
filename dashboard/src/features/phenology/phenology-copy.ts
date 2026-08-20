import type { CropId } from "@/lib/data/types";

export const CROP_LABELS = {
  corn: "Corn",
  soybean: "Soybean",
  winter_wheat: "Winter wheat",
  oats: "Oats",
  other_cropland: "Other cropland"
} as const satisfies Readonly<Record<CropId, string>>;

export const PHENOLOGY_CROPS = [
  "corn",
  "soybean",
  "winter_wheat"
] as const satisfies readonly CropId[];

export const CROP_CHART_COLORS = {
  corn: "#b66d00",
  soybean: "#0072b2",
  winter_wheat: "#00845f"
} as const satisfies Readonly<Record<(typeof PHENOLOGY_CROPS)[number], string>>;

export interface CropStage {
  readonly label: string;
  readonly shortLabel: string;
  readonly startDay: number;
  readonly endDay: number;
}

const SHARED_SUMMER_STAGES = [
  { label: "Planting", shortLabel: "Planting", startDay: 97, endDay: 140 },
  {
    label: "Emergence & vegetative growth",
    shortLabel: "Emergence",
    startDay: 140,
    endDay: 170
  },
  {
    label: "Canopy development",
    shortLabel: "Canopy",
    startDay: 170,
    endDay: 200
  }
] as const satisfies readonly CropStage[];

export const CROP_STAGES = {
  corn: [
    ...SHARED_SUMMER_STAGES,
    {
      label: "Peak greenness · tasseling / R3–R5",
      shortLabel: "Peak greenness",
      startDay: 200,
      endDay: 235
    },
    {
      label: "Grain fill & maturity",
      shortLabel: "Grain fill",
      startDay: 235,
      endDay: 260
    },
    {
      label: "Senescence & harvest",
      shortLabel: "Senescence & harvest",
      startDay: 260,
      endDay: 300
    }
  ],
  soybean: [
    ...SHARED_SUMMER_STAGES,
    {
      label: "Peak greenness · R3–R5",
      shortLabel: "Peak greenness",
      startDay: 200,
      endDay: 235
    },
    {
      label: "Grain fill & maturity",
      shortLabel: "Grain fill",
      startDay: 235,
      endDay: 260
    },
    {
      label: "Senescence & harvest",
      shortLabel: "Senescence & harvest",
      startDay: 260,
      endDay: 300
    }
  ],
  winter_wheat: [
    {
      label: "Spring green-up",
      shortLabel: "Spring green-up",
      startDay: 97,
      endDay: 110
    },
    {
      label: "Stem extension & heading",
      shortLabel: "Stem / heading",
      startDay: 110,
      endDay: 145
    },
    {
      label: "Peak greenness & flowering",
      shortLabel: "Peak / flowering",
      startDay: 145,
      endDay: 170
    },
    { label: "Grain fill", shortLabel: "Grain fill", startDay: 170, endDay: 200 },
    {
      label: "Senescence & harvest",
      shortLabel: "Senescence & harvest",
      startDay: 200,
      endDay: 220
    }
  ]
} as const satisfies Readonly<
  Record<(typeof PHENOLOGY_CROPS)[number], readonly CropStage[]>
>;

export const PHENOLOGY_COPY = {
  heading: "Task 1 phenology",
  eyebrow: "Act I · A crop year has a shape",
  summary:
    "The HSGP reconstructs a smooth seasonal NDVI curve for each crop. Read all three together: timing and curve shape carry more meaning than any isolated peak.",
  missingHeading: "No Task 1 phenology data available",
  missingBody:
    "The normalized Task 1 model and NDVI artifacts were not provided. The documented paper figures below remain the named fallback evidence.",
  metricsRegionLabel: "HSGP model metrics",
  chartRegionLabel: "NDVI phenology comparator",
  uncertaintyLabel:
    "Nested posterior uncertainty is compared with the empirical across-year spatial interquartile range.",
  focusedScaleNote:
    "Focused NDVI range 0.50–1.00; the vertical axis does not begin at zero."
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
