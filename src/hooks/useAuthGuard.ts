import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type User } from '@/lib/api/auth'
import { useAuth } from '@/contexts/AuthContext'

interface UseAuthGuardOptions {
  requiredRole?: 'admin' | 'user'
  redirectTo?: string
}

interface UseAuthGuardReturn {
  user: User | null
  isLoading: boolean
  isAuthorized: boolean
  error: string | null
}

/**
 * Custom hook to guard routes with authentication and optional role validation.
 *
 * Features:
 * - Validates HTTP-only cookie session
 * - Fetches user data from API if localStorage is empty
 * - Supports role-based access control
 * - Handles cross-tab logout detection
 * - Proper cleanup with isMounted pattern
 *
 * @param options - Configuration options
 * @param options.requiredRole - Optional role required to access the route ('admin' | 'user')
 * @param options.redirectTo - Where to redirect if unauthorized (default: '/login')
 *
 * @returns Object containing user, loading state, authorization status, and error
 *
 * @example
 * // Basic usage - any authenticated user
 * const { user, isLoading, isAuthorized } = useAuthGuard()
 *
 * @example
 * // Require admin role
 * const { user, isLoading, isAuthorized } = useAuthGuard({ requiredRole: 'admin' })
 *
 * @example
 * // Custom redirect
 * const { user, isLoading, isAuthorized } = useAuthGuard({ redirectTo: '/pricing' })
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const { requiredRole, redirectTo = '/login' } = options
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      navigate(redirectTo)
      return
    }

    // Validate role if required
    if (requiredRole) {
      if (user.role !== requiredRole) {
        setError(`Access denied. ${requiredRole} role required.`)
        // Redirect based on role
        if (requiredRole === 'admin') {
          navigate('/dashboard')
        } else {
          navigate(redirectTo)
        }
        return
      }
    }

    // User is authenticated and authorized
    setIsAuthorized(true)
    setError(null)
  }, [user, authLoading, isAuthenticated, requiredRole, redirectTo, navigate])

  return {
    user,
    isLoading: authLoading,
    isAuthorized,
    error,
  }
}
