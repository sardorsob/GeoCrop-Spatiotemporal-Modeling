import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { EvidenceCaption } from "@/components/story/EvidenceCaption";
import { FigureFrame } from "@/components/story/FigureFrame";

describe("evidence figure primitives", () => {
  it("frames a named figure with visible source, denominator, and caveat", () => {
    render(
      <FigureFrame
        eyebrow="Seasonal signal"
        title="Corn phenology"
        caption={
          <EvidenceCaption
            source="Task 1 HSGP posterior"
            denominator="535 observations"
            caveat="Intervals summarize posterior uncertainty."
          />
        }
      >
        <div>Plot area</div>
      </FigureFrame>
    );

    const figure = screen.getByRole("figure", { name: "Corn phenology" });
    expect(within(figure).getByText("Plot area")).toBeVisible();
    expect(within(figure).getByText(/Task 1 HSGP posterior/)).toBeVisible();
    expect(within(figure).getByText(/535 observations/)).toBeVisible();
    expect(within(figure).getByText(/posterior uncertainty/)).toBeVisible();
  });

  it("defines an explicit reduced-motion fallback", () => {
    const stylesheet = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
    expect(stylesheet).toContain("scroll-behavior: auto");
    expect(stylesheet).toContain("animation-duration: 0.01ms");
  });
});
