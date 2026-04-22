// @ts-nocheck
import { Search, Wrench, Send, CalendarCheck } from "lucide-react";

const steps = [
  { number: "01", icon: Search, title: "Discover", description: "We learn about your business, ICP & goals." },
  { number: "02", icon: Wrench, title: "Build", description: "We craft your strategy, profile & systems." },
  { number: "03", icon: Send, title: "Outreach", description: "We reach out and start conversations." },
  { number: "04", icon: CalendarCheck, title: "Book & Close", description: "We book calls and you close deals." },
];

export function ProcessSection() {
  return (
    <section id="process" className="relative bg-background py-20 md:py-28">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">How It Works</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">Our Simple 4-Step Process</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">A proven process that brings you consistent results.</p>
        </div>
        <div className="mt-16 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-center">
                <div className="group flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="flex items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1" style={{ height: '72px', width: '72px' }}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-md border border-border/50">{step.number}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 max-w-[180px] text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden px-8 md:block lg:px-12">
                    <div className="flex items-center">
                      <div className="h-px w-12 bg-gradient-to-r from-primary/40 to-primary/10 lg:w-16" />
                      <div className="h-0 w-0 border-y-4 border-l-6 border-y-transparent border-l-primary/30" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
