
'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import { GallerySection } from '@/components/public/GallerySection'
import { SectionPageContent } from '@/components/public/SectionPageContent'

export default function GalleryPage() {
  const { portfolio, loading, error } = usePortfolioData()

  return (
    <PublicPageShell profile={portfolio?.profile}>
      <SectionPageContent loading={loading} error={error} loadingMessage="Loading gallery...">
        <GallerySection assets={portfolio?.mediaAssets ?? []} />
      </SectionPageContent>
    </PublicPageShell>
  )
}
