import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RotationPanel } from "../RotationPanel";
import type {
  DataPointSource,
  RotationClassSummary,
  RotationGeoSummary,
  RotationThresholdSensitivity,
  MarkovTransition
} from "@/lib/data/types";

const classSource: DataPointSource = {
  sourceId: "task2-areal-stats-by-class",
  rowCount: 3,
  path: "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv",
  label: "Task 2 areal statistics by class",
  dateStamp: "2026-04-12",
  denominator: "Valid classified cropland pixels",
  caveat:
    "Areal percentages use the valid classified cropland denominator from the exported artifact."
};

const geoSource: DataPointSource = {
  sourceId: "task2-areal-stats-by-region",
  rowCount: 2,
  path: "../artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv",
  label: "Task 2 areal statistics by region",
  dateStamp: "2026-04-12",
  denominator: "Valid classified cropland pixels within region",
  caveat:
    "Regional summaries are derived from the exported rotation classification artifact."
};

const markovSource: DataPointSource = {
  sourceId: "task2-markov-transition-probs",
  rowCount: 25,
  path: "../artifacts/tables/task2/task2__markov_transition_probs.csv",
  label: "Task 2 Markov transition probabilities",
  caveat:
    "Transition probabilities summarize observed crop-to-crop transitions in the scoped Task 2 artifact."
};

const thresholdSource: DataPointSource = {
  sourceId: "task2-threshold-sensitivity-grid",
  rowCount: 9,
  path: "../artifacts/tables/task2/task2__threshold_sensitivity_grid.csv",
  label: "Task 2 threshold sensitivity grid",
  denominator: "Valid classified cropland pixels",
  caveat:
    "Sensitivity rows show how class percentages vary under alternate rotation thresholds."
};

const classSummaries: readonly RotationClassSummary[] = [
  {
    rotationClass: "regular",
    pixelCount: 570202,
    areaHa: 17669192.4,
    percentOfValid: 27.36,
    source: classSource
  },
  {
    rotationClass: "monoculture",
    pixelCount: 81248,
    areaHa: 2517174.5,
    percentOfValid: 3.9,
    source: classSource
  },
  {
    rotationClass: "irregular",
    pixelCount: 1432205,
    areaHa: 44378741.1,
    percentOfValid: 68.74,
    source: classSource
  }
];

const geographySummaries: readonly RotationGeoSummary[] = [
  {
    geographyId: "state:IL",
    geographyName: "Illinois",
    geographyKind: "region",
    nPixels: 250000,
    pctRegular: 40.35,
    pctMonoculture: 5.07,
    pctIrregular: 54.58,
    source: geoSource
  },
  {
    geographyId: "state:IA",
    geographyName: "Iowa",
    geographyKind: "region",
    nPixels: 310000,
    pctRegular: 39.87,
    pctMonoculture: 4.91,
    pctIrregular: 55.22,
    source: geoSource
  }
];

const markovTransitions: readonly MarkovTransition[] = [
  {
    fromCrop: "corn",
    toCrop: "soybean",
    probability: 0.71,
    source: markovSource
  }
];

const thresholdSensitivity: readonly RotationThresholdSensitivity[] = [
  {
    alternationMin: 0.55,
    patternDistanceMax: 0.2,
    pctRegular: 27.36,
    pctMonoculture: 3.9,
    pctIrregular: 68.74,
    nPixels: 2087655,
    source: thresholdSource
  }
];

describe("RotationPanel", () => {
  it("renders class summaries, geographic summaries, selection context, and visible caveats", () => {
    render(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={geographySummaries}
        markovTransitions={markovTransitions}
        selectedEntity="Illinois"
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    expect(screen.getByRole("heading", { name: "Task 2 rotation" }))
      .toBeInTheDocument();

    const classChart = screen.getByRole("region", {
      name: "Rotation class summaries"
    });
    expect(within(classChart).getByText("Regular rotation")).toBeInTheDocument();
    expect(within(classChart).getByText("27.4%")).toBeInTheDocument();
    expect(within(classChart).getByText("570,202 pixels")).toBeInTheDocument();
    expect(within(classChart).getByText("17,669,192.4 ha")).toBeInTheDocument();
    expect(within(classChart).getByText("Monoculture")).toBeInTheDocument();
    expect(within(classChart).getByText("3.9%")).toBeInTheDocument();
    expect(within(classChart).getByText("Irregular")).toBeInTheDocument();
    expect(within(classChart).getByText("68.7%")).toBeInTheDocument();

    const ranking = screen.getByRole("table", {
      name: "Geographic rotation summaries"
    });
    const illinoisRow = within(ranking).getByRole("row", {
      name: /Illinois/i
    });
    expect(within(illinoisRow).getByText("Selected")).toBeInTheDocument();
    expect(within(illinoisRow).getByText("40.4%")).toBeInTheDocument();
    expect(within(illinoisRow).getByText("5.1%")).toBeInTheDocument();
    expect(within(illinoisRow).getByText("54.6%")).toBeInTheDocument();
    expect(
      screen.getByText("Selected geography: Illinois")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Bayesian thresholding, Markov transition probabilities, and threshold sensitivity/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Task 2 areal statistics by class")).toBeInTheDocument();
    expect(
      screen.getByText("../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv")
    ).toBeInTheDocument();
    expect(screen.getByText("3 rows")).toBeInTheDocument();
    expect(screen.getByText("2026-04-12")).toBeInTheDocument();
    expect(screen.getByText("Denominator: Valid classified cropland pixels"))
      .toBeInTheDocument();
  });

  it("shows an explicit geography empty state when no geographic rows exist", () => {
    render(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={[]}
        markovTransitions={[]}
        selectedGeographyId="state:IL"
        thresholdSensitivity={[]}
      />
    );

    expect(
      screen.getByText(/No geographic rotation summaries are available/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Selected geography: state:IL is not present in the loaded geographic summaries/i)
    ).toBeInTheDocument();
  });
});
