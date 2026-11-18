
'use client'

import React from 'react'
import { Profile, SiteSettings } from '@/types/database'
import { ArrowRight, Download, Sparkles } from 'lucide-react'

interface HeroSectionProps {
  profile: Profile
  settings: SiteSettings
}

export function HeroSection({ profile, settings }: HeroSectionProps) {
  const headline =
    settings.custom_headline?.trim() ||
    'Building solutions. Transforming ideas into impact.'

  const subtitle =
    settings.custom_subtitle?.trim() ||
    profile.bio ||
    'I work across data analytics, artificial intelligence, software solutions, research, education and community development.'

  const primaryCtaText =
    settings.primary_cta_text || 'Explore My Work'

  const primaryCtaLink =
    settings.primary_cta_link || '#projects'

  const secondaryCtaText =
    settings.secondary_cta_text || 'Get in Touch'

  const secondaryCtaLink =
    settings.secondary_cta_link || '#contact'

  const initials = profile.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')

  const hasPortrait = Boolean(profile.avatar_url)

  return (
    <section
      id="hero"
      className="bg-white pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Introduction */}
          <div className="lg:col-span-7 space-y-7">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>
                Data · Technology · Research · Education · Leadership
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-slate-500 font-medium">
                Hello, I'm
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12]">
                {profile.full_name}
              </h1>

              {profile.show_nickname && profile.nickname && (
                <p className="text-blue-700 font-semibold text-lg">
                  Also known as {profile.nickname}
                </p>
              )}

              <h2 className="text-xl sm:text-2xl text-blue-700 font-semibold leading-relaxed">
                {profile.professional_title}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-8 max-w-2xl">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={primaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {primaryCtaText}
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                {secondaryCtaText}
              </a>

              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  View CV
                </a>
              )}
            </div>

            {profile.location && (
              <p className="text-sm text-slate-500 pt-2">
                Based in {profile.location}
              </p>
            )}
          </div>

          {/* Professional portrait */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[390px]">

              <div className="absolute -inset-4 rounded-3xl bg-blue-50 -z-10" />

              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {hasPortrait ? (
                  <img
                    src={profile.avatar_url!}
                    alt={`Portrait of ${profile.full_name}`}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-5xl font-bold">
                      {initials || 'D'}
                    </div>

                    <div className="text-center px-6">
                      <p className="text-lg font-semibold text-slate-800">
                        {profile.full_name}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Professional portrait can be uploaded through the admin dashboard.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-5 left-5 right-5 bg-white border border-slate-200 shadow-lg rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Multidisciplinary Professional
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Analytics · Innovation · Research · Impact
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
