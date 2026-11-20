'use client'

import { useEffect, useMemo, useState } from 'react'
import { Manrope, Inter } from 'next/font/google'
import { supabase } from '@/lib/supabaseClient'
import { Quote, Star } from 'lucide-react'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const TESTIMONIAL_CATEGORIES = [
  'Solutions & Technology',
  'Projects & Collaboration',
  'Research & Academic',
  'Teaching & Mentorship',
  'Leadership & Community',
  'Professional Excellence',
  'Other',
] as const

type Testimonial = {
  id: string
  client_name: string
  professional_title: string | null
  organization: string | null
  relationship: string | null
  location: string | null
  category: string
  message: string
  photo_url: string | null
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const details = [
    item.organization,
    item.relationship,
    item.location,
  ].filter((value): value is string => Boolean(value?.trim()))

  const displayName = [item.professional_title, item.client_name]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ')

  return (
    <article className="flex min-h-[240px] w-[min(88vw,380px)] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:w-[380px] sm:p-6">
      <Quote aria-hidden="true" className="h-6 w-6 shrink-0 text-blue-200" />

      <p className="testimonial-body mt-3 whitespace-normal break-words text-[15px] leading-7 text-slate-700 sm:text-base">
        “{item.message}”
      </p>

      <div className="mt-5 flex items-start gap-3 border-t border-slate-100 pt-4">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt=""
            loading="lazy"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700"
          >
            {item.client_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="testimonial-heading whitespace-normal break-words text-sm font-bold leading-5 text-slate-900">
            {displayName}
          </p>

          {details.length > 0 && (
            <div className="testimonial-body mt-1 space-y-0.5 text-xs leading-5 text-slate-500">
              {details.map((detail, index) => (
                <p key={`${item.id}-detail-${index}`} className="whitespace-normal break-words">
                  {detail}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function MarqueeRow({
  items,
  reverse = false,
  duration,
}: {
  items: Testimonial[]
  reverse?: boolean
  duration: number
}) {
  if (items.length === 0) return null

  return (
    <div className="testimonial-marquee relative overflow-hidden">
      <div
        className={`testimonial-marquee-track flex w-max items-stretch gap-4 py-2 ${
          reverse ? 'testimonial-marquee-reverse' : ''
        }`}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-stretch gap-4 pr-4">
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

        <div aria-hidden="true" className="flex shrink-0 items-stretch gap-4 pr-4">
          {items.map((item, index) => (
            <TestimonialCard key={`${item.id}-loop-${index}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    let alive = true

    const load = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, client_name, professional_title, organization, relationship, location, category, message, photo_url')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('submitted_at', { ascending: false })

      if (!alive) return

      if (!error) {
        setItems(
          (data || []).map((item) => ({
            ...item,
            category: item.category || 'Other',
          })) as Testimonial[],
        )
      }

      setLoading(false)
    }

    void load()

    return () => {
      alive = false
    }
  }, [])

  const availableCategories = useMemo(
    () =>
      TESTIMONIAL_CATEGORIES.filter((category) =>
        items.some((item) => item.category === category),
      ),
    [items],
  )

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory)

  const hasTwoRows = filteredItems.length >= 4
  const firstRow = hasTwoRows
    ? filteredItems.filter((_, index) => index % 2 === 0)
    : filteredItems
  const secondRow = hasTwoRows
    ? filteredItems.filter((_, index) => index % 2 === 1).reverse()
    : []

  return (
    <section
      id="testimonials"
      className={`${manrope.variable} ${inter.variable} testimonial-section overflow-hidden bg-slate-50/70 py-16 md:py-20`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl px-5 text-center sm:px-8">
          <span className="testimonial-body inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Star className="h-4 w-4" /> Testimonials
          </span>

          <h2 className="testimonial-heading mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {selectedCategory === 'All' ? 'What people say' : selectedCategory}
          </h2>

          <p className="testimonial-body mt-4 text-base leading-7 text-slate-600">
            Feedback and experiences shared by people I've had the opportunity to work with.
          </p>
        </div>

        {!loading && items.length > 0 && (
          <div
            className="testimonial-body mb-8 flex flex-wrap justify-center gap-2 px-5 sm:px-8"
            aria-label="Filter testimonials by category"
          >
            {['All', ...availableCategories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  selectedCategory === category
                    ? 'border-blue-700 bg-blue-700 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="testimonial-body px-5 py-10 text-center text-sm text-slate-500">
            Loading testimonials…
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            <MarqueeRow
              items={firstRow}
              duration={Math.max(28, firstRow.length * 9)}
            />

            {hasTwoRows && (
              <MarqueeRow
                items={secondRow}
                reverse
                duration={Math.max(32, secondRow.length * 10)}
              />
            )}
          </div>
        ) : (
          <div className="testimonial-body mx-5 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 sm:mx-8">
            {items.length === 0
              ? 'Testimonials will appear here as they are approved.'
              : 'There are no approved testimonials in this category yet.'}
          </div>
        )}
      </div>

      <style jsx global>{`
        .testimonial-section .testimonial-heading {
          font-family: var(--font-manrope), 'Manrope', system-ui, sans-serif;
        }

        .testimonial-section .testimonial-body {
          font-family: var(--font-inter), 'Inter', system-ui, sans-serif;
        }

        .testimonial-marquee-track {
          animation: testimonial-marquee-left var(--marquee-duration, 36s) linear infinite;
          will-change: transform;
        }

        .testimonial-marquee-reverse {
          animation-name: testimonial-marquee-right;
        }

        .testimonial-marquee:hover .testimonial-marquee-track,
        .testimonial-marquee:focus-within .testimonial-marquee-track {
          animation-play-state: paused;
        }

        @keyframes testimonial-marquee-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes testimonial-marquee-right {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-marquee {
            overflow-x: auto;
            scrollbar-width: thin;
          }

          .testimonial-marquee-track,
          .testimonial-marquee-reverse {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
