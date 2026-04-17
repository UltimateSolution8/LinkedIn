import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_REDDIT_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // For Reddit integration, just return a resolved null response
      return Promise.resolve({ data: null })
    }
    return Promise.reject(error)
  }
)

export default client
