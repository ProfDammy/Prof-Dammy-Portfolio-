
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { ExperienceSection } from '@/components/public/ExperienceSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function ExperiencePage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading experience...">
        <ExperienceSection experiences={portfolio?.experiences ?? []} />
      </SectionPageContent>
    </PublicPageShell>
  )
}
