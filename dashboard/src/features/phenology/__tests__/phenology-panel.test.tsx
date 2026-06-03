import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PhenologyPanel } from "../PhenologyPanel";
import type {
  DataPointSource,
  PhenologyModelEvaluation,
  PhenologySeries
} from "@/lib/data/types";

const modelSource: DataPointSource = {
  sourceId: "task1-model-evaluation",
  rowCount: 3,
  path: "../artifacts/tables/task1/model_evaluation.csv",
  label: "Task 1 model evaluation",
  caveat: "Phenology model metrics are scoped to the exported Task 1 evaluation artifact."
};

const posteriorSource: DataPointSource = {
  sourceId: "task1-hsgp-posterior-phenology",
  rowCount: 6,
  path: "../artifacts/tables/task1/hsgp_posterior_phenology.csv",
  label: "Task 1 HSGP posterior phenology",
  caveat: "Posterior phenology summaries represent modeled NDVI seasonality, not raw pixel observations."
};

const empiricalSource: DataPointSource = {
  sourceId: "task1-empirical-ndvi-by-crop",
  rowCount: 6,
  path: "../artifacts/tables/task1/empirical_ndvi_by_crop.csv",
  label: "Task 1 empirical NDVI by crop",
  caveat: "Empirical NDVI summaries are aggregated by crop and day of year for dashboard display."
};

const modelEvaluation: readonly PhenologyModelEvaluation[] = [
  {
    crop: "corn",
    nObservations: 535,
    rmse: 0.0194,
    mae: 0.0146,
    coverage50: 0.5944,
    coverage90: 0.9009,
    meanCrps: 0.0107,
    source: modelSource
  },
  {
    crop: "soybean",
    nObservations: 412,
    rmse: 0.0242,
    mae: 0.0185,
    coverage50: 0.55,
    coverage90: 0.88,
    meanCrps: 0.0129,
    source: modelSource
  }
];

const phenologySeries: readonly PhenologySeries[] = [
  {
    crop: "corn",
    source: posteriorSource,
    points: [
      {
        dayOfYear: 100,
        posteriorMean: 0.42,
        posteriorIqr25: 0.37,
        posteriorIqr75: 0.47,
        credibleInterval05: 0.31,
        credibleInterval95: 0.52
      },
      {
        dayOfYear: 160,
        posteriorMean: 0.72,
        posteriorIqr25: 0.67,
        posteriorIqr75: 0.77,
        credibleInterval05: 0.62,
        credibleInterval95: 0.81
      },
      {
        dayOfYear: 220,
        posteriorMean: 0.51,
        posteriorIqr25: 0.46,
        posteriorIqr75: 0.56,
        credibleInterval05: 0.4,
        credibleInterval95: 0.61
      }
    ]
  },
  {
    crop: "corn",
    source: empiricalSource,
    points: [
      { dayOfYear: 105, empiricalMeanNdvi: 0.4, nPixels: 1200 },
      { dayOfYear: 165, empiricalMeanNdvi: 0.69, nPixels: 1300 },
      { dayOfYear: 225, empiricalMeanNdvi: 0.5, nPixels: 1250 }
    ]
  },
  {
    crop: "soybean",
    source: posteriorSource,
    points: [
      {
        dayOfYear: 110,
        posteriorMean: 0.35,
        credibleInterval05: 0.28,
        credibleInterval95: 0.44
      },
      {
        dayOfYear: 175,
        posteriorMean: 0.66,
        credibleInterval05: 0.58,
        credibleInterval95: 0.75
      }
    ]
  },
  {
    crop: "soybean",
    source: empiricalSource,
    points: [
      { dayOfYear: 112, empiricalMeanNdvi: 0.33, nPixels: 900 },
      { dayOfYear: 178, empiricalMeanNdvi: 0.63, nPixels: 940 }
    ]
  }
];

describe("PhenologyPanel", () => {
  it("renders source-backed Task 1 HSGP metrics for the selected crop", () => {
    render(
      <PhenologyPanel
        modelEvaluation={modelEvaluation}
        phenologySeries={phenologySeries}
        selectedCrop="corn"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Task 1 phenology" })
    ).toBeInTheDocument();

    const metrics = screen.getByRole("region", {
      name: "HSGP model metrics"
    });
    expect(within(metrics).getByText("RMSE")).toBeInTheDocument();
    expect(within(metrics).getByText("0.0194")).toBeInTheDocument();
    expect(within(metrics).getByText("MAE")).toBeInTheDocument();
    expect(within(metrics).getByText("0.0146")).toBeInTheDocument();
    expect(within(metrics).getByText("Coverage 50")).toBeInTheDocument();
    expect(within(metrics).getByText("59.4%")).toBeInTheDocument();
    expect(within(metrics).getByText("Coverage 90")).toBeInTheDocument();
    expect(within(metrics).getByText("90.1%")).toBeInTheDocument();
    expect(within(metrics).getByText("Mean CRPS")).toBeInTheDocument();
    expect(within(metrics).getByText("0.0107")).toBeInTheDocument();
    expect(within(metrics).getByText("535 observations")).toBeInTheDocument();

    expect(screen.getByText("Task 1 model evaluation")).toBeInTheDocument();
    expect(
      screen.getByText("../artifacts/tables/task1/model_evaluation.csv")
    ).toBeInTheDocument();
    expect(screen.getByText("3 rows")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Phenology model metrics are scoped to the exported Task 1 evaluation artifact."
      )
    ).toBeInTheDocument();
  });

  it("renders a code-native NDVI curve with direct labels and visible uncertainty text", () => {
    render(
      <PhenologyPanel
        modelEvaluation={modelEvaluation}
        phenologySeries={phenologySeries}
        selectedCrop="corn"
      />
    );

    expect(
      screen.getByRole("img", { name: "Corn NDVI phenology curve" })
    ).toBeInTheDocument();
    expect(screen.getByText("HSGP posterior")).toBeInTheDocument();
    expect(screen.getByText("Empirical NDVI")).toBeInTheDocument();
    expect(screen.getByText("Peak posterior: 0.72 at DOY 160")).toBeInTheDocument();
    expect(
      screen.getByText("Uncertainty band: posterior 5-95 credible interval")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Posterior phenology summaries represent modeled NDVI seasonality, not raw pixel observations."
      )
    ).toBeInTheDocument();
  });

  it("shows an explicit missing-data state with documented static figure fallbacks", () => {
    render(
      <PhenologyPanel
        modelEvaluation={[]}
        phenologySeries={[]}
        selectedCrop="corn"
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "No Task 1 phenology data available"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "HSGP phenology crops static fallback"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("../artifacts/figures/task1/hsgp_phenology_crops.png")
    ).toBeInTheDocument();
    expect(
      screen.getByText("../artifacts/figures/task1/calibration_diagnostics.png")
    ).toBeInTheDocument();
  });

  it("filters metrics and curves by selected crop and reports crop selection changes", () => {
    const onCropChange = vi.fn();

    render(
      <PhenologyPanel
        modelEvaluation={modelEvaluation}
        onCropChange={onCropChange}
        phenologySeries={phenologySeries}
        selectedCrop="soybean"
      />
    );

    expect(screen.getByLabelText("Crop")).toHaveValue("soybean");
    expect(screen.getByText("0.0242")).toBeInTheDocument();
    expect(screen.queryByText("0.0194")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Soybean NDVI phenology curve" })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Crop"), {
      target: { value: "corn" }
    });

    expect(onCropChange).toHaveBeenCalledWith("corn");
  });
});
