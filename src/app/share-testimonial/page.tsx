'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, CheckCircle2, ImagePlus, Send, X } from 'lucide-react'

const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ShareTestimonialPage() {
  const [form, setForm] = useState({
    client_name: '',
    professional_title: '',
    organization: '',
    location: '',
    relationship: '',
    message: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setError('')
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, or WEBP image.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError('Your picture must be 5 MB or smaller.')
      event.target.value = ''
      return
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(null)
    setPhotoPreview('')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    let photoUrl: string | null = null
    let uploadedPath: string | null = null

    try {
      if (photo) {
        const extension = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
        uploadedPath = `submissions/${crypto.randomUUID()}.${extension}`
        const { error: uploadError } = await supabase.storage
          .from('testimonial-photos')
          .upload(uploadedPath, photo, {
            cacheControl: '3600',
            upsert: false,
            contentType: photo.type,
          })
        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('testimonial-photos')
          .getPublicUrl(uploadedPath)
        photoUrl = data.publicUrl
      }

      const { error: insertError } = await supabase.from('testimonials').insert({
        ...form,
        professional_title: form.professional_title || null,
        organization: form.organization || null,
        location: form.location.trim() || null,
        relationship: form.relationship || null,
        photo_url: photoUrl,
        status: 'pending',
        featured: false,
      })
      if (insertError) throw insertError

      setSubmitted(true)
      setForm({
        client_name: '',
        professional_title: '',
        organization: '',
        location: '',
        relationship: '',
        message: '',
      })
      removePhoto()
    } catch (err) {
      // Remove an uploaded image if the testimonial record could not be saved.
      if (uploadedPath) {
        await supabase.storage.from('testimonial-photos').remove([uploadedPath])
      }
      console.error('Testimonial submission failed:', err)
      setError('We could not submit your testimonial. Please try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700">
          <ArrowLeft size={17} /> Back to portfolio
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-7 py-9 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-blue-300">
              A note from Damilola
            </p>
            <h1 className="mt-3 text-3xl font-bold !text-white sm:text-4xl">
              Share your experience
            </h1>
            <p className="mt-4 max-w-2xl leading-7 !text-slate-300">
              Thank you for taking a moment to share your experience of working, learning, or collaborating with me. Your feedback is genuinely appreciated.
            </p>
          </div>

          <div className="p-7 sm:p-10">
            {submitted ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-900">
                <CheckCircle2 className="mb-3 h-8 w-8" />
                <h2 className="text-xl font-bold">Thank you for your testimonial.</h2>
                <p className="mt-2 text-sm leading-6">Your response has been received. It will be reviewed before it is published on the portfolio.</p>
                <Link href="/" className="mt-5 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Return to portfolio</Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">Your name *
                    <input required maxLength={160} value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">Professional title (optional)
                    <input maxLength={160} value={form.professional_title} onChange={e => setForm({ ...form, professional_title: e.target.value })} placeholder="e.g. Mr, Dr, Prof., Engineer" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">Organisation (optional)
                    <input maxLength={180} value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">Location (optional)
                    <input maxLength={180} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Manchester, England, UK" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                  </label>

                  <label className="block text-sm font-medium text-slate-700 sm:col-span-2">How do you know or work with me? (optional)
                    <input maxLength={160} value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} placeholder="e.g. Student, Client, Colleague" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">Your testimonial *
                  <textarea required minLength={12} maxLength={2000} rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your experience…" className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                </label>

                <div>
                  <p className="text-sm font-medium text-slate-700">Your picture (optional)</p>
                  <p className="mt-1 text-xs text-slate-500">Upload a JPG, PNG, or WEBP image, up to 5 MB.</p>
                  {photoPreview ? (
                    <div className="mt-3 flex items-center gap-4 rounded-2xl border border-slate-200 p-3">
                      <img src={photoPreview} alt="Selected picture preview" className="h-16 w-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{photo?.name}</p>
                        <p className="text-xs text-slate-500">Ready to upload</p>
                      </div>
                      <button type="button" onClick={removePhoto} aria-label="Remove selected picture" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
                    </div>
                  ) : (
                    <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50">
                      <ImagePlus className="h-8 w-8 text-blue-700" />
                      <span className="mt-2 text-sm font-semibold text-slate-800">Choose a picture</span>
                      <span className="mt-1 text-xs text-slate-500">JPG, PNG or WEBP · Max 5 MB</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" />
                    </label>
                  )}
                </div>

                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <p className="text-xs leading-5 text-slate-500">Your testimonial will not appear on the website immediately. It will only be published after review and approval.</p>
                <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                  <Send size={16} /> {submitting ? 'Submitting…' : 'Submit testimonial'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
