'use client'

import React, { useState, useEffect } from 'react'
import { Achievement } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react'

const initialAchievementForm: Partial<Achievement> = {
  title: '',
  category: 'Teaching Excellence',
  issuer: '',
  award_date: '',
  description: '',
  display_order: 0,
  published: true
}

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Achievement>>(initialAchievementForm)
  const [saving, setSaving] = useState(false)

  const [deletingItem, setDeletingItem] = useState<Achievement | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('display_order', { ascending: true })
        .order('award_date', { ascending: false })

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
      ...initialAchievementForm,
      display_order: items.length + 1
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item: Achievement) => {
    setFormData(item)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.issuer || !formData.award_date || !formData.description) {
      setFeedback({ type: 'error', message: 'Title, Category, Issuer, Award Date, and Description are required.' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        issuer: formData.issuer,
        award_date: formData.award_date,
        description: formData.description,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('achievements')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((i) => (i.id === formData.id ? data : i)))
        setFeedback({ type: 'success', message: `Achievement updated successfully!` })
      } else {
        const { data, error } = await supabase
          .from('achievements')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Achievement added successfully!` })
      }
      setModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Could not save achievement: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', deletingItem.id)
      if (error) throw error

      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
      setFeedback({ type: 'success', message: `Achievement deleted successfully.` })
      setDeletingItem(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Delete failed: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <div className="flex justify-end items-center gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/10 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {feedback && (
        <div className="fixed right-4 top-4 z-[100] w-[min(24rem,calc(100vw-2rem))]">
          <FeedbackAlert
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <FeedbackAlert type="loading" message="Loading achievements..." />
        ) : items.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <Trophy className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">No achievements recorded</p>
            <p className="text-xs text-slate-500">Click &ldquo;Add Achievement&rdquo; to insert awards and honors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white border transition-all ${
                  item.published
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-70 bg-slate-50'
                } flex flex-col md:flex-row md:items-start justify-between gap-4`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
                      Order: {item.display_order}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs font-semibold text-blue-700">{item.issuer}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date: {item.award_date}
                    </p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <button
                    type="button"
                    onClick={async () => {
                      const newStatus = !item.published
                      const { error } = await supabase
                        .from('achievements')
                        .update({ published: newStatus })
                        .eq('id', item.id)

                      if (error) {
                        setFeedback({ type: 'error', message: `Could not update publication status: ${error.message}` })
                        return
                      }

                      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, published: newStatus } : i)))
                      setFeedback({ type: 'success', message: newStatus ? 'Achievement published.' : 'Achievement moved to draft.' })
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      item.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {item.published ? 'Published' : 'Draft'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-700 border border-slate-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 transition-colors"
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
        title={formData.id ? 'Edit Achievement' : 'Add Achievement'}
        subtitle="Manage award title, issuing body, category, and recognition notes"
        maxWidth="max-w-xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Award / Recognition Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Outstanding Data Analysis Instructor of the Year"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Teaching Excellence, Hackathon Winner..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Issuing Organization / Body <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.issuer || ''}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="SQI College of ICT Academic Board"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Award Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.award_date || ''}
                onChange={(e) => setFormData({ ...formData, award_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Recognition context, notable student outcomes, or award significance..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
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
              <span className="text-xs font-semibold text-slate-700">Publish on public portfolio</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              disabled={saving}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-xs font-semibold shadow-lg shadow-blue-600/10"
            >
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Achievement'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        title="Delete Achievement"
        description="Are you sure you want to permanently delete this achievement?"
        itemName={deletingItem?.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  )
}
