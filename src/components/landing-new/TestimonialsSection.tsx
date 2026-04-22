// @ts-nocheck
import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

const testimonials = [
  { quote: "Userixly completely changed the game for us. We now get 20-50 qualified meetings every month from LinkedIn. Highly recommend!", author: "James T.", role: "Founder, Leadr", photoPosition: "0% 0%" },
  { quote: "The team at Userixly is incredibly professional. They understood our needs and delivered results faster than we expected.", author: "Sarah K.", role: "CEO, BrightPath", photoPosition: "100% 0%" },
  { quote: "We tried doing LinkedIn outreach ourselves but it never worked. Userixly came in and within 60 days we had a full pipeline.", author: "Michael R.", role: "Founder, TechScale", photoPosition: "0% 100%" },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="relative bg-card py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Testimonials</span>
          </div>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">What Our Clients Say</h2>
        </div>
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="rounded-3xl border border-border/50 bg-secondary/30 p-8 shadow-card md:p-12">
            <Quote className="h-10 w-10 text-primary/20" />
            <blockquote className="mt-5 text-xl leading-relaxed text-foreground md:text-2xl font-medium">
              "{testimonials[current].quote}"
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
                <img src="/images/testimonial-grid.png" alt={testimonials[current].author} className="h-full w-full object-cover" style={{ objectPosition: testimonials[current].photoPosition }} />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{testimonials[current].author}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prev} className="h-10 w-10 rounded-full border-border/50 hover:border-primary/30 hover:bg-primary/5" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button key={idx} onClick={() => setCurrent(idx)} className={`h-2.5 rounded-full transition-all duration-300 ${idx === current ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/30"}`} aria-label={`Go to testimonial ${idx + 1}`} />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="h-10 w-10 rounded-full border-border/50 hover:border-primary/30 hover:bg-primary/5" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
