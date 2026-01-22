import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { checkSubscriptionAccess } from '@/lib/utils/subscription'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { isLoading: isAuthLoading, isAuthorized: isAuthenticated } = useAuthGuard({
    redirectTo: '/login',
  })
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Wait for auth to complete first
    if (isAuthLoading || !isAuthenticated) {
      return
    }

    const checkAccess = async () => {
      if (!isMounted) return

      setIsChecking(true)
      setIsAuthorized(false)

      // Check subscription access - ALWAYS fetch fresh data from API
      try {
        const hasAccess = await checkSubscriptionAccess()

        if (!isMounted) return

        if (!hasAccess) {
          // User doesn't have active subscription - redirect to auth pricing
          navigate('/auth-pricing')
          return
        }

        setIsAuthorized(true)
        setIsChecking(false)
      } catch (error) {
        console.error('Error checking access:', error)
        if (!isMounted) return
        // On error, redirect to auth pricing for security
        navigate('/auth-pricing')
      }
    }

    // Initial check
    checkAccess()

    return () => {
      isMounted = false
    }
  }, [navigate, isAuthLoading, isAuthenticated])

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
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Hide sidebar on mobile (md and below), show on desktop (lg and above) */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 w-full h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectProvider>
  )
}
