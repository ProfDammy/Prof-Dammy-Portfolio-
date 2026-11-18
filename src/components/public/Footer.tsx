
'use client'
import { useEffect, useState } from "react"
import Link from 'next/link'
import type { Profile, SiteSettings } from '@/types/database'
import {
  Mail,
  Phone,
  MessageCircle,
  Shield,
  ArrowUp,
} from 'lucide-react'
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa'

interface FooterProps {
  profile?: Profile
  settings?: SiteSettings
}

export function Footer({ profile, settings }: FooterProps) {
  const [year, setYear] = useState<number | null>(null)

useEffect(() => {
  setYear(new Date().getFullYear())
}, [])

  const displayName =
    profile?.show_nickname && profile?.nickname
      ? profile.nickname
      : profile?.full_name || 'Damilola Oluwagbamila'

  const socialLinks = profile?.social_links || {}

  const socials = [
    { key: 'linkedin', label: 'LinkedIn', url: socialLinks.linkedin, Icon: FaLinkedin },
    { key: 'github', label: 'GitHub', url: socialLinks.github, Icon: FaGithub },
    { key: 'facebook', label: 'Facebook', url: socialLinks.facebook, Icon: FaFacebook },
    { key: 'instagram', label: 'Instagram', url: socialLinks.instagram, Icon: FaInstagram },
    { key: 'youtube', label: 'YouTube', url: socialLinks.youtube, Icon: FaYoutube },
  ].filter((item) => item.url)

  const email = profile?.contact_email?.trim()
  const phone = profile?.contact_phone?.trim()

  const phoneDigits = phone?.replace(/\D/g, '') || ''

  const whatsappNumber = phoneDigits
    ? phoneDigits.startsWith('0')
      ? `234${phoneDigits.slice(1)}`
      : phoneDigits
    : ''

  const footerText =
    settings?.footer_content ||
    `© ${year ?? ""} ${profile?.full_name || 'Damilola Oluwagbamila'}. All rights reserved.`

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">

        {/* Identity and social platforms */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <Link href="/" className="flex w-fit items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              PD
            </span>

            <span className="text-sm font-bold text-slate-900">
              {displayName}
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {socials.map(({ key, label, url, Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact and professional positioning */}
        <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-blue-700"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <span>{email}</span>
              </a>
            )}

            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-blue-700"
              >
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{phone}</span>
              </a>
            )}

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-blue-700"
              >
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-blue-700"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin Portal
            </Link>

            <a
              href="#top"
              aria-label="Back to top"
              title="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-700"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-center text-[11px] text-slate-400 sm:text-left">
            {footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}
