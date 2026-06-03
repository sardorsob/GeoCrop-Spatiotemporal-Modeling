const EMPTY_NUMBER_VALUES = new Set(["", "nan", "na", "n/a", "null", "undefined", "--"]);

export function parseDashboardNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (EMPTY_NUMBER_VALUES.has(normalized)) {
    return undefined;
  }

  const numericText = value.trim().replace(/,/g, "").replace(/%$/, "");
  const parsed = Number(numericText);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseRequiredDashboardNumber(value: unknown, fallback = 0): number {
  return parseDashboardNumber(value) ?? fallback;
}
