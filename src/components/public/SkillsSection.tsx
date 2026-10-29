'use client'

import React from 'react'
import { Skill } from '@/types/database'
import { Wrench, BarChart3, Database, Code } from 'lucide-react'

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <Wrench className="w-3.5 h-3.5" />
            Core Competencies
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Skills & Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white">{skill.name}</h3>
              <p className="text-xs text-slate-400">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
