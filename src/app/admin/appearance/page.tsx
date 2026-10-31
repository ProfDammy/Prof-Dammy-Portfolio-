'use client'

import React, { useState, useEffect } from 'react'
import { useSiteCustomizer } from '@/context/CustomizerContext'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import {
  Palette,
  CheckCircle2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Navigation,
  Layers,
  ArrowRight
} from 'lucide-react'

export default function AdminAppearancePage() {
  const { settings, updateSettings, resetSettings, refreshSettings } = useSiteCustomizer()

  const [accentColor, setAccentColor] = useState(settings.theme_accent_color || '#2563eb')
  const [headline, setHeadline] = useState(settings.custom_headline || '')
  const [subtitle, setSubtitle] = useState(settings.custom_subtitle || '')
  const [primaryCtaText, setPrimaryCtaText] = useState(settings.primary_cta_text || 'Explore Projects')
  const [primaryCtaLink, setPrimaryCtaLink] = useState(settings.primary_cta_link || '#projects')
  const [secondaryCtaText, setSecondaryCtaText] = useState(settings.secondary_cta_text || 'Download CV')
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(settings.secondary_cta_link || '#cv')
  const [footerContent, setFooterContent] = useState(settings.footer_content || '')
  const [navLabels, setNavLabels] = useState<Record<string, string>>(settings.navigation_labels || {})
  const [visibility, setVisibility] = useState<Record<string, boolean>>(settings.section_visibility || {})

  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  useEffect(() => {
    setAccentColor(settings.theme_accent_color || '#2563eb')
    setHeadline(settings.custom_headline || '')
    setSubtitle(settings.custom_subtitle || '')
    setPrimaryCtaText(settings.primary_cta_text || 'Explore Projects')
    setPrimaryCtaLink(settings.primary_cta_link || '#projects')
    setSecondaryCtaText(settings.secondary_cta_text || 'Download CV')
    setSecondaryCtaLink(settings.secondary_cta_link || '#cv')
    setFooterContent(settings.footer_content || '')
    setNavLabels(settings.navigation_labels || {})
    setVisibility(settings.section_visibility || {})
  }, [settings])

  const presetColors = [
    { name: 'Royal Blue (Default)', hex: '#2563eb' },
    { name: 'Sky Cyan', hex: '#0284c7' },
    { name: 'Teal Emerald', hex: '#0d9488' },
    { name: 'Forest Green', hex: '#16a34a' },
    { name: 'Violet Indigo', hex: '#7c3aed' },
    { name: 'Amber Gold', hex: '#d97706' },
    { name: 'Ruby Crimson', hex: '#dc2626' }
  ]

  const sectionsList = [
    { key: 'hero', name: 'Hero Banner' },
    { key: 'about', name: 'About / Bio' },
    { key: 'skills', name: 'Skills & Proficiencies' },
    { key: 'experience', name: 'Professional Experience' },
    { key: 'projects', name: 'Showcase Projects' },
    { key: 'teaching', name: 'Teaching & Mentorship' },
    { key: 'leadership', name: 'Leadership & Forum' },
    { key: 'education', name: 'Education & Certifications' },
    { key: 'publications', name: 'Research Publications' },
    { key: 'achievements', name: 'Awards & Honors' },
    { key: 'gallery', name: 'Media Gallery' },
    { key: 'contact', name: 'Contact Section' }
  ]

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback({ type: 'loading', message: 'Saving appearance to Supabase database...' })

    try {
      const ok = await updateSettings({
        theme_accent_color: accentColor,
        custom_headline: headline,
        custom_subtitle: subtitle,
        primary_cta_text: primaryCtaText,
        primary_cta_link: primaryCtaLink,
        secondary_cta_text: secondaryCtaText,
        secondary_cta_link: secondaryCtaLink,
        footer_content: footerContent,
        navigation_labels: navLabels,
        section_visibility: visibility
      })

      if (ok) {
        setFeedback({ type: 'success', message: 'Site appearance saved to Supabase successfully!' })
      } else {
        setFeedback({ type: 'error', message: 'Could not sync settings to Supabase table.' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setFeedback({ type: 'error', message: `Save error: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (key: string) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }))
  }

  const handleReset = async () => {
    if (confirm('Reset all appearance and section visibility settings to defaults?')) {
      await resetSettings()
      setFeedback({ type: 'success', message: 'Appearance reset to default settings.' })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-blue-500" />
            Site Appearance Customizer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize branding accents, hero text, CTA actions, navigation labels, and section toggles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refreshSettings()}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reload
        </button>
      </div>

      {feedback && (
        <FeedbackAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" /> Theme Accent Color
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {presetColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setAccentColor(color.hex)}
                style={{ backgroundColor: color.hex }}
                className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center text-white ${
                  accentColor.toLowerCase() === color.hex.toLowerCase()
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent opacity-85 hover:opacity-100'
                }`}
                title={color.name}
              >
                {accentColor.toLowerCase() === color.hex.toLowerCase() && (
                  <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                )}
              </button>
            ))}

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400">Custom Hex:</span>
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#2563eb"
                className="w-28 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs text-center"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Hero Headline & Subtitle
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Custom Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Custom Subtitle / Credentials Line
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-blue-400" /> Hero Call-To-Action Buttons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <h3 className="text-xs font-bold text-blue-400 uppercase">Primary CTA</h3>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Button Label</label>
                <input
                  type="text"
                  value={primaryCtaText}
                  onChange={(e) => setPrimaryCtaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Button Target Link</label>
                <input
                  type="text"
                  value={primaryCtaLink}
                  onChange={(e) => setPrimaryCtaLink(e.target.value)}
                  placeholder="#projects"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-300 uppercase">Secondary CTA</h3>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Button Label</label>
                <input
                  type="text"
                  value={secondaryCtaText}
                  onChange={(e) => setSecondaryCtaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Button Target Link</label>
                <input
                  type="text"
                  value={secondaryCtaLink}
                  onChange={(e) => setSecondaryCtaLink(e.target.value)}
                  placeholder="#cv"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" /> Public Section Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sectionsList.map((sec) => {
              const isVisible = visibility[sec.key] !== false
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => toggleSection(sec.key)}
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isVisible
                      ? 'bg-blue-950/60 border-blue-700 text-blue-200'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className="truncate">{sec.name}</span>
                  {isVisible ? (
                    <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-400" /> Navigation Menu Labels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(navLabels).map((key) => (
              <div key={key}>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 capitalize">
                  {key} Link
                </label>
                <input
                  type="text"
                  value={navLabels[key] || ''}
                  onChange={(e) =>
                    setNavLabels({
                      ...navLabels,
                      [key]: e.target.value
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Footer Copyright / Text
          </h2>
          <input
            type="text"
            value={footerContent}
            onChange={(e) => setFooterContent(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Appearance Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
