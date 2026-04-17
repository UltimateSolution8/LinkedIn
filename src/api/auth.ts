import client from '../api/client'

interface AuthURLResponse {
  auth_url: string
}

export async function getLoginUrl(returnTo: string): Promise<string> {
  const res = await client.get<AuthURLResponse>('/api/auth/reddit/login', {
    'X-Return-To': returnTo,
  })
  return res!.auth_url
}
