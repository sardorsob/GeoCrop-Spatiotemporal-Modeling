import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MapPanel } from "../MapPanel";
import {
  EVIDENCE_MAP_LAYERS,
  getEvidenceFill,
  normalizeEvidenceMapLayerId
} from "@/features/map/map-layers";
import type { NormalizedDashboardData } from "@/lib/data/normalize";
import type {
  AnomalyStateCropSummary,
  RotationGeoSummary,
  StudyStateCode
} from "@/lib/data/types";

const STUDY_STATES = [
  ["IL", "Illinois", "17", 40.35],
  ["IN", "Indiana", "18", 34.29],
  ["IA", "Iowa", "19", 39.87],
  ["KS", "Kansas", "20", 14.24],
  ["KY", "Kentucky", "21", 20.54],
  ["MI", "Michigan", "26", 18.1],
  ["MN", "Minnesota", "27", 28.2],
  ["MO", "Missouri", "29", 24.5],
  ["NE", "Nebraska", "31", 26.8],
  ["ND", "North Dakota", "38", 11.29],
  ["OH", "Ohio", "39", 22.85],
  ["SD", "South Dakota", "46", 28.17],
  ["WI", "Wisconsin", "55", 13.55]
] as const;

const geographySummaries: readonly RotationGeoSummary[] = [
  ...STUDY_STATES.map(([stateCode, geographyName, stateFips, pctRegular]) => ({
    geographyId: stateCode,
    geographyName,
    geographyKind: "state" as const,
    stateCode,
    stateFips,
    nPixels: 10_000,
    pctRegular,
    pctMonoculture: 5,
    pctIrregular: 95 - pctRegular,
    source: {
      sourceId: "task2-areal-stats-by-region" as const,
      path: "../artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv",
      label: "Task 2 areal statistics by region",
      dateStamp: "2026-04-12",
      caveat: "Measured state shares from the dated Task 2 artifact."
    }
  })),
  {
    geographyId: "17001",
    geographyName: "Adams County",
    geographyKind: "county",
    stateCode: "IL",
    stateFips: "17",
    countyFips: "001",
    nPixels: 3_805,
    pctRegular: 36.43,
    pctMonoculture: 1.05,
    pctIrregular: 62.52,
    source: {
      sourceId: "task2-areal-stats-by-county",
      path: "../artifacts/tables/task4/task2__areal_stats_by_county__20260412.csv",
      label: "Task 2 areal statistics by county",
      dateStamp: "2026-04-12",
      caveat: "County summaries use valid classified cropland pixels."
    }
  }
];

const anomalySummaries: readonly AnomalyStateCropSummary[] = [
  anomaly("midwest_flood_2019", "IA", "Iowa", 1.25, 1_000),
  anomaly("midwest_flood_2019", "IL", "Illinois", 0.75, 2_000),
  anomaly("plains_drought_2022", "IA", "Iowa", -2, 1_500),
  anomaly("plains_drought_2022", "IL", "Illinois", -0.5, 2_500)
];

const mapData: Pick<NormalizedDashboardData, "task2" | "task3"> = {
  task2: {
    classSummaries: [],
    geographySummaries,
    markovTransitions: [],
    thresholdSensitivity: []
  },
  task3: { anomalySummaries }
};

