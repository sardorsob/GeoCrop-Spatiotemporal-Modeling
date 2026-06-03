import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MAP_LAYER_IDS } from "@/lib/state/dashboard-state";
import { CornBeltMap } from "../CornBeltMap";
import { CORN_BELT_MAP_LAYERS, getCornBeltMapLayer } from "@/features/map/map-layers";

describe("CornBeltMap", () => {
  it("renders a source-backed fallback surface with visible caveats and legend", () => {
    render(<CornBeltMap activeLayerId="rotation-class" />);

    expect(
      screen.getByRole("region", { name: "Corn Belt map surface" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Corn Belt map" })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/source-backed fallback/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not pixel-precise/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/tap a state tile/i)).toBeInTheDocument();

    const legend = screen.getByRole("list", {
      name: "Rotation class legend"
    });
    expect(within(legend).getByText("Regular")).toBeInTheDocument();
    expect(within(legend).getByText("Monoculture")).toBeInTheDocument();
    expect(within(legend).getByText("Irregular")).toBeInTheDocument();

    expect(
      screen.getByText("Task 2 areal statistics by county")
    ).toBeInTheDocument();
    expect(screen.getByText(/County summaries are scoped/i)).toBeInTheDocument();
  });

  it("offers controls for every dashboard MapLayerId", () => {
    render(<CornBeltMap activeLayerId="prediction-agreement" />);

    const controls = screen.getByRole("radiogroup", { name: "Map layer" });

    for (const layerId of MAP_LAYER_IDS) {
      const layer = getCornBeltMapLayer(layerId);
      expect(
        within(controls).getByRole("radio", { name: new RegExp(layer.label, "i") })
      ).toBeInTheDocument();
    }
  });

  it("emits selected geography and layer context when a tile is selected", () => {
    const onSelectionChange = vi.fn();

    render(
      <CornBeltMap
        activeLayerId="soil-moisture-anomaly"
        onSelectionChange={onSelectionChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /select iowa/i }));

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
    }
  });
});
