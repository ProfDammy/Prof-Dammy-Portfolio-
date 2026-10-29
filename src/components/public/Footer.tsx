'use client'

import React from 'react'
import Link from 'next/link'
import { Profile, SiteSettings } from '@/types/database'
import { Mail, MapPin, Phone, Shield, Globe } from 'lucide-react'

interface FooterProps {
  profile?: Profile
  settings?: SiteSettings
}

export function Footer({ profile, settings }: FooterProps) {
  const social = profile?.social_links || {}
  const footerText = settings?.footer_content || '© Damilola Miracle Oluwagbamila (Prof Dammy). All rights reserved.'

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                PD
              </div>
              <span className="text-xl font-bold text-white">Damilola Miracle Oluwagbamila</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {profile?.bio ||
                'Data Analytics Instructor, AI Solutions Developer, Academic Researcher, and Founder of Creative Thinkers Forum.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-white transition-colors">Skills & Tech Stack</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Featured Projects</a></li>
              <li><a href="#teaching" className="hover:text-white transition-colors">Teaching & Mentorship</a></li>
              <li><a href="#publications" className="hover:text-white transition-colors">Research & Publications</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Direct Contact</h3>
            <ul className="space-y-3 text-sm">
              {profile?.contact_email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a href={`mailto:${profile.contact_email}`} className="hover:text-white transition-colors">
                    {profile.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-slate-300 flex items-center gap-1 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
