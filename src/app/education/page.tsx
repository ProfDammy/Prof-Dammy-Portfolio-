
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { EducationSection } from '@/components/public/EducationSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function EducationPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading education...">
        <EducationSection
          education={portfolio?.education ?? []}
          certifications={portfolio?.certifications ?? []}
        />
      </SectionPageContent>
    </PublicPageShell>
  )
}
