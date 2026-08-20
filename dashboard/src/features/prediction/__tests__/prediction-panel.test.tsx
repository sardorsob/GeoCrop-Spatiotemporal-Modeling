import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type {
  AblationResult,
  DataPointSource,
  PredictionSplitSummary,
  PredictionTestMetrics,
  RegimeMetric,
  ShapFeature
} from "@/lib/data/types";

import { PredictionPanel } from "../PredictionPanel";

const testMetricsSource: DataPointSource = {
  sourceId: "task4-test-metrics",
  rowCount: 1,
  path: "../artifacts/tables/task4/task4__test_metrics__20260413.json",
  label: "Task 4 test metrics",
  dateStamp: "2026-04-13",
  denominator: "Task 4 held-out test split",
  caveat: "Held-out prediction performance for the scoped Task 4 model artifact."
};

const ablationSource: DataPointSource = {
  sourceId: "task4-ablation-results",
  rowCount: 4,
  path: "../artifacts/tables/task4/task4_ablation_results.csv",
  label: "Task 4 ablation results",
  caveat: "Validation-year comparisons among four scoped feature sets."
};

const regimeSource: DataPointSource = {
  sourceId: "task4-regime-stratified-metrics",
  rowCount: 3,
  path: "../artifacts/tables/task4/task4_regime_stratified_metrics.csv",
  label: "Task 4 regime-stratified metrics",
  denominator: "Prediction evaluation pixels within rotation regime",
  caveat: "Regime metrics have unequal group sizes and are descriptive, not causal."
};

const shapSource: DataPointSource = {
  sourceId: "task4-shap-feature-importance",
  rowCount: 7,
  path: "../artifacts/tables/task4/task4_shap_feature_importance.csv",
  label: "Task 4 SHAP feature importance",
  caveat: "Mean absolute SHAP values use a stratified 1,000-pixel test subsample."
};

const splitSource: DataPointSource = {
  sourceId: "task4-split-summary",
  rowCount: 3,
  path: "../artifacts/tables/task4/task4_split_summary.csv",
  label: "Task 4 split summary",
  denominator: "Pixels in each prediction split",
  caveat: "The exported 2023 test split is class-balanced."
};

const testMetrics: PredictionTestMetrics = {
  overallAccuracy: 0.792056,
  macroF1: 0.7914484152140422,
  perClassF1: {
    other_cropland: 0.8926132688,
    corn: 0.7259554294,
    soybean: 0.7347080777,
    winter_wheat: 0.812516885,
    oats: 0
  },
  confusionMatrix: [
    [111_765, 3_265, 1_801, 8_169],
    [4_751, 97_694, 9_894, 12_661],
    [4_748, 30_935, 81_305, 8_012],
    [4_158, 12_252, 3_326, 105_264]
  ],
  source: testMetricsSource
};

const ablationResults: readonly AblationResult[] = [
  makeAblation("B", "cdl_ndvi", 34, 0.82328, 0.8244834),
  makeAblation("A", "cdl_only", 19, 0.805894, 0.8080386),
  makeAblation("D", "cdl_ndvi_smap", 38, 0.822626, 0.8239125),
  makeAblation("C", "cdl_smap", 23, 0.806576, 0.808649)
];

const shapFeatures: readonly ShapFeature[] = [
  { feature: "cdl_t1", meanAbsoluteShap: 0.455, source: shapSource },
  { feature: "rotation_entropy", meanAbsoluteShap: 0.16, source: shapSource },
  { feature: "ndvi_mid_mean", meanAbsoluteShap: 0.437, source: shapSource },
  { feature: "thermal_time", meanAbsoluteShap: 0.12, source: shapSource },
  { feature: "smap_mean_gs", meanAbsoluteShap: 0.196, source: shapSource },
  { feature: "soil_moisture_anomaly", meanAbsoluteShap: 0.08, source: shapSource },
  { feature: "county_latitude", meanAbsoluteShap: 0.04, source: shapSource }
];

