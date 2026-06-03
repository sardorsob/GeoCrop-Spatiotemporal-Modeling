import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardShell } from "./DashboardShell";

describe("DashboardShell", () => {
  it("renders the command center regions and task tabs", () => {
    render(<DashboardShell />);

    expect(
      screen.getByRole("heading", { name: "GeoCrop Interactive Dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Research tasks" }))
      .toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Main evidence" }))
      .toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Selected context" }))
      .toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Analytical summary" }))
      .toBeInTheDocument();

    const tablist = screen.getByRole("tablist", { name: "Research tasks" });
    expect(within(tablist).getAllByRole("tab")).toHaveLength(4);
    for (const tabName of ["Phenology", "Rotation", "Extremes", "Prediction"]) {
      expect(within(tablist).getByRole("tab", { name: tabName }))
        .toBeInTheDocument();
    }
  });
});
