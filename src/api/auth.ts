import client from '../api/client'
import type { AuthURLResponse, User } from '../types/gtag'

export async function getLoginUrl(): Promise<string> {
  const { data } = await client.get<AuthURLResponse>('/auth/reddit/login')
  return data.auth_url
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await client.get<User>('/auth/me')
    return data
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Not connected to Reddit, return null instead of redirecting
      return null
    }
    throw err
  }
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout')
}
