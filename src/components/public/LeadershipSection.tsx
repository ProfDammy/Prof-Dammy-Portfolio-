
'use client'

import type { LeadershipCommunity } from '@/types/database'
import { Users2, Award } from 'lucide-react'

interface LeadershipSectionProps {
  leadership: LeadershipCommunity[]
}

export function LeadershipSection({ leadership }: LeadershipSectionProps) {
  return (
    <section id="leadership" className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Users2 className="h-4 w-4" />
            LEADERSHIP &amp; SERVICE
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
            Leadership &amp; Community Impact
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Building communities, creating opportunities and contributing
            to meaningful social and professional development.
          </p>
        </div>

        {leadership.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {leadership.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-200 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Users2 className="h-6 w-6 text-blue-700" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-bold leading-7 text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 font-semibold text-blue-700">
                      {item.organization}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.role}
                      {item.period && ` · ${item.period}`}
                    </p>
                  </div>
                </div>

                {item.summary && (
                  <p className="mt-6 leading-7 text-slate-600">
                    {item.summary}
                  </p>
                )}

                {item.achievements?.length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Award className="h-4 w-4 text-blue-600" />
                      Contributions &amp; Achievements
                    </h4>

                    <ul className="space-y-3">
                      {item.achievements.map((achievement, index) => (
                        <li
                          key={`${item.id}-achievement-${index}`}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                        >
                          <span className="mt-0.5 font-bold text-blue-600">
                            ✓
                          </span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
            Leadership and community experiences will appear here.
          </p>
        )}
      </div>
    </section>
  )
}
