import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NormalizedDashboardData } from "@/lib/data/normalize";
import { DashboardShell } from "./DashboardShell";

const mockNavigation = vi.hoisted(() => ({
  replace: vi.fn(),
  searchParams: new URLSearchParams()
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: mockNavigation.replace }),
  useSearchParams: () => mockNavigation.searchParams
}));

const dashboardData: NormalizedDashboardData = {
  sources: [
    {
      sourceId: "task1-model-evaluation",
      taskId: "task1",
      path: "../artifacts/tables/task1/model_evaluation.csv",
      label: "Task 1 model evaluation",
      caveat:
        "Phenology model metrics are scoped to the exported Task 1 evaluation artifact.",
      statusText: "Available"
    },
    {
      sourceId: "task2-areal-stats-by-class",
      taskId: "task2",
      path: "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv",
      label: "Task 2 areal statistics by class",
      caveat:
        "Areal percentages use the valid classified cropland denominator from the exported artifact.",
      statusText: "Available",
      dateStamp: "2026-04-12",
      denominator: "Valid classified cropland pixels"
    },
    {
      sourceId: "task3-midwest-flood-2019-anomaly-stats",
      taskId: "task3",
      path: "../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv",
      label: "Task 3 Midwest flood 2019 anomaly statistics",
      caveat:
        "Anomaly summaries are aggregated by state and crop for the 2019 Midwest flood event window.",
      statusText: "Available",
      dateStamp: "2026-04-12",
      denominator: "Pixel-weeks in the selected event, state, and crop window"
    },
    {
      sourceId: "task4-test-metrics",
      taskId: "task4",
      path: "../artifacts/tables/task4/task4__test_metrics__20260413.json",
      label: "Task 4 test metrics",
      caveat:
        "Held-out prediction performance for the scoped Task 4 model artifact.",
      statusText: "Available"
    }
  ],
  errors: [
    {
      sourceId: "task4-split-summary",
      path: "../artifacts/tables/task4/task4_split_summary.csv",
      label: "Task 4 split summary",
      caveat: "Split summary caveat",
      errorCode: "missing-source",
      message: "Source artifact was not found."
    }
  ],
  task1: {
    modelEvaluation: [
      {
        crop: "corn",
        nObservations: 535,
        rmse: 0.0194,
        mae: 0.0146,
        coverage50: 0.5944,
        coverage90: 0.9009,
        meanCrps: 0.0107,
        source: {
          sourceId: "task1-model-evaluation",
          rowCount: 3,
          path: "../artifacts/tables/task1/model_evaluation.csv",
          label: "Task 1 model evaluation",
          caveat:
            "Phenology model metrics are scoped to the exported Task 1 evaluation artifact."
        }
      }
    ],
    phenologySeries: [
      {
        crop: "corn",
        source: {
          sourceId: "task1-hsgp-posterior-phenology",
          rowCount: 3,
          path: "../artifacts/tables/task1/hsgp_posterior_phenology.csv",
          label: "Task 1 HSGP posterior phenology",
          caveat:
            "Posterior phenology summaries represent modeled NDVI seasonality, not raw pixel observations."
        },
        points: [
          {
            dayOfYear: 100,
            posteriorMean: 0.42,
            credibleInterval05: 0.31,
            credibleInterval95: 0.52
          },
          {
            dayOfYear: 160,
            posteriorMean: 0.72,
            credibleInterval05: 0.62,
            credibleInterval95: 0.81
          }
        ]
      },
      {
        crop: "corn",
        source: {
          sourceId: "task1-empirical-ndvi-by-crop",
          rowCount: 3,
          path: "../artifacts/tables/task1/empirical_ndvi_by_crop.csv",
          label: "Task 1 empirical NDVI by crop",
          caveat:
            "Empirical NDVI summaries are aggregated by crop and day of year for dashboard display."
        },
        points: [
          { dayOfYear: 105, empiricalMeanNdvi: 0.4, nPixels: 1200 },
          { dayOfYear: 165, empiricalMeanNdvi: 0.69, nPixels: 1300 }
        ]
      }
    ]
  },
  task2: {
    classSummaries: [
      {
        rotationClass: "regular",
        pixelCount: 570202,
        areaHa: 17669192.4,
        percentOfValid: 27.36,
        source: {
          sourceId: "task2-areal-stats-by-class",
          rowCount: 3,
          path: "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv",
          label: "Task 2 areal statistics by class",
          dateStamp: "2026-04-12",
          denominator: "Valid classified cropland pixels",
          caveat:
            "Areal percentages use the valid classified cropland denominator from the exported artifact."
        }
      },
      {
        rotationClass: "monoculture",
        pixelCount: 81248,
        areaHa: 2517174.5,
        percentOfValid: 3.9,
        source: {
          sourceId: "task2-areal-stats-by-class",
          rowCount: 3,
          path: "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv",
          label: "Task 2 areal statistics by class",
          dateStamp: "2026-04-12",
          denominator: "Valid classified cropland pixels",
          caveat:
            "Areal percentages use the valid classified cropland denominator from the exported artifact."
        }
      }
    ],
    geographySummaries: [
      {
        geographyId: "state:IL",
        geographyName: "Illinois",
        geographyKind: "region",
        nPixels: 250000,
        pctRegular: 40.35,
        pctMonoculture: 5.07,
        pctIrregular: 54.58,
        source: {
          sourceId: "task2-areal-stats-by-region",
          rowCount: 2,
          path: "../artifacts/tables/task4/task2__areal_stats_by_region__20260412.csv",
          label: "Task 2 areal statistics by region",
          dateStamp: "2026-04-12",
          denominator: "Valid classified cropland pixels within region",
          caveat:
            "Regional summaries are derived from the exported rotation classification artifact."
        }
      }
    ],
    markovTransitions: [
      {
        fromCrop: "corn",
        toCrop: "soybean",
        probability: 0.71,
        source: {
          sourceId: "task2-markov-transition-probs",
          rowCount: 25,
          path: "../artifacts/tables/task2/task2__markov_transition_probs.csv",
          label: "Task 2 Markov transition probabilities",
          caveat:
            "Transition probabilities summarize observed crop-to-crop transitions in the scoped Task 2 artifact."
        }
      }
    ],
    thresholdSensitivity: [
      {
        alternationMin: 0.55,
        patternDistanceMax: 0.2,
        pctRegular: 27.36,
        pctMonoculture: 3.9,
        pctIrregular: 68.74,
        nPixels: 2087655,
        source: {
          sourceId: "task2-threshold-sensitivity-grid",
          rowCount: 9,
          path: "../artifacts/tables/task2/task2__threshold_sensitivity_grid.csv",
          label: "Task 2 threshold sensitivity grid",
          denominator: "Valid classified cropland pixels",
          caveat:
            "Sensitivity rows show how class percentages vary under alternate rotation thresholds."
        }
      }
    ]
  },
  task3: {
    anomalySummaries: [
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
        source: {
          sourceId: "task3-midwest-flood-2019-anomaly-stats",
          rowCount: 42,
          path: "../artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv",
          label: "Task 3 Midwest flood 2019 anomaly statistics",
          dateStamp: "2026-04-12",
          denominator: "Pixel-weeks in the selected event, state, and crop window",
          caveat:
            "Anomaly summaries are aggregated by state and crop for the 2019 Midwest flood event window."
        }
      }
    ]
  },
  task4: {
    ablationResults: [
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
        source: {
          sourceId: "task4-ablation-results",
          rowCount: 3,
          path: "../artifacts/tables/task4/task4_ablation_results.csv",
          label: "Task 4 ablation results",
          caveat:
            "Ablation results compare scoped feature sets in the Task 4 prediction experiment."
        }
      }
    ],
    regimeMetrics: [
      {
        rotationRegime: "regular",
        nPixels: 1800,
        overallAccuracy: 0.89,
        macroF1: 0.86,
        f1OtherCropland: 0.8,
        f1Corn: 0.91,
        f1Soybean: 0.88,
        f1WinterWheat: 0.84,
        source: {
          sourceId: "task4-regime-stratified-metrics",
          rowCount: 3,
          path: "../artifacts/tables/task4/task4_regime_stratified_metrics.csv",
          label: "Task 4 regime-stratified metrics",
          caveat: "Regime metrics are stratified by available rotation classes."
        }
      }
    ],
    shapFeatures: [
      {
        feature: "ndvi_peak_timing",
        meanAbsoluteShap: 0.42,
        source: {
          sourceId: "task4-shap-feature-importance",
          rowCount: 6,
          path: "../artifacts/tables/task4/task4_shap_feature_importance.csv",
          label: "Task 4 SHAP feature importance",
          caveat:
            "Mean absolute SHAP values summarize scoped prediction model importance."
        }
      }
    ],
    splitSummaries: [],
    testMetrics: {
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
      source: {
        sourceId: "task4-test-metrics",
        rowCount: 1,
        path: "../artifacts/tables/task4/task4__test_metrics__20260413.json",
        label: "Task 4 test metrics",
        caveat:
          "Held-out prediction performance for the scoped Task 4 model artifact."
      }
    }
  }
};

