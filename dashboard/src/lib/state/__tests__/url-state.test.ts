import { describe, expect, it } from "vitest";

import { DEFAULT_DASHBOARD_FILTER_STATE } from "../dashboard-state";
import {
  parseDashboardUrlState,
  serializeDashboardUrlState,
  updateDashboardUrlSearchParams
} from "../url-state";

describe("dashboard URL state", () => {
  it("returns defaults and no warnings when the query string is empty", () => {
    const result = parseDashboardUrlState(new URLSearchParams(""));

    expect(result.state).toEqual(DEFAULT_DASHBOARD_FILTER_STATE);
    expect(result.warnings).toEqual([]);
    expect(serializeDashboardUrlState(result.state)).toBe("");
  });

  it("parses all supported query params into normalized dashboard state", () => {
    const result = parseDashboardUrlState(
      new URLSearchParams(
        "tab=extremes&mapLayer=soil-moisture-anomaly&state=ia&crop=corn&event=midwest_flood_2019&rotationRegime=regular&selectedEntity=county%3A19001&lng=-93.62&lat=42.03&zoom=6.5"
      )
    );

    expect(result.warnings).toEqual([]);
    expect(result.state).toEqual({
      tab: "extremes",
      mapLayer: "soil-moisture-anomaly",
      state: "IA",
      crop: "corn",
      event: "midwest_flood_2019",
      rotationRegime: "regular",
      selectedEntity: "county:19001",
      mapView: {
        center: [-93.62, 42.03],
        zoom: 6.5
      }
    });
  });

  it("serializes state in stable order and omits default values", () => {
    const query = serializeDashboardUrlState({
      ...DEFAULT_DASHBOARD_FILTER_STATE,
      tab: "prediction",
      mapLayer: "crop-prediction",
      state: "IA",
      crop: "soybean",
      selectedEntity: "county:19001",
      mapView: {
        center: [-93.62, 42.03],
        zoom: 6.5
      }
    });

    expect(query).toBe(
      "tab=prediction&mapLayer=crop-prediction&state=IA&crop=soybean&selectedEntity=county%3A19001&lng=-93.62&lat=42.03&zoom=6.5"
    );
  });

  it("normalizes invalid params to defaults or omissions with warnings", () => {
    const result = parseDashboardUrlState(
      new URLSearchParams(
        "tab=bad&mapLayer=also-bad&state=%20&crop=rice&event=storm&rotationRegime=chaotic&selectedEntity=%20&lng=999&lat=42&zoom=-1"
      )
    );

    expect(result.state).toEqual(DEFAULT_DASHBOARD_FILTER_STATE);
    expect(result.warnings).toEqual([
      {
        param: "tab",
        value: "bad",
        message: "Invalid tab \"bad\"; using default \"phenology\"."
      },
      {
        param: "mapLayer",
        value: "also-bad",
        message: "Invalid mapLayer \"also-bad\"; using default \"rotation-class\"."
      },
      {
        param: "state",
        value: " ",
        message: "Invalid state \" \"; omitting filter."
      },
      {
        param: "crop",
        value: "rice",
        message: "Invalid crop \"rice\"; omitting filter."
      },
      {
        param: "event",
        value: "storm",
        message: "Invalid event \"storm\"; omitting filter."
      },
      {
        param: "rotationRegime",
        value: "chaotic",
        message: "Invalid rotationRegime \"chaotic\"; omitting filter."
      },
      {
        param: "selectedEntity",
        value: " ",
        message: "Invalid selectedEntity \" \"; omitting filter."
      },
      {
        param: "lng",
        value: "999",
        message: "Invalid map view longitude \"999\"; omitting map view."
      },
      {
        param: "zoom",
        value: "-1",
        message: "Invalid map view zoom \"-1\"; omitting map view."
      }
    ]);
  });

  it("preserves unrelated URL params when updating through the helper", () => {
    const updated = updateDashboardUrlSearchParams(
      new URLSearchParams("utm=class&tab=rotation&page=2"),
      {
        ...DEFAULT_DASHBOARD_FILTER_STATE,
        crop: "winter_wheat"
      }
    );

    expect(updated.toString()).toBe("utm=class&page=2&crop=winter_wheat");
  });
});
