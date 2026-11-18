
import React from 'react'
import type { Profile } from '@/types/database'
import { UserRound } from 'lucide-react'

interface AboutSectionProps {
  profile: Profile
}

export function AboutSection({ profile }: AboutSectionProps) {
  const biography =
    profile.detailed_about ||
    profile.bio ||
    'Biography information is currently unavailable.'

  return (
    <section id="about" className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">

        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <UserRound className="w-4 h-4" />
            Professional Biography
          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            About Me
          </h2>

          <p className="mt-4 text-base text-slate-600 leading-7">
            A closer look at my background, interests and professional journey.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 md:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="w-12 h-1 rounded-full bg-blue-700 mb-7" />

            <p className="text-base sm:text-lg leading-8 text-slate-700 whitespace-pre-line">
              {biography}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
