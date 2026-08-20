import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type {
  CropId,
  DataPointSource,
  PhenologyModelEvaluation,
  PhenologySeries
} from "@/lib/data/types";

import { PhenologyPanel } from "../PhenologyPanel";

const modelSource: DataPointSource = {
  sourceId: "task1-model-evaluation",
  rowCount: 3,
  path: "../artifacts/tables/task1/model_evaluation.csv",
  label: "Task 1 model evaluation",
  caveat: "Phenology model metrics are scoped to the exported Task 1 evaluation artifact."
};

const posteriorSource: DataPointSource = {
  sourceId: "task1-hsgp-posterior-phenology",
  rowCount: 9,
  path: "../artifacts/tables/task1/hsgp_posterior_phenology.csv",
  label: "Task 1 HSGP posterior phenology",
  caveat: "Posterior summaries are modeled NDVI seasonality, not raw pixel observations."
};

const empiricalSource: DataPointSource = {
  sourceId: "task1-empirical-ndvi-by-crop",
  rowCount: 9,
  path: "../artifacts/tables/task1/empirical_ndvi_by_crop.csv",
  label: "Task 1 empirical NDVI by crop",
  caveat: "Empirical boundaries are the across-year spatial quartiles for each crop and day."
};

const crops = ["corn", "soybean", "winter_wheat"] as const satisfies readonly CropId[];
const cropValues = {
  corn: { early: 0.68, peak: 0.88, late: 0.7, peakDay: 215 },
  soybean: { early: 0.64, peak: 0.84, late: 0.67, peakDay: 220 },
  winter_wheat: { early: 0.76, peak: 0.91, late: 0.61, peakDay: 160 }
} as const;

const modelEvaluation: readonly PhenologyModelEvaluation[] = crops.map((crop, index) => ({
  crop,
  nObservations: 535 - index * 100,
  rmse: 0.0194 + index * 0.002,
  mae: 0.0146 + index * 0.002,
  coverage50: 0.5944 - index * 0.02,
  coverage90: 0.9009 - index * 0.01,
  meanCrps: 0.0107 + index * 0.002,
  source: modelSource
}));

const phenologySeries: readonly PhenologySeries[] = crops.flatMap((crop) => {
  const values = cropValues[crop];
  const days = crop === "winter_wheat" ? [100, 160, 220] : [100, values.peakDay, 280];
  const means = [values.early, values.peak, values.late];

  return [
    {
      crop,
      source: posteriorSource,
      points: days.map((dayOfYear, index) => ({
        dayOfYear,
        posteriorMean: means[index],
        posteriorIqr25: means[index] - 0.025,
        posteriorIqr75: means[index] + 0.025,
        credibleInterval05: means[index] - 0.06,
        credibleInterval95: means[index] + 0.06
      }))
    },
    {
      crop,
      source: empiricalSource,
      points: days.map((dayOfYear, index) => ({
        dayOfYear,
        empiricalMeanNdvi: means[index] - 0.01,
        empiricalQ25Ndvi: means[index] - 0.045,
        empiricalQ75Ndvi: means[index] + 0.035,
        nPixels: 1_200 - index * 100
      }))
    }
  ];
});

