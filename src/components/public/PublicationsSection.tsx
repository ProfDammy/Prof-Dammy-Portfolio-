'use client'

import React from 'react'
import { Publication, Achievement } from '@/types/database'
import { BookOpen, Trophy } from 'lucide-react'

interface PublicationsSectionProps {
  publications: Publication[]
  achievements: Achievement[]
}

export function PublicationsSection({ publications, achievements }: PublicationsSectionProps) {
  return (
    <section id="publications" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-3xl font-bold text-white">Publications, Research & Honors</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">Research Publications</h3>
            {publications.map((pub) => (
              <div key={pub.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="text-lg font-bold text-white">{pub.title}</h4>
                <p className="text-xs text-slate-400">{pub.publisher_or_journal}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400">Honors & Achievements</h3>
            {achievements.map((ach) => (
              <div key={ach.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="text-lg font-bold text-white">{ach.title}</h4>
                <p className="text-xs text-slate-400">{ach.issuer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
