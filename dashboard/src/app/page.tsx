import { Suspense } from "react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { loadDashboardData } from "@/lib/data/dashboard-data";

export default async function Home() {
  const data = await loadDashboardData();

  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardShell data={data} />
    </Suspense>
  );
}

function DashboardFallback() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950">
      <div className="mx-auto max-w-7xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">
          Loading GeoCrop dashboard
        </p>
      </div>
    </main>
  );
}
