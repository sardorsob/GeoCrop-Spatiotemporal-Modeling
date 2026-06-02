import { homeCopy } from "@/lib/scaffold/home-copy";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          GeoCrop dashboard scaffold
        </p>
        <div className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            {homeCopy.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            {homeCopy.subtitle}
          </p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {homeCopy.lanes.map((lane) => (
            <div
              className="rounded border border-slate-200 bg-white p-5 shadow-sm"
              key={lane}
            >
              <p className="text-sm font-medium text-slate-500">Research lane</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {lane}
              </h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
