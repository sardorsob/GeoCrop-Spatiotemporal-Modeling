import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MAP_LAYER_IDS } from "@/lib/state/dashboard-state";
import { CORN_BELT_MAP_LAYERS, getCornBeltMapLayer } from "@/features/map/map-layers";
import { MapPanel } from "../MapPanel";

describe("MapPanel", () => {
  it("renders the current layer with legend and source context", () => {
    render(
      <MapPanel
        activeLayerId="rotation-class"
        onLayerChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("region", { name: "Corn Belt map surface" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Corn Belt geographic surface" })
    ).toBeInTheDocument();

    const region = screen.getByRole("region", { name: "Corn Belt map surface" });
    expect(within(region).getAllByText("Regular").length).toBeGreaterThan(0);
    expect(within(region).getByText("Monoculture")).toBeInTheDocument();
    expect(within(region).getByText("No data")).toBeInTheDocument();
    expect(within(region).getByText(/Corn Belt coverage:/)).toHaveTextContent(
      "Corn Belt coverage: 10 states."
    );
  });

  it("emits selected geography and layer context when a state is selected", () => {
    const onSelectionChange = vi.fn();

    render(
      <MapPanel
        activeLayerId="soil-moisture-anomaly"
        onLayerChange={vi.fn()}
        onSelectionChange={onSelectionChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Select Iowa" }));

    expect(onSelectionChange).toHaveBeenCalledWith({
      layerId: "soil-moisture-anomaly",
      selection: {
        geographyKind: "state",
        id: "state:IA",
        label: "Iowa",
        sourceId: "task3-midwest-flood-2019-anomaly-stats"
      },
      displayValue: "Flood anomaly watch",
      sourceIds: [
        "task3-midwest-flood-2019-anomaly-stats",
        "task3-plains-drought-2022-anomaly-stats"
      ],
      sourceLabel: "Task 3 Midwest flood 2019 anomaly statistics",
      caveat:
        "Anomaly summaries are aggregated by state and crop for the 2019 Midwest flood event window."
    });
  });
});

describe("Corn Belt map layer metadata", () => {
  it("covers every MapLayerId with source-backed fallback metadata", () => {
    expect(CORN_BELT_MAP_LAYERS.map((layer) => layer.id)).toEqual(MAP_LAYER_IDS);

    for (const layer of CORN_BELT_MAP_LAYERS) {
      expect(layer.sourceIds.length).toBeGreaterThan(0);
      expect(layer.sourceNotes.length).toBeGreaterThan(0);
      expect(layer.legend.length).toBeGreaterThan(0);
      expect(layer.status).toBe("fallback-only");
      expect(layer.fallbackReason).toMatch(/No browser-ready GeoJSON\/TopoJSON/i);
      expect(getCornBeltMapLayer(layer.id)).toBe(layer);
    }
  });
});
