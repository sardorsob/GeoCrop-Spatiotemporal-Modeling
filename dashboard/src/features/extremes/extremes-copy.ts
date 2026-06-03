import type { CropId, ExtremeEventId } from "@/lib/data/types";
import {
  CROP_OPTIONS,
  EXTREME_EVENT_OPTIONS,
  getDashboardOptionLabel
} from "@/lib/state/dashboard-state";

export const EXTREMES_COPY = {
  eyebrow: "Extremes",
  heading: "Task 3 soil moisture extremes",
  summary:
    "State and crop summaries compare soil moisture anomaly z-scores with NIG drought posterior evidence for the Task 3 event windows.",
  emptyState:
    "No Task 3 soil moisture anomalies match the selected filters. Review the event, crop, and state filters or confirm the normalized Task 3 anomaly artifacts are available.",
  zScoreCaveat:
    "Z-scores compare observed soil moisture anomalies against the event baseline; positive values mark wetter-than-baseline weeks and negative values mark drier-than-baseline weeks.",
  nigCaveat:
    "NIG P(drought) is a posterior drought probability, so it should be read alongside the z-score direction rather than as a standalone wetness score.",
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
    shortLabel: "Wet anomaly window",
    description: "2019 Midwest flood event window",
    interpretation:
      "Wet event interpretation: high NIG P(drought) can indicate non-drought posterior context despite wet anomaly framing."
  },
  plains_drought_2022: {
    label: getEventLabel("plains_drought_2022"),
    shortLabel: "Dry anomaly window",
    description: "2022 Plains drought event window",
    interpretation:
      "Dry event interpretation: P(drought) below 0.1 marks drought evidence when the z-score context is dry."
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

export function formatProbability(value: number): string {
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
