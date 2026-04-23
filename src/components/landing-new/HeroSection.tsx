// @ts-nocheck
import { motion } from "framer-motion";
import { Check, Calendar, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const CALENDLY_URL = "https://calendly.com/rixlyleads/30min";

const trustFeatures = [
  "No long-term contracts",
  "Results-driven approach",
  "100% done-for-you",
];

const stats = [
  { value: "50+", label: "Meetings Booked", sublabel: "Monthly", icon: Calendar },
  { value: "3X", label: "Pipeline", sublabel: "Growth", icon: TrendingUp },
  { value: "100+", label: "Clients", sublabel: "Served", icon: Users },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Column */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                LinkedIn Lead Generation Experts
              </span>
            </div>

            <h1 className="font-heading text-balance text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-[56px] lg:text-[64px]">
              Get 20–50 Qualified{" "}
              <span className="gradient-text">Meetings</span> Every Month Using{" "}
              <span className="gradient-text">LinkedIn</span>
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              We help founders, coaches & B2B businesses generate high-quality leads and book more calls—consistently.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer decoration-transparent hover:decoration-transparent"
                data-testid="hero-book-call"
              >
                <Calendar className="mr-2 h-5 w-5 inline" />
                Book a Free Strategy Call
              </a>

              <button
                onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center h-14 rounded-2xl border-2 border-border bg-card px-8 text-base font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-secondary gap-2"
              >
                See How It Works
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {trustFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -right-4 top-8 h-[380px] w-[320px] rounded-[40px] bg-gradient-to-br from-primary via-primary to-accent opacity-90 md:h-[460px] md:w-[380px] animate-pulse-glow" />
              <div className="absolute -right-8 top-12 h-[380px] w-[320px] rounded-[40px] bg-gradient-to-br from-accent/30 to-primary/20 blur-xl md:h-[460px] md:w-[380px]" />

              <div className="relative z-10 h-[380px] w-[320px] overflow-hidden rounded-[40px] border-4 border-white/50 shadow-2xl md:h-[460px] md:w-[380px] dark:border-white/20">
                <img
                  src="/images/hero-portrait.png"
                  alt="LinkedIn lead generation expert"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>

              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                const positions = [
                  "absolute -right-4 top-4 z-20 md:-right-14 md:top-8 animate-float",
                  "absolute -right-6 top-[45%] z-20 md:-right-18 animate-float-delayed",
                  "absolute -bottom-2 -right-2 z-20 md:-right-10 md:bottom-8 animate-float-slow",
                ];
                return (
                  <div
                    key={stat.label}
                    className={`${positions[idx]} flex items-center gap-3 rounded-2xl border border-border/50 bg-card/95 px-5 py-3.5 shadow-elevated backdrop-blur-md`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                      <p className="text-xs font-semibold leading-tight text-muted-foreground">
                        {stat.label}<br />{stat.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
