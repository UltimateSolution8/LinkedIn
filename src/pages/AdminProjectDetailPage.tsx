import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, ExternalLink, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { getProjectDetail, getAdminProjectLeads, type ProjectDetail } from "@/lib/api/admin";
import { type Lead } from "@/lib/api/leads";
import AdminLeadCardReadOnly from "@/components/admin/AdminLeadCardReadOnly";
import EditProjectConfigModal from "@/components/admin/EditProjectConfigModal";
import Pagination from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminProjectDetailPage() {
  const { userId, projectId } = useParams<{ userId: string; projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
    pageSize: 10,
  });

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setIsLoadingProject(true);
        setError(null);
        const projectData = await getProjectDetail(Number(projectId));
        setProject(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project details");
        console.error("Error fetching project details:", err);
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      if (!userId || !projectId) return;

      try {
        setIsLoadingLeads(true);
        setError(null);
        const response = await getAdminProjectLeads(
          Number(userId),
          Number(projectId),
          currentPage,
          10,
          sourceFilter === "all" ? undefined : sourceFilter,
          sortBy
        );
        setLeads(response.data);
        setPagination({
          totalPages: response.pagination.totalPages,
          totalLeads: response.pagination.totalLeads,
          hasNextPage: response.pagination.hasNextPage,
          hasPrevPage: response.pagination.hasPrevPage,
          pageSize: response.pagination.pageSize,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leads");
        console.error("Error fetching leads:", err);
      } finally {
        setIsLoadingLeads(false);
      }
    };

    fetchLeads();
  }, [userId, projectId, currentPage, sourceFilter, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleEditSuccess = async () => {
    // Refresh project data after successful update
    if (!projectId) return;

    try {
      const projectData = await getProjectDetail(Number(projectId));
      setProject(projectData);
    } catch (err) {
      console.error("Error refreshing project data:", err);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-neutral-500 dark:text-neutral-400 text-lg mt-4">Loading project...</p>
      </div>
    );
  }

  if (error && !project) {
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

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Project not found</p>
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
          Back to Admin
        </Button>

        {/* Project Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">
                {project.projectName}
              </h1>
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
              className="text-sm"
            >
              {project.status}
            </Badge>
          </div>
          {project.projectDescription && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {project.projectDescription}
            </p>
          )}
        </div>

        {/* Project Configuration Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Project Configuration</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Configuration
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                >
                  {isConfigExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          {isConfigExpanded && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Subreddits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.subreddits.map((subreddit, idx) => (
                      <Badge key={idx} variant="outline">
                        r/{subreddit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Post Threshold</p>
                  <p className="text-lg font-semibold text-neutral-950 dark:text-white">
                    {project.postThreshold}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Comment Threshold</p>
                  <p className="text-lg font-semibold text-neutral-950 dark:text-white">
                    {project.commentThreshold}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Date Range (days)</p>
                  <p className="text-lg font-semibold text-neutral-950 dark:text-white">
                    {project.postDateRangeDays}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Leads Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">
              Leads ({pagination.totalLeads})
            </h2>
            <div className="flex gap-3">
              <Select value={sourceFilter} onValueChange={handleSourceFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Added to Rixly (Newest)</SelectItem>
                  <SelectItem value="createdAt_asc">Added to Rixly (Oldest)</SelectItem>
                  <SelectItem value="postCreatedAt">Post Date (Newest)</SelectItem>
                  <SelectItem value="postCreatedAt_asc">Post Date (Oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoadingLeads ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mt-4">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                No leads found for this project.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 mb-6">
                {leads.map((lead) => (
                  <AdminLeadCardReadOnly
                    key={lead.leadId}
                    leadId={String(lead.leadId)}
                    source={lead.source}
                    username={lead.source === "comment" ? (lead.author || "Unknown") : (lead.originalPosterId || "Unknown")}
                    rating={lead.relevanceRating}
                    sourcePost={lead.title}
                    subreddit={lead.subreddit}
                    postUrl={lead.postUrl}
                    postCreatedAt={lead.postCreatedAt}
                    commentUrl={lead.commentUrl}
                    commentText={lead.commentText}
                    leadType={lead.leadType}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Edit Project Config Modal */}
        {project && (
          <EditProjectConfigModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            project={project}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
}
