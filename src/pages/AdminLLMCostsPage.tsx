import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, DollarSign, TrendingUp, Activity, ArrowLeft } from "lucide-react";
import {
  getTotalLLMCosts,
  getLLMCostsByOperation,
  getLLMCostsByProvider,
  getDailyLLMCosts,
  type LLMCostSummary,
  type LLMCostByOperation,
  type LLMCostByProvider,
  type DailyCost,
} from "@/lib/api/llmCosts";

export default function AdminLLMCostsPage() {
  const navigate = useNavigate();

  // Date range state - default to current month
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });

  // Data state
  const [summary, setSummary] = useState<LLMCostSummary | null>(null);
  const [costsByOperation, setCostsByOperation] = useState<LLMCostByOperation[]>([]);
  const [costsByProvider, setCostsByProvider] = useState<LLMCostByProvider[]>([]);
  const [dailyCosts, setDailyCosts] = useState<DailyCost[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all cost data
  const fetchCostData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryData, operationsData, providersData, dailyData] = await Promise.all([
        getTotalLLMCosts(startDate, endDate),
        getLLMCostsByOperation(startDate, endDate),
        getLLMCostsByProvider(startDate, endDate),
        getDailyLLMCosts(30),
      ]);

      setSummary(summaryData);
      setCostsByOperation(operationsData);
      setCostsByProvider(providersData);
      setDailyCosts(dailyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cost data");
      console.error("Error fetching cost data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCostData();
  }, [startDate, endDate]);

  const handleRefresh = () => {
    fetchCostData();
  };

  const setCurrentMonth = () => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    setStartDate(start);

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    setEndDate(end);
  };

  const setLastMonth = () => {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    setStartDate(start);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    setEndDate(end);
  };

  const setLast30Days = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    setEndDate(end);

    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    setStartDate(start);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatOperationType = (type: string) => {
    if (!type) return 'Unknown';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
              LLM Cost Analytics
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Monitor and analyze token usage and costs
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={setCurrentMonth} variant="outline" size="sm">
              Current Month
            </Button>
            <Button onClick={setLastMonth} variant="outline" size="sm">
              Last Month
            </Button>
            <Button onClick={setLast30Days} variant="outline" size="sm">
              Last 30 Days
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  date.setHours(0, 0, 0, 0);
                  setStartDate(date);
                }}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 block">
                End Date
              </label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  date.setHours(23, 59, 59, 999);
                  setEndDate(date);
                }}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      )}

      {/* Summary Stats */}
      {!isLoading && summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                    {formatCurrency(summary.total_cost_usd)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total API Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                    {formatNumber(Number(summary.total_calls))}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {Number(summary.success_count)} success, {Number(summary.error_count)} errors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                    {formatNumber(Number(summary.total_tokens))}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  In: {formatNumber(Number(summary.total_input_tokens))} / Out: {formatNumber(Number(summary.total_output_tokens))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Avg Latency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-950 dark:text-white">
                  {summary.avg_latency_ms.toFixed(0)}ms
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Per API call
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* By Operation Type */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Operation Type</CardTitle>
                <CardDescription>Breakdown of costs by operation</CardDescription>
              </CardHeader>
              <CardContent>
                {costsByOperation.length === 0 ? (
                  <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                    No operation data available for this period
                  </p>
                ) : (
                  <div className="space-y-3">
                    {costsByOperation.map((op) => (
                      <div
                        key={op.operation_type}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-neutral-950 dark:text-white text-sm">
                            {formatOperationType(op.operation_type)}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatNumber(Number(op.call_count))} calls • {formatNumber(Number(op.total_tokens))} tokens
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-neutral-950 dark:text-white">
                            {formatCurrency(op.total_cost_usd)}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {((op.total_cost_usd / summary.total_cost_usd) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* By Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Provider & Model</CardTitle>
                <CardDescription>Breakdown of costs by LLM provider</CardDescription>
              </CardHeader>
              <CardContent>
                {costsByProvider.length === 0 ? (
                  <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                    No provider data available for this period
                  </p>
                ) : (
                  <div className="space-y-3">
                    {costsByProvider.map((provider) => (
                      <div
                        key={`${provider.provider}-${provider.model}`}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-neutral-950 dark:text-white text-sm">
                            {provider.provider}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {provider.model} • {formatNumber(provider.call_count)} calls
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-neutral-950 dark:text-white">
                            {formatCurrency(provider.total_cost_usd)}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {((provider.total_cost_usd / summary.total_cost_usd) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Cost Trend (Last 30 Days)</CardTitle>
              <CardDescription>Daily breakdown of LLM costs</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyCosts.length === 0 ? (
                <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  No daily data available
                </p>
              ) : (
                <div className="space-y-2">
                  {dailyCosts.slice(0, 10).map((day) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-neutral-950 dark:text-white">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatNumber(day.call_count)} calls • {formatNumber(day.total_tokens)} tokens
                        </div>
                      </div>
                      <div className="font-semibold text-neutral-950 dark:text-white">
                        {formatCurrency(day.total_cost_usd)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
