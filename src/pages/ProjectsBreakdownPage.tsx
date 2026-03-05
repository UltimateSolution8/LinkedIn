import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, ExternalLink, Clock, Users, FolderKanban, TrendingUp, Activity } from "lucide-react";
import { getProjectsBreakdown, type ProjectBreakdownItem } from "@/lib/api/admin";

export default function ProjectsBreakdownPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProjectsBreakdown();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects breakdown");
      console.error("Error fetching projects breakdown:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary stats from actual data
  const summary = useMemo(() => {
    const totalProjects = projects.length;
    const totalJobs = projects.reduce((sum, p) => sum + p.jobs.length, 0);
    const activeJobs = projects.reduce((sum, p) =>
      sum + p.jobs.filter(j => j.status === 'processing' || j.status === 'queued').length, 0
    );
    const totalSalesLeads = projects.reduce((sum, p) => sum + p.salesLeads, 0);
    const totalEngagementLeads = projects.reduce((sum, p) => sum + p.engagementLeads, 0);
    const totalCommentSources = projects.reduce((sum, p) => sum + p.commentSources, 0);

    return {
      totalProjects,
      totalJobs,
      activeJobs,
      totalSalesLeads,
      totalEngagementLeads,
      totalCommentSources,
    };
  }, [projects]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "queued":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatJobType = (jobType: string) => {
    return jobType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-neutral-500 dark:text-neutral-400 text-lg mt-4">Loading projects breakdown...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-md text-sm max-w-md text-center">
          {error}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin")}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full overflow-y-auto">
      <div className="p-4 lg:p-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
            Projects Being Scraped
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {summary.totalProjects} active projects • {summary.activeJobs} active jobs
          </p>
        </div>

        {/* Summary Cards - Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <FolderKanban className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Projects</p>
              </div>
              <p className="text-2xl font-bold text-neutral-950 dark:text-white">{summary.totalProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Active Jobs</p>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.activeJobs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Sales Leads</p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.totalSalesLeads}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Engagement</p>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{summary.totalEngagementLeads}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Comments</p>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{summary.totalCommentSources}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Jobs</p>
              </div>
              <p className="text-2xl font-bold text-neutral-950 dark:text-white">{summary.totalJobs}</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table - Compact Version */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.projectId}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">
                          {project.projectName}
                        </h3>
                        {project.jobs.some(j => j.status === 'processing') && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                            Processing
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {project.owner.name} • {project.owner.email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/users/${project.owner.userId}/projects/${project.projectId}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded p-2">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Leads</p>
                      <p className="text-lg font-semibold text-neutral-950 dark:text-white">{project.totalLeads}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
                      <p className="text-xs text-green-600 dark:text-green-400">Sales</p>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300">{project.salesLeads}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2">
                      <p className="text-xs text-amber-600 dark:text-amber-400">Engagement</p>
                      <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">{project.engagementLeads}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                      <p className="text-xs text-purple-600 dark:text-purple-400">Comments</p>
                      <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">{project.commentSources}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                      <p className="text-xs text-blue-600 dark:text-blue-400">Subreddits</p>
                      <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{project.subredditsMonitored}</p>
                    </div>
                  </div>

                  {/* Jobs List - Compact */}
                  {project.jobs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Jobs ({project.jobs.length})
                      </h4>
                      <div className="space-y-2">
                        {project.jobs.map((job) => (
                          <div
                            key={job.jobId}
                            className="flex items-center justify-between p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Badge className={getStatusBadgeColor(job.status)}>
                                {job.status}
                              </Badge>
                              <span className="font-medium text-neutral-950 dark:text-white">
                                {formatJobType(job.jobType)}
                              </span>
                              <span className="text-neutral-500 dark:text-neutral-400">
                                #{job.jobId}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                              <div className="text-right">
                                <p className="text-neutral-600 dark:text-neutral-300 font-medium">{job.postsAnalyzed} posts</p>
                              </div>
                              {job.lastRunAt && (
                                <div className="text-right">
                                  <p className="text-neutral-500 dark:text-neutral-400">Last run</p>
                                  <p className="text-neutral-600 dark:text-neutral-300">{formatDate(job.lastRunAt)}</p>
                                </div>
                              )}
                              {job.nextScheduledAt && (
                                <div className="text-right flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                  <div>
                                    <p className="text-neutral-500 dark:text-neutral-400">Next run</p>
                                    <p className="text-purple-600 dark:text-purple-400 font-medium">{formatDate(job.nextScheduledAt)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.jobs.length === 0 && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">No jobs found</p>
                  )}
                </div>
              ))}

              {projects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-500 dark:text-neutral-400">No projects being scraped</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
