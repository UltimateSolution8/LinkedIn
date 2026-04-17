import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getLoginUrl, getMe } from '../api/auth'
import type { User } from '../types/gtag'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isRedditConnected: boolean
  login: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
  (async () => {
    try {
      const u = await getMe()
      setUser(u)
    } catch {
      // No Reddit user connected, just clear state
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  })()
}, [])

  async function login() {
    const url = await getLoginUrl()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const isRedditConnected = !!user?.reddit_user_id

  return (
    <AuthContext.Provider value={{ user, isLoading, isRedditConnected, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
