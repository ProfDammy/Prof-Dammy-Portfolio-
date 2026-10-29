'use client'

import React, { useState } from 'react'
import { Publication } from '@/types/database'
import { mockPublications } from '@/lib/mockData'
import { BookOpen } from 'lucide-react'

export default function AdminPublicationsPage() {
  const [publications] = useState<Publication[]>(mockPublications)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-500" />
        Publications & Research Manager
      </h1>
      <div className="space-y-4">
        {publications.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-bold text-white">{p.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
