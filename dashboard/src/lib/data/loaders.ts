import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { ArtifactSource, ArtifactSourceId, DashboardTaskId, SourceFormat } from "./types";

export type RawArtifactRow = Readonly<Record<string, string>>;

export type ArtifactLoadErrorCode = "missing-source" | "parse-error" | "unsupported-format";

interface LoadedArtifactBase {
  readonly sourceId: ArtifactSourceId;
  readonly taskId: DashboardTaskId;
  readonly path: string;
  readonly absolutePath: string;
  readonly format: SourceFormat;
  readonly label: string;
  readonly caveat: string;
  readonly dateStamp?: string;
  readonly denominator?: string;
  readonly source: ArtifactSource;
}

export interface LoadedCsvArtifact extends LoadedArtifactBase {
  readonly status: "success";
  readonly rowCount: number;
  readonly rows: readonly RawArtifactRow[];
}

export interface LoadedJsonArtifact extends LoadedArtifactBase {
  readonly status: "success";
  readonly rowCount: number;
  readonly json: unknown;
}

export type LoadedArtifactSuccess = LoadedCsvArtifact | LoadedJsonArtifact;

export interface LoadedArtifactError extends LoadedArtifactBase {
  readonly status: "error";
  readonly rowCount: 0;
  readonly errorCode: ArtifactLoadErrorCode;
  readonly message: string;
}

export type LoadedArtifact = LoadedArtifactSuccess | LoadedArtifactError;

export interface ArtifactLoadOptions {
  readonly dashboardRoot?: string;
}

export async function loadArtifactSources(
  sources: readonly ArtifactSource[],
  options: ArtifactLoadOptions = {}
): Promise<readonly LoadedArtifact[]> {
  return Promise.all(sources.map((source) => loadArtifactSource(source, options)));
}

export async function loadArtifactSource(
  source: ArtifactSource,
  options: ArtifactLoadOptions = {}
): Promise<LoadedArtifact> {
  const absolutePath = resolveArtifactPath(source.path, options.dashboardRoot);
  const base = createResultBase(source, absolutePath);

  try {
    const fileContents = await readFile(absolutePath, "utf8");

    if (source.format === "csv") {
      const rows = parseCsvRows(fileContents);

      return {
        ...base,
        status: "success",
        rowCount: rows.length,
        rows
      };
    }

    if (source.format === "json") {
      const json = JSON.parse(fileContents) as unknown;

      return {
        ...base,
        status: "success",
        rowCount: Array.isArray(json) ? json.length : json === null ? 0 : 1,
        json
      };
    }

    return createErrorResult(base, "unsupported-format", `Unsupported artifact format: ${source.format}`);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return createErrorResult(base, "missing-source", `Artifact source file was not found: ${source.path}`);
    }

    return createErrorResult(
      base,
      "parse-error",
      error instanceof Error ? error.message : `Unable to parse artifact source: ${source.path}`
    );
  }
}

export function resolveArtifactPath(sourcePath: string, dashboardRoot = getDefaultDashboardRoot()): string {
  return path.resolve(dashboardRoot, sourcePath);
}

export function parseCsvRows(csvText: string): readonly RawArtifactRow[] {
  const records = splitCsvRecords(csvText);

  if (records.length === 0) {
    return [];
  }

  const headers = records[0].map((header, index) => {
    const cleanHeader = index === 0 ? header.replace(/^\uFEFF/, "") : header;

    return cleanHeader.trim();
  });

  return records
    .slice(1)
    .filter((record) => record.some((value) => value.trim().length > 0))
    .map((record) => {
      const row: Record<string, string> = {};

      for (const [index, header] of headers.entries()) {
        row[header] = record[index] ?? "";
      }

      return row;
    });
}

function splitCsvRecords(csvText: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];

    if (inQuotes) {
      if (char === "\"" && csvText[index + 1] === "\"") {
        field += "\"";
        index += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        field += char;
      }

      continue;
    }

    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      record.push(field);
      field = "";
    } else if (char === "\n") {
      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else if (char === "\r") {
      if (csvText[index + 1] === "\n") {
        index += 1;
      }

      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  return records;
}

function createResultBase(source: ArtifactSource, absolutePath: string): LoadedArtifactBase {
  return {
    sourceId: source.id,
    taskId: source.taskId,
    path: source.path,
    absolutePath,
    format: source.format,
    label: source.label,
    caveat: source.caveat,
    dateStamp: source.dateStamp,
    denominator: source.denominator,
    source
  };
}

function createErrorResult(
  base: LoadedArtifactBase,
  errorCode: ArtifactLoadErrorCode,
  message: string
): LoadedArtifactError {
  return {
    ...base,
    status: "error",
    rowCount: 0,
    errorCode,
    message
  };
}

function getDefaultDashboardRoot(): string {
  const cwd = process.cwd();

  if (path.basename(cwd) === "dashboard") {
    return cwd;
  }

  const dashboardFromCwd = path.join(cwd, "dashboard");

  if (existsSync(dashboardFromCwd)) {
    return dashboardFromCwd;
  }

  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}
