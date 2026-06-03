import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ExtremesPanel } from "../ExtremesPanel";
import type {
  AnomalyStateCropSummary,
  DataPointSource
} from "@/lib/data/types";

const floodSource: DataPointSource = {
  sourceId: "task3-midwest-flood-2019-anomaly-stats",
  rowCount: 42,
  path: "../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv",
  label: "Task 3 Midwest flood 2019 anomaly statistics",
  dateStamp: "2026-04-12",
  denominator: "Pixel-weeks in the selected event, state, and crop window",
  caveat: "Anomaly summaries are aggregated by state and crop for the 2019 Midwest flood event window."
};

const droughtSource: DataPointSource = {
  sourceId: "task3-plains-drought-2022-anomaly-stats",
  rowCount: 38,
  path: "../artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv",
  label: "Task 3 Plains drought 2022 anomaly statistics",
  dateStamp: "2026-04-12",
  denominator: "Pixel-weeks in the selected event, state, and crop window",
  caveat: "Anomaly summaries are aggregated by state and crop for the 2022 Plains drought event window."
};

const anomalySummaries: readonly AnomalyStateCropSummary[] = [
  {
    eventId: "midwest_flood_2019",
    state: "Illinois",
    crop: "corn",
    meanZ: 0.8235,
    maxZ: 2.2511,
    fractionObservedZGreaterThan1: 0.4706,
    fractionObservedZGreaterThan1p5: 0.1457,
    nPixelWeeks: 2178324,
    meanNigPDrought: 0.7824,
    fractionPDroughtBelow0p1: 0.0003,
    source: floodSource
  },
  {
    eventId: "midwest_flood_2019",
    state: "Iowa",
    crop: "soybean",
    meanZ: 0.5132,
    maxZ: 1.881,
    fractionObservedZGreaterThan1: 0.225,
    fractionObservedZGreaterThan1p5: 0.093,
    nPixelWeeks: 114205,
    meanNigPDrought: 0.6811,
    fractionPDroughtBelow0p1: 0.0012,
    source: floodSource
  },
  {
    eventId: "plains_drought_2022",
    state: "Illinois",
    crop: "corn",
    meanZ: -0.7645,
    maxZ: 3.1942,
    fractionObservedZGreaterThan1: 0.0312,
    fractionObservedZGreaterThan1p5: 0.0088,
    nPixelWeeks: 1988044,
    meanNigPDrought: 0.4128,
    fractionPDroughtBelow0p1: 0.1557,
    source: droughtSource
  },
  {
    eventId: "plains_drought_2022",
    state: "Kansas",
    crop: "winter_wheat",
    meanZ: -1.1025,
    maxZ: 2.7121,
    fractionObservedZGreaterThan1: 0.0149,
    fractionObservedZGreaterThan1p5: 0.0034,
    nPixelWeeks: 542905,
    meanNigPDrought: 0.2866,
    fractionPDroughtBelow0p1: 0.2431,
    source: droughtSource
  }
];

describe("ExtremesPanel", () => {
  it("renders source-backed Task 3 values, event options, and visible caveats", () => {
    render(
      <ExtremesPanel
        anomalySummaries={anomalySummaries}
        selectedCrop="corn"
        selectedEvent="midwest_flood_2019"
        selectedState="Illinois"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Task 3 soil moisture extremes" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Midwest flood 2019" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Plains drought 2022" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Z-scores compare observed soil moisture anomalies against the event baseline/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/NIG P\(drought\) is a posterior drought probability/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/high NIG P\(drought\) can indicate non-drought posterior context/i)
    ).toBeInTheDocument();

    const table = screen.getByRole("table", {
      name: "State and crop anomaly values"
    });
    const row = within(table).getByRole("row", { name: /Illinois Corn/i });

    expect(within(row).getByText("0.8235")).toBeInTheDocument();
    expect(within(row).getByText("2.2511")).toBeInTheDocument();
    expect(within(row).getByText("47.06%")).toBeInTheDocument();
    expect(within(row).getByText("14.57%")).toBeInTheDocument();
    expect(within(row).getByText("2,178,324")).toBeInTheDocument();
    expect(within(row).getByText("0.7824")).toBeInTheDocument();
    expect(within(row).getByText("0.03%")).toBeInTheDocument();
    expect(screen.queryByText("-0.7645")).not.toBeInTheDocument();

    expect(screen.getByText("Task 3 Midwest flood 2019 anomaly statistics"))
      .toBeInTheDocument();
    expect(
      screen.getByText(
        "../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("42 rows")).toBeInTheDocument();
    expect(screen.getByText("2026-04-12")).toBeInTheDocument();
    expect(
      screen.getByText("Denominator: Pixel-weeks in the selected event, state, and crop window")
    ).toBeInTheDocument();
  });

  it("reports URL-state-compatible event, crop, and state filter changes", () => {
    const onEventChange = vi.fn();
    const onCropChange = vi.fn();
    const onStateChange = vi.fn();

    render(
      <ExtremesPanel
        anomalySummaries={anomalySummaries}
        onCropChange={onCropChange}
        onEventChange={onEventChange}
        onStateChange={onStateChange}
        selectedCrop="corn"
        selectedEvent="midwest_flood_2019"
        selectedState="Illinois"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Plains drought 2022" }));
    expect(onEventChange).toHaveBeenCalledWith("plains_drought_2022");

    fireEvent.change(screen.getByLabelText("Crop"), {
      target: { value: "soybean" }
    });
    expect(onCropChange).toHaveBeenCalledWith("soybean");

    fireEvent.change(screen.getByLabelText("State"), {
      target: { value: "Iowa" }
    });
    expect(onStateChange).toHaveBeenCalledWith("Iowa");
  });

  it("shows an explicit empty state for missing or filtered-out anomaly rows", () => {
    render(
      <ExtremesPanel
        anomalySummaries={[]}
        selectedCrop="corn"
        selectedEvent="midwest_flood_2019"
        selectedState="Illinois"
      />
    );

    expect(
      screen.getByText(/No Task 3 soil moisture anomalies match the selected filters/i)
    ).toBeInTheDocument();
  });
});
