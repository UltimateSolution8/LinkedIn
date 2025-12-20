import { BrowserRouter } from 'react-router-dom'
import { ProjectProvider } from '@/contexts/ProjectContext'
import AppRouter from '@/router'

export default function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <AppRouter />
      </ProjectProvider>
    </BrowserRouter>
  )
}
