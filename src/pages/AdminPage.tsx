
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlayCircle, AlertCircle, FolderKanban, ExternalLink, CreditCard, Calendar } from "lucide-react";
import { scrapeReddit } from "@/lib/api/projects";
import { getAdminUsers, getProjectDetail, updatePaymentBypass, type AdminUser, type ProjectDetail } from "@/lib/api/admin";

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isLoadingProjectDetail, setIsLoadingProjectDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isPaymentBypassDialogOpen, setIsPaymentBypassDialogOpen] = useState(false);
  const [bypassEndDate, setBypassEndDate] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = await getAdminUsers();
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
        console.error("Error fetching admin users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectClick = async (projectId: number) => {
    try {
      setIsLoadingProjectDetail(true);
      setIsProjectDialogOpen(true);
      const projectDetail = await getProjectDetail(projectId);
      setSelectedProject(projectDetail);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch project details");
      setIsProjectDialogOpen(false);
    } finally {
      setIsLoadingProjectDetail(false);
    }
  };

  const handleScrapeFromDetail = async () => {
    if (!selectedProject) return;

    try {
      await scrapeReddit(String(selectedProject.projectId));
      alert("Scraping started successfully!");
    } catch (err) {
      console.error("Error starting scraping:", err);
      alert("Failed to start scraping");
    }
  };

  const handleOpenPaymentBypassDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setBypassEndDate("");
    setIsPaymentBypassDialogOpen(true);
  };

  const handleEnablePaymentBypass = async () => {
    if (!selectedUser || !bypassEndDate) {
      alert("Please select an end date");
      return;
    }

    try {
      await updatePaymentBypass({
        userId: selectedUser.userId,
        enabled: true,
        until: new Date(bypassEndDate).toISOString(),
      });

      // Refresh users data
      const userData = await getAdminUsers();
      setUsers(userData);
      setIsPaymentBypassDialogOpen(false);
      alert("Payment bypass enabled successfully!");
    } catch (err) {
      console.error("Error enabling payment bypass:", err);
      alert("Failed to enable payment bypass");
    }
  };

  const handleDisablePaymentBypass = async (userId: number) => {
    if (!confirm("Are you sure you want to disable payment bypass for this user?")) {
      return;
    }

    try {
      await updatePaymentBypass({
        userId,
        enabled: false,
      });

      // Refresh users data
      const userData = await getAdminUsers();
      setUsers(userData);
      alert("Payment bypass disabled successfully!");
    } catch (err) {
      console.error("Error disabling payment bypass:", err);
      alert("Failed to disable payment bypass");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <p className="text-lg text-red-600 dark:text-red-400 mb-2">
              Error loading users
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage users and their subscriptions
        </p>
      </div>

      {/* Users List */}
      {!users || users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            No users found
          </p>
        </div>
      ) : (
            <div className="grid gap-6">
              {users.map((user) => (
                <Card key={user.userId} className="border-neutral-200 dark:border-neutral-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-neutral-950 dark:text-white">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                          {user.email}
                          {user.role && ` • ${user.role}`}
                        </CardDescription>
                      </div>
                      <Badge className={
                        user.subscription?.status === "active"
                          ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400"
                          : "bg-neutral-600/10 dark:bg-neutral-600/20 text-neutral-600 dark:text-neutral-400"
                      }>
                        {user.subscription?.status || "No subscription"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Subscription Info */}
                    {user.subscription && (
                      <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Subscription Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Plan</div>
                            <div className="font-medium text-neutral-950 dark:text-white capitalize">
                              {user.subscription.planId.replace(/_/g, " ")}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Status</div>
                            <Badge className={
                              user.subscription.status === "active"
                                ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400"
                                : "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400"
                            }>
                              {user.subscription.status}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Period Start</div>
                            <div className="text-neutral-700 dark:text-neutral-300">
                              {formatDate(user.subscription.currentPeriodStart)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Period End</div>
                            <div className="text-neutral-700 dark:text-neutral-300">
                              {formatDate(user.subscription.currentPeriodEnd)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Bypass Info/Button */}
                    <div className="mb-4">
                      {user.paymentBypass.enabled ? (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                  Payment Bypass Enabled
                                </span>
                              </div>
                              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                                Valid until: {formatDate(user.paymentBypass.until!)}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDisablePaymentBypass(user.userId)}
                            variant="outline"
                            size="sm"
                            className="w-full border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                          >
                            Disable Payment Bypass
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleOpenPaymentBypassDialog(user)}
                          variant="outline"
                          className="w-full"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Enable Payment Bypass
                        </Button>
                      )}
                    </div>

                    {/* Projects Section */}
                    {!user.projects || user.projects.length === 0 ? (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                        No projects yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                          <FolderKanban className="w-4 h-4" />
                          Projects ({user.projects.length})
                        </h4>
                        <div className="grid gap-3">
                          {user.projects.map((project) => (
                            <div
                              key={project.projectId}
                              className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-neutral-950 dark:text-white mb-1">
                                    {project.projectName}
                                  </h5>
                                  <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline mb-2 block"
                                  >
                                    {project.projectUrl}
                                  </a>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleProjectClick(project.projectId)}
                                  className="ml-2"
                                >
                                  View Details
                                </Button>
                              </div>
                              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                {project.projectDescription}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
      )}

      {/* Payment Bypass Dialog */}
      <Dialog open={isPaymentBypassDialogOpen} onOpenChange={setIsPaymentBypassDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-neutral-950 dark:text-white">
              Enable Payment Bypass
            </DialogTitle>
            <DialogDescription>
              {selectedUser && `Enable payment bypass for ${selectedUser.firstName} ${selectedUser.lastName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bypassEndDate" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Bypass End Date
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <Input
                  id="bypassEndDate"
                  type="date"
                  value={bypassEndDate}
                  onChange={(e) => setBypassEndDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Select the date when the payment bypass should expire
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsPaymentBypassDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEnablePaymentBypass}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!bypassEndDate}
              >
                Enable Bypass
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-neutral-950 dark:text-white">
              {isLoadingProjectDetail ? "Loading..." : selectedProject?.projectName}
            </DialogTitle>
            <DialogDescription>
              {!isLoadingProjectDetail && selectedProject && (
                <a
                  href={selectedProject.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  {selectedProject.projectUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </DialogDescription>
          </DialogHeader>

          {isLoadingProjectDetail ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : selectedProject ? (
            <div className="space-y-6">
              {/* Status Badge */}
              <div>
                <Badge className={
                  selectedProject.status === "active"
                    ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400"
                    : "bg-neutral-600/10 dark:bg-neutral-600/20 text-neutral-600 dark:text-neutral-400"
                }>
                  {selectedProject.status}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Description
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {selectedProject.projectDescription}
                </p>
              </div>

              {/* Keywords */}
              {selectedProject.keywords && selectedProject.keywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Keywords ({selectedProject.keywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Semantic Queries */}
              {selectedProject.semanticQueries && selectedProject.semanticQueries.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Semantic Queries ({selectedProject.semanticQueries.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.semanticQueries.map((query, index) => (
                      <div
                        key={index}
                        className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {query}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subreddits */}
              {selectedProject.subreddits && selectedProject.subreddits.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Subreddits ({selectedProject.subreddits.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.subreddits.map((subreddit, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                      >
                        r/{subreddit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Configuration */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Configuration
                </h3>
                <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Post Threshold
                    </div>
                    <div className="text-sm font-medium text-neutral-950 dark:text-white">
                      {selectedProject.postThreshold}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Comment Threshold
                    </div>
                    <div className="text-sm font-medium text-neutral-950 dark:text-white">
                      {selectedProject.commentThreshold}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Date Range (Days)
                    </div>
                    <div className="text-sm font-medium text-neutral-950 dark:text-white">
                      {selectedProject.postDateRangeDays}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <Button
                  onClick={handleScrapeFromDetail}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Scrape Posts
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
