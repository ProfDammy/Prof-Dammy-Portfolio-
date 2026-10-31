'use client'

import React, { useState, useEffect } from 'react'
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
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboardOverview() {
  const [counts, setCounts] = useState<Record<string, number>>({
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
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          proj,
          exp,
          sk,
          edu,
          cert,
          teach,
          lead,
          pub,
          ach,
          med
        ] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('experiences').select('id', { count: 'exact', head: true }),
          supabase.from('skills').select('id', { count: 'exact', head: true }),
          supabase.from('education').select('id', { count: 'exact', head: true }),
          supabase.from('certifications').select('id', { count: 'exact', head: true }),
          supabase.from('teaching_mentorship').select('id', { count: 'exact', head: true }),
          supabase.from('leadership_community').select('id', { count: 'exact', head: true }),
          supabase.from('publications').select('id', { count: 'exact', head: true }),
          supabase.from('achievements').select('id', { count: 'exact', head: true }),
          supabase.from('media_assets').select('id', { count: 'exact', head: true })
        ])

        setCounts({
          projects: proj.count || 0,
          experiences: exp.count || 0,
          skills: sk.count || 0,
          education: edu.count || 0,
          certifications: cert.count || 0,
          teaching: teach.count || 0,
          leadership: lead.count || 0,
          publications: pub.count || 0,
          achievements: ach.count || 0,
          media: med.count || 0
        })
      } catch (e) {
        console.error('Failed to load dashboard metrics:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  const modules = [
    { name: 'Profile & Bio', count: 'Active', href: '/admin/profile', icon: User, desc: 'Personal details, bio & contacts' },
    { name: 'Site Appearance', count: 'Live', href: '/admin/appearance', icon: Palette, desc: 'Themes, CTAs & section visibility' },
    { name: 'Projects', count: counts.projects, href: '/admin/projects', icon: FolderGit2, desc: 'Case studies & data tools' },
    { name: 'Experience', count: counts.experiences, href: '/admin/experience', icon: Briefcase, desc: 'Career roles & responsibilities' },
    { name: 'Skills', count: counts.skills, href: '/admin/skills', icon: Wrench, desc: 'Technical & pedagogical proficiencies' },
    { name: 'Education & Certs', count: counts.education + counts.certifications, href: '/admin/education', icon: GraduationCap, desc: 'Degrees & verified credentials' },
    { name: 'Teaching & Mentorship', count: counts.teaching, href: '/admin/teaching', icon: Award, desc: 'Courses, students impacted & pedagogy' },
    { name: 'Leadership & Forum', count: counts.leadership, href: '/admin/leadership', icon: Users2, desc: 'Creative Thinkers Forum initiatives' },
    { name: 'Publications & Research', count: counts.publications, href: '/admin/publications', icon: BookOpen, desc: 'Academic papers & research work' },
    { name: 'Achievements', count: counts.achievements, href: '/admin/achievements', icon: Trophy, desc: 'Awards, recognition & honors' },
    { name: 'Media & Documents', count: counts.media, href: '/admin/media', icon: ImageIcon, desc: 'CV vault & public asset storage' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" /> Authenticated Administrator
            </div>
            <h1 className="text-3xl font-extrabold text-white">Welcome back, Prof Dammy!</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Professional Portfolio Content Management System connected directly to your Supabase cloud database and storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          All 11 Content Management Sections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.name}
                href={mod.href}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {loading && typeof mod.count === 'number' ? '...' : mod.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    {mod.name}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
