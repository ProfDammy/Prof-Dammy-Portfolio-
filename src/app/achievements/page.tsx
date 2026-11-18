
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { AchievementsSection } from '@/components/public/AchievementsSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function AchievementsPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent
        loading={loading}
        error={error}
        loadingMessage="Loading achievements..."
      >
        <AchievementsSection
          achievements={portfolio?.achievements ?? []}
        />
      </SectionPageContent>
    </PublicPageShell>
  )
}
