'use client'

import React, { useState } from 'react'
import { Education, Certification } from '@/types/database'
import { mockEducation, mockCertifications } from '@/lib/mockData'
import { GraduationCap, Award } from 'lucide-react'

export default function AdminEducationPage() {
  const [education] = useState<Education[]>(mockEducation)
  const [certifications] = useState<Certification[]>(mockCertifications)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-blue-500" />
        Education & Certifications Manager
      </h1>
      <div className="space-y-4">
        {education.map((e) => (
          <div key={e.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{e.degree}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
