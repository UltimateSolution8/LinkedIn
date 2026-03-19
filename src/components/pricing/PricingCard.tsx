
import { Check, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type PricingPlan } from "@/lib/api/pricing";

interface PricingCardProps {
    plan: PricingPlan;
    onChoosePlan: (isTrial: boolean) => void;
    processing?: boolean;
}

export default function PricingCard({ plan, onChoosePlan, processing = false }: PricingCardProps) {
    const formatAmount = (amount: number) => {
        if (plan.currency === "INR") {
            return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
        }
        if (Number.isInteger(amount)) {
            return amount.toString();
        }
        return amount.toFixed(2);
    };

    // Calculate discount percentage if originalPrice is available
    const discountPercentage = plan.originalPrice
        ? Math.round(((plan.originalPrice - plan.currentPrice) / plan.originalPrice) * 100)
        : null;

    // Format interval display (e.g., "per month", "per 3 months", "per year")
    const getIntervalDisplay = () => {
        if (!plan.interval) return "";
        const intervalText = plan.intervalCount > 1
            ? `${plan.intervalCount} ${plan.interval}s`
            : plan.interval;
        return `per ${intervalText}`;
    };

    // Hardcoded features that override plan.features
    const hardcodedFeatures = [
        "UNLIMITED *100* Posts to view",
        "UNLIMITED *50* keyword matches",
        "UNLIMITED *15* keywords monitored",
        "UNLIMITED *100* relevancy checks",
        "2 projects",
        "Daily email notifications",
        "Chat & email support",
        "Detailed Basic reports",
    ];

    return (
        <Card className="relative w-full max-w-md bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Purple Accent Header */}
            <div className="h-2 bg-gradient-to-r from-teal-600 to-teal-700"></div>

            <CardHeader className="p-4 sm:p-6 pb-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{plan.name}</h3>

                {/* Pricing Section */}
                <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                            {plan.currencySymbol}
                            {formatAmount(plan.currentPrice)}
                        </span>
                        {plan.interval && (
                            <span className="text-base text-gray-600">
                                {getIntervalDisplay()}
                            </span>
                        )}
                        {plan.originalPrice && (
                            <span className="text-2xl text-gray-400 line-through ml-1">
                                {plan.currencySymbol}{formatAmount(plan.originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Subtitle - Offer Info */}
                    {plan.isIntroductory && discountPercentage && (
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Introductory Offer for Limited Period</p>
                            <p className="text-sm font-bold text-orange-600">Flat {discountPercentage}% off</p>
                        </div>
                    )}
                </div>

                {/* Highlight Feature */}
                {plan.highlightNumber && (
                    <div className="flex items-center gap-2 text-gray-600 mt-4">
                        <Zap className="w-5 h-5 text-teal-600" />
                        <span className="font-semibold">{plan.highlightNumber}</span>
                        <span className="text-sm">{plan.highlightLabel}</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-6">
                {/* Features List */}
                <ul className="space-y-3 mb-6">
                    {hardcodedFeatures.map((feature, index) => {
                        // Parse feature text and convert *text* to strikethrough
                        const parts = feature.split(/(\*[^*]+\*)/g);
                        return (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 text-sm leading-relaxed">
                                    {parts.map((part, i) => {
                                        if (part.startsWith("*") && part.endsWith("*")) {
                                            return (
                                                <span key={i} className="line-through">
                                                    {part.slice(1, -1)}
                                                </span>
                                            );
                                        }
                                        return part;
                                    })}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                {/* Trial Button */}
                {!processing && (
                    <>
                        <Button
                            onClick={() => onChoosePlan(true)}
                            variant="outline"
                            className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 py-4 sm:py-6 rounded-xl text-sm sm:text-base font-semibold mb-3"
                        >
                            Start 3-Day Free Trial
                        </Button>

                        <p className="text-xs text-center text-gray-500 mb-4">
                            No charge for 3 days. Cancel anytime.
                        </p>

                        {/* Pay Now Button (existing flow) */}
                        <Button
                            onClick={() => onChoosePlan(false)}
                            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-4 sm:py-6 rounded-xl text-sm sm:text-base font-semibold"
                        >
                            Pay Now
                        </Button>
                    </>
                )}

                {/* Processing State */}
                {processing && (
                    <Button
                        disabled
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 sm:py-6 rounded-xl text-sm sm:text-base font-semibold"
                    >
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
