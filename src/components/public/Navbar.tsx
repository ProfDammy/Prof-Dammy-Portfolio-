
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { Profile } from '@/types/database'

interface NavbarProps {
  navLabels?: Record<string, string>
  visibility?: Record<string, boolean>
  profile?: Profile | null
}

const navLinks = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'skills', label: 'Expertise', href: '/skills' },
  { key: 'experience', label: 'Experience', href: '/experience' },
  { key: 'projects', label: 'Projects', href: '/projects' },
  { key: 'teaching', label: 'Teaching', href: '/teaching' },
  { key: 'leadership', label: 'Leadership', href: '/leadership' },
  { key: 'education', label: 'Education', href: '/education' },
  { key: 'publications', label: 'Research', href: '/research' },
  { key: 'achievements', label: 'Achievements', href: '/achievements' },
  { key: 'gallery', label: 'Gallery', href: '/gallery' },
  { key: 'contact', label: 'Contact', href: '/contact' },
]

export default function Navbar({
  navLabels = {},
  visibility = {},
  profile,
}: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleLinks = navLinks.filter(
    (link) => link.key === 'home' || visibility[link.key] !== false
  )

  const displayName =
    profile?.show_nickname && profile?.nickname
      ? profile.nickname
      : profile?.full_name || 'Damilola Oluwagbamila'

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[70px] max-w-[1600px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">

        {/* Brand */}
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-blue-700"
          onClick={() => setMobileOpen(false)}
        >
          {displayName}
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden flex-1 items-center justify-end gap-x-4 xl:gap-x-5 2xl:flex 2xl:gap-x-6"
        >
          {visibleLinks.map((link) => {
            const active = isActive(link.href)
            const isContact = link.key === 'contact'

            return (
              <Link
                key={link.key}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={
                  isContact
                    ? `whitespace-nowrap rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-blue-800 hover:!text-white ${
                        active ? 'bg-blue-900' : ''
                      }`
                    : `whitespace-nowrap text-sm font-medium transition-colors ${
                        active
                          ? 'text-blue-700'
                          : 'text-slate-600 hover:text-blue-700'
                      }`
                }
              >
                {navLabels[link.key] || link.label}
              </Link>
            )
          })}
        </nav>

        {/* Tablet and mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 2xl:hidden"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Tablet and mobile navigation */}
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-5 py-4 2xl:hidden"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3">
            {visibleLinks.map((link) => {
              const active = isActive(link.href)
              const isContact = link.key === 'contact'

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={
                    isContact
                      ? `rounded-lg bg-blue-700 px-3 py-3 text-center text-sm font-semibold !text-white transition-colors hover:bg-blue-800 hover:!text-white ${
                          active ? 'bg-blue-900' : ''
                        }`
                      : `rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                        }`
                  }
                >
                  {navLabels[link.key] || link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
