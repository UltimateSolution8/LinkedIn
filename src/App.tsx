import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthProvider as RedditAuthProvider } from '@/contexts/AuthContext1'
import AppRouter from '@/router'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
