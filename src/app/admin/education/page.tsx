'use client'

import React, { useState, useEffect } from 'react'
import { Education, Certification } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  GraduationCap,
  Award,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  ExternalLink,
  Calendar,
  Building2
} from 'lucide-react'

const initialEducationForm: Partial<Education> = {
  degree: '',
  field_of_study: '',
  institution: '',
  location: '',
  start_year: new Date().getFullYear() - 4,
  end_year: new Date().getFullYear(),
  is_current: false,
  grade_or_honors: '',
  activities: '',
  display_order: 0,
  published: true
}

const initialCertForm: Partial<Certification> = {
  title: '',
  issuing_organization: '',
  issue_date: '',
  expiration_date: null,
  credential_id: '',
  credential_url: '',
  display_order: 0,
  published: true
}

export default function AdminEducationPage() {
  const [activeTab, setActiveTab] = useState<'education' | 'certifications'>('education')
  const [educations, setEducations] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [eduModalOpen, setEduModalOpen] = useState(false)
  const [eduForm, setEduForm] = useState<Partial<Education>>(initialEducationForm)
  const [savingEdu, setSavingEdu] = useState(false)
  const [deletingEdu, setDeletingEdu] = useState<Education | null>(null)

  const [certModalOpen, setCertModalOpen] = useState(false)
  const [certForm, setCertForm] = useState<Partial<Certification>>(initialCertForm)
  const [savingCert, setSavingCert] = useState(false)
  const [deletingCert, setDeletingCert] = useState<Certification | null>(null)

  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [eduRes, certRes] = await Promise.all([
        supabase.from('education').select('*').order('display_order', { ascending: true }).order('start_year', { ascending: false }),
        supabase.from('certifications').select('*').order('display_order', { ascending: true }).order('issue_date', { ascending: false })
      ])

      if (eduRes.error) throw eduRes.error
      if (certRes.error) throw certRes.error

      setEducations(eduRes.data || [])
      setCertifications(certRes.data || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown load error'
      setFeedback({ type: 'error', message: `Failed to load records: ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAddEdu = () => {
    setEduForm({
      ...initialEducationForm,
      display_order: educations.length + 1
    })
    setEduModalOpen(true)
  }

  const handleOpenEditEdu = (edu: Education) => {
    setEduForm(edu)
    setEduModalOpen(true)
  }

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eduForm.degree || !eduForm.field_of_study || !eduForm.institution || !eduForm.start_year) {
      setFeedback({ type: 'error', message: 'Degree, Field of Study, Institution, and Start Year are required.' })
      return
    }

    setSavingEdu(true)
    try {
      const payload = {
        degree: eduForm.degree,
        field_of_study: eduForm.field_of_study,
        institution: eduForm.institution,
        location: eduForm.location || null,
        start_year: Number(eduForm.start_year),
        end_year: eduForm.is_current ? null : (eduForm.end_year ? Number(eduForm.end_year) : null),
        is_current: eduForm.is_current || false,
        grade_or_honors: eduForm.grade_or_honors || null,
        activities: eduForm.activities || null,
        display_order: Number(eduForm.display_order) || 0,
        published: eduForm.published !== false
      }

      if (eduForm.id) {
        const { data, error } = await supabase
          .from('education')
          .update(payload)
          .eq('id', eduForm.id)
          .select()
          .single()

        if (error) throw error
        setEducations((prev) => prev.map((e) => (e.id === eduForm.id ? data : e)))
        setFeedback({ type: 'success', message: `Education record updated successfully!` })
      } else {
        const { data, error } = await supabase
          .from('education')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setEducations((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Education record created successfully!` })
      }
      setEduModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Could not save education: ${msg}` })
    } finally {
      setSavingEdu(false)
    }
  }

  const handleDeleteEdu = async () => {
    if (!deletingEdu) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('education').delete().eq('id', deletingEdu.id)
      if (error) throw error

      setEducations((prev) => prev.filter((e) => e.id !== deletingEdu.id))
      setFeedback({ type: 'success', message: `Education record deleted.` })
      setDeletingEdu(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Delete failed: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  const handleOpenAddCert = () => {
    setCertForm({
      ...initialCertForm,
      display_order: certifications.length + 1
    })
    setCertModalOpen(true)
  }

  const handleOpenEditCert = (cert: Certification) => {
    setCertForm(cert)
    setCertModalOpen(true)
  }

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certForm.title || !certForm.issuing_organization || !certForm.issue_date) {
      setFeedback({ type: 'error', message: 'Title, Issuing Organization, and Issue Date are required.' })
      return
    }

    setSavingCert(true)
    try {
      const payload = {
        title: certForm.title,
        issuing_organization: certForm.issuing_organization,
        issue_date: certForm.issue_date,
        expiration_date: certForm.expiration_date || null,
        credential_id: certForm.credential_id || null,
        credential_url: certForm.credential_url || null,
        display_order: Number(certForm.display_order) || 0,
        published: certForm.published !== false
      }

      if (certForm.id) {
        const { data, error } = await supabase
          .from('certifications')
          .update(payload)
          .eq('id', certForm.id)
          .select()
          .single()

        if (error) throw error
        setCertifications((prev) => prev.map((c) => (c.id === certForm.id ? data : c)))
        setFeedback({ type: 'success', message: `Certification "${data.title}" updated!` })
      } else {
        const { data, error } = await supabase
          .from('certifications')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setCertifications((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Certification "${data.title}" added!` })
      }
      setCertModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      setFeedback({ type: 'error', message: `Could not save certification: ${msg}` })
    } finally {
      setSavingCert(false)
    }
  }

  const handleDeleteCert = async () => {
    if (!deletingCert) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', deletingCert.id)
      if (error) throw error

      setCertifications((prev) => prev.filter((c) => c.id !== deletingCert.id))
      setFeedback({ type: 'success', message: `Certification "${deletingCert.title}" deleted.` })
      setDeletingCert(null)
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
            Education &amp; Certifications Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage academic degrees, institutions, honors, and verified technical credentials.
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
            onClick={activeTab === 'education' ? handleOpenAddEdu : handleOpenAddCert}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add {activeTab === 'education' ? 'Education' : 'Certification'}
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

      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'education'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Academic Education ({educations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('certifications')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'certifications'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" /> Certifications &amp; Credentials ({certifications.length})
        </button>
      </div>

      {activeTab === 'education' && (
        <div className="space-y-4">
          {loading ? (
            <FeedbackAlert type="loading" message="Loading education records..." />
          ) : educations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No academic degrees found</p>
              <p className="text-xs text-slate-400">Click &ldquo;Add Education&rdquo; to insert your alma mater.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                    edu.published
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/50 opacity-70 bg-slate-950/40'
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        Order: {edu.display_order}
                      </span>
                      {edu.grade_or_honors && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                          {edu.grade_or_honors}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                    <p className="text-xs font-semibold text-blue-400">{edu.field_of_study}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {edu.institution} {edu.location && `• ${edu.location}`}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {edu.start_year} &ndash; {edu.is_current ? 'Present' : edu.end_year || 'Completed'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        const newStatus = !edu.published
                        await supabase.from('education').update({ published: newStatus }).eq('id', edu.id)
                        setEducations((prev) => prev.map((e) => (e.id === edu.id ? { ...e, published: newStatus } : e)))
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                        edu.published
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {edu.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {edu.published ? 'Published' : 'Draft'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditEdu(edu)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-blue-950 text-blue-400 hover:text-blue-300 border border-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingEdu(edu)}
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
      )}

      {activeTab === 'certifications' && (
        <div className="space-y-4">
          {loading ? (
            <FeedbackAlert type="loading" message="Loading certifications..." />
          ) : certifications.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No certifications recorded</p>
              <p className="text-xs text-slate-400">Click &ldquo;Add Certification&rdquo; to insert verified credentials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                    cert.published
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/50 opacity-70 bg-slate-950/40'
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        Order: {cert.display_order}
                      </span>
                      {cert.credential_id && (
                        <span className="text-[11px] font-mono text-slate-400">
                          ID: {cert.credential_id}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{cert.title}</h3>
                    <p className="text-xs font-semibold text-blue-400">{cert.issuing_organization}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Issued: {cert.issue_date} {cert.expiration_date && `• Expires: ${cert.expiration_date}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        const newStatus = !cert.published
                        await supabase.from('certifications').update({ published: newStatus }).eq('id', cert.id)
                        setCertifications((prev) => prev.map((c) => (c.id === cert.id ? { ...c, published: newStatus } : c)))
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                        cert.published
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {cert.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {cert.published ? 'Published' : 'Draft'}
                    </button>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                        title="Verification Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEditCert(cert)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-blue-950 text-blue-400 hover:text-blue-300 border border-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCert(cert)}
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
      )}

      <RecordModal
        isOpen={eduModalOpen}
        title={eduForm.id ? 'Edit Education Record' : 'Add Education Record'}
        subtitle="Manage academic degree, study field, university, and completion years"
        maxWidth="max-w-2xl"
        onClose={() => setEduModalOpen(false)}
      >
        <form onSubmit={handleSaveEdu} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Degree / Qualification <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={eduForm.degree || ''}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                placeholder="e.g. Bachelor of Technology (B.Tech)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Field of Study / Major <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={eduForm.field_of_study || ''}
                onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })}
                placeholder="e.g. Mathematics / Computer Science"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institution <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={eduForm.institution || ''}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                placeholder="e.g. LAUTECH"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={eduForm.location || ''}
                onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                placeholder="e.g. Oyo State, Nigeria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Year <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                required
                value={eduForm.start_year || ''}
                onChange={(e) => setEduForm({ ...eduForm, start_year: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                End Year {!eduForm.is_current && <span className="text-slate-400">(or expected)</span>}
              </label>
              <input
                type="number"
                disabled={eduForm.is_current}
                value={eduForm.end_year || ''}
                onChange={(e) => setEduForm({ ...eduForm, end_year: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none disabled:opacity-40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={eduForm.display_order ?? 0}
                onChange={(e) => setEduForm({ ...eduForm, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Grade / Honors
              </label>
              <input
                type="text"
                value={eduForm.grade_or_honors || ''}
                onChange={(e) => setEduForm({ ...eduForm, grade_or_honors: e.target.value })}
                placeholder="First Class Honors, Distinction, etc."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Activities / Societies
              </label>
              <input
                type="text"
                value={eduForm.activities || ''}
                onChange={(e) => setEduForm({ ...eduForm, activities: e.target.value })}
                placeholder="Lead Math Tutor, Society President..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eduForm.is_current || false}
                onChange={(e) => setEduForm({ ...eduForm, is_current: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300">Currently studying here</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eduForm.published !== false}
                onChange={(e) => setEduForm({ ...eduForm, published: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300">Publish on public portfolio</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={savingEdu}
              onClick={() => setEduModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdu}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              {savingEdu ? 'Saving...' : eduForm.id ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </RecordModal>

      <RecordModal
        isOpen={certModalOpen}
        title={certForm.id ? 'Edit Certification' : 'Add Certification'}
        subtitle="Manage professional credentials, certificate ID, and verification links"
        maxWidth="max-w-xl"
        onClose={() => setCertModalOpen(false)}
      >
        <form onSubmit={handleSaveCert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Certification Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={certForm.title || ''}
              onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
              placeholder="e.g. Certified Data Analyst Professional"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Issuing Organization <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={certForm.issuing_organization || ''}
              onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
              placeholder="e.g. SQI College of ICT, Microsoft, Google"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Issue Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={certForm.issue_date || ''}
                onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Expiration Date
              </label>
              <input
                type="date"
                value={certForm.expiration_date || ''}
                onChange={(e) => setCertForm({ ...certForm, expiration_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Credential ID
              </label>
              <input
                type="text"
                value={certForm.credential_id || ''}
                onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                placeholder="e.g. SQI-DA-2023"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={certForm.display_order ?? 0}
                onChange={(e) => setCertForm({ ...certForm, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Credential Verification URL
            </label>
            <input
              type="url"
              value={certForm.credential_url || ''}
              onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
              placeholder="https://edu.sqi.ng/verify..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={certForm.published !== false}
                onChange={(e) => setCertForm({ ...certForm, published: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300">Publish on public portfolio</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={savingCert}
              onClick={() => setCertModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingCert}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              {savingCert ? 'Saving...' : certForm.id ? 'Save Changes' : 'Add Certification'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingEdu}
        title="Delete Education Record"
        description="Are you sure you want to permanently delete this degree record?"
        itemName={`${deletingEdu?.degree} - ${deletingEdu?.institution}`}
        loading={deleting}
        onConfirm={handleDeleteEdu}
        onCancel={() => setDeletingEdu(null)}
      />

      <DeleteConfirmModal
        isOpen={!!deletingCert}
        title="Delete Certification"
        description="Are you sure you want to delete this credential?"
        itemName={deletingCert?.title}
        loading={deleting}
        onConfirm={handleDeleteCert}
        onCancel={() => setDeletingCert(null)}
      />
    </div>
  )
}
