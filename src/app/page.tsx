
'use client'

import Link from 'next/link'
import { useSiteCustomizer } from '@/context/CustomizerContext'
import { usePortfolioData } from '@/hooks/usePortfolioData'
import PublicPageShell from '@/components/public/PublicPageShell'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Users,
  GraduationCap,
  FlaskConical,
  Code2,
  BriefcaseBusiness,
  FolderGit2,
  Sparkles
} from 'lucide-react'

export default function PortfolioHomePage() {
  const { settings } = useSiteCustomizer()
  const { portfolio, loading, error, refresh } = usePortfolioData()

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">
            Loading portfolio...
          </p>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !portfolio?.profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Portfolio unavailable
          </h1>

          <p className="mt-3 text-slate-600 leading-7">
            {error || 'No published profile is currently available.'}
          </p>

          <button
            type="button"
            onClick={refresh}
            className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  const { profile, projects, skills, experiences } = portfolio

  // Featured projects
  const featuredProjects = projects
    .filter(project => project.is_featured)
    .slice(0, 3)

  // Professional areas
  const professionalAreas = [
    {
      title: 'Data Analytics & Business Intelligence',
      description:
        'Turning data into meaningful insights and practical decisions.',
      icon: BarChart3,
      href: '/skills'
    },
    {
      title: 'AI & Software Solutions',
      description:
        'Building digital products, applications and intelligent solutions.',
      icon: BrainCircuit,
      href: '/projects'
    },
    {
      title: 'Research & Technical Writing',
      description:
        'Research, analysis and evidence-based knowledge development.',
      icon: FlaskConical,
      href: '/research'
    },
    {
      title: 'Teaching & Mentorship',
      description:
        'Developing skills and empowering people through learning.',
      icon: GraduationCap,
      href: '/teaching'
    },
    {
      title: 'Leadership & Community',
      description:
        'Building communities and creating opportunities for impact.',
      icon: Users,
      href: '/leadership'
    },
    {
      title: 'Digital Innovation',
      description:
        'Applying technology to solve real-world problems.',
      icon: Code2,
      href: '/projects'
    }
  ]

  return (
    <PublicPageShell
      profile={profile}
      navLabels={settings.navigation_labels}
      visibility={settings.section_visibility}
      settings={settings}
    >

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-50 blur-3xl opacity-70" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-slate-50 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:px-10">

          {/* Introduction */}
          <div className="lg:col-span-7">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-4 w-4" />
              Professional Portfolio
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Hello, I'm{' '}
              <span className="text-blue-700">
                {profile.show_nickname && profile.nickname
                  ? profile.nickname
                  : profile.full_name}
              </span>.
            </h1>

            <h2 className="mt-5 text-xl font-semibold leading-relaxed text-slate-700 sm:text-2xl">
              {profile.professional_title}
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              {profile.bio}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md"
              >
                Explore my projects
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                Discover my story
              </Link>

            </div>

            {profile.location && (
              <p className="mt-7 text-sm text-slate-500">
                {profile.location}
              </p>
            )}

          </div>

          {/* Profile photograph */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">

            <div className="relative">

              <div className="absolute -inset-3 rounded-3xl border border-blue-100 rotate-3" />

              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="relative h-72 w-72 rounded-2xl border border-slate-200 bg-slate-50 object-cover shadow-xl sm:h-96 sm:w-96"
                />
              ) : (
                <div className="relative flex h-72 w-72 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-7xl font-bold text-blue-700 sm:h-96 sm:w-96">
                  {profile.full_name.charAt(0)}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* PROFESSIONAL AREAS */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Professional expertise
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              A multidisciplinary professional journey
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              My work spans technology, research, education and community
              development. Explore the different areas of my professional
              experience and interests.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {professionalAreas.map(area => {
              const Icon = area.icon

              return (
                <Link
                  key={area.title}
                  href={area.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {area.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                    Explore area
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>

                </Link>
              )
            })}

          </div>

        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="bg-white py-20 md:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                  Selected work
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                  Featured Projects
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-slate-600">
                  A selection of projects, digital products and practical
                  solutions.
                </p>

              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
              >
                View all projects
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

            <div className={`mt-10 grid gap-6 ${
              featuredProjects.length === 1
                ? 'grid-cols-1 max-w-2xl mx-auto'
                : featuredProjects.length === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>

              {featuredProjects.map(project => (

                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >

                  {project.image_url ? (
                    <div className="aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-slate-50">
                      <FolderGit2 className="h-12 w-12 text-blue-200" />
                    </div>
                  )}

                  <div className="p-6">

                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {project.category}
                    </p>

                    <h3 className="mt-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {project.short_description}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                      View project
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>

                  </div>

                </Link>

              ))}

            </div>

          </div>
        </section>
      )}

      {/* PROFESSIONAL SNAPSHOT */}
      <section className="border-y border-slate-100 bg-slate-50 py-16 md:py-20">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              At a glance
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Professional snapshot
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Sparkles className="h-5 w-5" />
              </div>

              <p className="mt-5 text-4xl font-bold text-slate-950">
                {skills.length}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Published skills
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FolderGit2 className="h-5 w-5" />
              </div>

              <p className="mt-5 text-4xl font-bold text-slate-950">
                {projects.length}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Published projects
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <p className="mt-5 text-4xl font-bold text-slate-950">
                {experiences.length}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Professional experiences
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* CONTACT INVITATION */}
      <section className="bg-white py-20 md:py-24">

        <div className="mx-auto max-w-4xl px-5 text-center">

          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Let's connect
          </span>

          <h2 className="mt-6 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Interested in working together?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
            Explore my work, share an opportunity or get in touch to discuss
            a collaboration.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-md"
          >
            Contact me
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

    </PublicPageShell>
  )
}
