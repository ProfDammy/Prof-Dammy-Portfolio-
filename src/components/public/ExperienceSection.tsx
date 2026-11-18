
'use client'

import React from 'react'
import type { Experience } from '@/types/database'
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin
} from 'lucide-react'

interface ExperienceSectionProps {
  experiences: Experience[]
}

function formatDate(value: string) {
  if (!value) return ''

  const date = new Date(`${value.slice(0, 10)}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">

        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <BriefcaseBusiness className="w-4 h-4" />
            Career Journey
          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-slate-950">
            Professional Experience
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-8">
            Roles, responsibilities and experiences that have shaped my
            professional journey.
          </p>
        </div>

        {experiences.length > 0 ? (
          <div className="relative space-y-7">

            {experiences.map((exp, index) => (
              <article
                key={exp.id}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-md"
              >

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-950">
                      {exp.title}
                    </h3>

                    <p className="text-blue-700 font-semibold mt-2">
                      {exp.company}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shrink-0">
                    <CalendarDays className="w-4 h-4 text-blue-600" />

                    {formatDate(exp.start_date)}
                    {' – '}
                    {exp.is_current
                      ? 'Present'
                      : exp.end_date
                        ? formatDate(exp.end_date)
                        : 'Not specified'}
                  </span>

                </div>

                <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-500">

                  {exp.employment_type && (
                    <span className="rounded-md bg-slate-50 px-3 py-1.5">
                      {exp.employment_type}
                    </span>
                  )}

                  {exp.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-3 py-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {exp.location}
                    </span>
                  )}

                </div>

                {exp.description?.length > 0 && (
                  <ul className="mt-6 space-y-3">

                    {exp.description.map((item, itemIndex) => (
                      <li
                        key={`${exp.id}-description-${itemIndex}`}
                        className="flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 shrink-0" />

                        <span className="text-slate-700 leading-7">
                          {item}
                        </span>
                      </li>
                    ))}

                  </ul>
                )}

                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">

                    {exp.technologies.map(technology => (
                      <span
                        key={technology}
                        className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-3 py-2 rounded-md"
                      >
                        {technology}
                      </span>
                    ))}

                  </div>
                )}

              </article>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
            <BriefcaseBusiness className="w-10 h-10 text-slate-300 mx-auto mb-4" />

            <h3 className="font-semibold text-slate-900">
              Experience information is being updated
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Please check back soon.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
