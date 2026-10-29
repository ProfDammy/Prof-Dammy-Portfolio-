'use client'

import React, { useState } from 'react'
import { Skill } from '@/types/database'
import { mockSkills } from '@/lib/mockData'
import { Wrench } from 'lucide-react'

export default function AdminSkillsPage() {
  const [skills] = useState<Skill[]>(mockSkills)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Wrench className="w-6 h-6 text-blue-500" />
        Skills Manager
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
