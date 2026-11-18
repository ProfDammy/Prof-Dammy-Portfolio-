
'use client'

import React, { useState, useEffect } from 'react'
import { Experience } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react'

const initialExperienceForm: Partial<Experience> = {
  title: '',
  company: '',
  location: '',
  employment_type: 'Full-time',
  start_date: '',
  end_date: null,
  is_current: false,
  description: [],
  technologies: [],
  display_order: 0,
  published: true
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Experience>>(initialExperienceForm)
  const [descriptionText, setDescriptionText] = useState('')
  const [technologiesText, setTechnologiesText] = useState('')
  const [saving, setSaving] = useState(false)

  const [deletingExperience, setDeletingExperience] = useState<Experience | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error fetching experiences:', error)
        setFeedback({ type: 'error', message: `Failed to load experiences: ${error.message}` })
      } else {
        setExperiences(data || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown load error'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const handleOpenAdd = () => {
    setFormData({
      ...initialExperienceForm,
      display_order: experiences.length + 1
    })
    setDescriptionText('')
    setTechnologiesText('')
    setModalOpen(true)
  }

  const handleOpenEdit = (exp: Experience) => {
    setFormData(exp)
    setDescriptionText((exp.description || []).join('\n'))
    setTechnologiesText((exp.technologies || []).join(', '))
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.company || !formData.start_date) {
      setFeedback({ type: 'error', message: 'Title, Company, and Start Date are required.' })
      return
    }

    setSaving(true)
    try {
      const parsedDesc = descriptionText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
      const parsedTech = technologiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location || null,
        employment_type: formData.employment_type || 'Full-time',
        start_date: formData.start_date,
        end_date: formData.is_current ? null : (formData.end_date || null),
        is_current: formData.is_current || false,
        description: parsedDesc,
        technologies: parsedTech,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false,
        updated_at: new Date().toISOString()
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error

        setExperiences((prev) => prev.map((exp) => (exp.id === formData.id ? data : exp)))
        setFeedback({ type: 'success', message: `Experience at "${data.company}" updated successfully!` })
      } else {
        const { data, error } = await supabase
          .from('experiences')
          .insert(payload)
          .select()
          .single()

        if (error) throw error

        setExperiences((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Experience at "${data.company}" created successfully!` })
      }

      setModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database error'
      setFeedback({ type: 'error', message: `Could not save experience: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingExperience) return
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', deletingExperience.id)

      if (error) throw error

      setExperiences((prev) => prev.filter((exp) => exp.id !== deletingExperience.id))
      setFeedback({ type: 'success', message: `Experience at "${deletingExperience.company}" deleted.` })
      setDeletingExperience(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      setFeedback({ type: 'error', message: `Could not delete experience: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  const handleTogglePublish = async (exp: Experience) => {
    const updatedStatus = !exp.published
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ published: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', exp.id)

      if (error) throw error

      setExperiences((prev) =>
        prev.map((e) => (e.id === exp.id ? { ...e, published: updatedStatus } : e))
      )
      setFeedback({
        type: 'success',
        message: `Experience at "${exp.company}" ${updatedStatus ? 'published' : 'moved to draft'} successfully.`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status toggle failed'
      setFeedback({ type: 'error', message: `Could not toggle status: ${msg}` })
    }
  }

  return (
    <div className="space-y-5 mx-auto w-full max-w-6xl pb-12">
      {/* Page actions: the workspace header already provides the page title. */}
      <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchExperiences}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>
      </div>

      {feedback && (
        <div className="pointer-events-none fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-md sm:right-6 sm:top-6">
          <div className="pointer-events-auto rounded-2xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
            <FeedbackAlert
              type={feedback.type}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <FeedbackAlert type="loading" message="Loading experience history from Supabase..." />
        ) : experiences.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">No experience records found</p>
            <p className="text-xs text-slate-600">Click &ldquo;Add Experience&rdquo; to insert your work history.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all ${
                  exp.published
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-70 bg-slate-50'
                } flex flex-col md:flex-row md:items-start justify-between gap-4`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                      Order: {exp.display_order}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {exp.employment_type}
                    </span>
                    {exp.is_current && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Current Role
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      {exp.title}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700">
                      {exp.company} {exp.location && `— ${exp.location}`}
                    </p>
                    <p className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {exp.start_date} &ndash; {exp.is_current ? 'Present' : exp.end_date || 'N/A'}
                    </p>
                  </div>

                  {exp.description && exp.description.length > 0 && (
                    <ul className="text-xs text-slate-700 list-disc list-inside space-y-1 pt-1">
                      {exp.description.map((bullet, idx) => (
                        <li key={idx} className="line-clamp-2">{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(exp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      exp.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
                    }`}
                  >
                    {exp.published ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Draft
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors"
                    title="Edit record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingExperience(exp)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-colors"
                    title="Delete record"
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
        title={formData.id ? 'Edit Experience' : 'Add Experience'}
        subtitle="Manage job title, company, dates, description bullets, and tech stack"
        maxWidth="max-w-2xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Job Title <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Data Analysis Instructor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company / Organization <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. SQI College of ICT"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employment Type
              </label>
              <select
                value={formData.employment_type || 'Full-time'}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Leadership">Leadership</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Oyo State, Nigeria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Date <span className="text-rose-700">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                End Date {!formData.is_current && <span className="text-slate-600">(leave blank if ongoing)</span>}
              </label>
              <input
                type="date"
                disabled={formData.is_current}
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_current || false}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50 border-slate-200 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">I currently work in this role</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published !== false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50 border-slate-200 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">Publish on public portfolio</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Responsibilities & Accomplishments (one bullet point per line)
            </label>
            <textarea
              rows={4}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="e.g. Design and deliver curriculums covering Python, SQL, and Power BI\nMentor students through end-to-end data capstones"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Technologies / Tools Utilized (comma-separated)
            </label>
            <input
              type="text"
              value={technologiesText}
              onChange={(e) => setTechnologiesText(e.target.value)}
              placeholder="Python, SQL, Power BI, Excel, Pandas"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
            />
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingExperience}
        title="Delete Experience Record"
        description="Are you sure you want to delete this career experience entry from the database?"
        itemName={`${deletingExperience?.title} @ ${deletingExperience?.company}`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingExperience(null)}
      />
    </div>
  )
}
