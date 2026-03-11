import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import NotificationButton from '@/components/shared/NotificationButton'
import UserProfileDropdown from '@/components/shared/UserProfileDropdown'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function CreateProjectLayout() {
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
    <div className="relative flex min-h-screen w-full flex-col bg-neutral-100 dark:bg-neutral-950">
      <div className="flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 md:px-10 py-3 bg-white dark:bg-neutral-950">
          {/* Left Side - Logo */}
          <Logo />

          {/* Right Side - Notification & Avatar */}
          <div className="flex flex-1 justify-end items-center gap-4">
            {/* Notification Button */}
            <NotificationButton />

            {/* User Profile Dropdown */}
            <UserProfileDropdown />
          </div>
        </header>

        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  )
}
