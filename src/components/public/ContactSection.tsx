'use client'

import React, { useState } from 'react'
import { Profile } from '@/types/database'

interface ContactSectionProps {
  profile: Profile
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4">
          <p className="text-sm text-slate-300">Email: {profile.contact_email}</p>
        </div>
      </div>
    </section>
  )
}
