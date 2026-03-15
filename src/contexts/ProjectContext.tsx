
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getProjects, type Project } from "@/lib/api/projects";

interface ProjectContextType {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const LAST_ACCESSED_PROJECT_KEY = "lastAccessedProjectId";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapper to also save to localStorage
  const setSelectedProjectId = (id: string | null) => {
    setSelectedProjectIdState(id);
    if (id) {
      localStorage.setItem(LAST_ACCESSED_PROJECT_KEY, id);
    } else {
      localStorage.removeItem(LAST_ACCESSED_PROJECT_KEY);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);

      // Determine which project to select
      if (data.length > 0 && !selectedProjectId) {
        // Try to get lastAccessedProjectId from localStorage
        const lastAccessedId = localStorage.getItem(LAST_ACCESSED_PROJECT_KEY);

        // Check if lastAccessedId is valid (exists in the projects list)
        const isValidProject = lastAccessedId && data.some(p => p._id === lastAccessedId);

        if (isValidProject) {
          setSelectedProjectId(lastAccessedId);
        } else {
          // Fall back to first project
          setSelectedProjectId(data[0]._id);
        }
      } else if (data.length === 0) {
        // No projects - clear any selected project
        setSelectedProjectId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch projects when this provider is mounted
    // (which only happens on routes that need projects now)
    fetchProjects();
  }, []);

  const refreshProjects = async () => {
    await fetchProjects();
  };

  const getProjectById = (id: string) => {
    return projects.find((project) => project._id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        projects,
        isLoading,
        error,
        refreshProjects,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
