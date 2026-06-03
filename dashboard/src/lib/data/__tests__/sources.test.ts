import { describe, expect, it } from "vitest";

import { sourceNotesById } from "../source-notes";
import {
  artifactSources,
  getArtifactSource,
  taskSourceIds
} from "../sources";
import type { ArtifactSourceId, SourceNote } from "../types";

const expectedSourceIds = [
  "task1-model-evaluation",
  "task1-hsgp-posterior-phenology",
  "task1-empirical-ndvi-by-crop",
  "task2-areal-stats-by-class",
  "task2-areal-stats-by-county",
  "task2-areal-stats-by-region",
  "task2-markov-transition-probs",
  "task2-threshold-sensitivity-grid",
  "task3-midwest-flood-2019-anomaly-stats",
  "task3-plains-drought-2022-anomaly-stats",
  "task4-ablation-results",
  "task4-regime-stratified-metrics",
  "task4-shap-feature-importance",
  "task4-split-summary",
  "task4-test-metrics"
] as const satisfies readonly ArtifactSourceId[];

describe("artifact source registry", () => {
  it("covers every scoped Task 1-4 CSV/JSON source with stable ids", () => {
    expect(artifactSources.map((source) => source.id)).toEqual(expectedSourceIds);
    expect(taskSourceIds.task1).toEqual(expectedSourceIds.slice(0, 3));
    expect(taskSourceIds.task2).toEqual(expectedSourceIds.slice(3, 8));
    expect(taskSourceIds.task3).toEqual(expectedSourceIds.slice(8, 10));
    expect(taskSourceIds.task4).toEqual(expectedSourceIds.slice(10));
  });

  it("records explicit parent artifact paths without reading source files", () => {
    expect(getArtifactSource("task1-model-evaluation").path).toBe(
      "../artifacts/tables/task1/model_evaluation.csv"
    );
    expect(getArtifactSource("task2-areal-stats-by-class").path).toBe(
      "../artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv"
    );
    expect(getArtifactSource("task3-plains-drought-2022-anomaly-stats").path).toBe(
      "../artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv"
    );
    expect(getArtifactSource("task4-test-metrics").path).toBe(
      "../artifacts/tables/task4/task4__test_metrics__20260413.json"
    );
  });

  it("includes labels, expected columns, caveats, statuses, and notes for every source", () => {
    for (const source of artifactSources) {
      const note: SourceNote = sourceNotesById[source.id];

      expect(source.label.length).toBeGreaterThan(0);
      expect(source.expectedColumns.length).toBeGreaterThan(0);
      expect(source.caveat.length).toBeGreaterThan(0);
      expect(source.statusText.length).toBeGreaterThan(0);
      expect(note.sourceId).toBe(source.id);
      expect(note.path).toBe(source.path);
      expect(note.taskId).toBe(source.taskId);
      expect(note.label).toBe(source.label);
      expect(note.caveat).toBe(source.caveat);
      expect(note.statusText).toBe(source.statusText);
    }
  });

  it("exposes a typed lookup API that rejects invalid source ids at compile time", () => {
    const sourceId: ArtifactSourceId = "task4-test-metrics";

    expect(getArtifactSource(sourceId).format).toBe("json");

    // @ts-expect-error invalid registry ids should fail TypeScript compilation
    getArtifactSource("task5-not-in-scope");
  });
});
