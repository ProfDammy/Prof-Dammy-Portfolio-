'use client'

import React, { useState, useMemo } from 'react'
import { Project } from '@/types/database'
import { FolderGit2, Search, ExternalLink, Code2, CheckCircle, Clock, Sparkles } from 'lucide-react'

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)))
    return ['All', ...cats]
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [projects, searchQuery, selectedCategory, selectedStatus])

  return (
    <section id="projects" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <FolderGit2 className="w-3.5 h-3.5" />
            Portfolio Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Featured Projects & Solutions
          </h2>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-10 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>Category: {cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200 text-sm"
              >
                <option value="All">Status: All Projects</option>
                <option value="completed">Status: Completed</option>
                <option value="in_progress">Status: In Progress</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'completed' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
                {project.is_featured && <Sparkles className="w-4 h-4 text-amber-400" />}
              </div>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-sm text-slate-400">{project.short_description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
