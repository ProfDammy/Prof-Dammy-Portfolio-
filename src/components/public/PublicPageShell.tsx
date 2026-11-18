
import type { ReactNode } from 'react'
import type { Profile } from '@/types/database'
import Navbar from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

interface PublicPageShellProps {
  children: ReactNode
  profile?: Profile | null
  navLabels?: Record<string, string>
  visibility?: Record<string, boolean>
  settings?: any
}

export default function PublicPageShell({
  children,
  profile,
  navLabels,
  visibility,
  settings,
}: PublicPageShellProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        profile={profile}
        navLabels={navLabels}
        visibility={visibility}
      />

      <main className="min-h-[60vh]">
        {children}
      </main>

      <Footer
        profile={profile ?? undefined}
        settings={settings}
      />
    </div>
  )
}
