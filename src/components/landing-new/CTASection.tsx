// @ts-nocheck
import { Calendar, Grid3X3, FileText, Check, Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { PopupButton } from "react-calendly";

const CALENDLY_URL = "https://calendly.com/rixlyleads/30min";

const benefits = ["Custom strategy for your business", "No commitments", "100% done-for-you"];
const actions = [
  { icon: Calendar, title: "Strategy Call", description: "30 Min Call" },
  { icon: Grid3X3, title: "Custom Plan", description: "For Your Business" },
  { icon: FileText, title: "Action Plan", description: "Clear Next Steps" },
];
const contactMethods = [
  { icon: Mail, title: "Email Us", value: "hello@userixly.com" },
  { icon: Phone, title: "Call Us", value: "+1 (800) 555-0197" },
  { icon: MessageCircle, title: "WhatsApp", value: "+1 (800) 555-0197" },
];

export function CTASection() {
  return (
    <section className="relative bg-card py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-white shadow-elevated md:p-10">
            <h2 className="font-heading text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Fill Your Calendar with Qualified Meetings?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90">Book a free strategy call and let's build your LinkedIn growth engine.</p>
            <ul className="mt-6 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PopupButton
                url={CALENDLY_URL}
                rootElement={document.getElementById("root")!}
                text="Book My Free Strategy Call"
                className="inline-flex items-center justify-center h-13 w-full rounded-2xl bg-white px-6 text-base font-semibold text-primary transition-all hover:bg-white/90 hover:-translate-y-0.5 cursor-pointer sm:w-auto"
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/50 shadow-sm">
                    <img src="/images/testimonial-grid.png" alt="Client" className="h-full w-full object-cover" style={{ objectPosition: `${i % 2 === 0 ? '0%' : '100%'} ${i < 2 ? '0%' : '100%'}` }} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80">Join 100+ founders growing with Userixly</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-border/50 bg-card p-7 shadow-card md:p-8">
              <h3 className="text-xl font-bold text-foreground">Let's Build Your LinkedIn Growth Engine</h3>
              <p className="mt-2 text-sm text-muted-foreground">Book a free strategy call and see how we can help you get more qualified meetings.</p>
              <div className="mt-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <Grid3X3 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-foreground">Pick a Date & Time That Works For You</p>
              <div className="mt-5">
                <PopupButton
                  url={CALENDLY_URL}
                  rootElement={document.getElementById("root")!}
                  text="Book Your Free Call"
                  className="flex items-center justify-center h-12 w-full rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-90 hover:-translate-y-0.5 cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.title} className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-5 text-center shadow-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{action.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="font-heading text-2xl font-bold text-foreground">Still Have Questions?</h3>
          <p className="mt-2 text-base text-muted-foreground">We're here to help.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {contactMethods.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-7 text-center shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="mt-4 text-base font-semibold text-foreground">{m.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
