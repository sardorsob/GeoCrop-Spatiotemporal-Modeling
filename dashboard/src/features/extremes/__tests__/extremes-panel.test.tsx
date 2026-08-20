import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import type {
  AnomalyStateCropSummary,
  CropId,
  DataPointSource
} from "@/lib/data/types";

import { ExtremesPanel } from "../ExtremesPanel";

const floodSource: DataPointSource = {
  sourceId: "task3-midwest-flood-2019-anomaly-stats",
  rowCount: 42,
  path: "../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv",
  label: "Task 3 Midwest flood 2019 anomaly statistics",
  dateStamp: "2026-04-12",
  denominator: "Pixel-weeks in the selected event, state, and crop window",
  caveat: "State/crop means summarize an event window and do not resolve individual fields."
};

const droughtSource: DataPointSource = {
  sourceId: "task3-plains-drought-2022-anomaly-stats",
  rowCount: 38,
  path: "../artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv",
  label: "Task 3 Plains drought 2022 anomaly statistics",
  dateStamp: "2026-04-12",
  denominator: "Pixel-weeks in the selected event, state, and crop window",
  caveat: "The short SMAP baseline limits event interpretation."
};

const anomalySummaries: readonly AnomalyStateCropSummary[] = [
  {
    eventId: "midwest_flood_2019",
    state: "Illinois",
    stateCode: "IL",
    crop: "corn",
    meanZ: 0.8235,
    maxZ: 2.2511,
    fractionObservedZGreaterThan1: 0.4706,
    fractionObservedZGreaterThan1p5: 0.1457,
    nPixelWeeks: 2_178_324,
    meanNigPDrought: 0.7824,
    fractionPDroughtBelow0p1: 0.0003,
    source: floodSource
  },
  {
    eventId: "midwest_flood_2019",
    state: "Iowa",
    stateCode: "IA",
    crop: "soybean",
    meanZ: 0.5132,
    maxZ: 1.881,
    fractionObservedZGreaterThan1: 0.225,
    fractionObservedZGreaterThan1p5: 0.093,
    nPixelWeeks: 114_205,
    meanNigPDrought: 0.6811,
    fractionPDroughtBelow0p1: 0.0012,
    source: floodSource
  },
  {
    eventId: "plains_drought_2022",
    state: "Illinois",
    stateCode: "IL",
    crop: "corn",
    meanZ: -0.7645,
    maxZ: 3.1942,
    fractionObservedZGreaterThan1: 0.0312,
    fractionObservedZGreaterThan1p5: 0.0088,
    nPixelWeeks: 1_988_044,
    meanNigPDrought: 0.4128,
    fractionPDroughtBelow0p1: 0.1557,
    source: droughtSource
  },
  {
    eventId: "plains_drought_2022",
    state: "Kansas",
    stateCode: "KS",
    crop: "winter_wheat",
    meanZ: -1.1025,
    maxZ: 2.7121,
    fractionObservedZGreaterThan1: 0.0149,
    fractionObservedZGreaterThan1p5: 0.0034,
    nPixelWeeks: 542_905,
    meanNigPDrought: 0.2866,
    fractionPDroughtBelow0p1: 0.2431,
    source: droughtSource
  }
];

