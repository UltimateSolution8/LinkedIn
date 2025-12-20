import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { getCurrentUser } from '@/lib/api/auth'

export default function ProfileLayout() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }
    setIsChecking(false)
  }, [navigate])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800 px-10 py-3 bg-white dark:bg-neutral-950">
        <Logo />
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
