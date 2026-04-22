// @ts-nocheck
import { Pen, Award, Users, Cog, Phone, MessageSquare, ChevronRight } from "lucide-react";

const services = [
  { icon: Pen, title: "Write Viral Founder Posts to Attract Leads", description: "We write high-impact, scroll-stopping posts that build authority and attract your ideal audience.", color: "from-blue-500/10 to-indigo-500/10", iconColor: "text-blue-600 dark:text-blue-400", borderColor: "group-hover:border-blue-300/50 dark:group-hover:border-blue-500/30" },
  { icon: Award, title: "Founder Personal Branding + Leads", description: "We position you as a trusted authority so you become the obvious choice in your niche.", color: "from-purple-500/10 to-pink-500/10", iconColor: "text-purple-600 dark:text-purple-400", borderColor: "group-hover:border-purple-300/50 dark:group-hover:border-purple-500/30" },
  { icon: Users, title: "Done-for-you LinkedIn Lead Generation", description: "We handle everything—from prospecting to outreach and follow-ups so you get booked calls.", color: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-600 dark:text-emerald-400", borderColor: "group-hover:border-emerald-300/50 dark:group-hover:border-emerald-500/30" },
  { icon: Cog, title: "LinkedIn Automation Setup", description: "We set up safe, smart automation systems to scale outreach and follow-ups seamlessly.", color: "from-orange-500/10 to-amber-500/10", iconColor: "text-orange-600 dark:text-orange-400", borderColor: "group-hover:border-orange-300/50 dark:group-hover:border-orange-500/30" },
  { icon: Phone, title: "Book Discovery Calls", description: "We qualify interested leads and book discovery calls on your calendar.", color: "from-cyan-500/10 to-blue-500/10", iconColor: "text-cyan-600 dark:text-cyan-400", borderColor: "group-hover:border-cyan-300/50 dark:group-hover:border-cyan-500/30" },
  { icon: MessageSquare, title: "Reply Management System", description: "We manage replies, follow-ups, and nurture conversations so no opportunity is missed.", color: "from-rose-500/10 to-red-500/10", iconColor: "text-rose-600 dark:text-rose-400", borderColor: "group-hover:border-rose-300/50 dark:group-hover:border-rose-500/30" },
];

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Our Services</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">
            Our LinkedIn Lead Generation Services
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground md:text-xl">
            Everything you need to build authority, attract leads and book more qualified calls.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 ${service.borderColor}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-8 w-8 ${service.iconColor}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{service.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{service.description}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn more <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
