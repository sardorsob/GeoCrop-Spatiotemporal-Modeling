import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type {
  DataPointSource,
  MarkovTransition,
  RotationClassSummary,
  RotationGeoSummary,
  RotationThresholdSensitivity
} from "@/lib/data/types";

import { RotationPanel } from "../RotationPanel";

const classSource: DataPointSource = {
  sourceId: "task2-areal-stats-by-class",
  rowCount: 3,
  path: "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv",
  label: "Task 2 areal statistics by class",
  dateStamp: "2026-04-12",
  denominator: "Valid classified cropland pixels",
  caveat: "Areal percentages use the valid classified cropland denominator."
};

const geoSource: DataPointSource = {
  sourceId: "task2-areal-stats-by-region",
  rowCount: 4,
  path: "../artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv",
  label: "Task 2 areal statistics by region",
  dateStamp: "2026-04-12",
  denominator: "Valid classified cropland pixels within geography",
  caveat: "Geographic shares are aggregate state or county evidence."
};

const markovSource: DataPointSource = {
  sourceId: "task2-markov-transition-probs",
  rowCount: 25,
  path: "../artifacts/tables/task2/task2__markov_transition_probs.csv",
  label: "Task 2 Markov transition probabilities",
  caveat: "Transitions summarize observed crop-to-crop changes."
};

const thresholdSource: DataPointSource = {
  sourceId: "task2-threshold-sensitivity-grid",
  rowCount: 3,
  path: "../artifacts/tables/task2/task2__threshold_sensitivity_grid.csv",
  label: "Task 2 threshold sensitivity grid",
  denominator: "2,084,112 eligible pixels",
  caveat: "Sensitivity rows are a separate threshold experiment."
};

const classSummaries: readonly RotationClassSummary[] = [
  {
    rotationClass: "regular",
    pixelCount: 570_202,
    areaHa: 17_669_192.4,
    percentOfValid: 27.36,
    source: classSource
  },
  {
    rotationClass: "monoculture",
    pixelCount: 81_308,
    areaHa: 2_519_539.9,
    percentOfValid: 3.9,
    source: classSource
  },
  {
    rotationClass: "irregular",
    pixelCount: 1_432_602,
    areaHa: 44_392_900.1,
    percentOfValid: 68.74,
    source: classSource
  }
];

const geographySummaries: readonly RotationGeoSummary[] = [
  {
    geographyId: "17",
    geographyName: "Illinois",
    geographyKind: "state",
    stateCode: "IL",
    stateFips: "17",
    nPixels: 293_524,
    pctRegular: 40.35,
    pctMonoculture: 5.07,
    pctIrregular: 54.58,
    source: geoSource
  },
  {
    geographyId: "19",
    geographyName: "Iowa",
    geographyKind: "state",
    stateCode: "IA",
    stateFips: "19",
    nPixels: 321_601,
    pctRegular: 39.87,
    pctMonoculture: 6.93,
    pctIrregular: 53.2,
    source: geoSource
  },
  {
    geographyId: "17197",
    geographyName: "Will County, Illinois",
    geographyKind: "county",
    stateCode: "IL",
    stateFips: "17",
    countyFips: "17197",
    nPixels: 18_000,
    pctRegular: 44.2,
    pctMonoculture: 4.5,
    pctIrregular: 51.3,
    source: geoSource
  },
  {
    geographyId: "17019",
    geographyName: "Champaign County, Illinois",
    geographyKind: "county",
    stateCode: "IL",
    stateFips: "17",
    countyFips: "17019",
    nPixels: 16_000,
    pctRegular: 44.2,
    pctMonoculture: 5.1,
    pctIrregular: 50.7,
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
    alternationMin: 0.5,
    patternDistanceMax: 3,
    pctRegular: 34.79,
    pctMonoculture: 6.04,
    pctIrregular: 59.17,
    nPixels: 2_084_112,
    source: thresholdSource
  },
  {
    alternationMin: 0.55,
    patternDistanceMax: 3,
    pctRegular: 34.48,
    pctMonoculture: 6.04,
    pctIrregular: 59.48,
    nPixels: 2_084_112,
    source: thresholdSource
  },
  {
    alternationMin: 0.7,
    patternDistanceMax: 5,
    pctRegular: 37.55,
    pctMonoculture: 6.04,
    pctIrregular: 56.4,
    nPixels: 2_084_112,
    source: thresholdSource
  }
];

