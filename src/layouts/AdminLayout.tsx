import { Outlet } from 'react-router-dom'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function AdminLayout() {
  const { isLoading, isAuthorized } = useAuthGuard({
    requiredRole: 'admin',
    redirectTo: '/login',
  })

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Checking authorization...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Outlet />
    </div>
  )
}
