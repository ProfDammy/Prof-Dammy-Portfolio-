'use client'

import React, { useEffect, useState } from 'react'
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
  ArrowRight,
  Type,
  MousePointerClick,
  PanelBottom,
} from 'lucide-react'

type Feedback = {
  type: 'success' | 'error' | 'loading'
  message: string
} | null

const presetColors = [
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Forest Green', hex: '#16a34a' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Crimson', hex: '#dc2626' },
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
  { key: 'contact', name: 'Contact Section' },
]

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700'
const cardClass = 'space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'
const headingClass = 'flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wide text-slate-900'

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
  const [resetting, setResetting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

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

  const handleReload = async () => {
    setFeedback({ type: 'loading', message: 'Refreshing appearance settings...' })
    try {
      await refreshSettings()
      setFeedback({ type: 'success', message: 'Appearance settings refreshed.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setFeedback({ type: 'error', message: `Could not refresh settings: ${message}` })
    }
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
      setFeedback({ type: 'error', message: 'Enter a valid six-digit HEX colour, for example #2563eb.' })
      return
    }

    setSaving(true)
    setFeedback({ type: 'loading', message: 'Saving appearance settings...' })
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
        section_visibility: visibility,
      })

      if (ok) {
        setFeedback({ type: 'success', message: 'Site appearance saved successfully.' })
      } else {
        setFeedback({ type: 'error', message: 'The settings could not be saved. Please try again.' })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setFeedback({ type: 'error', message: `Save failed: ${message}` })
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (key: string) => {
    setVisibility((previous) => ({
      ...previous,
      [key]: previous[key] === false,
    }))
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all appearance and section visibility settings to defaults?')) return

    setResetting(true)
    setFeedback({ type: 'loading', message: 'Restoring default appearance settings...' })
    try {
      await resetSettings()
      setFeedback({ type: 'success', message: 'Appearance settings have been reset to their defaults.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setFeedback({ type: 'error', message: `Reset failed: ${message}` })
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      {/* Page actions: the workspace layout already provides the page title. */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReload}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" /> Reload settings
        </button>
      </div>

      {feedback && (
        <div className="fixed right-4 top-4 z-[100] w-[min(26rem,calc(100vw-2rem))] sm:right-6 sm:top-6">
          <FeedbackAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <section className={cardClass}>
          <div>
            <h2 className={headingClass}><Palette className="h-4 w-4 text-blue-600" /> Theme accent colour</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">Choose the accent used by the public portfolio interface. You can select a preset or enter a custom HEX value.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {presetColors.map((color) => {
              const selected = accentColor.toLowerCase() === color.hex.toLowerCase()
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setAccentColor(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Use ${color.name}`}
                  aria-pressed={selected}
                  title={`${color.name} ${color.hex}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition ${selected ? 'scale-105 border-slate-900 shadow-md' : 'border-white shadow-sm hover:scale-105'}`}
                >
                  {selected && <CheckCircle2 className="h-5 w-5 text-white drop-shadow" />}
                </button>
              )
            })}
            <div className="ml-0 flex items-center gap-2 sm:ml-auto">
              <label htmlFor="accent-hex" className="text-xs font-medium text-slate-600">Custom HEX</label>
              <input id="accent-hex" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} placeholder="#2563eb" className="w-28 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-center font-mono text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <input aria-label="Choose accent colour" type="color" value={/^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#2563eb'} onChange={(event) => setAccentColor(event.target.value)} className="h-9 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="h-8 w-8 rounded-lg border border-black/5" style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#2563eb' }} />
            <div><p className="text-xs font-semibold text-slate-800">Selected accent</p><p className="font-mono text-[11px] text-slate-500">{accentColor}</p></div>
          </div>
        </section>

        <section className={cardClass}>
          <div>
            <h2 className={headingClass}><Type className="h-4 w-4 text-blue-600" /> Homepage headline & subtitle</h2>
            <p className="mt-2 text-xs text-slate-500">Control the main message visitors see in the homepage hero area.</p>
          </div>
          <div className="grid gap-4">
            <div><label htmlFor="hero-headline" className={labelClass}>Custom headline</label><input id="hero-headline" type="text" value={headline} onChange={(event) => setHeadline(event.target.value)} className={inputClass} placeholder="Your professional headline" /></div>
            <div><label htmlFor="hero-subtitle" className={labelClass}>Custom subtitle / credentials line</label><textarea id="hero-subtitle" rows={3} value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className={inputClass} placeholder="A short supporting statement about your work and expertise." /></div>
          </div>
        </section>

        <section className={cardClass}>
          <div>
            <h2 className={headingClass}><MousePointerClick className="h-4 w-4 text-blue-600" /> Hero call-to-action buttons</h2>
            <p className="mt-2 text-xs text-slate-500">Set the wording and destination of the two buttons in your homepage hero.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-wide text-blue-800">Primary CTA</h3><span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-700">Main action</span></div>
              <div><label htmlFor="primary-cta-text" className={labelClass}>Button label</label><input id="primary-cta-text" value={primaryCtaText} onChange={(event) => setPrimaryCtaText(event.target.value)} className={inputClass} /></div>
              <div><label htmlFor="primary-cta-link" className={labelClass}>Button target link</label><input id="primary-cta-link" value={primaryCtaLink} onChange={(event) => setPrimaryCtaLink(event.target.value)} className={inputClass} placeholder="#projects" /></div>
              <div className="pt-1"><span className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white" style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#2563eb' }}>{primaryCtaText || 'Button preview'} <ArrowRight className="h-3.5 w-3.5" /></span></div>
            </div>
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Secondary CTA</h3><span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600">Alternative action</span></div>
              <div><label htmlFor="secondary-cta-text" className={labelClass}>Button label</label><input id="secondary-cta-text" value={secondaryCtaText} onChange={(event) => setSecondaryCtaText(event.target.value)} className={inputClass} /></div>
              <div><label htmlFor="secondary-cta-link" className={labelClass}>Button target link</label><input id="secondary-cta-link" value={secondaryCtaLink} onChange={(event) => setSecondaryCtaLink(event.target.value)} className={inputClass} placeholder="#cv" /></div>
              <div className="pt-1"><span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700">{secondaryCtaText || 'Button preview'}</span></div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <div>
            <h2 className={headingClass}><Layers className="h-4 w-4 text-blue-600" /> Public section visibility</h2>
            <p className="mt-2 text-xs text-slate-500">Choose which sections appear on the public portfolio. Hidden sections remain in your admin content.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sectionsList.map((section) => {
              const isVisible = visibility[section.key] !== false
              return (
                <button key={section.key} type="button" onClick={() => toggleSection(section.key)} aria-pressed={isVisible} className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition ${isVisible ? 'border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-50' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                  <span className="text-xs font-semibold">{section.name}</span>
                  <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${isVisible ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>{isVisible ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className={cardClass}>
          <div>
            <h2 className={headingClass}><Navigation className="h-4 w-4 text-blue-600" /> Navigation menu labels</h2>
            <p className="mt-2 text-xs text-slate-500">Edit the text labels used by the public website navigation.</p>
          </div>
          {Object.keys(navLabels).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(navLabels).map((key) => (
                <div key={key}><label htmlFor={`nav-${key}`} className={`${labelClass} capitalize`}>{key} link</label><input id={`nav-${key}`} value={navLabels[key] || ''} onChange={(event) => setNavLabels((previous) => ({ ...previous, [key]: event.target.value }))} className={inputClass} /></div>
              ))}
            </div>
          ) : <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">No navigation labels are currently configured.</p>}
        </section>

        <section className={cardClass}>
          <div><h2 className={headingClass}><PanelBottom className="h-4 w-4 text-blue-600" /> Footer copyright / text</h2><p className="mt-2 text-xs text-slate-500">Set the text displayed in your website footer.</p></div>
          <div><label htmlFor="footer-content" className={labelClass}>Footer text</label><input id="footer-content" type="text" value={footerContent} onChange={(event) => setFooterContent(event.target.value)} className={inputClass} placeholder="© Your Name. All rights reserved." /></div>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={handleReset} disabled={resetting || saving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw className="h-4 w-4" />{resetting ? 'Resetting...' : 'Reset defaults'}</button>
          <button type="submit" disabled={saving || resetting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving settings...' : 'Save appearance settings'}</button>
        </div>
      </form>
    </div>
  )
}
