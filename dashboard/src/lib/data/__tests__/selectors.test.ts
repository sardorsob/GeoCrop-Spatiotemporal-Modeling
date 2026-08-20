import { describe, expect, it } from "vitest";

import {
  selectEventMapEvidence,
  selectRotationMapEvidence
} from "../selectors";
import type {
  AnomalyStateCropSummary,
  RotationGeoSummary
} from "../types";
import type { NormalizedDashboardData } from "../normalize";

const rotationRows: readonly RotationGeoSummary[] = [
  {
    geographyId: "IL",
    geographyName: "Illinois",
    geographyKind: "state",
    stateCode: "IL",
    stateFips: "17",
    nPixels: 100,
    pctRegular: 40,
    pctMonoculture: 5,
    pctIrregular: 55,
    source: { sourceId: "task2-areal-stats-by-region" }
  },
  {
    geographyId: "IA",
    geographyName: "Iowa",
    geographyKind: "state",
    stateCode: "IA",
    stateFips: "19",
    nPixels: 200,
    pctRegular: 30,
    pctMonoculture: 7,
    pctIrregular: 63,
    source: { sourceId: "task2-areal-stats-by-region" }
  }
];

const anomalyRows: readonly AnomalyStateCropSummary[] = [
  anomaly("midwest_flood_2019", "IL", "Illinois", 1.2, 100),
  anomaly("midwest_flood_2019", "IA", "Iowa", 0.4, 200),
  anomaly("plains_drought_2022", "IL", "Illinois", -2, 150),
  anomaly("plains_drought_2022", "IA", "Iowa", -0.8, 250),
  { ...anomaly("plains_drought_2022", "IA", "Iowa", -3, 10), crop: "soybean" }
];

describe("v2 evidence selectors", () => {
  it("returns ranked, source-backed rotation values with honest denominators", () => {
    const result = selectRotationMapEvidence(
      { geographySummaries: rotationRows },
      { geographyKind: "state", metric: "pctRegular" }
    );

    expect(result.domain).toEqual([0, 40]);
    expect(result.values).toEqual([
      expect.objectContaining({
        geographyId: "IL",
        value: 40,
        rank: 1,
        denominator: 100,
        source: { sourceId: "task2-areal-stats-by-region" }
      }),
      expect.objectContaining({
        geographyId: "IA",
        value: 30,
        rank: 2,
        denominator: 200
      })
    ]);
  });

  it("uses one crop-specific, zero-centered domain across both event maps", () => {
    const result = selectEventMapEvidence(
      { anomalySummaries: anomalyRows },
      { eventId: "midwest_flood_2019", crop: "corn" }
    );

    expect(result.domain).toEqual([-2, 2]);
    expect(result.values).toEqual([
      expect.objectContaining({
        geographyId: "IL",
        geographyKind: "state",
        value: 1.2,
        rank: 1,
        denominator: 100,
        source: { sourceId: "task3-midwest-flood-2019-anomaly-stats" }
      }),
      expect.objectContaining({
        geographyId: "IA",
        value: 0.4,
        rank: 2,
        denominator: 200
      })
    ]);
  });

  it("returns an explicit empty event slice without manufacturing geography", () => {
    const result = selectEventMapEvidence(
      { anomalySummaries: anomalyRows },
      { eventId: "midwest_flood_2019", crop: "winter_wheat" }
    );

    expect(result.values).toEqual([]);
    expect(result.domain).toEqual([-1, 1]);
  });
});

function anomaly(
  eventId: AnomalyStateCropSummary["eventId"],
  stateCode: AnomalyStateCropSummary["stateCode"],
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
          : "task3-plains-drought-2022-anomaly-stats"
    }
  };
}

if (false) {
  const data = {} as NormalizedDashboardData;

  // @ts-expect-error Task 4 has no geographic rotation evidence contract.
  selectRotationMapEvidence(data.task4, {
    geographyKind: "state",
    metric: "pctRegular"
  });
  // @ts-expect-error Task 4 has no geographic anomaly evidence contract.
  selectEventMapEvidence(data.task4, {
    eventId: "midwest_flood_2019",
    crop: "corn"
  });
}
