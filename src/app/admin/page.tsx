
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  FolderGit2,
  Briefcase,
  Wrench,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  Users2,
  Image as ImageIcon,
  Palette,
  User,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Layers3,
  RefreshCw,
  CheckCircle2,
  FileEdit,
  Plus,
  LayoutDashboard,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type Counts = {
  projects: number
  experiences: number
  skills: number
  education: number
  certifications: number
  teaching: number
  leadership: number
  publications: number
  achievements: number
  media: number
}

const initialCounts: Counts = {
  projects: 0,
  experiences: 0,
  skills: 0,
  education: 0,
  certifications: 0,
  teaching: 0,
  leadership: 0,
  publications: 0,
  achievements: 0,
  media: 0
}

const contentTables = [
  'projects',
  'experiences',
  'skills',
  'education',
  'certifications',
  'teaching_mentorship',
  'leadership_community',
  'publications',
  'achievements'
] as const

const modules = [
  {
    name: 'Profile & Bio',
    href: '/admin/profile',
    icon: User,
    description: 'Personal details, biography and contact information',
    group: 'Workspace'
  },
  {
    name: 'Site Appearance',
    href: '/admin/appearance',
    icon: Palette,
    description: 'Homepage content, navigation and section visibility',
    group: 'Workspace'
  },
  {
    name: 'Projects',
    key: 'projects',
    href: '/admin/projects',
    icon: FolderGit2,
    description: 'Portfolio projects, case studies and solutions',
    group: 'Portfolio content'
  },
  {
    name: 'Experience',
    key: 'experiences',
    href: '/admin/experience',
    icon: Briefcase,
    description: 'Professional roles and responsibilities',
    group: 'Portfolio content'
  },
  {
    name: 'Skills',
    key: 'skills',
    href: '/admin/skills',
    icon: Wrench,
    description: 'Technical, analytical and professional skills',
    group: 'Portfolio content'
  },
  {
    name: 'Education & Certifications',
    key: 'education',
    extraKey: 'certifications',
    href: '/admin/education',
    icon: GraduationCap,
    description: 'Academic background and credentials',
    group: 'Portfolio content'
  },
  {
    name: 'Teaching & Mentorship',
    key: 'teaching',
    href: '/admin/teaching',
    icon: Award,
    description: 'Training, courses and mentorship activities',
    group: 'Portfolio content'
  },
  {
    name: 'Leadership & Community',
    key: 'leadership',
    href: '/admin/leadership',
    icon: Users2,
    description: 'Leadership roles and community initiatives',
    group: 'Portfolio content'
  },
  {
    name: 'Publications & Research',
    key: 'publications',
    href: '/admin/publications',
    icon: BookOpen,
    description: 'Research, publications and written work',
    group: 'Portfolio content'
  },
  {
    name: 'Achievements',
    key: 'achievements',
    href: '/admin/achievements',
    icon: Trophy,
    description: 'Awards, recognition and accomplishments',
    group: 'Portfolio content'
  },
  {
    name: 'Media & Documents',
    key: 'media',
    href: '/admin/media',
    icon: ImageIcon,
    description: 'Portfolio images and document management',
    group: 'Portfolio content'
  }
]