describe("RotationPanel", () => {
  it("orders rule, source-backed composition, and measured geography", () => {
    render(
      <RotationPanel
        classSummaries={classSummaries}
        geographyFigure={<section aria-label="Measured rotation map">Map evidence</section>}
        geographySummaries={geographySummaries}
        markovTransitions={markovTransitions}
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    const sequences = screen.getByRole("region", { name: "Schematic rotation rules" });
    const composition = screen.getByRole("region", { name: "Rotation class composition" });
    const map = screen.getByRole("region", { name: "Measured rotation map" });
    const ranking = screen.getByRole("region", { name: "Geographic rotation ranking" });

    expect(sequences.compareDocumentPosition(composition) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(composition.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(map.compareDocumentPosition(ranking) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(within(composition).getAllByTestId("rotation-composition-cell")).toHaveLength(100);
    expect(within(composition).getByText("27.36%")).toBeInTheDocument();
    expect(within(composition).getByText("3.90%")).toBeInTheDocument();
    expect(within(composition).getByText("68.74%")).toBeInTheDocument();
    expect(within(composition).getByText("2,084,112 eligible pixels")).toBeInTheDocument();
    expect(within(composition).getByText("2026-04-12")).toBeInTheDocument();
  });

  it("marks every sequence as schematic and defines irregular neutrally", () => {
    render(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={geographySummaries}
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    expect(screen.getAllByText("Schematic example · not an observed field")).toHaveLength(3);
    expect(screen.getByRole("list", { name: "Regular rotation decade sequence" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Monoculture decade sequence" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Irregular decade sequence" })).toBeInTheDocument();
    expect(
      screen.getAllByText("Outside the strict alternation and monoculture templates; this label does not imply poor management or field condition.")
    ).toHaveLength(2);
  });

  it("keeps a pinned map geography, its detail, and its within-grain rank consistent", () => {
    const { rerender } = render(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={geographySummaries}
        selectedEntity="17"
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    expect(screen.getByText("Pinned geography · Illinois")).toBeInTheDocument();
    expect(screen.getByText("Rank 1 of 2 states")).toBeInTheDocument();

    rerender(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={geographySummaries}
        selectedEntity="17197"
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    const selectedRow = screen.getByRole("listitem", { name: /Will County, Illinois/ });
    expect(selectedRow).toHaveAttribute("aria-current", "true");
    expect(within(selectedRow).getByText("Rank 1")).toBeInTheDocument();
    expect(screen.getByText("Pinned geography · Will County, Illinois")).toBeInTheDocument();
    expect(screen.getByText("Rank 1 of 2 counties")).toBeInTheDocument();

    const equalRow = screen.getByRole("listitem", { name: /Champaign County, Illinois/ });
    expect(within(equalRow).getByText("Rank 1")).toBeInTheDocument();
  });

  it("emits only complete source-supported threshold rows", () => {
    const onThresholdChange = vi.fn();
    render(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={geographySummaries}
        onThresholdChange={onThresholdChange}
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    const comparison = screen.getByRole("region", { name: "Discrete threshold sensitivity" });
    const select = within(comparison).getByLabelText("Sensitivity threshold row");
    expect(within(select).getAllByRole("option")).toHaveLength(3);
    expect(within(comparison).getByText("34.79% regular")).toBeInTheDocument();

    fireEvent.change(select, { target: { value: "a0.70-d5.00" } });

    expect(onThresholdChange).toHaveBeenCalledWith(thresholdSensitivity[2]);
    expect(within(comparison).getByText("37.55% regular")).toBeInTheDocument();
    expect(within(comparison).getByText("56.40% irregular")).toBeInTheDocument();
  });

  it("keeps the dated class result separate from the sensitivity experiment", () => {
    render(
      <RotationPanel
        classSummaries={classSummaries}
        geographySummaries={geographySummaries}
        thresholdSensitivity={thresholdSensitivity}
      />
    );

    expect(
      screen.getByText(/The dated class summary and the threshold-sensitivity grid are separate exports/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("Task 2 areal statistics by class").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Task 2 threshold sensitivity grid").length).toBeGreaterThan(0);
  });
});
