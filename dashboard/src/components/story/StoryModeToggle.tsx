import type { DashboardView } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type StoryMode = DashboardView;

const MODES = [
  { id: "story", label: "Story" },
  { id: "explore", label: "Explore" }
] as const;

export function StoryModeToggle({
  mode,
  className,
  storyHref = "/",
  exploreHref = "/?view=explore"
}: {
  readonly mode: StoryMode;
  readonly className?: string;
  readonly storyHref?: string;
  readonly exploreHref?: string;
}) {
  return (
    <nav
      aria-label="Experience mode"
      className={cn(
        "story-mode-toggle inline-grid grid-cols-2 rounded-full border border-rule bg-muted/80 p-1 text-xs font-semibold",
        className
      )}
    >
      {MODES.map((item) => {
        const isCurrent = item.id === mode;
        const href = item.id === "story" ? storyHref : exploreHref;

        return (
          <a
            key={item.id}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "flex min-h-11 min-w-16 items-center justify-center rounded-full px-3 transition-colors",
              isCurrent
                ? "bg-paper text-ink shadow-sm"
                : "text-muted-foreground hover:text-ink"
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
