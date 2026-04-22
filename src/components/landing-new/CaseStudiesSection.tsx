// @ts-nocheck
import { ArrowUpRight, Check } from "lucide-react";

const caseStudies = [
  {
    company: "leadr", type: "B2B SaaS", country: "US",
    description: "Lead generation agency with outbound and inbound for SaaS companies.",
    approach: ["Profile optimization & positioning", "Targeted outreach to decision-makers", "Content strategy for inbound leads"],
    results: [
      { label: "Results in 60 Days", value: "" },
      { label: "Meetings Booked", value: "52" },
      { label: "Revenue Generated", value: "$180K+" },
      { label: "Pipeline Growth", value: "3.2X" },
    ],
  },
  {
    company: "BrightPath Coaching", type: "Coaching", country: "UK",
    description: "Coaching business that needed more qualified leads.",
    approach: ["Content strategy & optimization", "Engagement & nurturing", "Appointment setting"],
    results: [
      { label: "Results in 45 Days", value: "" },
      { label: "Meetings Booked", value: "28" },
      { label: "Revenue Generated", value: "$95K+" },
      { label: "Revenue Growth", value: "2.7X" },
    ],
  },
];

export function CaseStudiesSection() {
  return (
    <section id="case-studies" className="relative bg-card py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Success Stories</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">Case Studies</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">How we help businesses grow with LinkedIn.</p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {caseStudies.map((study) => (
            <div key={study.company} className="group overflow-hidden rounded-3xl border border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
              <div className="border-b border-border/40 p-7">
                <h3 className="text-xl font-bold text-foreground">{study.company}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{study.type}</span>
                  <span className="text-sm text-muted-foreground">{study.country}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{study.description}</p>
              </div>
              <div className="grid gap-6 p-7 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Our Approach</h4>
                  <ul className="mt-3 space-y-2.5">
                    {study.approach.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  {study.results.map((result) =>
                    result.value ? (
                      <div key={result.label} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-2.5">
                        <span className="text-sm text-muted-foreground">{result.label}</span>
                        <span className="text-lg font-bold text-primary">{result.value}</span>
                      </div>
                    ) : (
                      <p key={result.label} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{result.label}</p>
                    )
                  )}
                </div>
              </div>
              <div className="border-t border-border/40 px-7 py-4">
                <button className="group/btn flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                  View Full Case Study
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
