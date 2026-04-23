// @ts-nocheck
import { Button } from "../ui/button";

const CALENDLY_URL = "https://calendly.com/rixlyleads/30min";

export function MidCTASection() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-10 text-center shadow-card md:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
          <div className="relative">
            <h2 className="font-heading text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Ready to Get More Qualified Meetings?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              Let's build your LinkedIn growth engine and scale your pipeline.
            </p>
            <div className="mt-8">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-13 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer decoration-transparent hover:decoration-transparent"
              >
                Book Your Free Strategy Call
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex -space-x-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-card shadow-sm">
                    <img src="/images/testimonial-grid.png" alt="Client" className="h-full w-full object-cover" style={{ objectPosition: `${i % 2 === 0 ? '0%' : '100%'} ${i < 2 ? '0%' : '100%'}` }} />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">Join 100+ founders growing with Rixly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
