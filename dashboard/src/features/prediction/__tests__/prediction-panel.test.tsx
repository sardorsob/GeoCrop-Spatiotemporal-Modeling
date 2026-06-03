import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PredictionPanel } from "../PredictionPanel";
import type {
  AblationResult,
  DataPointSource,
  PredictionTestMetrics,
  RegimeMetric,
  ShapFeature
} from "@/lib/data/types";

const testMetricsSource: DataPointSource = {
  sourceId: "task4-test-metrics",
  rowCount: 1,
  path: "../artifacts/tables/task4/task4__test_metrics__20260413.json",
  label: "Task 4 test metrics",
  caveat: "Held-out prediction performance for the scoped Task 4 model artifact."
};

const ablationSource: DataPointSource = {
  sourceId: "task4-ablation-results",
  rowCount: 3,
  path: "../artifacts/tables/task4/task4_ablation_results.csv",
  label: "Task 4 ablation results",
  caveat: "Ablation results compare scoped feature sets in the Task 4 prediction experiment."
};

const regimeSource: DataPointSource = {
  sourceId: "task4-regime-stratified-metrics",
  rowCount: 3,
  path: "../artifacts/tables/task4/task4_regime_stratified_metrics.csv",
  label: "Task 4 regime-stratified metrics",
  caveat: "Regime metrics are stratified by available rotation classes."
};

const shapSource: DataPointSource = {
  sourceId: "task4-shap-feature-importance",
  rowCount: 6,
  path: "../artifacts/tables/task4/task4_shap_feature_importance.csv",
  label: "Task 4 SHAP feature importance",
  caveat: "Mean absolute SHAP values summarize scoped prediction model importance."
};

const testMetrics: PredictionTestMetrics = {
  overallAccuracy: 0.873,
  macroF1: 0.842,
  perClassF1: {
    other_cropland: 0.78,
    corn: 0.88,
    soybean: 0.86,
    winter_wheat: 0.81,
    oats: 0.62
  },
  confusionMatrix: [
    [41, 3, 2, 1, 0],
    [4, 118, 17, 2, 0],
    [3, 22, 111, 1, 0],
    [1, 1, 0, 37, 0],
    [0, 2, 1, 0, 8]
  ],
  source: testMetricsSource
};

const ablationResults: readonly AblationResult[] = [
  {
    ablationId: "B",
    name: "Without rotation history",
    nFeatures: 18,
    overallAccuracy: 0.834,
    macroF1: 0.801,
    f1OtherCropland: 0.73,
    f1Corn: 0.84,
    f1Soybean: 0.82,
    f1WinterWheat: 0.79,
    source: ablationSource
  },
  {
    ablationId: "A",
    name: "Full feature model",
    nFeatures: 24,
    overallAccuracy: 0.873,
    macroF1: 0.842,
    f1OtherCropland: 0.78,
    f1Corn: 0.88,
    f1Soybean: 0.86,
    f1WinterWheat: 0.81,
    source: ablationSource
  },
  {
    ablationId: "C",
    name: "Spectral only",
    nFeatures: 10,
    overallAccuracy: 0.792,
    macroF1: 0.761,
    f1OtherCropland: 0.68,
    f1Corn: 0.8,
    f1Soybean: 0.77,
    f1WinterWheat: 0.73,
    source: ablationSource
  }
];

const shapFeatures: readonly ShapFeature[] = [
  { feature: "previous_crop", meanAbsoluteShap: 0.22, source: shapSource },
  { feature: "soil_moisture_anomaly", meanAbsoluteShap: 0.31, source: shapSource },
  { feature: "thermal_time", meanAbsoluteShap: 0.29, source: shapSource },
  { feature: "ndvi_peak_timing", meanAbsoluteShap: 0.42, source: shapSource },
  { feature: "rotation_entropy", meanAbsoluteShap: 0.36, source: shapSource },
  { feature: "county_latitude", meanAbsoluteShap: 0.08, source: shapSource }
];

