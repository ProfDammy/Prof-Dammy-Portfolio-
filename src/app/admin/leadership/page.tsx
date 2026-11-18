'use client'

import React, { useState, useEffect } from 'react'
import { LeadershipCommunity } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  Users2,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react'

const initialLeadershipForm: Partial<LeadershipCommunity> = {
  title: '',
  organization: '',
  role: '',
  period: '',
  summary: '',
  achievements: [],
  display_order: 0,
  published: true
}

export default function AdminLeadershipPage() {
  const [items, setItems] = useState<LeadershipCommunity[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<LeadershipCommunity>>(initialLeadershipForm)
  const [achievementsText, setAchievementsText] = useState('')
  const [saving, setSaving] = useState(false)

  const [deletingItem, setDeletingItem] = useState<LeadershipCommunity | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leadership_community')
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
      ...initialLeadershipForm,
      display_order: items.length + 1
    })
    setAchievementsText('')
    setModalOpen(true)
  }

  const handleOpenEdit = (item: LeadershipCommunity) => {
    setFormData(item)
    setAchievementsText((item.achievements || []).join('\n'))
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
      const parsedAchievements = achievementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        organization: formData.organization,
        role: formData.role,
        period: formData.period,
        summary: formData.summary,
        achievements: parsedAchievements,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('leadership_community')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((i) => (i.id === formData.id ? data : i)))
        setFeedback({ type: 'success', message: `Leadership initiative updated!` })
      } else {
        const { data, error } = await supabase
          .from('leadership_community')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Leadership initiative added!` })
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
      const { error } = await supabase.from('leadership_community').delete().eq('id', deletingItem.id)
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
    <div className="space-y-4 max-w-6xl pb-8">
      <div className="flex items-center justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Leadership Initiative
          </button>
        </div>

      {feedback && (
        <div className="fixed right-4 top-4 z-[100] w-[min(420px,calc(100vw-2rem))]">
          <FeedbackAlert
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <FeedbackAlert type="loading" message="Loading leadership initiatives..." />
        ) : items.length === 0 ? (
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center space-y-3">
            <Users2 className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">No leadership initiatives found</p>
            <p className="text-xs text-slate-600">Click &ldquo;Add Leadership Initiative&rdquo; to insert your work with Creative Thinkers Forum.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl bg-white border transition-all ${
                  item.published
                    ? 'border-slate-200 hover:border-blue-200'
                    : 'border-slate-200 opacity-70 bg-slate-50'
                } flex flex-col md:flex-row md:items-start justify-between gap-4`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                      Order: {item.display_order}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs font-semibold text-blue-700">{item.role} • {item.organization}</p>
                    <p className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {item.period}
                    </p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{item.summary}</p>

                  {item.achievements && item.achievements.length > 0 && (
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5 pt-1">
                      {item.achievements.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <button
                    type="button"
                    onClick={async () => {
                      const newStatus = !item.published
                      const { error } = await supabase
                        .from('leadership_community')
                        .update({ published: newStatus })
                        .eq('id', item.id)

                      if (error) {
                        setFeedback({ type: 'error', message: `Could not update publication status: ${error.message}` })
                        return
                      }

                      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, published: newStatus } : i)))
                      setFeedback({
                        type: 'success',
                        message: newStatus ? 'Leadership initiative published.' : 'Leadership initiative moved to draft.'
                      })
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      item.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {item.published ? 'Published' : 'Draft'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-slate-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 transition-colors"
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
        title={formData.id ? 'Edit Leadership Initiative' : 'Add Leadership Initiative'}
        subtitle="Manage program title, community organization, role, and key milestones"
        maxWidth="max-w-2xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Initiative Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Creative Thinkers Forum Community Outreach"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Organization <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Creative Thinkers Forum"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Founder & Convener"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Period <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. 2022 - Present"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order ?? 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Summary Overview <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Initiative background, community target, goals..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Key Achievements & Milestones (one per line)
            </label>
            <textarea
              rows={3}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              placeholder="e.g. Organized free technical workshops on data literacy\nBuilt active community network of young innovators"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published !== false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300">Publish on public portfolio</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              disabled={saving}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        title="Delete Leadership Record"
        description="Are you sure you want to delete this leadership entry from the database?"
        itemName={deletingItem?.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  )
}
