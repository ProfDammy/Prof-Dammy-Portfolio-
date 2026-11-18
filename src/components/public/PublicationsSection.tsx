
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  FolderGit2,
  CheckCircle2,
  CalendarDays
} from 'lucide-react'

import { createClientServer } from '@/lib/supabaseServer'
import PublicPageShell from '@/components/public/PublicPageShell'
import type { Project, Profile } from '@/types/database'

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({
  params
}: ProjectDetailPageProps) {
  const { slug } = await params
  const supabase = await createClientServer()

  const [projectResult, profileResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle(),

    supabase
      .from('profiles')
      .select('*')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  ])

  if (projectResult.error) {
    throw new Error(projectResult.error.message)
  }

  if (!projectResult.data) {
    notFound()
  }

  const project = projectResult.data as Project
  const profile = (profileResult.data ?? null) as Profile | null

  return (
    <PublicPageShell profile={profile}>
      <article className="bg-white">

        {/* Breadcrumb and back navigation */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to projects
          </Link>
        </div>

        {/* Project heading */}
        <header className="max-w-6xl mx-auto px-5 sm:px-8 py-10 md:py-14">

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-2 rounded-full">
              {project.category}
            </span>

            <span className={`text-xs font-semibold px-3 py-2 rounded-full ${
              project.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {project.status === 'completed'
                ? 'Completed'
                : 'In Progress'}
            </span>

            {project.is_featured && (
              <span className="text-xs font-semibold text-blue-700">
                Featured project
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-950 leading-tight max-w-4xl">
            {project.title}
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-8 mt-6 max-w-3xl">
            {project.short_description}
          </p>

          {/* External project links */}
          <div className="flex flex-wrap gap-4 mt-8">

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
              >
                Visit live project
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                View source code
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

          </div>
        </header>

        {/* Main project image */}
        {project.image_url && (
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={project.image_url}
                alt={`${project.title} website landing page screenshot`}
                className="w-full max-h-[640px] object-contain bg-slate-50"
              />
            </div>
          </div>
        )}

        {/* Project content */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 md:py-16">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main description */}
            <div className="lg:col-span-2">

              <section>
                <h2 className="text-2xl font-bold text-slate-950">
                  About the project
                </h2>

                <div className="mt-5 text-slate-600 leading-8 whitespace-pre-line">
                  {project.full_description || project.short_description}
                </div>
              </section>

              {/* Highlights */}
              {project.metrics_highlights?.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold text-slate-950">
                    Project highlights
                  </h2>

                  <ul className="mt-6 space-y-4">
                    {project.metrics_highlights.map((highlight, index) => (
                      <li
                        key={`${project.id}-highlight-${index}`}
                        className="flex items-start gap-3 text-slate-600 leading-7"
                      >
                        <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-1" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            </div>

            {/* Project information sidebar */}
            <aside className="lg:col-span-1">

              <div className="border border-slate-200 rounded-2xl p-6 sticky top-24">

                <h2 className="text-lg font-bold text-slate-950">
                  Project information
                </h2>

                <div className="mt-6 space-y-6">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Category
                    </p>
                    <p className="text-sm font-medium text-slate-800 mt-2">
                      {project.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </p>
                    <p className="text-sm font-medium text-slate-800 mt-2">
                      {project.status === 'completed'
                        ? 'Completed'
                        : 'In Progress'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <CalendarDays className="w-4 h-4 inline mr-1" />
                      Added to portfolio
                    </p>
                    <p className="text-sm font-medium text-slate-800 mt-2">
                      {new Date(project.created_at).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long'
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Technologies
                    </p>

                    {project.technologies?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map(technology => (
                          <span
                            key={technology}
                            className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-2 rounded-lg"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 mt-2">
                        No technologies listed.
                      </p>
                    )}
                  </div>

                </div>
              </div>

            </aside>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <FolderGit2 className="w-4 h-4" />
              Explore more projects
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </article>
    </PublicPageShell>
  )
}
