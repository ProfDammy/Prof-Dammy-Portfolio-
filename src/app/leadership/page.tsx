
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { LeadershipSection } from '@/components/public/LeadershipSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function LeadershipPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading leadership experience...">
        <LeadershipSection leadership={portfolio?.leadership ?? []} />
      </SectionPageContent>
    </PublicPageShell>
  )
}
