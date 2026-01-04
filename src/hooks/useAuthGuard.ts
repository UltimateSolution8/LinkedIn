import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, type User } from '@/lib/api/auth'

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const validateAuth = async () => {
      if (!isMounted) return

      setIsLoading(true)
      setIsAuthorized(false)
      setError(null)

      try {
        // Check if user exists in localStorage
        let currentUser = getCurrentUser()

        // If no user in localStorage, try to fetch from API (cookie-based auth)
        if (!currentUser) {
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
              currentUser = userToStore
            } else {
              // No valid session
              if (isMounted) {
                navigate(redirectTo)
              }
              return
            }
          } catch (err) {
            console.error('Error fetching user:', err)
            if (isMounted) {
              setError('Failed to authenticate')
              navigate(redirectTo)
            }
            return
          }
        }

        if (!isMounted) return

        // Ensure we have a user at this point
        if (!currentUser) {
          setError('Failed to authenticate')
          navigate(redirectTo)
          return
        }

        // Validate role if required
        if (requiredRole) {
          if (currentUser.role !== requiredRole) {
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
        setUser(currentUser)
        setIsAuthorized(true)
      } catch (err) {
        console.error('Auth validation error:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Authentication failed')
          navigate(redirectTo)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Initial validation
    validateAuth()

    // Listen for storage changes (cross-tab logout detection)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === null) {
        // User data changed - re-validate
        validateAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [navigate, redirectTo, requiredRole])

  return {
    user,
    isLoading,
    isAuthorized,
    error,
  }
}
