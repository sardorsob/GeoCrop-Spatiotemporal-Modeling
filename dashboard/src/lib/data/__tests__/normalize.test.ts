import { describe, expect, it } from "vitest";

import { parseDashboardNumber } from "../../format/number";
import { loadDashboardData } from "../dashboard-data";
import { loadArtifactSource, type LoadedCsvArtifact, type RawArtifactRow } from "../loaders";
import { normalizeDashboardData } from "../normalize";
import { getArtifactSource } from "../sources";
import type { ArtifactSource, ArtifactSourceId } from "../types";

describe("static artifact loaders", () => {
  it("loads CSV and JSON artifacts with row counts and source metadata", async () => {
    const csv = await loadArtifactSource(getArtifactSource("task1-model-evaluation"));
    const json = await loadArtifactSource(getArtifactSource("task4-test-metrics"));

    expect(csv.status).toBe("success");
    expect(json.status).toBe("success");

    if (csv.status !== "success" || !("rows" in csv) || json.status !== "success" || !("json" in json)) {
      throw new Error("Expected representative CSV and JSON sources to load.");
    }

    expect(csv.sourceId).toBe("task1-model-evaluation");
    expect(csv.path).toBe("../artifacts/tables/task1/model_evaluation.csv");
    expect(csv.rowCount).toBe(3);
    expect(csv.rows[0]).toMatchObject({
      crop: "corn",
      n_obs: "535",
      RMSE: "0.0194",
      "50% coverage": "0.5944"
    });

    expect(json.sourceId).toBe("task4-test-metrics");
    expect(json.path).toBe("../artifacts/tables/task4/task4__test_metrics__20260413.json");
    expect(json.rowCount).toBe(1);
    expect(json.json).toMatchObject({
      overall_accuracy: 0.792056,
      per_class_f1_named: {
        corn: 0.7259554293951982
      }
    });
  });

  it("returns a typed missing-source error instead of throwing", async () => {
    const missingSource = {
      ...getArtifactSource("task1-model-evaluation"),
      path: "../artifacts/tables/task1/not-a-real-artifact.csv"
    } satisfies ArtifactSource;

    const result = await loadArtifactSource(missingSource);

    expect(result).toMatchObject({
      status: "error",
      sourceId: "task1-model-evaluation",
      path: "../artifacts/tables/task1/not-a-real-artifact.csv",
      rowCount: 0,
      errorCode: "missing-source"
    });
  });
});