describe("ExtremesPanel", () => {
  it("renders both events for one crop with the same fixed zero-centered domain", () => {
    render(<ExtremesPanel anomalySummaries={anomalySummaries} selectedCrop="corn" />);

    expect(screen.getByRole("heading", { name: "Task 3 soil moisture extremes" })).toBeInTheDocument();
    expect(screen.getByText("Compared crop · Corn")).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Midwest flood 2019 map" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Plains drought 2022 map" })).toBeInTheDocument();

    const frames = screen.getAllByTestId("event-map-frame");
    expect(frames).toHaveLength(2);
    expect(frames[0]).toHaveAttribute("data-domain", "-1.0000:1.0000");
    expect(frames[1]).toHaveAttribute("data-domain", "-1.0000:1.0000");
    expect(screen.getAllByText("Shared mean z scale · −1.0000 to +1.0000")).toHaveLength(2);
  });

  it("offers all five crops as direct pressed buttons and updates the evidence", () => {
    const onCropChange = vi.fn();

    function CropHarness() {
      const [crop, setCrop] = useState<CropId>("corn");
      return (
        <ExtremesPanel
          anomalySummaries={anomalySummaries}
          onCropChange={(nextCrop) => {
            onCropChange(nextCrop);
            if (nextCrop) setCrop(nextCrop);
          }}
          selectedCrop={crop}
        />
      );
    }

    render(<CropHarness />);

    const cropGroup = screen.getByRole("group", { name: "Compared crop" });
    expect(within(cropGroup).getAllByRole("button")).toHaveLength(5);
    expect(screen.queryByRole("combobox", { name: "Compared crop" }))
      .not.toBeInTheDocument();
    expect(within(cropGroup).getByRole("button", { name: "Corn" }))
      .toHaveAttribute("aria-pressed", "true");

    fireEvent.click(within(cropGroup).getByRole("button", { name: "Soybean" }));

    expect(onCropChange).toHaveBeenCalledWith("soybean");
    expect(within(cropGroup).getByRole("button", { name: "Soybean" }))
      .toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Compared crop · Soybean")).toBeInTheDocument();
  });

  it("pins one state into event-specific magnitude, NIG, denominator, source, and limits", () => {
    render(<ExtremesPanel anomalySummaries={anomalySummaries} selectedCrop="corn" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Select Illinois" })[0]);

    const detail = screen.getByRole("region", { name: "Pinned event evidence" });
    expect(within(detail).getByText("Illinois · Corn")).toBeInTheDocument();
    expect(within(detail).getByText("Mean z · +0.8235")).toBeInTheDocument();
    expect(within(detail).getByText("NIG percentile · 0.7824")).toBeInTheDocument();
    expect(within(detail).getByText("2,178,324 pixel-weeks")).toBeInTheDocument();
    expect(within(detail).getByText("Mean z · −0.7645")).toBeInTheDocument();
    expect(within(detail).getByText("NIG percentile · 0.4128")).toBeInTheDocument();
    expect(within(detail).getByText("1,988,044 pixel-weeks")).toBeInTheDocument();
    expect(within(detail).getByText("Task 3 Midwest flood 2019 anomaly statistics")).toBeInTheDocument();
    expect(within(detail).getByText("The short SMAP baseline limits event interpretation.")).toBeInTheDocument();
  });

  it("shows a missing state/crop combination as no-data without borrowing the other event", () => {
    render(<ExtremesPanel anomalySummaries={anomalySummaries} selectedCrop="soybean" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Select Iowa" })[0]);

    expect(screen.getByText("Mean z · +0.5132")).toBeInTheDocument();
    expect(
      screen.getByText("No Plains drought 2022 value for Soybean in Iowa.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Mean z · −0.7645")).not.toBeInTheDocument();
  });

  it("keeps mean z available when the NIG percentile is missing", () => {
    const rowsWithMissingNig = anomalySummaries.map((row) =>
      row.eventId === "midwest_flood_2019" && row.state === "Illinois"
        ? { ...row, meanNigPDrought: Number.NaN }
        : row
    );
    render(<ExtremesPanel anomalySummaries={rowsWithMissingNig} selectedCrop="corn" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Select Illinois" })[0]);

    const detail = screen.getByRole("region", { name: "Pinned event evidence" });
    expect(within(detail).getByText("Mean z · +0.8235")).toBeInTheDocument();
    expect(within(detail).getByText("NIG percentile · Not reported")).toBeInTheDocument();
  });

  it("lets an external state selection replace a local map pin", () => {
    const { rerender } = render(
      <ExtremesPanel anomalySummaries={anomalySummaries} selectedCrop="soybean" />
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Select Illinois" })[0]);

    rerender(
      <ExtremesPanel
        anomalySummaries={anomalySummaries}
        selectedCrop="soybean"
        selectedState="Iowa"
      />
    );

    const detail = screen.getByRole("region", { name: "Pinned event evidence" });
    expect(within(detail).getByText("Iowa · Soybean")).toBeInTheDocument();
    expect(within(detail).getByText("Mean z · +0.5132")).toBeInTheDocument();
  });

  it("uses a stack-to-pair layout and keeps magnitude separate from posterior context", () => {
    render(<ExtremesPanel anomalySummaries={anomalySummaries} selectedCrop="corn" />);

    expect(screen.getByTestId("event-map-comparison")).toHaveAttribute("data-layout", "stack-to-pair");
    expect(
      screen.getByText(/Mean z is anomaly magnitude and direction; it is the map color/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The NIG posterior predictive percentile accounts for baseline uncertainty/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/It is not a confidence interval around mean z/i)).toBeInTheDocument();
  });

  it("keeps the complete exact table keyboard-reachable in Explore", () => {
    const onCropChange = vi.fn();
    render(
      <ExtremesPanel
        anomalySummaries={anomalySummaries}
        onCropChange={onCropChange}
        selectedCrop="corn"
      />
    );

    fireEvent.click(
      within(screen.getByRole("group", { name: "Compared crop" }))
        .getByRole("button", { name: "Soybean" })
    );
    expect(onCropChange).toHaveBeenCalledWith("soybean");

    const summary = screen.getByText("Exact state × crop values · 4 rows");
    summary.focus();
    expect(summary).toHaveFocus();
    fireEvent.click(summary);

    const table = screen.getByRole("table", { name: "State and crop anomaly values" });
    expect(within(table).getByRole("row", { name: /Midwest flood 2019 Illinois Corn/i })).toBeInTheDocument();
    expect(within(table).getByText("0.8235")).toBeInTheDocument();
    expect(within(table).getByText("-0.7645")).toBeInTheDocument();
  });
});
