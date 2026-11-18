
import type { ReactNode } from 'react'

interface SectionPageContentProps {
  loading: boolean
  error: string | null
  children: ReactNode
  loadingMessage?: string
}

export function SectionPageContent({
  loading,
  error,
  children,
  loadingMessage = 'Loading content...',
}: SectionPageContentProps) {
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-sm text-slate-500">{loadingMessage}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return <>{children}</>
}
