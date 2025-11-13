"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ProjectProvider } from "@/contexts/ProjectContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          {children}
        </main>
      </div>
    </ProjectProvider>
  );
}