const regimeMetrics: readonly RegimeMetric[] = [
  {
    rotationRegime: "regular",
    nPixels: 1800,
    overallAccuracy: 0.89,
    macroF1: 0.86,
    f1OtherCropland: 0.8,
    f1Corn: 0.91,
    f1Soybean: 0.88,
    f1WinterWheat: 0.84,
    source: regimeSource
  },
  {
    rotationRegime: "monoculture",
    nPixels: 640,
    overallAccuracy: 0.85,
    macroF1: 0.82,
    f1OtherCropland: 0.75,
    f1Corn: 0.87,
    f1Soybean: 0.83,
    f1WinterWheat: 0.8,
    source: regimeSource
  },
  {
    rotationRegime: "irregular",
    nPixels: 410,
    overallAccuracy: 0.78,
    macroF1: 0.74,
    f1OtherCropland: 0.67,
    f1Corn: 0.79,
    f1Soybean: 0.76,
    f1WinterWheat: 0.72,
    source: regimeSource
  }
];

function renderPanel(metrics: PredictionTestMetrics | undefined = testMetrics) {
  return render(
    <PredictionPanel
      ablationResults={ablationResults}
      regimeMetrics={regimeMetrics}
      shapFeatures={shapFeatures}
      testMetrics={metrics}
    />
  );
}

describe("PredictionPanel", () => {
  it("renders source-backed headline test metrics", () => {
    renderPanel();

    expect(screen.getByRole("heading", { name: "Task 4 prediction diagnostics" }))
      .toBeInTheDocument();

    const metrics = screen.getByRole("region", { name: "Headline test metrics" });
    expect(within(metrics).getByText("Overall accuracy")).toBeInTheDocument();
    expect(within(metrics).getByText("87.3%")).toBeInTheDocument();
    expect(within(metrics).getByText("Macro F1")).toBeInTheDocument();
    expect(within(metrics).getByText("84.2%")).toBeInTheDocument();
    expect(screen.getByText("Task 4 test metrics")).toBeInTheDocument();
    expect(screen.getByText("../artifacts/tables/task4/task4__test_metrics__20260413.json"))
      .toBeInTheDocument();
  });

  it("orders ablation rows by strongest macro F1", () => {
    renderPanel();

    const table = screen.getByRole("table", { name: "Ablation comparison" });
    const rows = within(table).getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("Full feature model")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Without rotation history")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Spectral only")).toBeInTheDocument();
    expect(within(rows[0]).getByText("84.2%")).toBeInTheDocument();
  });

  it("shows the top five SHAP labels in ranked order", () => {
    renderPanel();

    const table = screen.getByRole("table", { name: "SHAP feature ranking" });
    const rows = within(table).getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("NDVI peak timing")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Rotation entropy")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Soil moisture anomaly")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Thermal time")).toBeInTheDocument();
    expect(within(rows[4]).getByText("Previous crop")).toBeInTheDocument();
    expect(screen.queryByText("County latitude")).not.toBeInTheDocument();
  });

  it("keeps regime and corn-soy caveats visible", () => {
    renderPanel();

    expect(
      screen.getByText(/Irregular rotation strata have fewer evaluation pixels/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Corn and soybean classes remain the primary confusion pair/i)
    ).toBeInTheDocument();
  });

  it("renders confusion counts when available and a documented fallback when absent", () => {
    const { rerender } = renderPanel();

    const matrix = screen.getByRole("table", { name: "Test confusion matrix" });
    expect(within(matrix).getByText("118")).toBeInTheDocument();
    expect(within(matrix).getByText("22")).toBeInTheDocument();
    expect(
      screen.queryByText(/Confusion counts are unavailable/i)
    ).not.toBeInTheDocument();

    rerender(
      <PredictionPanel
        ablationResults={ablationResults}
        regimeMetrics={regimeMetrics}
        shapFeatures={shapFeatures}
        testMetrics={{ ...testMetrics, confusionMatrix: undefined }}
      />
    );

    expect(screen.getByText(/Confusion counts are unavailable/i)).toBeInTheDocument();
    expect(screen.getByText("../artifacts/figures/task4/task4_test_confusion_matrix.png"))
      .toBeInTheDocument();
  });

  it("shows an explicit empty state when prediction diagnostics are missing", () => {
    render(
      <PredictionPanel
        ablationResults={[]}
        regimeMetrics={[]}
        shapFeatures={[]}
        testMetrics={undefined}
      />
    );

    expect(screen.getByText(/No Task 4 prediction diagnostics are available yet/i))
      .toBeInTheDocument();
  });
});
