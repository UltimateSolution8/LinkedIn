import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { getCurrentUser } from '@/lib/api/auth'
import { checkSubscriptionAccess } from '@/lib/utils/subscription'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkAccess = async () => {
      if (!isMounted) return

      setIsChecking(true)
      setIsAuthorized(false)

      // Check if user is logged in in localStorage
      let user = getCurrentUser()

      // If no user in localStorage, try to fetch from API (cookie-based auth)
      if (!user) {
        try {
          const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL
          const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })

          if (response.ok) {
            const userData = await response.json()
            const userToStore = userData.user || userData
            localStorage.setItem('user', JSON.stringify(userToStore))
            user = userToStore
          } else {
            // No valid session, redirect to login
            navigate('/login')
            return
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          navigate('/login')
          return
        }
      }

      // Check subscription access - ALWAYS fetch fresh data from API
      try {
        const hasAccess = await checkSubscriptionAccess()

        if (!isMounted) return

        if (!hasAccess) {
          // User doesn't have active subscription - redirect to pricing
          navigate('/pricing')
          return
        }

        setIsAuthorized(true)
        setIsChecking(false)
      } catch (error) {
        console.error('Error checking access:', error)
        if (!isMounted) return
        // On error, redirect to pricing for security
        navigate('/pricing')
      }
    }

    // Initial check
    checkAccess()

    // Listen for storage changes (user logout/login in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken' || e.key === null) {
        // User data changed - re-check access
        checkAccess()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorageChange)
    }
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
