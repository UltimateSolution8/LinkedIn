import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  // Note: StrictMode is disabled to match Next.js config (reactStrictMode: false)
  <App />
)
