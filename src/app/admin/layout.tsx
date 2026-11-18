
'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ShieldCheck, ExternalLink, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/profile': 'Profile & Bio',
  '/admin/appearance': 'Site Appearance',
  '/admin/projects': 'Projects',
  '/admin/experience': 'Professional Experience',
  '/admin/skills': 'Skills & Expertise',
  '/admin/education': 'Education & Certifications',
  '/admin/teaching': 'Teaching & Mentorship',
  '/admin/leadership': 'Leadership & Community',
  '/admin/publications': 'Publications & Research',
  '/admin/achievements': 'Achievements',
  '/admin/media': 'Media & Documents',
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  // Sidebar state is maintained by the shared admin layout.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }

    let active = true

    const verifyAdministrator = async () => {
      setChecking(true)
      setAuthorized(false)

      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) throw error

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
          ?.trim()
          .toLowerCase()

        const userEmail = data.user?.email?.toLowerCase()

        const isAdmin =
          !!adminEmail &&
          !!data.user &&
          userEmail === adminEmail &&
          !!data.user.email_confirmed_at

        if (!isAdmin) {
          await supabase.auth.signOut()

          if (active) {
            router.replace('/admin/login')
          }

          return
        }

        if (active) {
          setAuthorized(true)
        }
      } catch (error) {
        console.error('Administrator verification failed:', error)

        if (active) {
          router.replace('/admin/login')
        }
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    verifyAdministrator()

    return () => {
      active = false
    }
  }, [pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <ShieldCheck size={27} />
          </div>

          <div className="mt-5 h-6 w-6 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-700" />

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Verifying administrator access
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait while your workspace loads.
          </p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  const pageTitle = pageTitles[pathname] || 'Admin Workspace'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() =>
          setSidebarCollapsed((previous) => !previous)
        }
      />

      <div
        className={`min-h-screen transition-[padding] duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[280px]'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/95 pl-[76px] pr-4 backdrop-blur-md sm:pr-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
              <span>Portfolio CMS</span>
              <ChevronRight size={12} />
              <span className="truncate text-slate-500">
                Admin Workspace
              </span>
            </div>

            <h1 className="mt-1 truncate text-[17px] font-bold tracking-tight text-slate-900 sm:text-lg">
              {pageTitle}
            </h1>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700">
                Workspace active
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="hidden sm:inline">View website</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
