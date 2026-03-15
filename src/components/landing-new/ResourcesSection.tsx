// @ts-nocheck
import { motion } from "framer-motion";
import { BookOpen, Download, PlayCircle, FileText, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

const resources = [
  {
    id: 1,
    title: "Reddit Marketing Strategy Guide 2024",
    description: "A comprehensive guide to building your brand on Reddit. Learn the unwritten rules, best practices, and proven strategies.",
    type: "Guide",
    icon: BookOpen,
    downloadCount: "2.5k+",
    category: "Strategy",
  },
  {
    id: 2,
    title: "B2B Lead Generation on Reddit",
    description: "How to find and convert high-quality B2B leads using Reddit. Includes templates, scripts, and real case studies.",
    type: "E-Book",
    icon: FileText,
    downloadCount: "1.8k+",
    category: "Lead Gen",
  },
  {
    id: 3,
    title: "Reddit SEO Masterclass",
    description: "Master Reddit SEO to get your content seen by the right audience. Video course with step-by-step instructions.",
    type: "Video Course",
    icon: PlayCircle,
    downloadCount: "3.2k+",
    category: "SEO",
  },
  {
    id: 4,
    title: "Keyword Research Templates",
    description: "Ready-to-use spreadsheets for tracking keywords, subreddits, and engagement metrics.",
    type: "Template",
    icon: Download,
    downloadCount: "4.1k+",
    category: "Tools",
  },
  {
    id: 5,
    title: "AI Prompts for Reddit Engagement",
    description: "50+ proven AI prompts to generate engaging comments and responses that convert.",
    type: "Prompts",
    icon: BookOpen,
    downloadCount: "2.9k+",
    category: "AI",
  },
  {
    id: 6,
    title: "Community Manager Toolkit",
    description: "Everything you need to manage Reddit communities effectively. Automations, workflows, and more.",
    type: "Toolkit",
    icon: Download,
    downloadCount: "1.5k+",
    category: "Management",
  },
];

const features = [
  "Free forever resources",
  "Updated regularly",
  "Proven strategies",
  "No email required",
];

export const ResourcesSection = () => {
  return (
    <section
      id="resources"
      className="py-16 md:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50"
      data-testid="resources-section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Free Resources</span>
          </div>
          <h2
            className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-white"
            data-testid="resources-title"
          >
            Level up your Reddit strategy
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Free guides, templates, and tools to help you succeed on Reddit
          </p>
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm"
            >
              <CheckCircle className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {feature}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 h-full flex flex-col group cursor-pointer">
                {/* Icon and Type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <resource.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                    {resource.type}
                  </span>
                </div>

                {/* Category */}
                <span className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {resource.category}
                </span>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-grow">
                  {resource.description}
                </p>

                {/* Download count and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {resource.downloadCount} downloads
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                  >
                    Get Free <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8"
          >
            View All Resources <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
