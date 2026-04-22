// @ts-nocheck
import { User, Target, FileText, Calendar, BarChart3, Settings } from "lucide-react";

const features = [
  { icon: User, title: "Profile Optimization", description: "We optimize your profile to attract the right people.", gradient: "from-blue-500/10 to-indigo-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
  { icon: Target, title: "Targeted Outreach", description: "We reach out to your ideal clients with personalized messages.", gradient: "from-purple-500/10 to-pink-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
  { icon: FileText, title: "Content & Authority", description: "We create content that builds trust and drives inbound leads.", gradient: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { icon: Calendar, title: "Appointment Setting", description: "We handle conversations and book qualified calls on your calendar.", gradient: "from-orange-500/10 to-amber-500/10", iconColor: "text-orange-600 dark:text-orange-400" },
  { icon: BarChart3, title: "Pipeline & Reporting", description: "You get a clear pipeline view and regular performance reports.", gradient: "from-cyan-500/10 to-blue-500/10", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { icon: Settings, title: "Ongoing Optimization", description: "We test, analyze & optimize to get you better results every month.", gradient: "from-rose-500/10 to-red-500/10", iconColor: "text-rose-600 dark:text-rose-400" },
];

export function FeaturesSection() {
  return (
    <section id="about" className="relative bg-card py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Our System</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">
            The LinkedIn Lead Generation System That Actually Works
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            We combine profile optimization, content strategy, and targeted outreach to fill your calendar with qualified calls.
          </p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 shadow-card transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                    <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
