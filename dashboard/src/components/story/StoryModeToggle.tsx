import { cn } from "@/lib/utils";

export type StoryMode = "story" | "explore";

const MODES = [
  { id: "story", label: "Story", href: "/" },
  { id: "explore", label: "Explore", href: "/?view=explore" }
] as const;

export function StoryModeToggle({
  mode,
  className
}: {
  readonly mode: StoryMode;
  readonly className?: string;
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

        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "flex min-h-9 min-w-16 items-center justify-center rounded-full px-3 transition-colors",
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
