'use client'

import React from 'react'
import Link from 'next/link'
import { FolderGit2, Briefcase, Wrench, GraduationCap, BookOpen, Trophy } from 'lucide-react'
import { mockProjects, mockExperiences, mockSkills, mockTeachingMentorship, mockPublications, mockAchievements } from '@/lib/mockData'

export default function AdminDashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Welcome back, Prof Dammy!</h1>
        <p className="text-slate-300 text-sm">Content Management System Portal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-3xl font-bold text-white">{mockProjects.length}</p>
          <p className="text-xs text-slate-400">Projects</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-3xl font-bold text-white">{mockExperiences.length}</p>
          <p className="text-xs text-slate-400">Experiences</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-3xl font-bold text-white">{mockSkills.length}</p>
          <p className="text-xs text-slate-400">Skills</p>
        </div>
      </div>
    </div>
  )
}
