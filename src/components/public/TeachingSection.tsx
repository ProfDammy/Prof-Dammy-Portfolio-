
import type { TeachingMentorship } from '@/types/database'
import { GraduationCap, Users, BookOpen } from 'lucide-react'

interface TeachingSectionProps {
  teaching: TeachingMentorship[]
}

export function TeachingSection({ teaching }: TeachingSectionProps) {
  return (
    <section id="teaching" className="bg-white py-12 md:py-14">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
              <GraduationCap className="h-4 w-4" />
              KNOWLEDGE SHARING
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Teaching, Training &amp; Mentorship
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Supporting learning, developing practical skills and empowering
            individuals through knowledge sharing and mentorship.
          </p>
        </div>

        {teaching.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teaching.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <BookOpen className="h-5 w-5 text-blue-700" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-6 text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-blue-700">
                      {item.organization}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.role}
                      {item.period && ` · ${item.period}`}
                    </p>
                  </div>
                </div>

                {item.summary && (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {item.summary}
                  </p>
                )}

                {item.impact_highlights?.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {item.impact_highlights.map((highlight, index) => (
                      <li
                        key={`${item.id}-highlight-${index}`}
                        className="flex items-start gap-2 text-xs leading-5 text-slate-600"
                      >
                        <span className="mt-0.5 font-bold text-blue-600">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.students_impacted > 0 && (
                  <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>
                      <strong className="text-slate-900">
                        {item.students_impacted.toLocaleString()}
                      </strong>{' '}
                      learners impacted
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
            Teaching and mentorship experiences will appear here.
          </p>
        )}
      </div>
    </section>
  )
}
