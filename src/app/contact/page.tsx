
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { ContactSection } from '@/components/public/ContactSection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function ContactPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading contact information...">
        {portfolio?.profile ? (
          <ContactSection profile={portfolio.profile} />
        ) : (
          <p className="px-5 py-8 text-center text-slate-500">
            Contact information is currently unavailable.
          </p>
        )}
      </SectionPageContent>
    </PublicPageShell>
  )
}
