'use client'

import React from 'react'
import { Education, Certification } from '@/types/database'
import { GraduationCap, Award } from 'lucide-react'

interface EducationSectionProps {
  education: Education[]
  certifications: Certification[]
}

export function EducationSection({ education, certifications }: EducationSectionProps) {
  return (
    <section id="education" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-3xl font-bold text-white">Education & Certifications</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">Academic Education</h3>
            {education.map((edu) => (
              <div key={edu.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                <p className="text-xs text-blue-400">{edu.field_of_study}</p>
                <p className="text-xs text-slate-400">{edu.institution}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400">Certifications</h3>
            {certifications.map((cert) => (
              <div key={cert.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-lg font-bold text-white">{cert.title}</h4>
                <p className="text-xs text-blue-400">{cert.issuing_organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
