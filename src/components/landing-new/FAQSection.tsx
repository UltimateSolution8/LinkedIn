// @ts-nocheck
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "product", label: "Product" },
  { id: "platforms", label: "Platforms" },
  { id: "pricing", label: "Pricing" },
  { id: "security", label: "Security" },
];

const faqData = {
  product: [
    {
      question: "How does Rixly identify buyer intent?",
      answer: "Rixly monitors keyword signals, problem statements, alternative comparisons, and recommendation requests inside discussions. These patterns indicate users who are actively evaluating solutions — not just browsing.",
    },
    {
      question: "Do I need technical skills to use Rixly?",
      answer: "No. Setup takes under 2 minutes — select your target subreddits, set keywords, and choose engagement preferences. Rixly surfaces relevant conversations automatically. You just reply.",
    },
    {
      question: "How quickly can I start seeing results?",
      answer: "You'll see relevant conversations surfaced within minutes of setup. Qualified leads typically appear within 2-4 weeks depending on your niche, engagement quality, and follow-up process.",
    },
    {
      question: "Is social media lead generation scalable?",
      answer: "Yes. With structured monitoring and AI-assisted engagement, you can cover dozens of subreddits and hundreds of conversations without it becoming a full-time job. Most users spend 15-20 minutes per day.",
    },
  ],
  platforms: [
    {
      question: "Is Reddit good for B2B lead generation?",
      answer: "Yes. B2B buyers openly discuss product challenges, compare alternatives, and ask for recommendations inside niche subreddits. Monitoring those conversations lets you engage at the moment of intent — no cold outreach, no paid ads.",
    },
    {
      question: "How does Reddit lead generation work?",
      answer: "It works by tracking targeted subreddits and keywords for high-intent discussions. When users mention problems your product solves, you respond with helpful, contextual replies that naturally drive interest and demo requests.",
    },
    {
      question: "Is Reddit lead generation better than LinkedIn?",
      answer: "They serve different purposes. Reddit reveals raw, unfiltered buying intent in niche communities. LinkedIn provides professional targeting and direct outreach. Combining both creates the strongest multi-platform lead generation strategy. Rixly supports Reddit now, with LinkedIn launching soon.",
    },
    {
      question: "Is Rixly only for Reddit?",
      answer: "Currently, Reddit monitoring is live. LinkedIn integration is launching soon, followed by Twitter. Rixly is evolving into a multi-platform conversation intelligence platform for social lead generation across all major networks.",
    },
  ],
  pricing: [
    {
      question: "How is Rixly different from scraping tools?",
      answer: "Scraping tools export raw data — usernames, post lists, bulk exports. Rixly identifies real buyer intent inside conversations and helps you engage intelligently with AI-suggested replies. The focus is on conversion-ready discussions, not data dumps.",
    },
    {
      question: "What types of companies benefit most from Rixly?",
      answer: "B2B SaaS companies, growth agencies, and Web3 teams see the strongest results — because their buyers actively research tools and discuss solutions in public forums before making decisions.",
    },
    {
      question: "Can agencies use Rixly for their clients?",
      answer: "Yes. Agencies can monitor niche conversations across multiple client verticals and offer social lead generation as a structured, repeatable service. It's a high-margin offering with minimal overhead.",
    },
    {
      question: "How do I track ROI from Reddit leads?",
      answer: "Rixly lets you track which conversations, subreddits, and replies drive results. Use tracked links and CRM integrations to attribute demo bookings and pipeline revenue to specific Reddit engagements.",
    },
  ],
  security: [
    {
      question: "Will using Rixly get my Reddit account banned?",
      answer: "No. Rixly focuses on compliant, value-first engagement aligned with subreddit rules. We don't do mass automation, spam, or abusive scraping. You post from your own account with thoughtful, human replies. That's what keeps your account safe.",
    },
    {
      question: "What makes Reddit leads higher intent than cold outreach?",
      answer: "Because the buyer starts the conversation. On Reddit, users are actively describing their problems and asking for solutions. You're responding to existing demand — not interrupting someone who didn't ask to hear from you.",
    },
    {
      question: "Does this work for SaaS companies?",
      answer: "Yes. SaaS buyers frequently compare alternatives and ask for recommendations inside Reddit communities. Monitoring these discussions lets you engage before they finalize a purchase decision — when your input matters most.",
    },
  ],
};

export const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("product");
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const currentFaqs = faqData[activeCategory] || [];
  const visibleFaqs = showAll ? currentFaqs : currentFaqs.slice(0, 6);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setOpenIndex(null);
    setShowAll(false);
  };

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Rixly and how it finds high-intent leads.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleFaqs.map((faq, index) => (
              <motion.div
                key={`${activeCategory}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.25, 
                  ease: "easeOut",
                  delay: index * 0.05 
                }}
                className="border rounded-[12px] bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] overflow-hidden hover:bg-[rgba(255,255,255,0.06)] transition-colors duration-200"
              >
                <button
                  onClick={() => handleAccordionClick(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-medium text-sm pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {currentFaqs.length > 6 && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors duration-200"
            >
              Show More Questions
            </button>
          </motion.div>
        )}

        {/* Show Less Button */}
        {showAll && currentFaqs.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => setShowAll(false)}
              className="px-6 py-3 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors duration-200"
            >
              Show Less
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
