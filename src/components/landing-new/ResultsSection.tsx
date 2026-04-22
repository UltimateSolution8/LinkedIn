// @ts-nocheck
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

const results = [
  { icon: TrendingUp, value: "300%", label: "Increased Meetings", description: "Booked for qualified calls in the first 60 days.", highlight: false },
  { icon: DollarSign, value: "$250K+", label: "Pipeline Growth", description: "Generated $250K+ in pipeline.", highlight: true },
  { icon: Calendar, value: "20-50", label: "Qualified Meetings", sublabel: "Consistent Flow", description: "Qualified meetings every month consistently.", highlight: false },
];

export function ResultsSection() {
  return (
    <section className="relative bg-card py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Proven Results</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">Results That Speak</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">Real results from real clients.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {results.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className={`flex flex-col items-center rounded-3xl border p-10 text-center transition-all duration-300 ${r.highlight ? "border-transparent bg-gradient-to-br from-primary to-accent text-white shadow-elevated" : "border-border/50 bg-card shadow-card hover:shadow-card-hover hover:-translate-y-1"}`}>
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${r.highlight ? "bg-white/20" : "bg-primary/10"}`}>
                  <Icon className={`h-8 w-8 ${r.highlight ? "text-white" : "text-primary"}`} />
                </div>
                <p className={`mt-6 text-5xl font-extrabold ${r.highlight ? "text-white" : "text-primary"}`}>{r.value}</p>
                <p className={`mt-2 text-lg font-semibold ${r.highlight ? "text-white/90" : "text-foreground"}`}>{r.label}</p>
                {r.sublabel && <span className={`mt-2 rounded-full px-3 py-1 text-xs font-medium ${r.highlight ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{r.sublabel}</span>}
                <p className={`mt-3 text-sm ${r.highlight ? "text-white/80" : "text-muted-foreground"}`}>{r.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
