
'use client'

import type { Education, Certification } from '@/types/database'
import { GraduationCap, Award, ExternalLink } from 'lucide-react'

interface EducationSectionProps {
  education: Education[]
  certifications: Certification[]
}

function formatIssueDate(date: string) {
  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function EducationSection({
  education,
  certifications,
}: EducationSectionProps) {
  return (
    <section id="education" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <GraduationCap className="h-4 w-4" />
            ACADEMIC BACKGROUND
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
            Education &amp; Certifications
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Academic qualifications, professional learning and continuous
            development.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          {/* Academic Education */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <GraduationCap className="h-5 w-5 text-blue-700" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Academic Education
              </h3>
            </div>

            {education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu) => (
                  <article
                    key={edu.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-200"
                  >
                    <h4 className="text-lg font-bold text-slate-900">
                      {edu.degree}
                    </h4>

                    <p className="mt-2 font-semibold text-blue-700">
                      {edu.field_of_study}
                    </p>

                    <p className="mt-2 text-slate-600">
                      {edu.institution}
                    </p>

                    {edu.location && (
                      <p className="mt-1 text-sm text-slate-500">
                        {edu.location}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-slate-500">
                      {edu.start_year} –{' '}
                      {edu.is_current
                        ? 'Present'
                        : edu.end_year ?? 'Not specified'}
                    </p>

                    {edu.grade_or_honors && (
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        {edu.grade_or_honors}
                      </p>
                    )}

                    {edu.activities && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {edu.activities}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
                Academic qualifications will appear here.
              </p>
            )}
          </div>

          {/* Certifications */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Award className="h-5 w-5 text-blue-700" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Certifications
              </h3>
            </div>

            {certifications.length > 0 ? (
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <article
                    key={cert.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-200"
                  >
                    <h4 className="text-lg font-bold text-slate-900">
                      {cert.title}
                    </h4>

                    <p className="mt-2 font-semibold text-blue-700">
                      {cert.issuing_organization}
                    </p>

                    {cert.issue_date && (
                      <p className="mt-3 text-sm text-slate-500">
                        Issued: {formatIssueDate(cert.issue_date)}
                      </p>
                    )}

                    {cert.expiration_date && (
                      <p className="mt-1 text-sm text-slate-500">
                        Expires: {formatIssueDate(cert.expiration_date)}
                      </p>
                    )}

                    {cert.credential_id && (
                      <p className="mt-2 text-xs text-slate-500">
                        Credential ID: {cert.credential_id}
                      </p>
                    )}

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
                      >
                        View credential
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
                Professional certifications will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
