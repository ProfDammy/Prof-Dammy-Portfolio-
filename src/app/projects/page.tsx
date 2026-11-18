
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function ProjectsPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent
        loading={loading}
        error={error}
        loadingMessage="Loading projects..."
      >
        <ProjectsSection projects={portfolio?.projects ?? []} />
      </SectionPageContent>
    </PublicPageShell>
  )
}
