import { ProjectProvider } from '@/contexts/ProjectContext'
import { ReactNode } from 'react'

interface ProjectProviderWrapperProps {
  children: ReactNode
}

/**
 * Wraps children with ProjectProvider.
 * Only use this for routes that need project data.
 */
export default function ProjectProviderWrapper({ children }: ProjectProviderWrapperProps) {
  return <ProjectProvider>{children}</ProjectProvider>
}
