
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { TeachingSection } from '@/components/public/TeachingSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function TeachingPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading teaching experience...">
        <TeachingSection teaching={portfolio?.teaching ?? []} />
      </SectionPageContent>
    </PublicPageShell>
  )
}
