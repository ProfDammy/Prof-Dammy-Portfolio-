'use client'

import React, { useState } from 'react'
import { Experience } from '@/types/database'
import { mockExperiences } from '@/lib/mockData'
import { Briefcase } from 'lucide-react'

export default function AdminExperiencePage() {
  const [experiences] = useState<Experience[]>(mockExperiences)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-blue-500" />
        Experience Manager
      </h1>
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{exp.title}</p>
            <p className="text-xs text-blue-400">{exp.company}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
