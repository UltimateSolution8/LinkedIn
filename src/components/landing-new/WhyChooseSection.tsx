// @ts-nocheck
import { Check, BarChart3, Percent } from "lucide-react";

const benefits = [
  { text: "Proven systems that get meetings" },
  { text: "100% done-for-you service" },
  { text: "No bots. No spam. 100% safe" },
  { text: "Clear reporting & communication" },
  { text: "Results-driven & ROI focused" },
  { text: "Month-to-month. No lock-in" },
];

export function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Why Us</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">Why Choose Userixly?</h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground">We deliver results, not excuses. Here's what sets us apart.</p>
        </div>
        <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-border/50 bg-card p-8 shadow-card md:p-10">
            <h3 className="mb-8 text-2xl font-bold text-foreground">What You Get With Us</h3>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-5 transition-colors hover:bg-secondary">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                  </div>
                  <span className="text-base font-medium text-foreground leading-relaxed">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card p-8 text-center shadow-card">
              <div className="mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10" style={{ height: '72px', width: '72px' }}>
                <BarChart3 className="h-9 w-9 text-primary" />
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Meetings Booked</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-6xl font-extrabold text-foreground">48</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-600">+90%</span>
              </div>
              <div className="mt-6 flex items-end gap-2">
                {[40, 55, 35, 65, 45, 80, 90].map((h, i) => (
                  <div key={i} className="w-5 rounded-t-sm bg-gradient-to-t from-primary to-accent" style={{ height: `${h * 0.7}px` }} />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card p-8 text-center shadow-card">
              <div className="mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10" style={{ height: '72px', width: '72px' }}>
                <Percent className="h-9 w-9 text-accent" />
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connection Acceptance</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-6xl font-extrabold text-foreground">62%</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-600">+8%</span>
              </div>
              <div className="relative mt-6 h-20 w-20">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="7" fill="none" className="text-secondary" />
                  <circle cx="40" cy="40" r="34" stroke="url(#why-gradient)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={`${62 * 2.14} ${100 * 2.14}`} />
                  <defs>
                    <linearGradient id="why-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
