
'use client'

import type { Profile } from '@/types/database'
import {
  Mail,
  MessageCircle,
  Phone,
  Send,
  MapPin,
  ExternalLink,
  GraduationCap,
  Globe,
} from 'lucide-react'

import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa'

interface ContactSectionProps {
  profile: Profile
}

const socialPlatforms = [
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'github', label: 'GitHub', icon: FaGithub },
  { key: 'facebook', label: 'Facebook', icon: FaFacebook },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube },
] as const

function normalizeSocialUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

function getWhatsAppNumber(phone: string) {
  let digits = phone.replace(/\D/g, '')

  // Convert Nigerian local mobile numbers to international format.
  if (digits.startsWith('0') && digits.length === 11) {
    digits = `234${digits.slice(1)}`
  }

  return digits
}

export function ContactSection({ profile }: ContactSectionProps) {
  const email = profile.contact_email?.trim()
  const phone = profile.contact_phone?.trim()
  const location = profile.location?.trim()

  const whatsappNumber = phone ? getWhatsAppNumber(phone) : ''

  const socialLinks = socialPlatforms
    .map((platform) => {
      const value = profile.social_links?.[platform.key]
      const url = value ? normalizeSocialUrl(value) : null

      return url ? { ...platform, url } : null
    })
    .filter((item) => item !== null)

  return (
    <section id="contact" className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        {/* Section introduction */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
            <MessageCircle className="h-4 w-4" />
            Let's Connect
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
            Get in Touch
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Have a project, collaboration opportunity, research idea, or
            professional inquiry? I'd be glad to hear from you.
          </p>
        </div>

        {/* Direct contact */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100">
                <Mail className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Email Me
              </h3>

              <p className="mt-2 break-all text-sm text-slate-600">
                {email}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Send an email
                <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100">
                <Phone className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Phone
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {phone}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Call me
                <Phone className="h-4 w-4" />
              </span>
            </a>
          )}

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100">
                <MessageCircle className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                WhatsApp
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Let's chat directly
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Chat me on WhatsApp
              <FaWhatsapp className="h-7 w-7" />
                
              </span>
            </a>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>{location}</span>
          </div>
        )}

        {/* Social media */}
        {socialLinks.length > 0 && (
          <div className="mx-auto mt-16 max-w-4xl border-t border-slate-200 pt-12">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Find Me Across Platforms
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Connect with me, explore my work and follow my professional journey.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
  {socialLinks.map((social) => {
    const Icon = social.icon

    return (
      <a
        key={social.key}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit my ${social.label} profile`}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      >
        <Icon className="h-5 w-5" />
        {social.label}
        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
      </a>  
      
    )
    
  })}

</div>
          </div>
        )}

        {/* Closing invitation */}
        <div className="mt-14 text-center">
          <p className="text-sm leading-6 text-slate-500">
            Open to meaningful collaborations, knowledge sharing and opportunities
            to create impact.
          </p>
        </div>
      </div>
    </section>
  )
}
