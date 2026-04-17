const BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL

async function request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

const client = {
  get<T>(path: string, headers?: Record<string, string>): Promise<T | null> {
    return request<T>(path, { method: 'GET', headers })
  },
  post<T>(path: string, payload?: unknown): Promise<T | null> {
    return request<T>(path, {
      method: 'POST',
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    })
  },
}

export default client
