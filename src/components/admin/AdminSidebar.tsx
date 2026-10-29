'use client'

import React from 'react'
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
  Image as ImageIcon,
  Palette,
  LogOut,
  Globe,
  Users2
} from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('profdammy_admin_session')
    router.push('/admin/login')
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile & Bio', href: '/admin/profile', icon: User },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Skills', href: '/admin/skills', icon: Wrench },
    { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Teaching & Mentorship', href: '/admin/teaching', icon: GraduationCap },
    { label: 'Leadership & Forum', href: '/admin/leadership', icon: Users2 },
    { label: 'Education & Certs', href: '/admin/education', icon: Award },
    { label: 'Publications & Research', href: '/admin/publications', icon: BookOpen },
    { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { label: 'Media & Documents', href: '/admin/media', icon: ImageIcon },
    { label: 'Site Appearance', href: '/admin/appearance', icon: Palette },
  ]

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 text-slate-300">
      <div className="p-4 space-y-6 overflow-y-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            PD
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">CMS Portal</p>
            <p className="text-[11px] text-blue-400 font-medium mt-1">Prof Dammy Admin</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>View Public Site</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
