
import {
  BookOpen,
  ExternalLink,
  FileText,
  CalendarDays,
  Users,
} from 'lucide-react'
import type { Publication } from '@/types/database'

interface ResearchSectionProps {
  publications: Publication[]
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

function getPublicationUrl(value: string) {
  const trimmed = value.trim()

  if (/^https?:\/\//i.test(trimmed)) return trimmed

  if (/^doi:/i.test(trimmed)) {
    return `https://doi.org/${trimmed.replace(/^doi:\s*/i, '')}`
  }

  if (/^10\.\d{4,9}\//.test(trimmed)) {
    return `https://doi.org/${trimmed}`
  }

  return `https://${trimmed}`
}

export function ResearchSection({ publications }: ResearchSectionProps) {
  return (
    <section id="publications" className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <BookOpen className="h-4 w-4" />
            RESEARCH &amp; SCHOLARSHIP
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
            Research &amp; Publications
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Academic research, scholarly contributions, articles, theses,
            and technical publications.
          </p>
        </div>

        {publications.length > 0 ? (
          <div className="space-y-6">
            {publications.map((publication) => (
              <article
                key={publication.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {publication.publication_type.replace(/_/g, ' ')}
                  </span>

                  {publication.publication_date && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(publication.publication_date)}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-bold leading-8 text-slate-900 sm:text-2xl">
                  {publication.title}
                </h3>

                {publication.publisher_or_journal && (
                  <p className="mt-2 font-medium text-blue-700">
                    {publication.publisher_or_journal}
                  </p>
                )}

                {publication.authors?.length > 0 && (
                  <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <p>
                      <span className="font-semibold text-slate-800">
                        Authors:
                      </span>{' '}
                      {publication.authors.join(', ')}
                    </p>
                  </div>
                )}

                {publication.abstract && (
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <h4 className="mb-2 text-sm font-semibold text-slate-800">
                      Abstract / Summary
                    </h4>

                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {publication.abstract}
                    </p>
                  </div>
                )}

                {publication.doi_or_url && (
                  <a
                    href={getPublicationUrl(publication.doi_or_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
                  >
                    <FileText className="h-4 w-4" />
                    View publication
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No publications available yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Research and academic contributions will appear here when published.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
