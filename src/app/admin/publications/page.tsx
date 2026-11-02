'use client'

import React, { useState, useEffect } from 'react'
import { Publication } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Calendar,
  ExternalLink,
  Users
} from 'lucide-react'

const initialPublicationForm: Partial<Publication> = {
  title: '',
  publisher_or_journal: '',
  publication_date: '',
  publication_type: 'paper',
  authors: [],
  abstract: '',
  doi_or_url: '',
  display_order: 0,
  published: true
}

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Publication>>(initialPublicationForm)
  const [authorsText, setAuthorsText] = useState('')
  const [saving, setSaving] = useState(false)

  const [deletingItem, setDeletingItem] = useState<Publication | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('display_order', { ascending: true })
        .order('publication_date', { ascending: false })

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
      ...initialPublicationForm,
      display_order: items.length + 1
    })
    setAuthorsText('Damilola Miracle Oluwagbamila')
    setModalOpen(true)
  }

  const handleOpenEdit = (item: Publication) => {
    setFormData(item)
    setAuthorsText((item.authors || []).join(', '))
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.publisher_or_journal || !formData.publication_date || !formData.abstract) {
      setFeedback({ type: 'error', message: 'Title, Publisher/Journal, Date, and Abstract are required.' })
      return
    }

    setSaving(true)
    try {
      const parsedAuthors = authorsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        publisher_or_journal: formData.publisher_or_journal,
        publication_date: formData.publication_date,
        publication_type: formData.publication_type || 'paper',
        authors: parsedAuthors,
        abstract: formData.abstract,
        doi_or_url: formData.doi_or_url || null,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('publications')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((i) => (i.id === formData.id ? data : i)))
        setFeedback({ type: 'success', message: `Publication "${data.title}" updated!` })
      } else {
        const { data, error } = await supabase
          .from('publications')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Publication "${data.title}" added!` })
      }
      setModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Could not save publication: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('publications').delete().eq('id', deletingItem.id)
      if (error) throw error

      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
      setFeedback({ type: 'success', message: `Publication deleted successfully.` })
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
            <BookOpen className="w-6 h-6 text-blue-500" />
            Publications &amp; Research Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your peer-reviewed papers, articles, research abstracts, and DOI links.
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
            <Plus className="w-4 h-4" /> Add Publication
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
          <FeedbackAlert type="loading" message="Loading research publications..." />
        ) : items.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No research publications found</p>
            <p className="text-xs text-slate-400">Click &ldquo;Add Publication&rdquo; to publish your scholarly work.</p>
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
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {item.publication_type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs font-semibold text-blue-400">{item.publisher_or_journal}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Published: {item.publication_date}
                    </p>
                  </div>

                  {item.authors && item.authors.length > 0 && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" /> {item.authors.join(', ')}
                    </p>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{item.abstract}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    type="button"
                    onClick={async () => {
                      const newStatus = !item.published
                      await supabase.from('publications').update({ published: newStatus }).eq('id', item.id)
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

                  {item.doi_or_url && (
                    <a
                      href={item.doi_or_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      title="Open Paper / DOI"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

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
        title={formData.id ? 'Edit Research Publication' : 'Add Research Publication'}
        subtitle="Manage publication title, journal/conference, authors, abstract, and DOI"
        maxWidth="max-w-2xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Publication Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Optimizing Predictive Analytics in Technical Education"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Publisher / Journal <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.publisher_or_journal || ''}
                onChange={(e) => setFormData({ ...formData, publisher_or_journal: e.target.value })}
                placeholder="e.g. Journal of Applied Data Science"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Publication Type
              </label>
              <select
                value={formData.publication_type || 'paper'}
                onChange={(e) => setFormData({ ...formData, publication_type: e.target.value as Publication['publication_type'] })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="paper">Peer-Reviewed Paper</option>
                <option value="article">Technical Article</option>
                <option value="thesis">Thesis / Dissertation</option>
                <option value="technical_report">Technical Report</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Publication Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.publication_date || ''}
                onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                DOI or URL Link
              </label>
              <input
                type="url"
                value={formData.doi_or_url || ''}
                onChange={(e) => setFormData({ ...formData, doi_or_url: e.target.value })}
                placeholder="https://doi.org/... or URL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Authors (comma-separated)
            </label>
            <input
              type="text"
              value={authorsText}
              onChange={(e) => setAuthorsText(e.target.value)}
              placeholder="Damilola Miracle Oluwagbamila, Co-author Name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Abstract <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.abstract || ''}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              placeholder="Detailed summary of problem, methodology, findings, and conclusions..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
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
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Publication'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        title="Delete Publication"
        description="Are you sure you want to permanently delete this publication record?"
        itemName={deletingItem?.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  )
}