describe("PhenologyPanel", () => {
  it("shows the three paper crops together in Story with a shared visual grammar", () => {
    render(
      <PhenologyPanel modelEvaluation={modelEvaluation} phenologySeries={phenologySeries} />
    );

    expect(screen.getByRole("heading", { name: "Task 1 phenology" })).toBeInTheDocument();
    for (const label of ["Corn", "Soybean", "Winter wheat"]) {
      expect(screen.getByRole("img", { name: `${label} NDVI phenology curve` })).toBeInTheDocument();
    }
    expect(screen.queryByRole("region", { name: "Season window controls" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Focus crop")).not.toBeInTheDocument();

    const metrics = screen.getByRole("region", { name: "HSGP model metrics" });
    expect(within(metrics).getAllByRole("row")).toHaveLength(4);
    expect(within(metrics).getByText("0.0194")).toBeInTheDocument();
    expect(within(metrics).getByText("0.0214")).toBeInTheDocument();
    expect(within(metrics).getByText("0.0234")).toBeInTheDocument();
  });

  it("makes both posterior interval levels and the empirical spatial interval explicit", () => {
    render(
      <PhenologyPanel modelEvaluation={modelEvaluation} phenologySeries={phenologySeries} />
    );

    expect(screen.getAllByText("Posterior mean")).toHaveLength(3);
    expect(screen.getAllByText("Posterior IQR (25–75%)")).toHaveLength(3);
    expect(screen.getAllByText("Posterior 90% interval")).toHaveLength(3);
    expect(screen.getAllByText("Empirical spatial IQR (Q25–Q75)")).toHaveLength(3);
    expect(
      screen.getAllByText("Focused NDVI range 0.50–1.00; the vertical axis does not begin at zero.")
    ).toHaveLength(3);
  });

  it("puts crop stages and peak timing in the reading path without requiring a tooltip", () => {
    render(
      <PhenologyPanel modelEvaluation={modelEvaluation} phenologySeries={phenologySeries} />
    );

    expect(screen.getByRole("list", { name: "Corn growth stages" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Soybean growth stages" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Winter wheat growth stages" })).toBeInTheDocument();
    expect(screen.getAllByText("Senescence & harvest")).toHaveLength(3);
    expect(screen.getByText("Corn peak · DOY 215 · NDVI 0.88")).toBeInTheDocument();
    expect(screen.getByText("Soybean peak · DOY 220 · NDVI 0.84")).toBeInTheDocument();
    expect(screen.getByText("Winter wheat peak · DOY 160 · NDVI 0.91")).toBeInTheDocument();
  });

  it("keeps all crops in Explore while shared season controls clamp safely", () => {
    const onCropChange = vi.fn();
    render(
      <PhenologyPanel
        mode="explore"
        modelEvaluation={modelEvaluation}
        onCropChange={onCropChange}
        phenologySeries={phenologySeries}
        selectedCrop="soybean"
      />
    );

    expect(screen.getByLabelText("Focus crop")).toHaveValue("soybean");
    fireEvent.click(screen.getByText("Season window · DOY 100–280"));
    const controls = screen.getByRole("region", { name: "Season window controls" });
    expect(within(controls).getByText("Visible span: DOY 100–280")).toBeInTheDocument();

    fireEvent.change(within(controls).getByLabelText("Start day of year"), {
      target: { value: "300" }
    });
    fireEvent.change(within(controls).getByLabelText("End day of year"), {
      target: { value: "140" }
    });

    expect(within(controls).getByText("Visible span: DOY 140–280")).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /NDVI phenology curve/ })).toHaveLength(3);

    fireEvent.change(screen.getByLabelText("Focus crop"), { target: { value: "corn" } });
    expect(onCropChange).toHaveBeenCalledWith("corn");
  });

  it("names missing evidence, documented fallbacks, sources, and caveats", () => {
    const { rerender } = render(
      <PhenologyPanel modelEvaluation={modelEvaluation} phenologySeries={phenologySeries} />
    );

    expect(screen.getByText("Task 1 model evaluation")).toBeInTheDocument();
    expect(screen.getByText("Task 1 HSGP posterior phenology")).toBeInTheDocument();
    expect(screen.getByText("Task 1 empirical NDVI by crop")).toBeInTheDocument();
    expect(screen.getByText(posteriorSource.caveat!)).toBeInTheDocument();
    expect(screen.getByText(empiricalSource.caveat!)).toBeInTheDocument();

    rerender(<PhenologyPanel modelEvaluation={[]} phenologySeries={[]} />);

    expect(
      screen.getByRole("heading", { name: "No Task 1 phenology data available" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "HSGP phenology crops static fallback" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("../artifacts/figures/task1/hsgp_phenology_crops.png")
    ).toBeInTheDocument();
  });
});
