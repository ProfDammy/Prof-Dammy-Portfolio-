'use client'

import React, { useState, useEffect } from 'react'
import { Profile } from '@/types/database'
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
  Link as LinkIcon
} from 'lucide-react'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(mockProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile from Supabase:', error)
        setFeedback({ type: 'error', message: `Could not load profile from database: ${error.message}` })
      } else if (data) {
        setProfile({
          ...mockProfile,
          ...data,
          social_links: data.social_links || mockProfile.social_links
        })
      } else {
        setProfile(mockProfile)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setFeedback({ type: 'error', message: `Error loading profile: ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback({ type: 'loading', message: 'Saving profile to database...' })

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
        social_links: profile.social_links || {},
        cv_url: profile.cv_url,
        published: profile.published !== false,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
      }

      setFeedback({ type: 'success', message: 'Profile updated successfully in Supabase!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save'
      setFeedback({ type: 'error', message: `Database error: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  const updateSocialLink = (key: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      social_links: {
        ...(prev.social_links || {}),
        [key]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <FeedbackAlert type="loading" message="Loading profile from Supabase..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            Profile & Biography Editor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal identity, bio, contact details, and public visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfile}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reload
        </button>
      </div>

      {feedback && (
        <FeedbackAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Core Information</h2>
            <button
              type="button"
              onClick={() => setProfile({ ...profile, published: !profile.published })}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                profile.published !== false
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {profile.published !== false ? (
                <>
                  <Eye className="w-3.5 h-3.5" /> Published (Public)
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hidden (Draft)
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.professional_title}
                onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Bio / Tagline <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detailed Biography (About Section)
            </label>
            <textarea
              rows={6}
              value={profile.detailed_about || ''}
              onChange={(e) => setProfile({ ...profile, detailed_about: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Media & Assets Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={profile.avatar_url || ''}
                placeholder="https://..."
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Banner Media URL
              </label>
              <input
                type="text"
                value={profile.hero_media_url || ''}
                placeholder="https://..."
                onChange={(e) => setProfile({ ...profile, hero_media_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Public CV / Resume URL
              </label>
              <input
                type="text"
                value={profile.cv_url || ''}
                placeholder="/documents/Damilola_Oluwagbamila_CV.pdf or https://..."
                onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> Contact Email
              </label>
              <input
                type="email"
                value={profile.contact_email || ''}
                placeholder="contact@profdammy.com"
                onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone Number
              </label>
              <input
                type="text"
                value={profile.contact_phone || ''}
                placeholder="+234..."
                onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Location
              </label>
              <input
                type="text"
                value={profile.location || ''}
                placeholder="Oyo State, Nigeria"
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-blue-400" /> Social & Academic Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub</label>
              <input
                type="url"
                value={profile.social_links?.github || ''}
                placeholder="https://github.com/..."
                onChange={(e) => updateSocialLink('github', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn</label>
              <input
                type="url"
                value={profile.social_links?.linkedin || ''}
                placeholder="https://linkedin.com/in/..."
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Twitter / X</label>
              <input
                type="url"
                value={profile.social_links?.twitter || ''}
                placeholder="https://twitter.com/..."
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Scholar</label>
              <input
                type="url"
                value={profile.social_links?.google_scholar || ''}
                placeholder="https://scholar.google.com/..."
                onChange={(e) => updateSocialLink('google_scholar', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Profile to Database'}
          </button>
        </div>
      </form>
    </div>
  )
}
