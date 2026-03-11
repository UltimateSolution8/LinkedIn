
import { Check, Lock } from "lucide-react";
import PricingCard from "../pricing/PricingCard";
import { type PricingPlan } from "@/lib/api/pricing";

interface BlurredLeadsProps {
    plans: PricingPlan[];
    onChoosePlan: (plan: PricingPlan, isTrial: boolean) => void;
    processing: boolean;
}

export default function BlurredLeads({ plans, onChoosePlan, processing }: BlurredLeadsProps) {
    // Mock blurred lead data
    const mockLeads = [
        { username: "u/tech_enthusiast", subreddit: "r/SaaS", time: "2h ago" },
        { username: "u/marketing_pro", subreddit: "r/entrepreneur", time: "5h ago" },
        { username: "u/dev_helper", subreddit: "r/reactjs", time: "1d ago" },
        { username: "u/business_guy", subreddit: "r/startups", time: "2d ago" },
        { username: "u/social_expert", subreddit: "r/marketing", time: "3d ago" },
    ];

    return (
        <div className="relative mt-8">
            {/* Blurred Background Content */}
            <div className="space-y-4 opacity-40 blur-[4px] pointer-events-none select-none">
                {mockLeads.map((_, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                                <div>
                                    <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-1"></div>
                                    <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                                </div>
                            </div>
                            <div className="h-6 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                            <div className="h-4 w-[90%] bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-12 px-4 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80">
                <div className="max-w-2xl w-full text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-6">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-950 dark:text-white mb-4">
                        Ready to find your next customers?
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 px-4">
                        We've found potential leads for your project. Subscribe now to unlock full access to posts, leads, and AI reply suggestions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-xl mx-auto mb-10 px-4">
                        {[
                            "Real-time Reddit monitoring",
                            "AI-powered lead qualification",
                            "Smart reply suggestions",
                            "Unlimited keyword matches",
                            "24/7 automated scanning",
                            "Cancel any time"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="flex justify-center w-full pb-20">
                    <div className="max-w-md w-full">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                onChoosePlan={(isTrial) => onChoosePlan(plan, isTrial)}
                                processing={processing}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
