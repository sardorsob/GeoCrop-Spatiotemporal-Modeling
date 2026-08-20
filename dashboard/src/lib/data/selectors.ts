import type { NormalizedDashboardData } from "./normalize";
import type {
  CropId,
  DataPointSource,
  ExtremeEventId,
  StudyStateCode
} from "./types";

export type RotationEvidenceMetric =
  | "pctRegular"
  | "pctMonoculture"
  | "pctIrregular";

export type RotationEvidenceGeographyKind = "state" | "county";

export interface MapEvidenceValue {
  readonly geographyId: string;
  readonly geographyName: string;
  readonly geographyKind: RotationEvidenceGeographyKind;
  readonly stateCode: StudyStateCode;
  readonly value: number;
  readonly rank: number;
  readonly denominator: number;
  readonly source: DataPointSource;
}

export interface MapEvidenceResult {
  readonly values: readonly MapEvidenceValue[];
  readonly domain: readonly [minimum: number, maximum: number];
  readonly unit: "%" | "z-score";
  readonly denominatorLabel: string;
}

export function selectRotationMapEvidence(
  task2: Pick<NormalizedDashboardData["task2"], "geographySummaries">,
  options: {
    readonly geographyKind: RotationEvidenceGeographyKind;
    readonly metric: RotationEvidenceMetric;
  }
): MapEvidenceResult {
  const rows = task2.geographySummaries.filter(
    (row) => row.geographyKind === options.geographyKind && row.stateCode
  );
  const ranked = rows
    .map((row) => ({ row, value: row[options.metric] }))
    .sort((left, right) =>
      right.value - left.value || left.row.geographyName.localeCompare(right.row.geographyName)
    );
  const maximum = Math.max(0, ...ranked.map(({ value }) => value));

  return {
    values: ranked.map(({ row, value }, index) => ({
      geographyId: row.geographyId,
      geographyName: row.geographyName,
      geographyKind: options.geographyKind,
      stateCode: row.stateCode as StudyStateCode,
      value,
      rank: index + 1,
      denominator: row.nPixels,
      source: row.source
    })),
    domain: [0, maximum],
    unit: "%",
    denominatorLabel:
      options.geographyKind === "state"
        ? "Valid classified cropland pixels within state"
        : "Valid classified cropland pixels within county"
  };
}

export function selectEventMapEvidence(
  task3: Pick<NormalizedDashboardData["task3"], "anomalySummaries">,
  options: {
    readonly eventId: ExtremeEventId;
    readonly crop: CropId;
  }
): MapEvidenceResult {
  const cropRows = task3.anomalySummaries.filter(
    (row): row is typeof row & { readonly stateCode: StudyStateCode } =>
      row.crop === options.crop && row.stateCode !== undefined
  );
  const eventRows = cropRows
    .filter((row) => row.eventId === options.eventId)
    .sort(
      (left, right) =>
        Math.abs(right.meanZ) - Math.abs(left.meanZ) || left.state.localeCompare(right.state)
    );
  const maximumMagnitude = Math.max(1, ...cropRows.map((row) => Math.abs(row.meanZ)));

  return {
    values: eventRows.map((row, index) => ({
      geographyId: row.stateCode,
      geographyName: row.state,
      geographyKind: "state",
      stateCode: row.stateCode,
      value: row.meanZ,
      rank: index + 1,
      denominator: row.nPixelWeeks,
      source: row.source
    })),
    domain: [-maximumMagnitude, maximumMagnitude],
    unit: "z-score",
    denominatorLabel: "Pixel-weeks in the selected event, state, and crop window"
  };
}
