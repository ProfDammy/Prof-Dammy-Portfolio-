'use client'

import React, { useState, useEffect } from 'react'
import { Skill } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react'

const initialSkillForm: Partial<Skill> = {
  category: 'Data Analytics & BI',
  name: '',
  proficiency_level: 85,
  icon_name: 'Database',
  description: '',
  display_order: 0,
  published: true
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Skill>>(initialSkillForm)
  const [saving, setSaving] = useState(false)

  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching skills:', error)
        setFeedback({ type: 'error', message: `Failed to load skills: ${error.message}` })
      } else {
        setSkills(data || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown load error'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleOpenAdd = () => {
    setFormData({
      ...initialSkillForm,
      display_order: skills.length + 1
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (skill: Skill) => {
    setFormData(skill)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category) {
      setFeedback({ type: 'error', message: 'Skill Name and Category are required.' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        category: formData.category,
        name: formData.name,
        proficiency_level: formData.proficiency_level ? Number(formData.proficiency_level) : null,
        icon_name: formData.icon_name || null,
        description: formData.description || null,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error

        setSkills((prev) => prev.map((s) => (s.id === formData.id ? data : s)))
        setFeedback({ type: 'success', message: `Skill "${data.name}" updated successfully!` })
      } else {
        const { data, error } = await supabase
          .from('skills')
          .insert(payload)
          .select()
          .single()

        if (error) throw error

        setSkills((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Skill "${data.name}" added successfully!` })
      }

      setModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database error'
      setFeedback({ type: 'error', message: `Could not save skill: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingSkill) return
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', deletingSkill.id)

      if (error) throw error

      setSkills((prev) => prev.filter((s) => s.id !== deletingSkill.id))
      setFeedback({ type: 'success', message: `Skill "${deletingSkill.name}" deleted.` })
      setDeletingSkill(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      setFeedback({ type: 'error', message: `Could not delete skill: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  const handleTogglePublish = async (skill: Skill) => {
    const updatedStatus = !skill.published
    try {
      const { error } = await supabase
        .from('skills')
        .update({ published: updatedStatus })
        .eq('id', skill.id)

      if (error) throw error

      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, published: updatedStatus } : s))
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
            <Wrench className="w-6 h-6 text-blue-500" />
            Skills Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure technical proficiencies, tools, categories, and proficiency bars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSkills}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Skill
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
          <FeedbackAlert type="loading" message="Loading skills from Supabase database..." />
        ) : skills.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No skills records found</p>
            <p className="text-xs text-slate-400">Click &ldquo;Add Skill&rdquo; to insert your capabilities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`p-4 rounded-2xl bg-slate-900 border transition-all ${
                  skill.published
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-slate-800/50 opacity-70 bg-slate-950/40'
                } flex flex-col justify-between gap-3`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {skill.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Order: {skill.display_order}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                    {skill.proficiency_level && (
                      <span className="text-xs font-bold text-blue-400">
                        {skill.proficiency_level}%
                      </span>
                    )}
                  </div>

                  {skill.proficiency_level && (
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${skill.proficiency_level}%` }}
                      />
                    </div>
                  )}

                  {skill.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {skill.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                      skill.published
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {skill.published ? (
                      <>
                        <Eye className="w-3 h-3" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Draft
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(skill)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-blue-950 text-blue-400 hover:text-blue-300 border border-slate-800 transition-colors"
                      title="Edit skill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingSkill(skill)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-slate-800 transition-colors"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RecordModal
        isOpen={modalOpen}
        title={formData.id ? 'Edit Skill' : 'Add New Skill'}
        subtitle="Configure skill category, proficiency bar (1-100), and description"
        maxWidth="max-w-xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Skill Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Power BI & DAX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Data Analytics & BI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Proficiency Level (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.proficiency_level ?? 85}
                onChange={(e) => setFormData({ ...formData, proficiency_level: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Icon Name
              </label>
              <input
                type="text"
                value={formData.icon_name || ''}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="BarChart3, Database..."
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
              Description / Tool Overview
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Interactive dashboard design, DAX formulas, data modeling..."
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
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingSkill}
        title="Delete Skill Record"
        description="Are you sure you want to delete this technical skill entry from the database?"
        itemName={deletingSkill?.name}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingSkill(null)}
      />
    </div>
  )
}
