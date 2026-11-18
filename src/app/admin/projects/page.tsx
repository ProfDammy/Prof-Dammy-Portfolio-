'use client'

import React, { useState, useEffect } from 'react'
import { Project } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Code2,
  RotateCcw,
  Eye,
  EyeOff,
  Star,
  ImagePlus,
  X,
  Upload
} from 'lucide-react'

const initialProjectForm: Partial<Project> = {
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  category: 'Data Analytics',
  status: 'completed',
  is_featured: false,
  image_url: '',
  demo_url: '',
  github_url: '',
  technologies: [],
  metrics_highlights: [],
  display_order: 0,
  published: true
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>(initialProjectForm)
  const [technologiesText, setTechnologiesText] = useState('')
  const [metricsText, setMetricsText] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        setFeedback({ type: 'error', message: `Failed to load projects: ${error.message}` })
      } else {
        setProjects(data || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown load error'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleOpenAdd = () => {
    setFormData({
      ...initialProjectForm,
      display_order: projects.length + 1
    })
    setTechnologiesText('')
    setMetricsText('')
    setSelectedImage(null)
    setRemoveCurrentImage(false)
    setImagePreview(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setFormData(project)
    setTechnologiesText((project.technologies || []).join(', '))
    setMetricsText((project.metrics_highlights || []).join('\n'))
    setSelectedImage(null)
    setRemoveCurrentImage(false)
    setImagePreview(project.image_url || null)
    setModalOpen(true)
  }

  const handleSlugify = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  const handleImageSelection = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please choose an image file.' })
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image must be 8 MB or smaller.' })
      return
    }

    setSelectedImage(file)
    setRemoveCurrentImage(false)
    setImagePreview(URL.createObjectURL(file))
  }

  const getPortfolioStoragePath = (publicUrl: string) => {
    try {
      const url = new URL(publicUrl)
      const marker = '/storage/v1/object/public/portfolio-media/'
      const index = url.pathname.indexOf(marker)
      return index >= 0 ? decodeURIComponent(url.pathname.slice(index + marker.length)) : null
    } catch {
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.short_description || !formData.category) {
      setFeedback({ type: 'error', message: 'Title, Short Description, and Category are required.' })
      return
    }

    setSaving(true)
    let newlyUploadedImagePath: string | null = null
    try {
      const autoSlug = formData.slug?.trim() || handleSlugify(formData.title)
      const parsedTech = technologiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const parsedMetrics = metricsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const previousImageUrl = formData.image_url || null
      let nextImageUrl = removeCurrentImage ? null : previousImageUrl
      if (selectedImage) {
        const extension = selectedImage.name.split('.').pop()?.toLowerCase() || 'jpg'
        const safeSlug = autoSlug.replace(/[^a-z0-9-]/g, '') || 'project'
        newlyUploadedImagePath = `projects/${safeSlug}-${Date.now()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(newlyUploadedImagePath, selectedImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: selectedImage.type
          })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(newlyUploadedImagePath)

        nextImageUrl = publicUrlData.publicUrl
      }

      const payload = {
        title: formData.title,
        slug: autoSlug,
        short_description: formData.short_description,
        full_description: formData.full_description || null,
        category: formData.category,
        status: formData.status || 'completed',
        is_featured: formData.is_featured || false,
        image_url: nextImageUrl,
        demo_url: formData.demo_url || null,
        github_url: formData.github_url || null,
        technologies: parsedTech,
        metrics_highlights: parsedMetrics,
        display_order: Number(formData.display_order) || 0,
        published: formData.published !== false,
        updated_at: new Date().toISOString()
      }

      if (formData.id) {
        const { data, error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', formData.id)
          .select()
          .single()

        if (error) throw error

        setProjects((prev) => prev.map((p) => (p.id === formData.id ? data : p)))
        if ((selectedImage || removeCurrentImage) && previousImageUrl) {
          const oldPath = getPortfolioStoragePath(previousImageUrl)
          if (oldPath) {
            try {
              await supabase.storage.from('portfolio-media').remove([oldPath])
            } catch (cleanupError) {
              console.warn('The previous project image could not be removed from storage:', cleanupError)
            }
          }
        }
        setFeedback({ type: 'success', message: `Project "${data.title}" updated successfully!` })
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(payload)
          .select()
          .single()

        if (error) throw error

        setProjects((prev) => [...prev, data])
        setFeedback({ type: 'success', message: `Project "${data.title}" created successfully!` })
      }

      setModalOpen(false)
    } catch (err: unknown) {
      if (newlyUploadedImagePath) {
        await supabase.storage.from('portfolio-media').remove([newlyUploadedImagePath])
      }
      const msg = err instanceof Error ? err.message : 'Database error'
      setFeedback({ type: 'error', message: `Could not save project: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingProject) return
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deletingProject.id)

      if (error) throw error

      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id))
      setFeedback({ type: 'success', message: `Project "${deletingProject.title}" deleted successfully.` })
      setDeletingProject(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      setFeedback({ type: 'error', message: `Could not delete project: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  const handleTogglePublish = async (project: Project) => {
    const updatedStatus = !project.published
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', project.id)

      if (error) throw error

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: updatedStatus } : p))
      )
      setFeedback({
        type: 'success',
        message: `Project "${project.title}" ${updatedStatus ? 'published' : 'moved to draft'} successfully.`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status toggle failed'
      setFeedback({ type: 'error', message: `Could not change published status: ${msg}` })
    }
  }

  return (
    <div className="space-y-5 mx-auto w-full max-w-6xl pb-12">
      {/* Page actions: the fixed workspace header already provides the page title. */}
      <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProjects}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Project
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
          <FeedbackAlert type="loading" message="Loading projects from Supabase database..." />
        ) : projects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">No projects found in database</p>
            <p className="text-xs text-slate-600">Click &ldquo;Add New Project&rdquo; to add your first work sample.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all ${
                  project.published
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-70 bg-slate-50'
                } flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                      Order: {project.display_order}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {project.category}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      project.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    {project.is_featured && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300" /> Featured
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {project.short_description}
                    </p>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {project.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      project.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
                    }`}
                  >
                    {project.published ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Draft
                      </>
                    )}
                  </button>

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                      title="Demo URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                      title="GitHub Repository"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(project)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors"
                    title="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingProject(project)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-colors"
                    title="Delete project"
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
        title={formData.id ? 'Edit Project' : 'Add New Project'}
        subtitle="Manage project details, slug, technologies, URLs, and showcase status"
        maxWidth="max-w-3xl"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Project Title <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => {
                  const title = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: prev.id ? prev.slug : handleSlugify(title)
                  }))
                }}
                placeholder="e.g. Student Analytics Dashboard"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                URL Slug <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="student-analytics-dashboard"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Category <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Data Analytics, AI Solution, etc."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status || 'completed'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'completed' | 'in_progress' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order ?? 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Short Description <span className="text-rose-700">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.short_description || ''}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="High-level overview of the project shown on project cards..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Full Description / Methodology
            </label>
            <textarea
              rows={4}
              value={formData.full_description || ''}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="Detailed architecture, findings, business impact..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="Python, Power BI, SQL, Pandas"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Project screenshot / landing-page image
                </label>
                <span className="text-[11px] text-slate-500">PNG, JPG, WEBP · Max 8 MB</span>
              </div>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Project screenshot preview"
                    className="w-full max-h-64 object-contain"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white">
                      <Upload className="h-3.5 w-3.5" />
                      Replace image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) => handleImageSelection(event.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null)
                        setRemoveCurrentImage(true)
                        setImagePreview(null)
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">Upload project screenshot</span>
                  <span className="text-xs text-slate-500">Choose a screenshot of the project's landing page</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => handleImageSelection(event.target.files?.[0])}
                  />
                </label>
              )}
              <p className="mt-2 text-[11px] text-slate-500">
                The image is uploaded to your portfolio-media storage bucket and attached only to this project.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Live Demo / Dashboard URL
              </label>
              <input
                type="url"
                value={formData.demo_url || ''}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.github_url || ''}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Key Metrics / Impact Highlights (one per line)
            </label>
            <textarea
              rows={3}
              value={metricsText}
              onChange={(e) => setMetricsText(e.target.value)}
              placeholder="e.g. 98% accuracy in customer retention\nDecreased query latency by 45%"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50 border-slate-200 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">Feature this project prominently</span>
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </RecordModal>

      <DeleteConfirmModal
        isOpen={!!deletingProject}
        title="Delete Project"
        description="Are you sure you want to permanently delete this project from the database?"
        itemName={deletingProject?.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  )
}
