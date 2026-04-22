// @ts-nocheck
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "How does LinkedIn lead generation work?", answer: "We optimize your LinkedIn profile, identify your ideal prospects, and reach out with personalized messages. We handle all conversations and book qualified meetings directly on your calendar." },
  { question: "Is LinkedIn outreach safe?", answer: "Yes, absolutely. We use safe, compliant methods that adhere to LinkedIn's guidelines. No bots, no spam—just genuine human outreach and relationship building." },
  { question: "How many meetings can I expect?", answer: "Most clients see 20-50 qualified meetings per month within the first 60-90 days. Results vary based on your industry, offer, and target audience." },
  { question: "How long does it take to see results?", answer: "You'll start seeing conversations within the first 2 weeks. Most clients book their first meetings within 30 days, with consistent flow established by day 60-90." },
  { question: "Do you work with all industries?", answer: "We work primarily with B2B companies, SaaS founders, coaches, consultants, and agencies. If you sell to businesses, we can likely help." },
  { question: "What if I don't have time to manage it?", answer: "That's the beauty of our service—it's 100% done-for-you. We handle everything from profile optimization to booking calls. You just show up for meetings." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-background py-20 md:py-28">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</span>
            </div>
            <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[44px]">Frequently Asked Questions</h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">Everything you need to know.</p>
          </div>
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border/40">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-base font-semibold text-foreground md:text-lg pr-4">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openIndex === index && (
                  <div className="pb-5 text-base leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
