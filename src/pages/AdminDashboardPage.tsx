import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Users, FolderKanban, Play, RefreshCw, ChevronDown, ChevronUp, StopCircle } from "lucide-react";
import {
  getAdminDashboardStats,
  getTodaysLeadsByProject,
  getActiveJobs,
  getScheduledJobs,
  getJobHistory,
  stopJob,
  type AdminDashboardStats,
  type TodaysLeadsByProject,
  type ActiveJob,
  type ScheduledJob,
  type JobRun,
} from "@/lib/api/admin";
import StatCard from "@/components/admin/StatCard";
import TodaysLeadsTable from "@/components/admin/TodaysLeadsTable";
import JobRunTable from "@/components/admin/JobRunTable";
import NextJobTimer from "@/components/admin/NextJobTimer";
import LLMCostSummaryCard from "@/components/admin/LLMCostSummaryCard";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [todaysLeads, setTodaysLeads] = useState<TodaysLeadsByProject[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobRun[]>([]);

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeadsExpanded, setIsLeadsExpanded] = useState(true);

  // Stop job state
  const [selectedJobToStop, setSelectedJobToStop] = useState<ActiveJob | null>(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [isStoppingJob, setIsStoppingJob] = useState(false);
  const [stopError, setStopError] = useState<string | null>(null);

  // Fetch all data
  const fetchDashboardData = async () => {
    try {
      setError(null);

      // Fetch stats
      setIsLoadingStats(true);
      try {
        const statsData = await getAdminDashboardStats();
        setStats(statsData);
        console.log("Dashboard stats loaded:", statsData);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
      setIsLoadingStats(false);

      // Fetch today's leads
      setIsLoadingLeads(true);
      try {
        const leadsData = await getTodaysLeadsByProject();
        setTodaysLeads(leadsData);
        console.log("Today's leads loaded:", leadsData.length, "projects");
      } catch (err) {
        console.error("Error fetching today's leads:", err);
      }
      setIsLoadingLeads(false);

      // Fetch job data
      setIsLoadingJobs(true);
      const [activeJobsResult, scheduledJobsResult, jobHistoryResult] = await Promise.allSettled([
        getActiveJobs(),
        getScheduledJobs(),
        getJobHistory(1, 10),
      ]);

      // Handle active jobs
      if (activeJobsResult.status === 'fulfilled') {
        console.log("Active jobs loaded:", activeJobsResult.value);
        setActiveJobs(activeJobsResult.value);
      } else {
        console.error("Error fetching active jobs:", activeJobsResult.reason);
      }

      // Handle scheduled jobs
      if (scheduledJobsResult.status === 'fulfilled') {
        console.log("Scheduled jobs loaded:", scheduledJobsResult.value);
        setScheduledJobs(scheduledJobsResult.value);
      } else {
        console.error("Error fetching scheduled jobs:", scheduledJobsResult.reason);
      }

      // Handle job history
      if (jobHistoryResult.status === 'fulfilled') {
        console.log("Recent jobs loaded:", jobHistoryResult.value.data.length);
        setRecentJobs(jobHistoryResult.value.data);
      } else {
        console.error("Error fetching job history:", jobHistoryResult.reason);
      }

      setIsLoadingJobs(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err);
      setIsLoadingStats(false);
      setIsLoadingLeads(false);
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleStopJob = async () => {
    if (!selectedJobToStop) return;

    setIsStoppingJob(true);
    setStopError(null);

    try {
      await stopJob(selectedJobToStop.jobRunId);
      setIsStopDialogOpen(false);
      setSelectedJobToStop(null);

      // Refresh all dashboard data
      await fetchDashboardData();

      alert("Job stopped successfully!");
    } catch (err) {
      setStopError(err instanceof Error ? err.message : "Failed to stop job");
      // Keep dialog open to show error
    } finally {
      setIsStoppingJob(false);
    }
  };

  const formatStartTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Today ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
    } else {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const nextScheduledJob = scheduledJobs.length > 0 ? scheduledJobs[0] : null;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Monitor projects, jobs, and lead generation
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div onClick={() => navigate("/admin/projects-breakdown")} className="cursor-pointer">
          <StatCard
            title="Projects Being Scraped"
            value={stats?.projectsBeingScraped ?? 0}
            icon={FolderKanban}
            isLoading={isLoadingStats}
            description="Active scraping schedules"
          />
        </div>
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Jobs Running Now"
          value={stats?.jobsRunningNow ?? 0}
          icon={Play}
          isLoading={isLoadingStats}
        />
      </div>

      {/* LLM Cost Summary */}
      <div className="mb-8">
        <LLMCostSummaryCard />
      </div>

      {/* Today's Leads Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Leads by Project</CardTitle>
              <CardDescription>
                Breakdown of leads generated today by type and source
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLeadsExpanded(!isLeadsExpanded)}
            >
              {isLeadsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {isLeadsExpanded && (
          <CardContent>
            {isLoadingLeads ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : (
              <TodaysLeadsTable leads={todaysLeads} />
            )}
          </CardContent>
        )}
      </Card>

      {/* Job Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Next Scheduled Job */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Scheduled Job</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : (
              <NextJobTimer
                nextRunAt={nextScheduledJob?.nextRunAt ?? null}
                projectName={nextScheduledJob?.projectName}
                projectId={nextScheduledJob?.projectId}
                jobRunId={nextScheduledJob?.jobRunId}
                jobType={nextScheduledJob?.jobType}
              />
            )}
          </CardContent>
        </Card>

        {/* Currently Running Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Currently Running</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : activeJobs.length === 0 ? (
              <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                No jobs currently running
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div
                    key={job.jobRunId}
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div>
                      <div className="font-medium text-neutral-950 dark:text-white text-sm">
                        {job.projectName}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {job.jobType.replace('_', ' ')} • Started {formatStartTime(job.startedAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobToStop(job);
                          setIsStopDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                      >
                        <StopCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Job Runs */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Job Runs</CardTitle>
              <CardDescription>Last 10 completed or failed jobs</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/jobs")}
            >
              View All History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingJobs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : (
            <JobRunTable jobs={recentJobs} />
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/admin/users")}
        >
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">Manage Users & Projects</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              View and manage all users
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/admin/jobs")}
        >
          <div className="text-center">
            <Play className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">Job History</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              View complete job history
            </div>
          </div>
        </Button>
      </div>

      {/* Stop Job Confirmation Dialog */}
      <Dialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-neutral-950 dark:text-white">
              Stop Running Job?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to stop this job? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedJobToStop && (
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="font-medium text-neutral-950 dark:text-white mb-1">
                {selectedJobToStop.projectName}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {selectedJobToStop.jobType.replace('_', ' ')} • Job #{selectedJobToStop.jobRunId}
              </div>
            </div>
          )}

          {stopError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">{stopError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                setIsStopDialogOpen(false);
                setStopError(null);
              }}
              variant="outline"
              className="flex-1"
              disabled={isStoppingJob}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStopJob}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={isStoppingJob}
            >
              {isStoppingJob ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Stopping...
                </>
              ) : (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Job
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
