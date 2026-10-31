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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status toggle failed'
      setFeedback({ type: 'error', message: `Could not toggle status: ${msg}` })
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            Experience Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your career trajectory, roles, employment history, and key pedagogical/technical impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchExperiences}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Experience
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
          <FeedbackAlert type="loading" message="Loading experience history from Supabase..." />
        ) : experiences.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No experience records found</p>
            <p className="text-xs text-slate-400">Click &ldquo;Add Experience&rdquo; to insert your work history.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                  exp.published
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-slate-800/50 opacity-70 bg-slate-950/40'
                } flex flex-col md:flex-row md:items-start justify-between gap-4`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      Order: {exp.display_order}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {exp.employment_type}
                    </span>
                    {exp.is_current && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Current Role
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {exp.title}
                    </h3>
                    <p className="text-xs font-semibold text-blue-400">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {exp.start_date} &ndash; {exp.is_current ? 'Present' : exp.end_date || 'N/A'}
                    </p>
                  </div>

                  {exp.description && exp.description.length > 0 && (
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 pt-1">
                      {exp.description.map((bullet, idx) => (
                        <li key={idx} className="line-clamp-2">{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(exp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      exp.published
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
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
                    className="p-2 rounded-xl bg-slate-950 hover:bg-blue-950 text-blue-400 hover:text-blue-300 border border-slate-800 hover:border-blue-800 transition-colors"
                    title="Edit record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingExperience(exp)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800 transition-colors"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Data Analysis Instructor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company / Organization <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. SQI College of ICT"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Employment Type
              </label>
              <select
                value={formData.employment_type || 'Full-time'}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Leadership">Leadership</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Oyo State, Nigeria"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                End Date {!formData.is_current && <span className="text-slate-400">(leave blank if ongoing)</span>}
              </label>
              <input
                type="date"
                disabled={formData.is_current}
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_current || false}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300">I currently work in this role</span>
            </label>

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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Responsibilities & Accomplishments (one bullet point per line)
            </label>
            <textarea
              rows={4}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="e.g. Design and deliver curriculums covering Python, SQL, and Power BI\nMentor students through end-to-end data capstones"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Technologies / Tools Utilized (comma-separated)
            </label>
            <input
              type="text"
              value={technologiesText}
              onChange={(e) => setTechnologiesText(e.target.value)}
              placeholder="Python, SQL, Power BI, Excel, Pandas"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
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
