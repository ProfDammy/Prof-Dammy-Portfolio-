
'use client'

import React, { useMemo } from 'react'
import type { Skill } from '@/types/database'
import { Wrench, CheckCircle2 } from 'lucide-react'

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = useMemo(() => {
    return skills.reduce<Record<string, Skill[]>>((groups, skill) => {
      const category = skill.category || 'Other Skills'

      if (!groups[category]) {
        groups[category] = []
      }

      groups[category].push(skill)

      return groups
    }, {})
  }, [skills])

  const categories = Object.entries(groupedSkills)

  return (
    <section id="skills" className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Wrench className="w-4 h-4" />
            Core Competencies
          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-slate-950">
            Skills & Areas of Expertise
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-8">
            A range of practical skills, tools and capabilities developed
            through professional work, learning and experience.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {categories.map(([category, categorySkills]) => (
              <article
                key={category}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 transition-all duration-300 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Wrench className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {category}
                  </h3>
                </div>

                <div className="space-y-5">
                  {categorySkills.map(skill => (
                    <div key={skill.id} className="flex items-start gap-3">

                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <p className="font-semibold text-slate-800">
                            {skill.name}
                          </p>

                          {skill.proficiency_level !== null && (
                            <span className="text-xs font-medium text-slate-500">
                              {skill.proficiency_level}%
                            </span>
                          )}
                        </div>

                        {skill.description && (
                          <p className="text-sm text-slate-600 leading-6 mt-1">
                            {skill.description}
                          </p>
                        )}

                        {skill.proficiency_level !== null && (
                          <div
                            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                            role="progressbar"
                            aria-label={`${skill.name} proficiency`}
                            aria-valuenow={skill.proficiency_level}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, skill.proficiency_level)
                                )}%`
                              }}
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </article>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-4" />

            <h3 className="font-semibold text-slate-900">
              Skills are being updated
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
