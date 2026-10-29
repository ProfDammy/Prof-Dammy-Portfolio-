'use client'

import React, { useState } from 'react'
import { LeadershipCommunity } from '@/types/database'
import { mockLeadershipCommunity } from '@/lib/mockData'
import { Users2 } from 'lucide-react'

export default function AdminLeadershipPage() {
  const [leadership] = useState<LeadershipCommunity[]>(mockLeadershipCommunity)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Users2 className="w-6 h-6 text-blue-500" />
        Leadership & Community Forum Manager
      </h1>
      <div className="space-y-4">
        {leadership.map((l) => (
          <div key={l.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{l.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
