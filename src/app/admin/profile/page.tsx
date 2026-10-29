'use client'

import React, { useState } from 'react'
import { Profile } from '@/types/database'
import { mockProfile } from '@/lib/mockData'
import { User, Save, CheckCircle2 } from 'lucide-react'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(mockProfile)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" />
          Profile & Biography Editor
        </h1>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Title</label>
          <input
            type="text"
            value={profile.professional_title}
            onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Save Profile
        </button>
      </form>
    </div>
  )
}
