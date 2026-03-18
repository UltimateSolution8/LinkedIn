import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { getTotalLLMCosts, type LLMCostSummary } from "@/lib/api/llmCosts";

export default function LLMCostSummaryCard() {
  const navigate = useNavigate();
  const [currentMonthCost, setCurrentMonthCost] = useState<LLMCostSummary | null>(null);
  const [lastMonthCost, setLastMonthCost] = useState<LLMCostSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Current month
      const currentStart = new Date();
      currentStart.setDate(1);
      currentStart.setHours(0, 0, 0, 0);
      const currentEnd = new Date();
      currentEnd.setHours(23, 59, 59, 999);

      // Last month
      const lastStart = new Date();
      lastStart.setMonth(lastStart.getMonth() - 1);
      lastStart.setDate(1);
      lastStart.setHours(0, 0, 0, 0);
      const lastEnd = new Date(lastStart);
      lastEnd.setMonth(lastEnd.getMonth() + 1);
      lastEnd.setDate(0);
      lastEnd.setHours(23, 59, 59, 999);

      const [current, last] = await Promise.all([
        getTotalLLMCosts(currentStart, currentEnd),
        getTotalLLMCosts(lastStart, lastEnd),
      ]);

      setCurrentMonthCost(current);
      setLastMonthCost(last);
    } catch (err) {
      console.error("Error fetching LLM cost summary:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cost data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const calculatePercentageChange = () => {
    if (!currentMonthCost || !lastMonthCost) {
      return null;
    }
    const current = parseFloat(currentMonthCost.total_cost_usd as string);
    const last = parseFloat(lastMonthCost.total_cost_usd as string);
    if (last === 0) return null;
    return ((current - last) / last) * 100;
  };

  const percentageChange = calculatePercentageChange();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>LLM Costs</CardTitle>
            <CardDescription>Current month token usage costs</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/llm-costs")}
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : currentMonthCost ? (
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-teal-600" />
              <span className="text-3xl font-bold text-neutral-950 dark:text-white">
                {formatCurrency(parseFloat(currentMonthCost.total_cost_usd as string))}
              </span>
              {percentageChange !== null && (
                <div className={`flex items-center gap-1 text-sm ${
                  percentageChange >= 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {percentageChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(percentageChange).toFixed(1)}%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  Total API Calls
                </div>
                <div className="text-lg font-semibold text-neutral-950 dark:text-white">
                  {(Number(currentMonthCost.total_calls) || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  Total Tokens
                </div>
                <div className="text-lg font-semibold text-neutral-950 dark:text-white">
                  {((Number(currentMonthCost.total_tokens) || 0) / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>

            {lastMonthCost && (
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Last month:</span>
                  <span className="font-medium text-neutral-950 dark:text-white">
                    {formatCurrency(parseFloat(lastMonthCost.total_cost_usd as string))}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
            No cost data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
