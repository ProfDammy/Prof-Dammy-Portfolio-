'use client'

import React from 'react'
import { LeadershipCommunity } from '@/types/database'
import { Users2 } from 'lucide-react'

interface LeadershipSectionProps {
  leadership: LeadershipCommunity[]
}

export function LeadershipSection({ leadership }: LeadershipSectionProps) {
  return (
    <section id="leadership" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Leadership & Community Impact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {leadership.map((item) => (
            <div key={item.id} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              <p className="text-sm text-blue-400 font-semibold">{item.role} • {item.organization}</p>
              <p className="text-slate-300 text-sm">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
