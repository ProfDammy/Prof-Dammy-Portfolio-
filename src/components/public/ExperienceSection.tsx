'use client'

import React from 'react'
import { Experience } from '@/types/database'
import { Briefcase } from 'lucide-react'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            Career History
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Professional Experience
          </h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white">{exp.title}</h3>
              <p className="text-sm text-blue-400 font-semibold">{exp.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
