'use client'

import React, { useState } from 'react'
import { TeachingMentorship } from '@/types/database'
import { mockTeachingMentorship } from '@/lib/mockData'
import { GraduationCap } from 'lucide-react'

export default function AdminTeachingPage() {
  const [teaching] = useState<TeachingMentorship[]>(mockTeachingMentorship)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-blue-500" />
        Teaching & Mentorship Manager
      </h1>
      <div className="space-y-4">
        {teaching.map((t) => (
          <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{t.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
