'use client'

import { useEffect, useState } from 'react'
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

type Testimonial = {
  id: string
  client_name: string
  professional_title: string | null
  organization: string | null
  relationship: string | null
  message: string
  photo_url: string | null
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const details = [
    item.professional_title,
    item.organization,
    item.relationship,
  ].filter(Boolean)

  return (
    <article className="flex h-[220px] w-[min(82vw,320px)] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:w-[320px] sm:p-6">
      <Quote aria-hidden="true" className="h-6 w-6 shrink-0 text-blue-200" />

      <p className="testimonial-body mt-3 line-clamp-4 min-h-[5.5rem] text-[15px] leading-7 text-slate-700 sm:text-base">
        “{item.message}”
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
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

        <div className="min-w-0">
          <p className="testimonial-heading truncate text-sm font-bold text-slate-900">
            {item.client_name}
          </p>
          {details.length > 0 && (
            <p className="testimonial-body mt-1 line-clamp-1 text-xs text-slate-500">
              {details.join(' · ')}
            </p>
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
        className={`testimonial-marquee-track flex w-max gap-4 py-2 ${
          reverse ? 'testimonial-marquee-reverse' : ''
        }`}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 gap-4 pr-4">
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

        <div aria-hidden="true" className="flex shrink-0 gap-4 pr-4">
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

  useEffect(() => {
    let alive = true

    const load = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, client_name, professional_title, organization, relationship, message, photo_url')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('submitted_at', { ascending: false })

      if (!alive) return
      if (!error) setItems((data || []) as Testimonial[])
      setLoading(false)
    }

    load()

    return () => {
      alive = false
    }
  }, [])

  const hasTwoRows = items.length >= 4
  const firstRow = hasTwoRows
    ? items.filter((_, index) => index % 2 === 0)
    : items
  const secondRow = hasTwoRows
    ? items.filter((_, index) => index % 2 === 1).reverse()
    : []

  return (
    <section
      id="testimonials"
      className={`${manrope.variable} ${inter.variable} testimonial-section overflow-hidden bg-slate-50/70 py-16 md:py-20`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl px-5 text-center sm:px-8">
          <span className="testimonial-body inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Star className="h-4 w-4" /> Testimonials
          </span>

          <h2 className="testimonial-heading mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            What people say
          </h2>

          <p className="testimonial-body mt-4 text-base leading-7 text-slate-600">
            Feedback and experiences shared by people I've had the opportunity to work with.
          </p>
        </div>

        {loading ? (
          <div className="testimonial-body px-5 py-10 text-center text-sm text-slate-500">
            Loading testimonials…
          </div>
        ) : items.length > 0 ? (
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
            Testimonials will appear here as they are approved.
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
