
'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Project } from '@/types/database'
import {
  FolderGit2,
  Search,
  ExternalLink,
  GitBranch,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react'

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Available project categories
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        projects
          .map(project => project.category)
          .filter(Boolean)
      )
    )

    return ['All', ...cats.sort()]
  }, [projects])

  // Search and filtering
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const query = searchQuery.toLowerCase().trim()

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.short_description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.technologies.some(technology =>
          technology.toLowerCase().includes(query)
        )

      const matchesCategory =
        selectedCategory === 'All' ||
        project.category === selectedCategory

      const matchesStatus =
        selectedStatus === 'All' ||
        project.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [projects, searchQuery, selectedCategory, selectedStatus])

  // Reset filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedStatus('All')
  }

  // Responsive grid based on the number of displayed projects
  const gridClass =
    filteredProjects.length === 1
      ? 'grid grid-cols-1 max-w-2xl mx-auto'
      : filteredProjects.length === 2
        ? 'grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <section id="projects" className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Search and filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 mb-10">

          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-blue-700" />

            <span className="text-sm font-semibold text-slate-800">
              Find a project
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Search input */}
            <div className="flex items-center gap-3 w-full px-3.5 rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">

              <Search className="w-5 h-5 shrink-0 text-slate-400" />

              <input
                type="search"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className="w-full min-w-0 py-3 bg-transparent border-0 outline-none ring-0 focus:ring-0 text-slate-800 text-sm placeholder:text-slate-400"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={event => setSelectedCategory(event.target.value)}
              aria-label="Filter projects by category"
              className="w-full px-3 py-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  Category: {category}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={event => setSelectedStatus(event.target.value)}
              aria-label="Filter projects by status"
              className="w-full px-3 py-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
            </select>

          </div>

          {/* Results count */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-4">

            <p className="text-sm text-slate-500">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>

            {(searchQuery !== '' ||
              selectedCategory !== 'All' ||
              selectedStatus !== 'All') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Clear filters
              </button>
            )}

          </div>
        </div>

        {/* Project cards */}
        {filteredProjects.length > 0 ? (

          <div className={`${gridClass} gap-6`}>

            {filteredProjects.map(project => (

              <article
                key={project.id}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >

                {/* Project image */}
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`View ${project.title} details`}
                  className="block aspect-video overflow-hidden bg-slate-100"
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <FolderGit2 className="w-12 h-12 text-blue-200" />
                    </div>
                  )}
                </Link>

                {/* Project information */}
                <div className="p-6 flex flex-col flex-1">

                  {/* Status and featured badge */}
                  <div className="flex items-center justify-between gap-3">

                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        project.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {project.status === 'completed'
                        ? 'Completed'
                        : 'In Progress'}
                    </span>

                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </span>
                    )}

                  </div>

                  {/* Category */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mt-5">
                    {project.category}
                  </p>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-blue-800 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>

                  {/* Short description */}
                  <p className="text-sm text-slate-600 leading-7 mt-3">
                    {project.short_description}
                  </p>

                  {/* Technologies */}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">

                      {project.technologies.map(technology => (
                        <span
                          key={technology}
                          className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-md"
                        >
                          {technology}
                        </span>
                      ))}

                    </div>
                  )}

                  {/* Project highlights */}
                  {project.metrics_highlights?.length > 0 && (
                    <ul className="mt-5 space-y-2">

                      {project.metrics_highlights.map((metric, index) => (
                        <li
                          key={`${project.id}-metric-${index}`}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{metric}</span>
                        </li>
                      ))}

                    </ul>
                  )}

                  {/* Project actions */}
                  <div className="mt-auto pt-6 flex flex-wrap items-center gap-4">

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      View details
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700"
                      >
                        Live demo
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}

                  </div>

                </div>
              </article>

            ))}

          </div>

        ) : (

          /* Empty state */
          <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-10 md:p-14">

            <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-slate-900">
              {projects.length === 0
                ? 'Projects are being updated'
                : 'No matching projects found'}
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              {projects.length === 0
                ? 'Please check back soon for project showcases.'
                : 'Try another search term or change your filters.'}
            </p>

            {projects.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Clear filters
              </button>
            )}

          </div>

        )}

      </div>
    </section>
  )
}
