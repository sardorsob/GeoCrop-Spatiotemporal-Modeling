export interface SeasonWindow {
  readonly startDay: number;
  readonly endDay: number;
}

export type SeasonWindowPresetId = "full" | "green_up" | "peak" | "senescence";

export interface SeasonWindowPreset {
  readonly id: SeasonWindowPresetId;
  readonly label: string;
  readonly window: SeasonWindow;
}

const PRESET_LABELS = {
  full: "Full season",
  green_up: "Green-up",
  peak: "Peak",
  senescence: "Senescence"
} as const satisfies Readonly<Record<SeasonWindowPresetId, string>>;

const PRESET_WINDOWS = {
  green_up: { startDay: 90, endDay: 150 },
  peak: { startDay: 150, endDay: 210 },
  senescence: { startDay: 210, endDay: 280 }
} as const satisfies Readonly<Record<Exclude<SeasonWindowPresetId, "full">, SeasonWindow>>;

export function getSeasonBounds<T extends { readonly dayOfYear: number }>(
  rows: readonly T[]
): SeasonWindow | undefined {
  if (rows.length === 0) return undefined;

  let startDay = rows[0].dayOfYear;
  let endDay = rows[0].dayOfYear;

  for (const row of rows) {
    startDay = Math.min(startDay, row.dayOfYear);
    endDay = Math.max(endDay, row.dayOfYear);
  }

  return { startDay, endDay };
}

export function clampSeasonWindow(window: SeasonWindow, bounds: SeasonWindow): SeasonWindow {
  const orderedStart = Math.min(window.startDay, window.endDay);
  const orderedEnd = Math.max(window.startDay, window.endDay);

  return {
    startDay: clampDay(orderedStart, bounds),
    endDay: clampDay(orderedEnd, bounds)
  };
}

export function filterRowsByWindow<T extends { readonly dayOfYear: number }>(
  rows: readonly T[],
  window: SeasonWindow
): T[] {
  return rows.filter((row) => row.dayOfYear >= window.startDay && row.dayOfYear <= window.endDay);
}

export function findBrushIndexes<T extends { readonly dayOfYear: number }>(
  rows: readonly T[],
  window: SeasonWindow
): { startIndex: number; endIndex: number } {
  if (rows.length === 0) return { startIndex: 0, endIndex: 0 };

  const startIndex = findFirstIndexAtOrAfter(rows, window.startDay);
  const endIndex = findLastIndexAtOrBefore(rows, window.endDay);

  if (startIndex === -1) {
    const lastIndex = rows.length - 1;
    return { startIndex: lastIndex, endIndex: lastIndex };
  }

  if (endIndex === -1) return { startIndex: 0, endIndex: 0 };
  if (startIndex > endIndex) return { startIndex, endIndex: startIndex };

  return { startIndex, endIndex };
}

export function getSeasonWindowPreset(
  id: SeasonWindowPresetId,
  bounds: SeasonWindow
): SeasonWindowPreset {
  const window = id === "full" ? bounds : PRESET_WINDOWS[id];

  return {
    id,
    label: PRESET_LABELS[id],
    window: clampSeasonWindow(window, bounds)
  };
}

function clampDay(dayOfYear: number, bounds: SeasonWindow): number {
  return Math.min(bounds.endDay, Math.max(bounds.startDay, Math.round(dayOfYear)));
}

function findFirstIndexAtOrAfter<T extends { readonly dayOfYear: number }>(
  rows: readonly T[],
  dayOfYear: number
): number {
  return rows.findIndex((row) => row.dayOfYear >= dayOfYear);
}

function findLastIndexAtOrBefore<T extends { readonly dayOfYear: number }>(
  rows: readonly T[],
  dayOfYear: number
): number {
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].dayOfYear <= dayOfYear) return index;
  }

  return -1;
}
