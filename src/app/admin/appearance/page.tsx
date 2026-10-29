'use client'

import React, { useState } from 'react'
import { useSiteCustomizer } from '@/context/CustomizerContext'
import { Palette, CheckCircle2, Save, Eye } from 'lucide-react'

export default function AdminAppearancePage() {
  const { settings, updateSettings, resetSettings } = useSiteCustomizer()
  const [accentColor, setAccentColor] = useState(settings.theme_accent_color || '#2563eb')
  const [headline, setHeadline] = useState(settings.custom_headline || '')
  const [subtitle, setSubtitle] = useState(settings.custom_subtitle || '')
  const [saved, setSaved] = useState(false)

  const presetColors = ['#2563eb', '#0284c7', '#0d9488', '#16a34a', '#7c3aed', '#d97706', '#dc2626']

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      theme_accent_color: accentColor,
      custom_headline: headline,
      custom_subtitle: subtitle
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleSection = (key: string) => {
    const current = settings.section_visibility || {}
    updateSettings({
      section_visibility: {
        ...current,
        [key]: current[key] === false ? true : false
      }
    })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-blue-500" />
          Site Appearance Customizer
        </h1>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Live Changes Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase">Accent Theme Color</label>
          <div className="flex items-center gap-3">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAccentColor(color)}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full border-2 ${
                  accentColor === color ? 'border-white scale-110' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subtitle</label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase">Section Visibility</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['hero', 'about', 'skills', 'experience', 'projects', 'teaching', 'leadership', 'education', 'publications', 'gallery', 'contact'].map((sec) => {
              const visible = settings.section_visibility?.[sec] !== false
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => toggleSection(sec)}
                  className={`p-3 rounded-xl border text-xs font-semibold capitalize flex items-center justify-between ${
                    visible ? 'bg-blue-950 border-blue-700 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{sec}</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button type="button" onClick={resetSettings} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold">
            Reset Defaults
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            Save Customizations
          </button>
        </div>
      </form>
    </div>
  )
}
