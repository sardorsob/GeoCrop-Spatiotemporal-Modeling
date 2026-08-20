import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { ActHeader } from "@/components/story/ActHeader";
import { ActNavigator } from "@/components/story/ActNavigator";
import { EvidenceCaption } from "@/components/story/EvidenceCaption";
import { FigureFrame } from "@/components/story/FigureFrame";
import { StoryModeToggle } from "@/components/story/StoryModeToggle";

describe("Narrative Atlas story primitives", () => {
  it("renders the four-act reading path with one current destination", () => {
    render(<ActNavigator currentAct="rotation" />);

    const navigation = screen.getByRole("navigation", { name: "Research story" });
    const links = within(navigation).getAllByRole("link");

    expect(links).toHaveLength(4);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#act-phenology",
      "#act-rotation",
      "#act-extremes",
      "#act-prediction"
    ]);
    expect(
      within(navigation).getByRole("link", { name: /rotation/i })
    ).toHaveAttribute("aria-current", "location");
  });

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

  it("renders act hierarchy and a single selected Story or Explore mode without task data", () => {
    render(
      <>
        <ActHeader
          act={1}
          eyebrow="The seasonal signal"
          title="A crop year has a shape"
          summary="Observed quartiles and the HSGP posterior share one seasonal clock."
        />
        <StoryModeToggle mode="explore" />
      </>
    );

    expect(
      screen.getByRole("heading", { name: "A crop year has a shape", level: 2 })
    ).toBeVisible();
    expect(screen.getByText("Act 01 / 04")).toBeVisible();

    const modeNavigation = screen.getByRole("navigation", {
      name: "Experience mode"
    });
    const storyLink = within(modeNavigation).getByRole("link", { name: "Story" });
    const exploreLink = within(modeNavigation).getByRole("link", { name: "Explore" });

    expect(storyLink).toHaveAttribute("href", "/");
    expect(exploreLink).toHaveAttribute("href", "/?view=explore");
    expect(storyLink).not.toHaveAttribute("aria-current");
    expect(exploreLink).toHaveAttribute("aria-current", "page");
  });

  it("defines an explicit reduced-motion fallback", () => {
    const stylesheet = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
    expect(stylesheet).toContain("scroll-behavior: auto");
    expect(stylesheet).toContain("animation-duration: 0.01ms");
  });
});