describe("DashboardShell", () => {
  beforeEach(() => {
    mockNavigation.replace.mockReset();
    mockNavigation.searchParams = new URLSearchParams();
  });

  it("integrates the map and all four source-backed task tabs", () => {
    mockNavigation.searchParams = new URLSearchParams(
      "view=analyst&crop=corn"
    );

    render(<DashboardShell data={dashboardData} />);

    expect(
      screen.getByRole("heading", { name: "GeoCrop Interactive Dashboard" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Dashboard filters" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Corn Belt map surface" })
    ).toBeInTheDocument();

    const tablist = screen.getByRole("tablist", { name: "Research tasks" });
    expect(within(tablist).getAllByRole("tab")).toHaveLength(4);
    for (const tabName of ["Phenology", "Rotation", "Extremes", "Prediction"]) {
      expect(within(tablist).getByRole("tab", { name: tabName }))
        .toBeInTheDocument();
    }
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "id",
      "tabpanel-phenology"
    );
    expect(
      within(tablist).getByRole("tab", { name: "Phenology" })
    ).toHaveAttribute("aria-controls", "tabpanel-phenology");

    expect(
      screen.getByRole("heading", { name: "Task 1 phenology" })
    ).toBeInTheDocument();
    expect(screen.getByText("Task 1 model evaluation")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Phenology model metrics are scoped to the exported Task 1 evaluation artifact."
      )
    ).toBeInTheDocument();

    fireEvent.click(within(tablist).getByRole("tab", { name: "Rotation" }));
    expect(
      screen.getByRole("heading", { name: "Task 2 rotation" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Task 2 areal statistics by class").length)
      .toBeGreaterThan(0);
    expect(mockNavigation.replace).toHaveBeenLastCalledWith(
      expect.stringContaining("view=analyst"),
      { scroll: false }
    );
    expect(mockNavigation.replace).toHaveBeenLastCalledWith(
      expect.stringContaining("tab=rotation"),
      { scroll: false }
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "id",
      "tabpanel-rotation"
    );

    fireEvent.click(within(tablist).getByRole("tab", { name: "Extremes" }));
    expect(
      screen.getByRole("heading", { name: "Task 3 soil moisture extremes" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Task 3 Midwest flood 2019 anomaly statistics").length
    ).toBeGreaterThan(0);

    fireEvent.click(within(tablist).getByRole("tab", { name: "Prediction" }));
    expect(
      screen.getByRole("heading", { name: "Task 4 prediction diagnostics" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Task 4 test metrics").length)
      .toBeGreaterThan(0);
    expect(
      screen.getByText("Held-out prediction performance for the scoped Task 4 model artifact.")
    ).toBeInTheDocument();
  });

  it("restores representative URL filters, writes URL updates, and surfaces data errors", () => {
    mockNavigation.searchParams = new URLSearchParams(
      "tab=extremes&mapLayer=soil-moisture-anomaly&state=Illinois&crop=corn&event=midwest_flood_2019&selectedEntity=state:IL"
    );

    render(<DashboardShell data={dashboardData} />);

    expect(
      screen.getByRole("heading", { name: "Task 3 soil moisture extremes" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Data load status" })
    ).toHaveTextContent("Task 4 split summary");
    expect(screen.getByText("Source artifact was not found."))
      .toBeInTheDocument();

    const filters = screen.getByRole("region", { name: "Dashboard filters" });
    expect(within(filters).getByLabelText("Map layer")).toHaveValue(
      "soil-moisture-anomaly"
    );
    expect(within(filters).getByLabelText("State")).toHaveValue("ILLINOIS");
    expect(within(filters).getByLabelText("Selected entity")).toHaveValue(
      "state:IL"
    );

    fireEvent.change(within(filters).getByLabelText("Crop"), {
      target: { value: "soybean" }
    });

    expect(mockNavigation.replace).toHaveBeenLastCalledWith(
      expect.stringContaining("crop=soybean"),
      { scroll: false }
    );
    expect(mockNavigation.replace).toHaveBeenLastCalledWith(
      expect.stringContaining("tab=extremes"),
      { scroll: false }
    );

    fireEvent.click(screen.getByRole("button", { name: "Select Iowa" }));

    expect(mockNavigation.replace).toHaveBeenLastCalledWith(
      expect.stringContaining("selectedEntity=state%3AIA"),
      { scroll: false }
    );
    expect(within(filters).getByLabelText("Selected entity")).toHaveValue(
      "state:IA"
    );
  });
});
