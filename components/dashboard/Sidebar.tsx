"use client";

import { CheckCircle2, PauseCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const projects = [
  { name: "SaaS Marketing Leads", status: "active", icon: CheckCircle2 },
  { name: "Web Design Clients", status: "inactive", icon: CheckCircle2 },
  { name: "Mobile App Dev", status: "paused", icon: PauseCircle },
  { name: "Early Adopters", status: "inactive", icon: CheckCircle2 },
];

export default function Sidebar() {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/create-project");
  };

  return (
    <aside className="flex w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjNUw5OL83OLGuRJ5NTl43lODzRR6uarTz0MXwCsuH-0cKVPFtEz4_o7oc6gnfHEWK84sS4xKeQnYq364x3hzif_uc4h6LbunOLd6mdyE_lnvFKw_ZVO1JEoPIy_KCY-97sQeAxLWWe9MtBCEACixqZKCyqtQKlpt9SNCE7npCqcQbpNthu3o1KxVd1K1KtyJvEHlU2OsKs9hLBPoC-mNeWtOsFrH3wr8x4QeI-uR5cOyR1_VOjM_rn0WMC6iNbX6-z2mx_kK1NP2N")`
              }}
              role="img"
              aria-label="Rixly company logo"
            />
            <div className="flex flex-col">
              <h1 className="text-neutral-950 dark:text-white text-base font-bold leading-normal">
                Rixly
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal">
                AI Lead Discovery
              </p>
            </div>
          </div>

          {/* Projects List */}
          <div className="flex flex-col gap-2 mt-4">
            {projects.map((project, index) => {
              const Icon = project.icon;
              const isActive = index === 0;

              return (
                <div
                  key={project.name}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-purple-600/10 dark:bg-purple-600/20"
                      : "hover:bg-purple-600/10 dark:hover:bg-purple-600/20"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium leading-normal ${
                      isActive
                        ? "text-neutral-950 dark:text-white"
                        : "text-neutral-950 dark:text-neutral-300"
                    }`}
                  >
                    {project.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create New Project Button */}
        <Button
          onClick={handleCreateProject}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="truncate">Create New Project</span>
        </Button>
      </div>
    </aside>
  );
}
