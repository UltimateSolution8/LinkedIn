import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, RefreshCw, Filter } from "lucide-react";
import { getJobHistory, type JobHistoryResponse } from "@/lib/api/admin";
import JobRunTable from "@/components/admin/JobRunTable";
import Pagination from "@/components/ui/pagination";

export default function AdminJobHistoryPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobHistoryResponse["data"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalJobs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchJobHistory = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: any = {};
      if (statusFilter !== "all") {
        filters.status = statusFilter as any;
      }
      if (jobTypeFilter !== "all") {
        filters.jobType = jobTypeFilter as any;
      }

      const response = await getJobHistory(page, 20, filters);
      setJobs(response.data);
      setPagination({
        totalPages: response.pagination.totalPages,
        totalJobs: response.pagination.totalJobs,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch job history");
      console.error("Error fetching job history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobHistory(currentPage);
  }, [currentPage, statusFilter, jobTypeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchJobHistory(currentPage);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleJobTypeFilterChange = (value: string) => {
    setJobTypeFilter(value);
    setCurrentPage(1);
  };

  if (isLoading && jobs.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Loading job history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
              Job History
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {pagination.totalJobs} total jobs
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Job Type
              </label>
              <Select value={jobTypeFilter} onValueChange={handleJobTypeFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reddit_scraping">Reddit Scraping</SelectItem>
                  <SelectItem value="quickrun">Quick Run</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              <JobRunTable jobs={jobs} />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    hasNextPage={pagination.hasNextPage}
                    hasPrevPage={pagination.hasPrevPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
