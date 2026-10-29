'use client'

import React, { useState } from 'react'
import { Project } from '@/types/database'
import { mockProjects } from '@/lib/mockData'
import { FolderGit2 } from 'lucide-react'

export default function AdminProjectsPage() {
  const [projects] = useState<Project[]>(mockProjects)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <FolderGit2 className="w-6 h-6 text-blue-500" />
        Projects Manager
      </h1>
      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{proj.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
