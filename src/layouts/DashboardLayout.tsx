import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { ProjectProvider, useProject } from '@/contexts/ProjectContext'
import { useAuthGuard } from '@/hooks/useAuthGuard'

function DashboardLayoutContent() {
  const { projects, isLoading } = useProject()
  const hasProjects = !isLoading && projects.length > 0

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Hide sidebar on mobile (md and below), show on desktop (lg and above) */}
        {/* Also hide sidebar when there are no projects */}
        {hasProjects && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const { isLoading: isAuthLoading, isAuthorized: isAuthenticated } = useAuthGuard({
    redirectTo: '/login',
  })
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      setIsAuthorized(true)
      setIsChecking(false)
    }
  }, [isAuthLoading, isAuthenticated])

  if (isAuthLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Checking access...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAuthorized) {
    return null
  }

  return (
    <ProjectProvider>
      <DashboardLayoutContent />
    </ProjectProvider>
  )
}
