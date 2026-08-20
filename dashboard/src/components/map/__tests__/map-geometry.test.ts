import { describe, expect, it } from "vitest";

import {
  STUDY_VIEW_BOX,
  getStudyCountyFeatures,
  getStudyStateFeatures
} from "../map-geometry";

describe("Corn Belt map geometry", () => {
  it("returns exactly the 13 canonical study states in Albers coordinates", () => {
    const states = getStudyStateFeatures();

    expect(states).toHaveLength(13);
    expect(states.map((state) => state.properties.stateCode).sort()).toEqual([
      "IA",
      "IL",
      "IN",
      "KS",
      "KY",
      "MI",
      "MN",
      "MO",
      "ND",
      "NE",
      "OH",
      "SD",
      "WI"
    ]);
  });

  it("keeps five-digit county GEOIDs and a study-focused viewport", () => {
    const counties = getStudyCountyFeatures();

    expect(counties.length).toBeGreaterThan(1_000);
    expect(counties.every((county) => /^\d{5}$/.test(county.properties.geographyId))).toBe(true);
    expect(counties.some((county) => county.properties.geographyId === "17001")).toBe(true);
    expect(STUDY_VIEW_BOX.width).toBeLessThan(700);
    expect(STUDY_VIEW_BOX.height).toBeLessThan(500);
  });
});
