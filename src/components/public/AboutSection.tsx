'use client'

import React from 'react'
import { Profile } from '@/types/database'
import { User } from 'lucide-react'

interface AboutSectionProps {
  profile: Profile
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <User className="w-3.5 h-3.5" />
            Professional Biography
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            About Prof Dammy
          </h2>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-8 rounded-2xl space-y-6">
          <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
            {profile.detailed_about || profile.bio}
          </p>
        </div>
      </div>
    </section>
  )
}
