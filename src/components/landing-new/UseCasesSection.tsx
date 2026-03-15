// @ts-nocheck
import { motion } from "framer-motion";
import { Building2, Briefcase, Users } from "lucide-react";
import { Badge } from "../ui/badge";

const useCases = [
  {
    id: "saas",
    icon: Building2,
    title: "For SaaS",
    subtitle: "Find buyers comparing alternatives before they decide",
    color: "bg-blue-500",
  },
  {
    id: "agencies",
    icon: Briefcase,
    title: "For Agencies",
    subtitle: "Offer Reddit lead generation as a high-margin service",
    color: "bg-purple-500",
  },
  {
    id: "founders",
    icon: Users,
    title: "For Founders",
    subtitle: "Track Talents and project discussions before they trend",
    color: "bg-orange-500",
  },
];

export const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-primary blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm border-primary/30 bg-primary/5">
            USE CASES
          </Badge>
          <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Built for <span className="text-primary">every industry</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're SaaS, an agency, or a Founder, Rixly helps you find high-intent leads where they gather.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${useCase.color.replace('bg-', 'bg-')}`} />

              <div className="p-8">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${useCase.color} flex items-center justify-center mb-4`}>
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-heading text-2xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.subtitle}</p>
              </div>

              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 ${useCase.color} opacity-10 rounded-bl-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
