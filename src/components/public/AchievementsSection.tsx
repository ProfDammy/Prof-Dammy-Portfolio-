
import { Award, CalendarDays, Trophy } from 'lucide-react'
import type { Achievement } from '@/types/database'

interface AchievementsSectionProps {
  achievements: Achievement[]
}

function formatDate(value: string) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  return (
    <section id="achievements" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Trophy className="h-4 w-4" />
            MILESTONES &amp; RECOGNITION
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
            Achievements &amp; Recognition
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Awards, professional recognitions, milestones, and notable accomplishments.
          </p>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <article
                key={achievement.id}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Award className="h-6 w-6 text-blue-700" />
                </div>

                {achievement.category && (
                  <div className="mb-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                      {achievement.category.replace(/[_-]/g, ' ')}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold leading-7 text-slate-900">
                  {achievement.title}
                </h3>

                {achievement.issuer && (
                  <p className="mt-2 text-sm font-semibold text-blue-700">
                    {achievement.issuer}
                  </p>
                )}

                {achievement.description && (
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                    {achievement.description}
                  </p>
                )}

                {achievement.award_date && (
                  <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(achievement.award_date)}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <Trophy className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No achievements available yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Awards, recognitions, and milestones will appear here when published.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
