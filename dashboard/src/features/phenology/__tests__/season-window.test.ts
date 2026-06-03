import { describe, expect, it } from "vitest";

import {
  clampSeasonWindow,
  filterRowsByWindow,
  findBrushIndexes,
  getSeasonBounds,
  getSeasonWindowPreset
} from "../season-window";

const rows = [
  { dayOfYear: 100, label: "early" },
  { dayOfYear: 160, label: "peak" },
  { dayOfYear: 220, label: "late" }
] as const;

describe("season window helpers", () => {
  it("derives a full-season bound from ordered or unordered rows", () => {
    expect(getSeasonBounds([rows[2], rows[0], rows[1]])).toEqual({
      startDay: 100,
      endDay: 220
    });
  });

  it("clamps inverted custom ranges to available day-of-year bounds", () => {
    expect(clampSeasonWindow({ startDay: 260, endDay: 120 }, { startDay: 100, endDay: 220 })).toEqual({
      startDay: 120,
      endDay: 220
    });
  });

  it("filters rows and maps custom windows to brush indexes", () => {
    const window = { startDay: 120, endDay: 180 };

    expect(filterRowsByWindow(rows, window)).toEqual([{ dayOfYear: 160, label: "peak" }]);
    expect(findBrushIndexes(rows, window)).toEqual({ startIndex: 1, endIndex: 1 });
  });

  it("creates fixed phenology presets within the available season", () => {
    expect(getSeasonWindowPreset("green_up", { startDay: 100, endDay: 260 })).toEqual({
      id: "green_up",
      label: "Green-up",
      window: { startDay: 100, endDay: 150 }
    });
    expect(getSeasonWindowPreset("senescence", { startDay: 180, endDay: 220 })).toEqual({
      id: "senescence",
      label: "Senescence",
      window: { startDay: 210, endDay: 220 }
    });
  });
});
