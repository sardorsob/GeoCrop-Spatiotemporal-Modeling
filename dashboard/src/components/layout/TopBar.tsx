"use client";

import { Sprout, Database, AlertTriangle, GitBranch } from "lucide-react";

import { StoryModeToggle, type StoryMode } from "@/components/story/StoryModeToggle";
import { Badge } from "@/components/ui/badge";
import type { NormalizedDashboardData } from "@/lib/data/normalize";

export function TopBar({
  data,
  mode = "story"
}: {
  readonly data: NormalizedDashboardData;
  readonly mode?: StoryMode;
}) {
  const hasIssues = data.errors.length > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-rule/80 bg-paper/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col items-stretch justify-between gap-3 px-4 py-3 min-[360px]:flex-row min-[360px]:items-center sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sprout className="size-5" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              GeoCrop · Corn Belt
            </p>
            <h1 className="-mt-0.5 truncate font-display text-lg font-bold leading-tight text-ink">
              Narrative Atlas
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StoryModeToggle mode={mode} />
          <div className="hidden items-center gap-2 lg:flex">
            <Badge variant="primary" className="gap-1.5">
              <Database className="size-3" />
              {data.sources.length} sources
            </Badge>
            <Badge variant="sky" className="gap-1.5">
              <GitBranch className="size-3" />
              Tasks 1–4
            </Badge>
            {hasIssues ? (
              <Badge variant="amber" className="gap-1.5">
                <AlertTriangle className="size-3" />
                {data.errors.length} load issue{data.errors.length === 1 ? "" : "s"}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                All artifacts loaded
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
