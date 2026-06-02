import { describe, expect, it } from "vitest";

import { homeCopy } from "./home-copy";

describe("homeCopy", () => {
  it("names the GeoCrop dashboard and the four research lanes", () => {
    expect(homeCopy.title).toBe("GeoCrop Interactive Dashboard");
    expect(homeCopy.lanes).toEqual([
      "Phenology",
      "Rotation",
      "Extremes",
      "Prediction"
    ]);
  });
});