const regimeMetrics: readonly RegimeMetric[] = [
  makeRegime("irregular", 310_108, 0.709198),
  makeRegime("regular", 65_574, 0.874127),
  makeRegime("monoculture", 124_318, 0.955453)
];

const splitSummaries: readonly PredictionSplitSummary[] = [
  makeSplit("Train", "2013–2021", 4_500_000, 1_125_000),
  makeSplit("Validation", "2022", 500_000, 125_000),
  makeSplit("Test", "2023", 500_000, 125_000)
];

function renderPanel(metrics: PredictionTestMetrics | undefined = testMetrics) {
  return render(
    <PredictionPanel
      ablationResults={ablationResults}
      regimeMetrics={regimeMetrics}
      shapFeatures={shapFeatures}
      splitSummaries={splitSummaries}
      testMetrics={metrics}
    />
  );
}

describe("PredictionPanel", () => {
  it("opens the conclusion with a data-bearing CDL, NDVI, and SMAP braid into LightGBM", () => {
    renderPanel();

    expect(screen.getByRole("heading", { name: "Task 4 prediction diagnostics" })).toBeInTheDocument();
    const braid = screen.getByRole("region", { name: "Feature sources feeding LightGBM" });
    expect(within(braid).getByText("CDL history")).toBeInTheDocument();
    expect(within(braid).getByText("30 m · 19 features")).toBeInTheDocument();
    expect(within(braid).getByText("NDVI phenology")).toBeInTheDocument();
    expect(within(braid).getByText("250 m · 15 features")).toBeInTheDocument();
    expect(within(braid).getByText("SMAP moisture")).toBeInTheDocument();
    expect(within(braid).getByText("9 km · 4 features")).toBeInTheDocument();
    expect(within(braid).getByText("LightGBM")).toBeInTheDocument();
    expect(within(braid).getByText("38 features · 4 crop classes")).toBeInTheDocument();
  });

  it("orders ablations by configuration and labels source-derived increments consistently", () => {
    renderPanel();

    const ablation = screen.getByRole("region", { name: "Incremental ablation evidence" });
    const cards = within(ablation).getAllByRole("article");
    expect(cards.map((card) => card.getAttribute("aria-label"))).toEqual([
      "CDL only ablation result",
      "CDL + NDVI ablation result",
      "CDL + SMAP ablation result",
      "Full model ablation result"
    ]);
    expect(within(cards[0]).getByText("80.6% accuracy")).toBeInTheDocument();
    expect(within(cards[1]).getByText("+1.74 pp vs CDL")).toBeInTheDocument();
    expect(within(cards[2]).getByText("+0.07 pp vs CDL")).toBeInTheDocument();
    expect(within(cards[3]).getByText("−0.07 pp vs CDL + NDVI")).toBeInTheDocument();
    expect(screen.getByText(/NDVI and SMAP configurations are separate branches/i)).toBeInTheDocument();
  });

  it("groups SHAP rows by source family without dropping unknown features", () => {
    renderPanel();

    const shap = screen.getByRole("region", { name: "Grouped SHAP feature importance" });
    for (const family of ["CDL history", "NDVI phenology", "SMAP moisture", "Other / context"]) {
      expect(within(shap).getByRole("heading", { name: family })).toBeInTheDocument();
    }
    for (const feature of [
      "CDL t1",
      "Rotation entropy",
      "NDVI mid mean",
      "Thermal time",
      "SMAP mean gs",
      "Soil moisture anomaly",
      "County latitude"
    ]) {
      expect(within(shap).getByText(feature)).toBeInTheDocument();
    }
    expect(within(shap).getByText("7 source rows · none hidden")).toBeInTheDocument();
  });

  it("directly names the corn/soy error and all three regime accuracies", () => {
    renderPanel();

    const confusion = screen.getByRole("region", { name: "Annotated test confusion matrix" });
    expect(within(confusion).getByText("30,935 soybean pixels → corn")).toBeInTheDocument();
    expect(within(confusion).getByText("9,894 corn pixels → soybean")).toBeInTheDocument();
    expect(within(confusion).getByText("40,829 cross-confusions")).toBeInTheDocument();

    const regimes = screen.getByRole("region", { name: "Rotation regime accuracy" });
    expect(within(regimes).getByRole("article", { name: "Monoculture accuracy 95.5%" })).toBeInTheDocument();
    expect(within(regimes).getByRole("article", { name: "Regular accuracy 87.4%" })).toBeInTheDocument();
    expect(within(regimes).getByRole("article", { name: "Irregular accuracy 70.9%" })).toBeInTheDocument();
    expect(within(regimes).getByText("24.6 percentage-point gap")).toBeInTheDocument();
    expect(within(regimes).getByText(/easiest to predict where crop history repeats/i)).toBeInTheDocument();
  });

  it("keeps concurrent-season, sampling, and spatial-resolution limits visible", () => {
    renderPanel();

    const limits = screen.getByRole("region", { name: "Prediction evidence limits" });
    expect(within(limits).getByText(/not a pre-plant forecast/i)).toBeInTheDocument();
    expect(within(limits).getByText(/concurrent growing season/i)).toBeInTheDocument();
    expect(within(limits).getByText(/2023 test split/i)).toBeInTheDocument();
    expect(within(limits).getByText(/500,000 pixels · 125,000 per class/i)).toBeInTheDocument();
    expect(within(limits).getByText(/1,000-pixel stratified subsample/i)).toBeInTheDocument();
    expect(within(limits).getByText(/SMAP's 9 km native signal/i)).toBeInTheDocument();
    expect(within(limits).getByText(/common ~557 m grid/i)).toBeInTheDocument();
    expect(within(limits).getByText(/No geographic prediction layer is shown/i)).toBeInTheDocument();
  });

  it("renders a zero-denominator confusion row without a false percentage", () => {
    renderPanel({
      ...testMetrics,
      confusionMatrix: [
        [0, 0, 0, 0],
        ...testMetrics.confusionMatrix!.slice(1)
      ]
    });

    const matrix = screen.getByRole("table", { name: "Test confusion matrix" });
    expect(within(matrix).getByText("No actual samples")).toBeInTheDocument();
    expect(within(matrix).queryByText(/NaN/)).not.toBeInTheDocument();
  });

  it("shows explicit missing states instead of inventing diagnostics", () => {
    render(
      <PredictionPanel
        ablationResults={[]}
        regimeMetrics={[]}
        shapFeatures={[]}
        splitSummaries={[]}
        testMetrics={undefined}
      />
    );

    expect(screen.getByText(/No Task 4 prediction diagnostics are available yet/i)).toBeInTheDocument();
    expect(screen.queryByText(/prediction choropleth/i)).not.toBeInTheDocument();
  });
});

function makeAblation(
  ablationId: string,
  name: string,
  nFeatures: number,
  overallAccuracy: number,
  macroF1: number
): AblationResult {
  return {
    ablationId,
    name,
    nFeatures,
    overallAccuracy,
    macroF1,
    f1OtherCropland: 0.9,
    f1Corn: 0.74,
    f1Soybean: 0.76,
    f1WinterWheat: 0.87,
    source: ablationSource
  };
}

function makeRegime(
  rotationRegime: RegimeMetric["rotationRegime"],
  nPixels: number,
  overallAccuracy: number
): RegimeMetric {
  return {
    rotationRegime,
    nPixels,
    overallAccuracy,
    macroF1: overallAccuracy - 0.08,
    f1OtherCropland: overallAccuracy - 0.1,
    f1Corn: overallAccuracy - 0.02,
    f1Soybean: overallAccuracy - 0.03,
    f1WinterWheat: overallAccuracy - 0.01,
    source: regimeSource
  };
}

function makeSplit(
  split: string,
  years: string,
  nPixels: number,
  perClass: number
): PredictionSplitSummary {
  return {
    split,
    years,
    nPixels,
    otherCropland: perClass,
    corn: perClass,
    soybean: perClass,
    winterWheat: perClass,
    source: splitSource
  };
}
