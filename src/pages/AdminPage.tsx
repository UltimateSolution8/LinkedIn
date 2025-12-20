
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { getAdminProjects, scrapeReddit, type Project } from "@/lib/api/projects";

interface ProjectData extends Project {
  scrapingStatus?: "idle" | "running" | "completed" | "error";
}

export default function AdminPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAdminProjects();
        setProjects(data.map((project) => ({ ...project, scrapingStatus: "idle" })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects");
        console.error("Error fetching admin projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleStartScraping = async (projectId: string) => {
    // Update project status to running
    setProjects((prev) =>
      prev.map((project) =>
        project._id === projectId
          ? { ...project, scrapingStatus: "running" }
          : project
      )
    );

    try {
      // Call the scrape Reddit API
      await scrapeReddit(projectId);

      // Update status to completed on success
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? { ...project, scrapingStatus: "completed" }
            : project
        )
      );
    } catch (err) {
      // Update status to error on failure
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? { ...project, scrapingStatus: "error" }
            : project
        )
      );
      console.error("Error starting scraping:", err);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/10">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400 hover:bg-green-600/10">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-600/10">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-neutral-600/10 dark:bg-neutral-600/20 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-600/10">
            Idle
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Loading projects...
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
              Error loading projects
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
          Manage project scraping and monitor system status
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            No projects found
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-neutral-950 dark:text-white">
                      {project.projectName}
                    </CardTitle>
                    <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {project.websiteUrl}
                      </a>
                    </CardDescription>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(project.scrapingStatus)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                  {project.description}
                </p>
                <Button
                  onClick={() => handleStartScraping(project._id)}
                  disabled={project.scrapingStatus === "running"}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {project.scrapingStatus === "running" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Scraping
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
