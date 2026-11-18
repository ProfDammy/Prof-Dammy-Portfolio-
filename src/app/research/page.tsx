
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { ResearchSection } from '@/components/public/ResearchSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function ResearchPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent
        loading={loading}
        error={error}
        loadingMessage="Loading research..."
      >
        <ResearchSection
          publications={portfolio?.publications ?? []}
        />
      </SectionPageContent>
    </PublicPageShell>
  )
}
