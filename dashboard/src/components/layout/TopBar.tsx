"use client";

import { Sprout, Database, AlertTriangle, GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { NormalizedDashboardData } from "@/lib/data/normalize";

export function TopBar({ data }: { readonly data: NormalizedDashboardData }) {
  const hasIssues = data.errors.length > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20">
            <Sprout className="size-5" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
              GeoCrop · Corn Belt
            </p>
            <h1 className="-mt-0.5 text-lg font-bold leading-tight text-slate-900">
              Spatiotemporal Crop Intelligence
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
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
            <Badge variant="outline" className="gap-1.5 text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              All artifacts loaded
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
