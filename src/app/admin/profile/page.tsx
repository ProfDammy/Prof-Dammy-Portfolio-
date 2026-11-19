
'use client'

import React, { useEffect, useState } from 'react'
import type { Profile } from '@/types/database'
import { mockProfile } from '@/lib/mockData'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import {
  User,
  Save,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  Camera,
  Trash2,
  CheckCircle2,
} from 'lucide-react'

type UploadKind = 'avatar' | 'hero' | 'cv'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(mockProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<UploadKind | null>(null)
  const [cropImage, setCropImage] = useState<{ file: File; url: string } | null>(null)
  const [cropZoom, setCropZoom] = useState(1)
  const [cropX, setCropX] = useState(50)
  const [cropY, setCropY] = useState(50)

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'loading'
    message: string
  } | null>(null)

  const fetchProfile = async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setProfile({
          ...mockProfile,
          ...data,
          social_links: data.social_links || {},
        })
      } else {
        setProfile(mockProfile)
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown error'

      setFeedback({
        type: 'error',
        message: `Could not load profile: ${message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const updateSocialLink = (key: string, value: string) => {
    setProfile((previous) => ({
      ...previous,
      social_links: {
        ...(previous.social_links || {}),
        [key]: value,
      },
    }))
  }

  const updateProfile = (key: keyof Profile, value: string | null) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const uploadSelectedFile = async (file: File, kind: UploadKind) => {
    try {
      if (kind === 'avatar' || kind === 'hero') {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select a valid image file.')
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Images must not exceed 5 MB.')
        }
      }

      if (kind === 'cv') {
        if (
          file.type !== 'application/pdf' &&
          !file.name.toLowerCase().endsWith('.pdf')
        ) {
          throw new Error('Please upload a PDF document.')
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Your CV must not exceed 10 MB.')
        }
      }

      setUploading(kind)
      setFeedback({
        type: 'loading',
        message: `Uploading ${file.name} to Supabase Storage...`,
      })

      const folder =
        kind === 'avatar'
          ? 'profile/avatar'
          : kind === 'hero'
            ? 'profile/hero'
            : 'documents'

      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${folder}/${Date.now()}_${cleanName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: publicData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath)

      const publicUrl = publicData.publicUrl

      const field =
        kind === 'avatar'
          ? 'avatar_url'
          : kind === 'hero'
            ? 'hero_media_url'
            : 'cv_url'

      updateProfile(field, publicUrl)

      const { error: assetError } = await supabase
        .from('media_assets')
        .insert({
          name: file.name,
          file_path: filePath,
          public_url: publicUrl,
          media_type: kind === 'cv' ? 'document' : 'image',
          mime_type: file.type || null,
          size_bytes: file.size,
          alt_text:
            kind === 'avatar'
              ? 'Profile photograph'
              : kind === 'hero'
                ? 'Homepage hero banner'
                : 'Professional CV',
        })

      if (assetError) {
        console.warn('Upload succeeded but media registration failed:', assetError.message)
      }

      setFeedback({
        type: 'success',
        message: `${kind === 'avatar' ? 'Profile photograph' : kind === 'hero' ? 'Hero banner' : 'CV'} uploaded successfully. Remember to save your profile.`,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown upload error'

      setFeedback({
        type: 'error',
        message,
      })
    } finally {
      setUploading(null)
    }
  }

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    kind: UploadKind,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const input = event.target

    if (kind === 'avatar') {
      if (!file.type.startsWith('image/')) {
        setFeedback({ type: 'error', message: 'Please select a valid image file.' })
        input.value = ''
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setFeedback({ type: 'error', message: 'Images must not exceed 5 MB.' })
        input.value = ''
        return
      }

      const url = URL.createObjectURL(file)
      setCropImage({ file, url })
      setCropZoom(1)
      setCropX(50)
      setCropY(50)
      input.value = ''
      return
    }

    void uploadSelectedFile(file, kind)
    input.value = ''
  }

  const applyAvatarCrop = async () => {
    if (!cropImage) return

    try {
      const image = new Image()
      image.src = cropImage.url
      await image.decode()

      const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) / cropZoom
      const sourceX = (image.naturalWidth - sourceSize) * (cropX / 100)
      const sourceY = (image.naturalHeight - sourceSize) * (cropY / 100)

      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1200

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not prepare the cropped image.')

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        canvas.width,
        canvas.height,
      )

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => result ? resolve(result) : reject(new Error('Could not create the cropped image.')),
          'image/jpeg',
          0.92,
        )
      })

      const croppedFile = new File(
        [blob],
        `profile-${Date.now()}.jpg`,
        { type: 'image/jpeg' },
      )

      URL.revokeObjectURL(cropImage.url)
      setCropImage(null)
      await uploadSelectedFile(croppedFile, 'avatar')
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Could not crop the selected image.',
      })
    }
  }

  const cancelAvatarCrop = () => {
    if (cropImage) URL.revokeObjectURL(cropImage.url)
    setCropImage(null)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()

    setSaving(true)
    setFeedback({
      type: 'loading',
      message: 'Saving profile to Supabase...',
    })

    try {
      const payload = {
        id: profile.id || 'a0000000-0000-0000-0000-000000000001',
        full_name: profile.full_name,
        professional_title: profile.professional_title,
        bio: profile.bio,
        detailed_about: profile.detailed_about,
        avatar_url: profile.avatar_url,
        hero_media_url: profile.hero_media_url,
        contact_email: profile.contact_email,
        contact_phone: profile.contact_phone,
        location: profile.location,
        social_links: {
          linkedin: profile.social_links?.linkedin || '',
          github: profile.social_links?.github || '',
          facebook: profile.social_links?.facebook || '',
          instagram: profile.social_links?.instagram || '',
          youtube: profile.social_links?.youtube || '',
        },
        cv_url: profile.cv_url,
        published: profile.published !== false,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setProfile({
          ...profile,
          ...data,
        })
      }

      setFeedback({
        type: 'success',
        message: 'Profile successfully saved to Supabase!',
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to save profile'

      setFeedback({
        type: 'error',
        message: `Database error: ${message}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100'

  const labelClass =
    'mb-1.5 block text-xs font-semibold text-slate-700'

  if (loading) {
    return (
      <div className="space-y-4">
        <FeedbackAlert
          type="loading"
          message="Loading profile from Supabase..."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      {/* Page actions: the workspace layout already provides the page title. */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={fetchProfile}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          <RotateCcw className="h-4 w-4" />
          Reload Profile
        </button>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core information */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Core Information
            </h2>

            <button
              type="button"
              onClick={() =>
                setProfile({
                  ...profile,
                  published: !profile.published,
                })
              }
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                profile.published !== false
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {profile.published !== false ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Published
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Hidden / Draft
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                required
                value={profile.full_name}
                onChange={(e) =>
                  updateProfile('full_name', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Professional Title *</label>
              <input
                required
                value={profile.professional_title}
                onChange={(e) =>
                  updateProfile('professional_title', e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Short Bio / Tagline *</label>
            <textarea
              required
              rows={3}
              value={profile.bio}
              onChange={(e) => updateProfile('bio', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Detailed Biography</label>
            <textarea
              rows={7}
              value={profile.detailed_about || ''}
              onChange={(e) =>
                updateProfile('detailed_about', e.target.value)
              }
              className={inputClass}
            />
          </div>
        </section>

        {/* Media and assets */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
              <ImageIcon className="h-5 w-5 text-blue-700" />
              Media & Assets
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Upload your own photographs, homepage banner and professional
              CV directly to your portfolio media library.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Avatar */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Camera className="h-4 w-4 text-blue-700" />
                  Profile Photograph
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Your professional portrait displayed on the website.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt="Profile preview"
                    className="h-36 w-36 rounded-full border-4 border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white">
                    <User className="h-12 w-12 text-slate-500" />
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500">
                    <Upload className="h-4 w-4" />
                    {uploading === 'avatar' ? 'Uploading...' : 'Upload & Crop Photograph'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploading !== null}
                      onChange={(e) => handleFileUpload(e, 'avatar')}
                      className="hidden"
                    />
                  </label>

                  {profile.avatar_url && (
                    <button
                      type="button"
                      onClick={() => updateProfile('avatar_url', null)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-center text-[11px] text-slate-500">
                  JPG, PNG or WebP. Maximum 5 MB.
                </p>
              </div>

              <div>
                <label className={labelClass}>Or use an image URL</label>
                <input
                  type="url"
                  value={profile.avatar_url || ''}
                  onChange={(e) =>
                    updateProfile('avatar_url', e.target.value || null)
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Hero banner */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <ImageIcon className="h-4 w-4 text-blue-700" />
                  Homepage Hero Banner
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  The visual used in your homepage hero area.
                </p>
              </div>

              <div className="space-y-3">
                {profile.hero_media_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.hero_media_url}
                    alt="Hero banner preview"
                    className="h-36 w-full rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-slate-500" />
                      <p className="mt-2 text-xs text-slate-500">
                        No hero banner selected
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500">
                    <Upload className="h-4 w-4" />
                    {uploading === 'hero' ? 'Uploading...' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploading !== null}
                      onChange={(e) => handleFileUpload(e, 'hero')}
                      className="hidden"
                    />
                  </label>

                  {profile.hero_media_url && (
                    <button
                      type="button"
                      onClick={() => updateProfile('hero_media_url', null)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  JPG, PNG or WebP. Maximum 5 MB.
                </p>
              </div>

              <div>
                <label className={labelClass}>Or use an image URL</label>
                <input
                  type="url"
                  value={profile.hero_media_url || ''}
                  onChange={(e) =>
                    updateProfile('hero_media_url', e.target.value || null)
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* CV */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileText className="h-4 w-4 text-blue-700" />
              Public CV / Resume
            </h3>

            <p className="mt-1 text-xs text-slate-600">
              Upload the latest PDF version of your professional CV.
            </p>

            {profile.cv_url && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-xs font-medium text-blue-700 hover:text-blue-700"
                >
                  View current CV
                </a>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500">
                <Upload className="h-4 w-4" />
                {uploading === 'cv' ? 'Uploading...' : 'Upload CV PDF'}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  disabled={uploading !== null}
                  onChange={(e) => handleFileUpload(e, 'cv')}
                  className="hidden"
                />
              </label>

              {profile.cv_url && (
                <button
                  type="button"
                  onClick={() => updateProfile('cv_url', null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove CV
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className={labelClass}>Or enter a CV URL</label>
              <input
                type="url"
                value={profile.cv_url || ''}
                onChange={(e) =>
                  updateProfile('cv_url', e.target.value || null)
                }
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              PDF only. Maximum 10 MB.
            </p>
          </div>
        </section>

        {/* Contact information */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="border-b border-slate-200 pb-3 text-base font-bold tracking-tight text-slate-900">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>
                <Mail className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
                Email
              </label>
              <input
                type="email"
                value={profile.contact_email || ''}
                onChange={(e) =>
                  updateProfile('contact_email', e.target.value)
                }
                placeholder="contact@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Phone className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
                Phone Number
              </label>
              <input
                type="text"
                value={profile.contact_phone || ''}
                onChange={(e) =>
                  updateProfile('contact_phone', e.target.value)
                }
                placeholder="+234..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
                Location
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) =>
                  updateProfile('location', e.target.value)
                }
                placeholder="Ogun State, Nigeria"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Social profiles */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
              <LinkIcon className="h-4 w-4 text-blue-700" />
              Social Media Profiles
            </h2>

            <p className="mt-2 text-xs text-slate-600">
              Manage the five social platforms displayed on your public portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                key: 'linkedin',
                label: 'LinkedIn',
                placeholder: 'https://linkedin.com/in/...',
              },
              {
                key: 'github',
                label: 'GitHub',
                placeholder: 'https://github.com/...',
              },
              {
                key: 'facebook',
                label: 'Facebook',
                placeholder: 'https://facebook.com/...',
              },
              {
                key: 'instagram',
                label: 'Instagram',
                placeholder: 'https://instagram.com/...',
              },
              {
                key: 'youtube',
                label: 'YouTube',
                placeholder: 'https://youtube.com/@...',
              },
            ].map((social) => (
              <div key={social.key}>
                <label className={labelClass}>{social.label}</label>
                <input
                  type="url"
                  value={
                    profile.social_links?.[social.key] || ''
                  }
                  placeholder={social.placeholder}
                  onChange={(e) =>
                    updateSocialLink(social.key, e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={saving || uploading !== null}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving Profile...' : 'Save Profile to Database'}
          </button>
        </div>
      </form>

      {cropImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="avatar-crop-title"
        >
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="avatar-crop-title" className="text-lg font-bold text-slate-900">
                  Crop profile photograph
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Adjust the zoom and position, then preview your square profile image.
                </p>
              </div>
              <button
                type="button"
                onClick={cancelAvatarCrop}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>

            <div className="mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={cropImage.url}
                alt="Crop preview"
                className="h-full w-full object-cover"
                style={{
                  objectPosition: `${cropX}% ${cropY}%`,
                  transform: `scale(${cropZoom})`,
                }}
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="crop-zoom" className="font-medium text-slate-700">Zoom</label>
                  <span className="text-slate-500">{cropZoom.toFixed(1)}×</span>
                </div>
                <input
                  id="crop-zoom"
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={cropZoom}
                  onChange={(event) => setCropZoom(Number(event.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="crop-horizontal" className="font-medium text-slate-700">Horizontal position</label>
                  <span className="text-slate-500">{cropX}%</span>
                </div>
                <input
                  id="crop-horizontal"
                  type="range"
                  min="0"
                  max="100"
                  value={cropX}
                  onChange={(event) => setCropX(Number(event.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="crop-vertical" className="font-medium text-slate-700">Vertical position</label>
                  <span className="text-slate-500">{cropY}%</span>
                </div>
                <input
                  id="crop-vertical"
                  type="range"
                  min="0"
                  max="100"
                  value={cropY}
                  onChange={(event) => setCropY(Number(event.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelAvatarCrop}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyAvatarCrop}
                disabled={uploading !== null}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading === 'avatar' ? 'Uploading...' : 'Apply crop & upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
