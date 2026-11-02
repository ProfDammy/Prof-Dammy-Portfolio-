'use client'

import React, { useState, useEffect } from 'react'
import { MediaAsset } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
import { FeedbackAlert } from '@/components/admin/FeedbackAlert'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { RecordModal } from '@/components/admin/RecordModal'
import {
  Image as ImageIcon,
  FileText,
  FileUp,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Film
} from 'lucide-react'

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null)
  const [editName, setEditName] = useState('')
  const [editAltText, setEditAltText] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const [deletingAsset, setDeletingAsset] = useState<MediaAsset | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching media_assets:', error)
        setFeedback({ type: 'error', message: `Could not load media: ${error.message}` })
      } else {
        setAssets(data || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setFeedback({ type: 'error', message: `Load failed: ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCV: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setFeedback({ type: 'loading', message: `Uploading ${file.name} to Supabase storage...` })

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const isDocument = ['pdf', 'doc', 'docx', 'txt'].includes(ext) || file.type.includes('pdf') || file.type.includes('document')
      const isVideo = ['mp4', 'webm', 'mov'].includes(ext) || file.type.startsWith('video/')
      const mediaType: 'image' | 'video' | 'document' = isDocument ? 'document' : isVideo ? 'video' : 'image'

      const folder = isCV ? 'documents' : mediaType === 'document' ? 'documents' : 'uploads'
      const timestamp = Date.now()
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${folder}/${timestamp}_${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Storage upload error: ${uploadError.message}`)
      }

      const { data: publicData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath)

      const publicUrl = publicData.publicUrl

      if (isCV) {
        await supabase
          .from('profiles')
          .update({ cv_url: publicUrl, updated_at: new Date().toISOString() })
          .neq('id', '00000000-0000-0000-0000-000000000000')
      }

      const assetRecord = {
        name: isCV ? `CV - ${file.name}` : file.name,
        file_path: filePath,
        public_url: publicUrl,
        media_type: mediaType,
        mime_type: file.type || null,
        size_bytes: file.size,
        alt_text: file.name
      }

      const { data: inserted, error: insertError } = await supabase
        .from('media_assets')
        .insert(assetRecord)
        .select()
        .single()

      if (insertError) {
        console.warn('File uploaded to storage but failed to register in media_assets table:', insertError.message)
      } else if (inserted) {
        setAssets((prev) => [inserted, ...prev])
      }

      setFeedback({
        type: 'success',
        message: `${file.name} uploaded successfully and registered in media assets!`
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during upload'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleOpenEdit = (asset: MediaAsset) => {
    setEditingAsset(asset)
    setEditName(asset.name)
    setEditAltText(asset.alt_text || '')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAsset) return

    setSavingEdit(true)
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .update({
          name: editName,
          alt_text: editAltText
        })
        .eq('id', editingAsset.id)
        .select()
        .single()

      if (error) throw error

      setAssets((prev) => prev.map((a) => (a.id === editingAsset.id ? data : a)))
      setFeedback({ type: 'success', message: 'Asset metadata updated successfully!' })
      setEditingAsset(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update'
      setFeedback({ type: 'error', message: `Update error: ${msg}` })
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingAsset) return
    setDeleting(true)

    try {
      if (deletingAsset.file_path) {
        await supabase.storage
          .from('portfolio-media')
          .remove([deletingAsset.file_path])
      }

      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', deletingAsset.id)

      if (error) throw error

      setAssets((prev) => prev.filter((a) => a.id !== deletingAsset.id))
      setFeedback({ type: 'success', message: `"${deletingAsset.name}" deleted successfully.` })
      setDeletingAsset(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      setFeedback({ type: 'error', message: `Could not delete asset: ${msg}` })
    } finally {
      setDeleting(false)
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            Media & Documents Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload images, CV documents, and research files directly to Supabase Storage &amp; database.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAssets}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh Assets
        </button>
      </div>

      {feedback && (
        <FeedbackAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Upload / Replace CV Document
            </h2>
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/70 border border-blue-800/80 px-2 py-0.5 rounded-md">
              PDF Document
            </span>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/60 text-center space-y-3">
            <FileUp className="w-7 h-7 text-blue-400 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Select your updated resume or curriculum vitae
            </p>
            <label className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-blue-600/20">
              {uploading ? 'Uploading...' : 'Choose PDF File'}
              <input
                type="file"
                accept=".pdf,application/pdf"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              Upload Image or Document
            </h2>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
              Any Media
            </span>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/60 text-center space-y-3">
            <Plus className="w-7 h-7 text-blue-400 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Upload project screenshots, certs, or publication PDFs
            </p>
            <label className="inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors">
              {uploading ? 'Uploading...' : 'Browse Local Files'}
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e, false)}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Uploaded Media Assets ({assets.length})
          </h2>
        </div>

        {loading ? (
          <FeedbackAlert type="loading" message="Loading media items from database..." />
        ) : assets.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
            No media assets found in database yet. Use the upload boxes above to upload your first image or document.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div className="h-36 w-full rounded-lg bg-slate-950 overflow-hidden relative flex items-center justify-center border border-slate-800/80">
                  {asset.media_type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : asset.media_type === 'video' ? (
                    <Film className="w-10 h-10 text-slate-600" />
                  ) : (
                    <FileText className="w-10 h-10 text-blue-400" />
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/90 text-slate-300 border border-slate-800">
                    {asset.media_type}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate font-mono">
                    {asset.file_path}
                  </p>
                  {asset.alt_text && (
                    <p className="text-[11px] text-slate-500 italic truncate">
                      Alt: {asset.alt_text}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.public_url, asset.id)}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    title="Copy Public URL"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={asset.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(asset)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingAsset(asset)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete asset"
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

      {editingAsset && (
        <RecordModal
          isOpen={true}
          title="Edit Asset Details"
          subtitle={editingAsset.name}
          onClose={() => setEditingAsset(null)}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alt Text / Description
              </label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                {savingEdit ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </RecordModal>
      )}

      <DeleteConfirmModal
        isOpen={!!deletingAsset}
        title="Delete Media Asset"
        description="Are you sure you want to permanently delete this media file from Supabase storage and remove its asset record?"
        itemName={deletingAsset?.name}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingAsset(null)}
      />
    </div>
  )
}
