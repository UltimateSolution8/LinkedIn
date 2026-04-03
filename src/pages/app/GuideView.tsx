import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Flame,
  Target,
  Settings,
  Sparkles,
  Search,
  MessageSquare,
  Zap,
  Users,
  CheckCircle2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuideView() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          The Rixly Playbook
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-4 tracking-tight">
          Mastering Your <span className="text-teal-600 dark:text-teal-400 italic">Growth Engine</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          A simple guide to understanding your dashboard, finding the right leads, and turning conversations into customers.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
      >
        {/* Play 1: Hot Leads */}
        <motion.div variants={item} className="relative group">
          <div className="h-full p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />

            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-950/30 rounded-2xl flex items-center justify-center mb-6">
              <Flame className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Hot Leads (Direct Wins)</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              These are authors directly asking for a solution or expressing a specific pain point. They are <span className="font-semibold text-neutral-900 dark:text-white">high-intent potential clients</span>.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
                <div className="mt-1 flex-shrink-0">
                  <Zap className="w-4 h-4 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Your Best Strategy: Send DMs</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Use the "Generate Message" button to draft a personalized response, copy it, and hit their inbox.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Play 2: Opportunities */}
        <motion.div variants={item} className="relative group">
          <div className="h-full p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />

            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-950/30 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Opportunities (Awareness)</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              These are broader discussions, competitors' mentions, or general industry questions. Great for <span className="font-semibold text-neutral-900 dark:text-white">building authority and brand presence</span>.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
                <div className="mt-1 flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Your Best Strategy: Reply Publicly</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Jump into the thread! Use "Generate Comment" to provide value first, then mention your product where it fits.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16 bg-gradient-to-br from-teal-500/5 to-transparent p-1 rounded-[2rem] border border-teal-500/10"
      >
        <div className="bg-white dark:bg-neutral-950/40 backdrop-blur-sm p-8 md:p-12 rounded-[1.9rem]">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
                Tuning Your <span className="text-teal-600 dark:text-teal-400">Radar</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-teal-600 dark:text-teal-400">1</div>
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Keywords</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Use words your customers say when they struggle. Broad keywords (e.g. "marketing") find MORE; specific ones (e.g. "reddit marketing tool") find BETTER leads.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-teal-600 dark:text-teal-400">2</div>
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Competitors</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Add names of other products in your space. We'll alert you when someone is unhappy with them or asking for alternatives.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-sm">
              <div className="relative p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3 opacity-60">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-3/4" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-1/2" />
                  <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 animate-bounce">
                    <Search className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <div className="mb-16">
        <h2 className="text-center text-2xl font-bold mb-10 text-neutral-900 dark:text-white">Rixly Pro-Tips for Real Growth</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Value Over Pitch",
              text: "Always answer the user's question first. A pitch with no answer gets downvoted.",
              icon: Info
            },
            {
              title: "Keep it Human",
              text: "Our AI is your co-pilot. Tweak the generated responses to sound like 'you'.",
              icon: Users
            },
            {
              title: "Consistency Wins",
              text: "Check your dashboard daily. The best opportunities disappear in hours.",
              icon: CheckCircle2
            }
          ].map((tip, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <tip.icon className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-4" />
              <h3 className="font-bold text-neutral-900 dark:text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center p-10 md:p-14 rounded-[2.5rem] bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 dark:border-teal-500/10 overflow-hidden relative shadow-2xl"
      >
        {/* Subtle Ambient Glows - very faint for premium feel */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/[0.03] rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/[0.03] rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white tracking-tight">
            Ready to find your first client?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-lg mx-auto font-medium leading-relaxed">
            Start by checking your Hot Leads. There's almost certainly someone looking for your product right now.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate(`/app/${projectId}/dashboard`)}
              className="px-10 py-4 rounded-full font-bold bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
