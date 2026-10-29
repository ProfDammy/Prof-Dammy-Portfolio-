'use client'

import React from 'react'
import { Profile, SiteSettings } from '@/types/database'
import { ArrowRight, Download, BarChart2, Cpu, GraduationCap, Award } from 'lucide-react'

interface HeroSectionProps {
  profile: Profile
  settings: SiteSettings
}

export function HeroSection({ profile, settings }: HeroSectionProps) {
  const headline = settings.custom_headline || 'Transforming Data into Intelligence & Empowering Next-Gen Innovators'
  const subtitle = settings.custom_subtitle || profile.professional_title
  const primaryCtaText = settings.primary_cta_text || 'Explore Projects'
  const primaryCtaLink = settings.primary_cta_link || '#projects'
  const secondaryCtaText = settings.secondary_cta_text || 'Download CV'
  const secondaryCtaLink = profile.cv_url || '#cv'

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-slate-950 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide">
              Instructor @ SQI College of ICT & Founder @ Creative Thinkers Forum
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {headline}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              {subtitle}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={primaryCtaLink}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group text-base"
              >
                {primaryCtaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={secondaryCtaLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Download className="w-5 h-5 text-blue-400" />
                {secondaryCtaText}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden bg-slate-800">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt={profile.full_name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