describe("normalized dashboard data", () => {
  it("coerces numeric strings, percentages, empty strings, and NaN-like values safely", () => {
    expect(parseDashboardNumber("1,234.5")).toBe(1234.5);
    expect(parseDashboardNumber("27.36%")).toBe(27.36);
    expect(parseDashboardNumber("")).toBeUndefined();
    expect(parseDashboardNumber("NaN")).toBeUndefined();
    expect(parseDashboardNumber(Number.NaN)).toBeUndefined();
  });

  it("normalizes representative Task 1 phenology artifacts with alias headers", async () => {
    const data = await loadDashboardData();
    const model = data.task1.modelEvaluation.find((row) => row.crop === "corn");
    const posterior = data.task1.phenologySeries.find(
      (series) => series.crop === "corn" && series.source.sourceId === "task1-hsgp-posterior-phenology"
    );
    const empirical = data.task1.phenologySeries.find(
      (series) => series.crop === "corn" && series.source.sourceId === "task1-empirical-ndvi-by-crop"
    );

    expect(data.errors).toEqual([]);
    expect(model).toMatchObject({
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
        caveat: "Phenology model metrics are scoped to the exported Task 1 evaluation artifact."
      }
    });
    expect(posterior?.points[0]).toMatchObject({
      dayOfYear: 97,
      posteriorMean: 0.68947,
      credibleInterval05: 0.65582,
      credibleInterval95: 0.72564
    });
    expect(empirical?.points.find((point) => point.dayOfYear === 105)).toMatchObject({
      dayOfYear: 105,
      empiricalQ25Ndvi: expect.any(Number),
      empiricalQ75Ndvi: expect.any(Number),
      nPixels: expect.any(Number)
    });
  });

  it("aggregates repeated empirical and rounded posterior DOYs without last-write-wins", () => {
    const data = normalizeDashboardData([
      loadedCsv("task1-hsgp-posterior-phenology", [
        {
          crop: "corn",
          doy: "100",
          posterior_mean: "0.4",
          posterior_iqr_25: "0.3",
          posterior_iqr_75: "0.5",
          ci_05: "0.2",
          ci_95: "0.6"
        },
        {
          crop: "corn",
          doy: "100",
          posterior_mean: "0.6",
          posterior_iqr_25: "0.5",
          posterior_iqr_75: "0.7",
          ci_05: "",
          ci_95: "0.8"
        }
      ]),
      loadedCsv("task1-empirical-ndvi-by-crop", [
        {
          crop: "corn",
          year: "2018",
          doy: "105",
          mean_ndvi: "0.4",
          q25_ndvi: "0.2",
          q75_ndvi: "0.6",
          n_pixels: "100"
        },
        {
          crop: "corn",
          year: "2019",
          doy: "105",
          mean_ndvi: "0.6",
          q25_ndvi: "0.4",
          q75_ndvi: "0.8",
          n_pixels: "300"
        }
      ])
    ]);

    const posterior = data.task1.phenologySeries.find(
      (series) => series.source.sourceId === "task1-hsgp-posterior-phenology"
    );
    const empirical = data.task1.phenologySeries.find(
      (series) => series.source.sourceId === "task1-empirical-ndvi-by-crop"
    );

    expect(posterior?.points).toEqual([
      {
        dayOfYear: 100,
        posteriorMean: 0.5,
        posteriorIqr25: 0.4,
        posteriorIqr75: 0.6,
        credibleInterval05: 0.2,
        credibleInterval95: 0.7
      }
    ]);
    expect(empirical?.points).toHaveLength(1);
    expect(empirical?.points[0]).toMatchObject({
      dayOfYear: 105,
      empiricalMeanNdvi: 0.5,
      empiricalQ75Ndvi: 0.7,
      nPixels: 400
    });
    expect(empirical?.points[0].empiricalQ25Ndvi).toBeCloseTo(0.3);
  });

  it("normalizes representative Task 2 rotation summaries with alias headers and matrix CSVs", async () => {
    const data = await loadDashboardData();
    const classSummary = data.task2.classSummaries.find((row) => row.rotationClass === "regular");
    const county = data.task2.geographySummaries.find((row) => row.geographyId === "17001");
    const region = data.task2.geographySummaries.find((row) => row.geographyId === "IL");
    const transition = data.task2.markovTransitions.find(
      (row) => row.fromCrop === "corn" && row.toCrop === "soybean"
    );

    expect(classSummary).toMatchObject({
      rotationClass: "regular",
      pixelCount: 570202,
      areaHa: 17669192.4,
      percentOfValid: 27.36,
      source: {
        sourceId: "task2-areal-stats-by-class",
        dateStamp: "2026-04-12"
      }
    });
    expect(county).toMatchObject({
      geographyId: "17001",
      geographyName: "Adams County",
      geographyKind: "county",
      stateCode: "IL",
      stateFips: "17",
      countyFips: "001",
      nPixels: 3805,
      pctRegular: 36.43
    });
    expect(region).toMatchObject({
      geographyId: "IL",
      geographyName: "Illinois",
      geographyKind: "state",
      stateCode: "IL",
      stateFips: "17",
      nPixels: 293524
    });
    expect(
      data.task2.geographySummaries.filter((row) => row.geographyKind === "state")
    ).toHaveLength(13);
    expect(
      data.task2.geographySummaries.some((row) => row.geographyName.includes("outside"))
    ).toBe(false);
    expect(
      data.task2.geographySummaries
        .filter((row) => row.geographyKind === "county")
        .every((row) => /^\d{5}$/.test(row.geographyId))
    ).toBe(true);
    expect(transition).toMatchObject({
      fromCrop: "corn",
      toCrop: "soybean",
      probability: 0.5542211915410524
    });
    expect(data.task2.thresholdSensitivity[0]).toMatchObject({
      alternationMin: 0.5,
      patternDistanceMax: 3,
      pctRegular: 34.79
    });
  });

  it("normalizes representative Task 3 flood and drought anomaly summaries", async () => {
    const data = await loadDashboardData();
    const flood = data.task3.anomalySummaries.find(
      (row) => row.eventId === "midwest_flood_2019" && row.state === "Illinois" && row.crop === "corn"
    );
    const drought = data.task3.anomalySummaries.find(
      (row) => row.eventId === "plains_drought_2022" && row.state === "Illinois" && row.crop === "corn"
    );

    expect(flood).toMatchObject({
      eventId: "midwest_flood_2019",
      stateCode: "IL",
      meanZ: 0.8235,
      maxZ: 2.2511,
      fractionObservedZGreaterThan1: 0.4706,
      fractionObservedZGreaterThan1p5: 0.1457,
      nPixelWeeks: 2178324,
      meanNigPDrought: 0.7824,
      fractionPDroughtBelow0p1: 0.0003
    });
    expect(drought).toMatchObject({
      eventId: "plains_drought_2022",
      stateCode: "IL",
      meanZ: -0.7645,
      fractionPDroughtBelow0p1: 0.1557
    });
  });

  it("normalizes representative Task 4 prediction artifacts including JSON metrics", async () => {
    const data = await loadDashboardData();

    expect(data.task4.ablationResults[0]).toMatchObject({
      ablationId: "A",
      name: "cdl_only",
      nFeatures: 19,
      overallAccuracy: 0.805894,
      macroF1: 0.8080385518045412
    });
    expect(data.task4.regimeMetrics.find((row) => row.rotationRegime === "irregular")).toMatchObject({
      nPixels: 310108,
      overallAccuracy: 0.7091980858281631
    });
    expect(data.task4.shapFeatures[0]).toMatchObject({
      feature: "cdl_t1",
      meanAbsoluteShap: 0.45483569168148025
    });
    expect(data.task4.splitSummaries[0]).toMatchObject({
      split: "Train",
      nPixels: 4500000,
      corn: 1125000,
      soybean: 1125000
    });
    expect(data.task4.testMetrics).toMatchObject({
      overallAccuracy: 0.792056,
      macroF1: 0.7914484152140422,
      perClassF1: {
        other_cropland: 0.8926132688022618,
        corn: 0.7259554293951982,
        soybean: 0.7347080776772724,
        winter_wheat: 0.8125168849814361
      },
      source: {
        sourceId: "task4-test-metrics",
        dateStamp: "2026-04-13"
      }
    });
  });
});

function loadedCsv(
  sourceId: ArtifactSourceId,
  rows: readonly RawArtifactRow[]
): LoadedCsvArtifact {
  const source = getArtifactSource(sourceId);

  return {
    status: "success",
    sourceId,
    taskId: source.taskId,
    path: source.path,
    absolutePath: source.path,
    format: "csv",
    label: source.label,
    caveat: source.caveat,
    dateStamp: source.dateStamp,
    denominator: source.denominator,
    source,
    rowCount: rows.length,
    rows
  };
}
