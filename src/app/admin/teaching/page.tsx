'use client'

import React, { useState, useEffect } from 'react'
import { TeachingMentorship } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Users,
  Calendar
} from 'lucide-react'

const initialTeachingForm: Partial<TeachingMentorship> = {
  title: '',
  organization: '',
  role: '',
  period: '',
  summary: '',
  impact_highlights: [],
  students_impacted: 0,
  display_order: 0,
  published: true
}

export default function AdminTeachingPage() {
  const [items, setItems] = useState<TeachingMentorship[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<TeachingMentorship>>(initialTeachingForm)
  const [highlightsText, setHighlightsText] = useState('')
  const [saving, setSaving] = useState(false)

  const [deletingItem, setDeletingItem] = useState<TeachingMentorship | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('teaching_mentorship')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown load error'
      setFeedback({ type: 'error', message: `Load failed: ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAdd = () => {
    setFormData({
      ...initialTeachingForm,
      display_order: items.length + 1
    })
    setHighlightsText('')
    setModalOpen(true)
  }

  const handleOpenEdit = (item: TeachingMentorship) => {
    setFormData(item)
    setHighlightsText((item.impact_highlights || []).join('\n'))
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.organization || !formData.role || !formData.period || !formData.summary) {
      setFeedback({ type: 'error', message: 'Title, Organization, Role, Period, and Summary are required.' })
      return
    }

    setSaving(true)
    try {
      const parsedHighlights = highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        organization: formData.organization,
        role: formData.role,
        period: formData.period,
        summary: formData.summary,
        impact_highlights: parsedHighlights,
        students_impacted: Number(formData.students_impacted) || 0,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('teaching_mentorship')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((i) => (i.id === formData.id ? data : i)))
        setFeedback({ type: 'success', message: `Teaching engagement updated!` })
      } else {
        const { data, error } = await supabase
          .from('teaching_mentorship')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Teaching engagement added!` })
      }
      setModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Could not save: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('teaching_mentorship').delete().eq('id', deletingItem.id)
      if (error) throw error

      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
      setFeedback({ type: 'success', message: `Record deleted successfully.` })
      setDeletingItem(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Delete failed: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            Teaching &amp; Mentorship Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage instructional courses, pedagogy engagements, student impact counts, and highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Teaching Engagement
          </button>
        </div>
      </div>

      {feedback && (
        <FeedbackAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <div className="space-y-4">
        {loading ? (
          <FeedbackAlert type="loading" message="Loading teaching engagements..." />
        ) : items.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No teaching engagements found</p>
            <p className="text-xs text-slate-400">Click &ldquo;Add Teaching Engagement&rdquo; to insert your courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                  item.published
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-slate-800/50 opacity-70 bg-slate-950/40'
                } flex flex-col md:flex-row md:items-start justify-between gap-4`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      Order: {item.display_order}
                    </span>
                    {item.students_impacted > 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {item.students_impacted}+ Mentees
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs font-semibold text-blue-400">{item.role} • {item.organization}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {item.period}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

                  {item.impact_highlights && item.impact_highlights.length > 0 && (
                    <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5 pt-1">
                      {item.impact_highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    type="button"
                    onClick={async () => {
                      const newStatus = !item.published
                      await supabase.from('teaching_mentorship').update({ published: newStatus }).eq('id', item.id)
                      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, published: newStatus } : i)))
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      item.published
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {item.published ? 'Published' : 'Draft'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-blue-950 text-blue-400 hover:text-blue-300 border border-slate-800 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-slate-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RecordModal
        isOpen={modalOpen}
        title={formData.id ? 'Edit Teaching Engagement' : 'Add Teaching Engagement'}
        subtitle="Manage program title, institution, role, period, and student impact"
        maxWidth="max-w-2xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Program / Course Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Data Analysis & BI Certification Program"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Organization / Institution <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. SQI College of ICT"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Role <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Lead Instructor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Period <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. 2023 - Present"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Students Impacted Count
              </label>
              <input
                type="number"
                value={formData.students_impacted ?? 0}
                onChange={(e) => setFormData({ ...formData, students_impacted: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Summary Overview <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Overview of syllabus, practical tools taught, and mentorship outcomes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Impact Highlights (one per line)
            </label>
            <textarea
              rows={3}
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              placeholder="e.g. Mentored 200+ students through practical data analytics capstones\n95% student certification completion rate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order ?? 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published !== false}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <span className="text-xs font-semibold text-slate-300">Publish on public portfolio</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={saving}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Engagement'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        title="Delete Teaching Record"
        description="Are you sure you want to delete this teaching & mentorship record?"
        itemName={deletingItem?.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  )
}
