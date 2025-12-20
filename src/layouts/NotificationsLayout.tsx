import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import NotificationButton from '@/components/shared/NotificationButton'
import UserProfileDropdown from '@/components/shared/UserProfileDropdown'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { getCurrentUser } from '@/lib/api/auth'
import { checkSubscriptionAccess } from '@/lib/utils/subscription'

export default function NotificationsLayout() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true)
      setIsAuthorized(false)

      // Check if user is logged in
      const user = getCurrentUser()
      if (!user) {
        navigate('/login')
        return
      }

      // Check subscription access - ALWAYS fetch fresh data from API
      try {
        const hasAccess = await checkSubscriptionAccess()
        if (!hasAccess) {
          // User doesn't have active subscription - redirect to pricing
          navigate('/pricing')
          return
        }

        setIsAuthorized(true)
        setIsChecking(false)
      } catch (error) {
        console.error('Error checking access:', error)
        // On error, redirect to pricing for security
        navigate('/pricing')
      }
    }

    checkAccess()
  }, [navigate])

  if (isChecking) {
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

  if (!isAuthorized) {
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
