
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { AboutSection } from '@/components/public/AboutSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function AboutPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading profile...">
        {portfolio?.profile ? (
          <AboutSection profile={portfolio.profile} />
        ) : (
          <p className="px-5 py-8 text-center text-slate-500">Profile information is unavailable.</p>
        )}
      </SectionPageContent>
    </PublicPageShell>
  )
}
