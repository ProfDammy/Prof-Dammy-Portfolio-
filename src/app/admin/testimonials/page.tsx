'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { MessageSquareQuote, RefreshCw, Check, X, Pencil, Trash2, Star } from 'lucide-react'

const TESTIMONIAL_CATEGORIES = [
  'Solutions & Technology',
  'Projects & Collaboration',
  'Research & Academic',
  'Teaching & Mentorship',
  'Leadership & Community',
  'Professional Excellence',
  'Other',
] as const

type Testimonial = {
  id: string
  client_name: string
  professional_title: string | null
  organization: string | null
  relationship: string | null
  location: string | null
  category: string
  message: string
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  featured: boolean
  display_order: number
  submitted_at: string
}

const emptyForm = {
  client_name: '',
  professional_title: '',
  organization: '',
  relationship: '',
  location: '',
  category: 'Other',
  message: '',
  photo_url: '',
  display_order: 0,
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Testimonial['status']>('all')
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<Testimonial | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('testimonials').select('*').order('submitted_at', { ascending: false })
    if (error) setFeedback({ type: 'error', message: `Could not load testimonials: ${error.message}` })
    else setItems((data || []).map((item) => ({ ...item, category: item.category || 'Other', location: item.location || null })) as Testimonial[])
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  const counts = useMemo(() => ({
    all: items.length,
    pending: items.filter(x => x.status === 'pending').length,
    approved: items.filter(x => x.status === 'approved').length,
    rejected: items.filter(x => x.status === 'rejected').length,
  }), [items])

  const visible = filter === 'all' ? items : items.filter(x => x.status === filter)

  const startEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({
      client_name: item.client_name,
      professional_title: item.professional_title || '',
      organization: item.organization || '',
      relationship: item.relationship || '',
      location: item.location || '',
      category: item.category || 'Other',
      message: item.message,
      photo_url: item.photo_url || '',
      display_order: item.display_order || 0,
    })
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editing) return
    setSaving(true)
    const { error } = await supabase.from('testimonials').update({
      ...form,
      professional_title: form.professional_title || null,
      organization: form.organization || null,
      relationship: form.relationship || null,
      location: form.location.trim() || null,
      category: form.category || 'Other',
      photo_url: form.photo_url || null,
      updated_at: new Date().toISOString(),
    }).eq('id', editing.id)
    setSaving(false)
    if (error) setFeedback({ type: 'error', message: `Could not save changes: ${error.message}` })
    else {
      setFeedback({ type: 'success', message: 'Testimonial updated.' })
      setEditing(null)
      await load()
    }
  }

  const setStatus = async (item: Testimonial, status: Testimonial['status']) => {
    const { error } = await supabase.from('testimonials').update({ status, updated_at: new Date().toISOString() }).eq('id', item.id)
    if (error) setFeedback({ type: 'error', message: `Could not update status: ${error.message}` })
    else {
      setFeedback({ type: 'success', message: `Testimonial ${status}.` })
      await load()
    }
  }

  const toggleFeatured = async (item: Testimonial) => {
    const { error } = await supabase.from('testimonials').update({ featured: !item.featured, updated_at: new Date().toISOString() }).eq('id', item.id)
    if (error) setFeedback({ type: 'error', message: `Could not update featured status: ${error.message}` })
    else await load()
  }

  const remove = async () => {
    if (!deleting) return
    const { error } = await supabase.from('testimonials').delete().eq('id', deleting.id)
    if (error) setFeedback({ type: 'error', message: `Could not delete testimonial: ${error.message}` })
    else {
      setFeedback({ type: 'success', message: 'Testimonial deleted.' })
      setDeleting(null)
      await load()
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Review submissions and choose which testimonials appear on your public portfolio.</p>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw size={14} /> Refresh</button>
      </div>

      {feedback && <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-md"><FeedbackAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} /></div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(key => (
          <button key={key} onClick={() => setFilter(key)} className={`rounded-2xl border p-4 text-left transition ${filter === key ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <p className="text-xs font-semibold capitalize text-slate-500">{key === 'all' ? 'All submissions' : key}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{counts[key]}</p>
          </button>
        ))}
      </div>

      {loading ? <FeedbackAlert type="loading" message="Loading testimonials…" /> : visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <MessageSquareQuote className="mx-auto h-9 w-9 text-blue-300" />
          <p className="mt-3 font-semibold text-slate-800">No testimonials in this view</p>
          <p className="mt-1 text-sm text-slate-500">New public submissions will appear here as pending.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(item => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">{item.client_name}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : item.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{item.status}</span>
                    {item.featured && <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700"><Star size={11} /> Featured</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{[item.professional_title, item.organization, item.relationship, item.location].filter(Boolean).join(' · ') || 'No additional details'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">{item.category || 'Other'}</span>
                    {item.location && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">Location: {item.location}</span>}
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.message}</p>
                  <p className="mt-3 text-[11px] text-slate-400">Submitted {new Date(item.submitted_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap items-start gap-2 sm:max-w-[220px] sm:justify-end">
                  {item.status !== 'approved' && <button onClick={() => void setStatus(item, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"><Check size={14} /> Approve</button>}
                  {item.status !== 'rejected' && <button onClick={() => void setStatus(item, 'rejected')} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"><X size={14} /> Reject</button>}
                  <button onClick={() => void toggleFeatured(item)} disabled={item.status !== 'approved'} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-40"><Star size={14} /> {item.featured ? 'Unfeature' : 'Feature'}</button>
                  <button onClick={() => startEdit(item)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Edit testimonial"><Pencil size={15} /></button>
                  <button onClick={() => setDeleting(item)} className="rounded-lg border border-rose-100 p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete testimonial"><Trash2 size={15} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Edit testimonial</h2><button type="button" onClick={() => setEditing(null)} className="text-sm text-slate-500">Close</button></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-700">Client name<input required value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700">Professional title<input value={form.professional_title} onChange={e => setForm({ ...form, professional_title: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700">Organisation<input value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700">Relationship<input value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700">Location<input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State or Country" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700">Category<select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">{TESTIMONIAL_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
              <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Photo URL<input type="url" value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Message<textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-semibold text-slate-700">Display order<input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-slate-600">Cancel</button><button disabled={saving} className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button></div>
          </form>
        </div>
      )}

      <DeleteConfirmModal isOpen={!!deleting} title="Delete testimonial" description="This permanently removes the testimonial submission." itemName={deleting?.client_name} loading={false} onConfirm={remove} onCancel={() => setDeleting(null)} />
    </div>
  )
}
