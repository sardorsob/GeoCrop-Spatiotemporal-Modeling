import type { CropId, ExtremeEventId } from "@/lib/data/types";
import {
  CROP_OPTIONS,
  EXTREME_EVENT_OPTIONS,
  getDashboardOptionLabel
} from "@/lib/state/dashboard-state";

export const EXTREMES_COPY = {
  eyebrow: "Act III · Watch the system under stress",
  heading: "Task 3 soil moisture extremes",
  summary:
    "The same crop and the same zero-centered scale hold still while the atlas moves from the 2019 flood to the 2022 drought.",
  emptyState:
    "No Task 3 soil moisture anomalies are available for this crop. The matched frames remain visible so absence is not mistaken for zero.",
  zScoreCaveat:
    "Mean z is anomaly magnitude and direction; it is the map color. Positive values are wetter than the multi-year baseline and negative values are drier.",
  nigCaveat:
    "The NIG posterior predictive percentile accounts for baseline uncertainty: values near 0 sit in the dry tail and values near 1 in the wet tail. It is not a confidence interval around mean z.",
  comparisonCaveat:
    "Read horizontally. Geography, crop, and color scale are matched; event windows and available state × crop observations are not assumed to be identical.",
  denominatorFallback: "Pixel-weeks in the selected event, state, and crop window"
} as const;

export const EXTREME_EVENT_DETAILS: Readonly<
  Record<
    ExtremeEventId,
    {
      readonly label: string;
      readonly shortLabel: string;
      readonly description: string;
      readonly interpretation: string;
    }
  >
> = {
  midwest_flood_2019: {
    label: getEventLabel("midwest_flood_2019"),
    shortLabel: "Wet event window",
    description: "2019 Midwest flood",
    interpretation:
      "Positive mean z locates wetter-than-baseline conditions; a NIG percentile nearer 1 places the observation farther into the posterior wet tail."
  },
  plains_drought_2022: {
    label: getEventLabel("plains_drought_2022"),
    shortLabel: "Dry event window",
    description: "2022 Plains drought",
    interpretation:
      "Negative mean z locates drier-than-baseline conditions; a NIG percentile nearer 0 places the observation farther into the posterior dry tail."
  }
};

export function getCropLabel(crop: CropId): string {
  return getDashboardOptionLabel(CROP_OPTIONS, crop);
}

export function getEventLabel(eventId: ExtremeEventId): string {
  return getDashboardOptionLabel(EXTREME_EVENT_OPTIONS, eventId);
}

export function formatZScore(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  });
}

export function formatSignedZScore(value: number): string {
  if (!Number.isFinite(value)) {
    return "Not reported";
  }

  const sign = value < 0 ? "−" : "+";
  return `${sign}${Math.abs(value).toFixed(4)}`;
}

export function formatProbability(value: number): string {
  if (!Number.isFinite(value)) {
    return "Not reported";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  });
}

export function formatPercent(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "percent"
  });
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0
  });
}