describe("MapPanel", () => {
  it("renders all 13 study states from numeric Task 2 evidence", () => {
    render(
      <MapPanel
        activeLayerId="rotation-regular-probability"
        data={mapData}
        onLayerChange={vi.fn()}
      />
    );

    const region = screen.getByRole("region", { name: "Corn Belt evidence map" });
    expect(within(region).getByText("13 study states")).toBeVisible();
    expect(within(region).getByRole("button", { name: "Select Iowa" })).toBeVisible();
    expect(within(region).getByText("No data")).toBeVisible();
    expect(within(region).queryByText(/schematic fallback/i)).not.toBeInTheDocument();
  });

  it("previews, pins, and clears the same evidence with pointer, keyboard, and reset", () => {
    const onSelectionChange = vi.fn();

    render(
      <MapPanel
        activeLayerId="rotation-regular-probability"
        data={mapData}
        onLayerChange={vi.fn()}
        onSelectionChange={onSelectionChange}
      />
    );

    const iowa = screen.getByRole("button", { name: "Select Iowa" });
    const lens = screen.getByRole("region", { name: "Evidence lens" });

    fireEvent.mouseEnter(iowa);
    expect(within(lens).getByText("Iowa")).toBeVisible();
    expect(within(lens).getByText("39.87%")).toBeVisible();

    fireEvent.click(iowa);
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        layerId: "rotation-regular-probability",
        displayValue: "39.87%",
        denominator: 10_000,
        rank: 2,
        selection: expect.objectContaining({ id: "state:IA", label: "Iowa" })
      })
    );
    expect(screen.getByRole("button", { name: "Reset pinned geography" })).toBeVisible();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(within(lens).getByText(/Hover, focus, or tap a geography/)).toBeVisible();

    fireEvent.focus(iowa);
    fireEvent.keyDown(iowa, { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Reset pinned geography" }));
    expect(within(lens).getByText(/Hover, focus, or tap a geography/)).toBeVisible();
  });

  it("offers county detail only for Task 2 and joins by five-digit GEOID", () => {
    render(
      <MapPanel
        activeLayerId="rotation-regular-probability"
        data={mapData}
        onLayerChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "County geography" }));

    expect(screen.getByText(/County values are aggregate shares/)).toBeVisible();
    expect(screen.getByRole("button", { name: /Pin Adams County: 36.43%/ })).toBeVisible();
    expect(screen.getByText("GEOID 17001")).toBeVisible();
  });

  it("uses one zero-centered source domain for Task 3 and never offers county grain", () => {
    render(
      <MapPanel
        activeLayerId="soil-moisture-anomaly"
        data={mapData}
        onLayerChange={vi.fn()}
        selectedCrop="corn"
        selectedEvent="midwest_flood_2019"
      />
    );

    const legend = screen.getByRole("list", { name: "Map legend" });
    expect(within(legend).getByText("−2.00")).toBeVisible();
    expect(within(legend).getByText("+2.00")).toBeVisible();
    expect(screen.queryByRole("button", { name: "County geography" })).not.toBeInTheDocument();
  });
});

describe("evidence map layer metadata", () => {
  it("offers only Task 2 and Task 3 layers with safe legacy normalization", () => {
    expect(EVIDENCE_MAP_LAYERS.map((layer) => [layer.id, layer.taskId])).toEqual([
      ["rotation-regular-probability", "task2"],
      ["soil-moisture-anomaly", "task3"]
    ]);
    expect(normalizeEvidenceMapLayerId("crop-prediction")).toBe(
      "rotation-regular-probability"
    );
    expect(normalizeEvidenceMapLayerId("prediction-agreement")).toBe(
      "rotation-regular-probability"
    );
    expect(normalizeEvidenceMapLayerId("rotation-class")).toBe(
      "rotation-regular-probability"
    );
  });

  it("keeps sequential and diverging endpoints stable across mapped features", () => {
    const rotation = EVIDENCE_MAP_LAYERS[0];
    const anomalyLayer = EVIDENCE_MAP_LAYERS[1];

    expect(getEvidenceFill(rotation, 0, [0, 40])).toBe("#edf1e3");
    expect(getEvidenceFill(rotation, 40, [0, 40])).toBe("#2f6f4e");
    expect(getEvidenceFill(anomalyLayer, -2, [-2, 2])).toBe("#b85f35");
    expect(getEvidenceFill(anomalyLayer, 0, [-2, 2])).toBe("#f4f0e6");
    expect(getEvidenceFill(anomalyLayer, 2, [-2, 2])).toBe("#24789a");
    expect(getEvidenceFill(anomalyLayer, undefined, [-2, 2])).toBe("#ded8cb");
  });
});

function anomaly(
  eventId: AnomalyStateCropSummary["eventId"],
  stateCode: StudyStateCode,
  state: string,
  meanZ: number,
  nPixelWeeks: number
): AnomalyStateCropSummary {
  return {
    eventId,
    state,
    stateCode,
    crop: "corn",
    meanZ,
    maxZ: Math.abs(meanZ),
    fractionObservedZGreaterThan1: 0,
    fractionObservedZGreaterThan1p5: 0,
    nPixelWeeks,
    meanNigPDrought: 0.5,
    fractionPDroughtBelow0p1: 0,
    source: {
      sourceId:
        eventId === "midwest_flood_2019"
          ? "task3-midwest-flood-2019-anomaly-stats"
          : "task3-plains-drought-2022-anomaly-stats",
      path: `../artifacts/tables/task3/${eventId}.csv`,
      label: eventId,
      dateStamp: "2026-04-12",
      caveat: "State × crop event-window summary."
    }
  };
}
