'use client'

import React, { useState } from 'react'
import { Achievement } from '@/types/database'
import { mockAchievements } from '@/lib/mockData'
import { Trophy } from 'lucide-react'

export default function AdminAchievementsPage() {
  const [achievements] = useState<Achievement[]>(mockAchievements)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Trophy className="w-6 h-6 text-amber-400" />
        Achievements Manager
      </h1>
      <div className="space-y-4">
        {achievements.map((a) => (
          <div key={a.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{a.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
