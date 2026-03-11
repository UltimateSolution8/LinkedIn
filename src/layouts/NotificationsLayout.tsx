import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import NotificationButton from '@/components/shared/NotificationButton'
import UserProfileDropdown from '@/components/shared/UserProfileDropdown'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function NotificationsLayout() {
  const navigate = useNavigate()
  const { isLoading: isAuthLoading, isAuthorized: isAuthenticated } = useAuthGuard({
    redirectTo: '/login',
  })
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Wait for auth to complete first
    if (isAuthLoading || !isAuthenticated) {
      return
    }

    const checkAccess = () => {
      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAccess()
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
      <div className="flex h-screen w-full flex-col">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-10 py-3 bg-white dark:bg-neutral-950">
          <Logo />
          <div className="flex items-center gap-4">
            <NotificationButton />
            <UserProfileDropdown />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </ProjectProvider>
  )
}
