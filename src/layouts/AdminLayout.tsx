import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@/lib/api/auth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()

    // Check if user is logged in
    if (!user) {
      navigate('/login')
      return
    }

    // Check if user has admin role
    const isAdmin = user.role === 'admin'

    if (!isAdmin) {
      navigate('/dashboard')
      return
    }

    setIsAuthorized(true)
  }, [navigate])

  if (!isAuthorized) {
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
