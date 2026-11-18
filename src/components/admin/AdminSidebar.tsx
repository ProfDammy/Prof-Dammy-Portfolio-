
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Briefcase,
  Wrench,
  FolderGit2,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  ImageIcon,
  Palette,
  LogOut,
  Globe,
  Users2,
  MessageSquareQuote,
  Menu,
  X,
  ChevronRight,
  Settings2,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

type AdminSidebarProps = {
  collapsed: boolean
  onToggleCollapse: () => void
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Workspace settings',
    items: [
      { label: 'Profile & Bio', href: '/admin/profile', icon: User },
      { label: 'Site Appearance', href: '/admin/appearance', icon: Palette },
    ],
  },
  {
    title: 'Portfolio content',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
      { label: 'Experience', href: '/admin/experience', icon: Briefcase },
      { label: 'Skills & Expertise', href: '/admin/skills', icon: Wrench },
      { label: 'Education & Certifications', href: '/admin/education', icon: GraduationCap },
      { label: 'Teaching & Mentorship', href: '/admin/teaching', icon: BookOpen },
      { label: 'Leadership & Community', href: '/admin/leadership', icon: Users2 },
      { label: 'Publications & Research', href: '/admin/publications', icon: Award },
      { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
      { label: 'Media & Documents', href: '/admin/media', icon: ImageIcon },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    ],
  },
]

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const closeMobileMenu = () => setMobileOpen(false)

  useEffect(() => {
    closeMobileMenu()
  }, [pathname])

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      localStorage.removeItem('profdammy_admin_session')
      router.replace('/admin/login')
      router.refresh()
    }
  }

  return (
    <>
      {/* Mobile navigation trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
          mobileOpen
            ? 'w-[280px] translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        } ${
          collapsed ? 'lg:w-[84px]' : 'lg:w-[280px]'
        }`}
      >
        {/* Brand and collapse controls */}
        <div
          className={`flex h-[76px] shrink-0 items-center border-b border-slate-100 ${
            collapsed
              ? 'justify-center px-3 lg:px-0'
              : 'justify-between px-5'
          }`}
        >
          <Link
            href="/admin"
            onClick={closeMobileMenu}
            title="Prof Dammy Admin Workspace"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-200">
              <Settings2 size={21} />
            </div>

            <div
              className={`min-w-0 overflow-hidden transition-all duration-200 ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              <p className="whitespace-nowrap text-[15px] font-bold tracking-tight text-slate-900">
                Prof Dammy
              </p>
              <p className="mt-0.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Portfolio CMS
              </p>
            </div>
          </Link>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 lg:flex ${
              collapsed ? 'lg:absolute lg:-right-3 lg:top-5 lg:z-10 lg:rounded-full lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm' : ''
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Workspace identity */}
        <div
          className={`mx-4 mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 ${
            collapsed ? 'lg:mx-3 lg:flex lg:justify-center lg:p-2' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              title="Administrator"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm"
            >
              <User size={16} />
            </div>

            <div
              className={`min-w-0 ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              <p className="text-xs font-bold text-slate-800">
                Administrator
              </p>
              <p className="text-[11px] text-slate-500">
                Portfolio workspace
              </p>
            </div>

            {!collapsed && (
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Admin navigation"
          className={`min-h-0 flex-1 overflow-y-auto py-6 ${
            collapsed ? 'px-3' : 'space-y-6 px-4'
          }`}
        >
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6 last:mb-0">
              <p
                className={`mb-2 overflow-hidden whitespace-nowrap px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      aria-current={active ? 'page' : undefined}
                      aria-label={collapsed ? item.label : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex min-h-10 items-center rounded-lg py-2.5 text-[13px] font-medium transition-all duration-200 ${
                        collapsed
                          ? 'justify-center gap-0 px-2 lg:px-0'
                          : 'gap-3 px-3'
                      } ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {active && (
                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-700" />
                      )}

                      <Icon
                        size={18}
                        strokeWidth={active ? 2.3 : 1.8}
                        className={`shrink-0 ${
                          active
                            ? 'text-blue-700'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />

                      <span
                        className={`min-w-0 flex-1 truncate ${
                          collapsed ? 'lg:hidden' : ''
                        }`}
                      >
                        {item.label}
                      </span>

                      {active && !collapsed && (
                        <ChevronRight
                          size={15}
                          className="shrink-0 text-blue-600"
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div
          className={`shrink-0 border-t border-slate-100 p-4 ${
            collapsed ? 'lg:px-3' : ''
          }`}
        >
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View public website"
            className={`flex items-center rounded-lg py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-700 ${
              collapsed ? 'justify-center gap-0 px-2' : 'gap-3 px-3'
            }`}
          >
            <Globe size={18} className="shrink-0 text-slate-400" />
            <span className={collapsed ? 'lg:hidden' : ''}>
              View public website
            </span>
            {!collapsed && (
              <ChevronRight size={14} className="ml-auto text-slate-300" />
            )}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title={loggingOut ? 'Signing out...' : 'Sign out'}
            aria-label={loggingOut ? 'Signing out' : 'Sign out'}
            className={`mt-1 flex w-full items-center rounded-lg py-2.5 text-left text-[13px] font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 ${
              collapsed ? 'justify-center gap-0 px-2' : 'gap-3 px-3'
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>
              {loggingOut ? 'Signing out...' : 'Sign out'}
            </span>
          </button>

          <p
            className={`mt-4 overflow-hidden whitespace-nowrap px-3 text-[10px] text-slate-400 ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            Portfolio Management Workspace
          </p>
        </div>
      </aside>
    </>
  )
}