export default function AdminDashboardOverview() {
  const [counts, setCounts] = useState<Counts>(initialCounts)
  const [published, setPublished] = useState(0)
  const [drafts, setDrafts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await Promise.all(
        contentTables.map(table =>
          supabase
            .from(table)
            .select('id', { count: 'exact', head: true })
        )
      )

      const mediaResult = await supabase
        .from('media_assets')
        .select('id', { count: 'exact', head: true })

      const failedIndex = results.findIndex(result => result.error)

      if (failedIndex !== -1) {
        throw new Error(results[failedIndex].error?.message)
      }

      if (mediaResult.error) {
        throw new Error(mediaResult.error.message)
      }

      const nextCounts: Counts = {
        projects: results[0].count ?? 0,
        experiences: results[1].count ?? 0,
        skills: results[2].count ?? 0,
        education: results[3].count ?? 0,
        certifications: results[4].count ?? 0,
        teaching: results[5].count ?? 0,
        leadership: results[6].count ?? 0,
        publications: results[7].count ?? 0,
        achievements: results[8].count ?? 0,
        media: mediaResult.count ?? 0
      }

      setCounts(nextCounts)

      const publishedResults = await Promise.all(
        contentTables.map(table =>
          supabase
            .from(table)
            .select('id', { count: 'exact', head: true })
            .eq('published', true)
        )
      )

      const publicationError = publishedResults.find(result => result.error)

      if (publicationError?.error) {
        throw new Error(publicationError.error.message)
      }

      const publishedTotal = publishedResults.reduce(
        (total, result) => total + (result.count ?? 0),
        0
      )

      const contentTotal = contentTables.reduce(
        (total, table) => total + (nextCounts[
          table === 'teaching_mentorship' ? 'teaching' :
          table === 'leadership_community' ? 'leadership' :
          table as keyof Counts
        ] ?? 0),
        0
      )

      setPublished(publishedTotal)
      setDrafts(Math.max(contentTotal - publishedTotal, 0))
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Dashboard loading error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load dashboard information.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const totalRecords = useMemo(() => {
    return Object.values(counts).reduce((total, value) => total + value, 0)
  }, [counts])

  const statistics = [
    {
      label: 'Total records',
      value: totalRecords,
      description: 'Across all portfolio sections',
      icon: Layers3,
      color: 'blue'
    },
    {
      label: 'Published records',
      value: published,
      description: 'Visible portfolio content',
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      label: 'Draft records',
      value: drafts,
      description: 'Content not yet published',
      icon: FileEdit,
      color: 'amber'
    },
    {
      label: 'Media assets',
      value: counts.media,
      description: 'Images and uploaded documents',
      icon: ImageIcon,
      color: 'violet'
    }
  ]

  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700'
  }

  const groupedModules = [
    {
      title: 'Workspace settings',
      description: 'Manage your identity and website presentation.',
      items: modules.filter(item => item.group === 'Workspace')
    },
    {
      title: 'Portfolio content',
      description: 'Create, update and organise your professional records.',
      items: modules.filter(item => item.group === 'Portfolio content')
    }
  ]

  return (
    <div className="space-y-8 pb-10">

      {/* Welcome panel */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Administrator workspace
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Welcome back, Prof Dammy.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
              Your professional portfolio, content and website settings are
              managed from this central workspace.
            </p>

            {lastUpdated && (
              <p className="mt-4 text-xs text-slate-400">
                Last refreshed: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              View public website
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Dashboard information could not be fully loaded.
            </p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="mt-2 text-sm font-semibold text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Portfolio overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A snapshot of your portfolio content.
            </p>
          </div>
          <span className="hidden text-xs text-slate-400 sm:block">
            Live database counts
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {statistics.map(stat => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                      {loading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Get straight to frequently used workspace areas.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">Edit profile</p>
              <p className="mt-0.5 text-xs text-slate-500">Update your biography and details</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/projects"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Plus className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">Manage projects</p>
              <p className="mt-0.5 text-xs text-slate-500">Add or update portfolio projects</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/appearance"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Palette className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">Customise website</p>
              <p className="mt-0.5 text-xs text-slate-500">Manage homepage and appearance</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>
      </section>

      {/* Management modules */}
      {groupedModules.map(group => (
        <section key={group.title}>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {group.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {group.description}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {group.items.length} sections
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map(module => {
              const Icon = module.icon

              const count = module.key
                ? counts[module.key as keyof Counts] +
                  (module.extraKey
                    ? counts[module.extraKey as keyof Counts]
                    : 0)
                : null

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      {count !== null && (
                        <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                          {loading ? '...' : count.toLocaleString()}
                        </span>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-600" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      {module.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {module.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}

      {/* Future engagement module */}
      <section className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-5 md:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Future workspace expansion
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Testimonials and client feedback management will be added here.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700">
            Planned feature
          </span>
        </div>
      </section>

    </div>
  )
}
