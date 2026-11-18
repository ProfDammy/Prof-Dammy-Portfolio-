
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { SkillsSection } from '@/components/public/SkillsSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function SkillsPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent
        loading={loading}
        error={error}
        loadingMessage="Loading expertise..."
      >
        <SkillsSection skills={portfolio?.skills ?? []} />
      </SectionPageContent>
    </PublicPageShell>
  )
}
