
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { MediaAsset } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'
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
  Film,
  Grid3X3,
  List,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Download,
  RefreshCw,
  Eye,
  Save,
  Upload,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileImage,
} from 'lucide-react'

type ManagedMediaAsset = MediaAsset & { show_in_gallery?: boolean }

type Feedback = {
  type: 'success' | 'error' | 'loading' | 'warning'
  message: string
} | null

type CropMode = 'new' | 'replace' | 'copy'

type CropState = {
  imageUrl: string
  fileName: string
  mode: CropMode
  asset?: MediaAsset
}

const ASPECT_RATIOS = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
]

const MAX_IMAGE_SIZE = 15 * 1024 * 1024

function formatBytes(bytes?: number | null) {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() || 'jpg'
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load this image for editing.'))
    image.src = url
  })
}

async function getCroppedImage(
  imageUrl: string,
  crop: Area,
  rotation: number,
  quality: number
): Promise<Blob> {
  const image = await createImage(imageUrl)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) throw new Error('Your browser could not create an image editor.')

  const radians = (rotation * Math.PI) / 180
  const sin = Math.abs(Math.sin(radians))
  const cos = Math.abs(Math.cos(radians))

  const rotatedWidth = image.width * cos + image.height * sin
  const rotatedHeight = image.width * sin + image.height * cos

  const rotationCanvas = document.createElement('canvas')
  rotationCanvas.width = rotatedWidth
  rotationCanvas.height = rotatedHeight

  const rotationContext = rotationCanvas.getContext('2d')
  if (!rotationContext) throw new Error('Could not process image rotation.')

  rotationContext.translate(rotatedWidth / 2, rotatedHeight / 2)
  rotationContext.rotate(radians)
  rotationContext.drawImage(image, -image.width / 2, -image.height / 2)

  canvas.width = crop.width
  canvas.height = crop.height

  context.drawImage(
    rotationCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Could not export the edited image.'))
      },
      'image/jpeg',
      quality
    )
  })
}

function Toast({
  feedback,
  onClose,
}: {
  feedback: Feedback
  onClose: () => void
}) {
  if (!feedback) return null

  const styles = {
    success: 'border-blue-300 bg-blue-700 !text-white [&_*]:!text-white',
    error: 'border-rose-300 bg-rose-700 text-white',
    warning: 'border-blue-200 bg-blue-50 text-blue-900',
    loading: 'border-blue-300 bg-blue-700 text-white',
  }

  const Icon =
    feedback.type === 'success'
      ? CheckCircle2
      : feedback.type === 'error'
        ? AlertCircle
        : feedback.type === 'warning'
          ? AlertCircle
          : Loader2

  return (
    <div className="fixed right-4 top-5 z-[100] w-[min(420px,calc(100vw-2rem))]">
      <div
        role="status"
        aria-live="polite"
        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl ring-1 ring-black/10 ${styles[feedback.type]}`}
      >
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            feedback.type === 'loading' ? 'animate-spin' : ''
          }`}
        />
        <p className="flex-1 text-sm font-semibold leading-6">
          {feedback.message}
        </p>
        {feedback.type !== 'loading' && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="rounded-lg p-1 opacity-90 transition-opacity hover:bg-white/15 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`my-auto w-full rounded-2xl border border-slate-300 bg-white shadow-2xl ${
          wide ? 'max-w-5xl' : 'max-w-lg'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-base font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<ManagedMediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null)
  const [editName, setEditName] = useState('')
  const [editAltText, setEditAltText] = useState('')
  const [deletingAsset, setDeletingAsset] = useState<MediaAsset | null>(null)
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null)

  const [cropState, setCropState] = useState<CropState | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [cropQuality, setCropQuality] = useState(90)
  const [savingCrop, setSavingCrop] = useState(false)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const notify = useCallback((next: Feedback) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setFeedback(next)

    if (next && next.type !== 'loading') {
      toastTimer.current = setTimeout(() => setFeedback(null), 4500)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const fetchAssets = useCallback(async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssets((data || []) as ManagedMediaAsset[])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown loading error'
      notify({ type: 'error', message: `Could not load media: ${message}` })
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void fetchAssets()
  }, [fetchAssets])

  const uploadFile = async (file: File, isCV = false) => {
    setUploading(true)
    notify({ type: 'loading', message: `Uploading ${file.name}...` })

    let uploadedPath: string | null = null

    try {
      const ext = getExtension(file.name)
      const isDocument =
        ['pdf', 'doc', 'docx', 'txt'].includes(ext) ||
        file.type.includes('pdf') ||
        file.type.includes('document')
      const isVideo =
        ['mp4', 'webm', 'mov'].includes(ext) || file.type.startsWith('video/')

      const mediaType: 'image' | 'video' | 'document' = isDocument
        ? 'document'
        : isVideo
          ? 'video'
          : 'image'

      const folder =
        isCV || mediaType === 'document' ? 'documents' : 'uploads'

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${folder}/${Date.now()}_${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined,
        })

      if (uploadError) throw new Error(uploadError.message)
      uploadedPath = filePath

      const { data: publicData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath)

      const publicUrl = publicData.publicUrl

      if (isCV) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            cv_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .neq('id', '00000000-0000-0000-0000-000000000000')

        if (profileError) throw profileError
      }

      const { data: inserted, error: insertError } = await supabase
        .from('media_assets')
        .insert({
          name: isCV ? `CV - ${file.name}` : file.name,
          file_path: filePath,
          public_url: publicUrl,
          media_type: mediaType,
          mime_type: file.type || null,
          size_bytes: file.size,
          alt_text: file.name,
          show_in_gallery: false,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setAssets((previous) => [inserted as ManagedMediaAsset, ...previous])
      notify({
        type: 'success',
        message: `${file.name} uploaded successfully. It is now available in your media library.`,
      })
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage
          .from('portfolio-media')
          .remove([uploadedPath])
          .catch(() => undefined)
      }

      const message =
        error instanceof Error ? error.message : 'Unknown upload error'
      notify({ type: 'error', message: `Upload failed: ${message}` })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    isCV = false
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (isCV && file.type !== 'application/pdf') {
      notify({ type: 'error', message: 'Please select a PDF file for your CV.' })
      return
    }

    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_SIZE) {
        notify({
          type: 'error',
          message: 'This image is larger than 15 MB. Please resize it before uploading.',
        })
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setCropState({
        imageUrl,
        fileName: file.name,
        mode: 'new',
      })
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
      setAspect(0)
      setCroppedArea(null)
      setCropQuality(90)
      return
    }

    void uploadFile(file, isCV)
  }

  const openCropEditor = (asset: MediaAsset, mode: CropMode) => {
    setCropState({
      imageUrl: asset.public_url,
      fileName: asset.name,
      mode,
      asset,
    })
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setAspect(0)
    setCroppedArea(null)
    setCropQuality(90)
  }

  const closeCropEditor = () => {
    if (cropState?.mode === 'new') {
      URL.revokeObjectURL(cropState.imageUrl)
    }
    setCropState(null)
    setCroppedArea(null)
  }

  const onCropComplete = useCallback(
    (_: Area, pixels: Area) => {
      setCroppedArea(pixels)
    },
    []
  )

  const saveCrop = async () => {
    if (!cropState || !croppedArea) {
      notify({ type: 'warning', message: 'Please select a crop area first.' })
      return
    }

    setSavingCrop(true)
    notify({ type: 'loading', message: 'Processing your edited image...' })

    let newPath: string | null = null

    try {
      const blob = await getCroppedImage(
        cropState.imageUrl,
        croppedArea,
        rotation,
        cropQuality / 100
      )

      const baseName = cropState.fileName.replace(/\.[^/.]+$/, '')
      const outputFile = new File([blob], `${baseName}-edited.jpg`, {
        type: 'image/jpeg',
      })

      const filePath =
        cropState.mode === 'replace' && cropState.asset
          ? `uploads/${Date.now()}_${baseName.replace(/[^a-zA-Z0-9_-]/g, '_')}-edited.jpg`
          : `uploads/${Date.now()}_${baseName.replace(/[^a-zA-Z0-9_-]/g, '_')}-edited.jpg`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, outputFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        })

      if (uploadError) throw uploadError
      newPath = filePath

      const { data: publicData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath)

      const publicUrl = publicData.publicUrl

      if (cropState.mode === 'new') {
        const { data, error } = await supabase
          .from('media_assets')
          .insert({
            name: outputFile.name,
            file_path: filePath,
            public_url: publicUrl,
            media_type: 'image',
            mime_type: 'image/jpeg',
            size_bytes: outputFile.size,
            alt_text: cropState.fileName,
            show_in_gallery: false,
          })
          .select()
          .single()

        if (error) throw error
        setAssets((previous) => [data as ManagedMediaAsset, ...previous])
      } else if (cropState.asset) {
        if (cropState.mode === 'replace') {
          const { data, error } = await supabase
            .from('media_assets')
            .update({
              file_path: filePath,
              public_url: publicUrl,
              mime_type: 'image/jpeg',
              size_bytes: outputFile.size,
            })
            .eq('id', cropState.asset.id)
            .select()
            .single()

          if (error) throw error

          setAssets((previous) =>
            previous.map((item) =>
              item.id === cropState.asset?.id ? (data as ManagedMediaAsset) : item
            )
          )

          const { error: oldFileError } = await supabase.storage
            .from('portfolio-media')
            .remove([cropState.asset.file_path])

          if (oldFileError) {
            notify({
              type: 'warning',
              message: 'The edited image was saved, but the previous file could not be removed. You can safely remove it later.',
            })
          }
        } else {
          const { data, error } = await supabase
            .from('media_assets')
            .insert({
              name: outputFile.name,
              file_path: filePath,
              public_url: publicUrl,
              media_type: 'image',
              mime_type: 'image/jpeg',
              size_bytes: outputFile.size,
              alt_text: cropState.asset.alt_text || cropState.asset.name,
              show_in_gallery: false,
            })
            .select()
            .single()

          if (error) throw error
          setAssets((previous) => [data as ManagedMediaAsset, ...previous])
        }
      }

      if (cropState.mode !== 'replace') {
        notify({
          type: 'success',
          message:
            cropState.mode === 'copy'
              ? 'Edited image saved as a new media item.'
              : 'Image cropped, optimized and uploaded successfully.',
        })
      } else {
        notify({
          type: 'success',
          message: 'Image replaced successfully. Your updated image is now saved.',
        })
      }

      closeCropEditor()
    } catch (error) {
      if (newPath) {
        await supabase.storage
          .from('portfolio-media')
          .remove([newPath])
          .catch(() => undefined)
      }

      const message =
        error instanceof Error ? error.message : 'Could not save edited image.'
      notify({ type: 'error', message: `Image editing failed: ${message}` })
    } finally {
      setSavingCrop(false)
    }
  }

  const handleSaveEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingAsset) return

    setSavingEdit(true)
    notify({ type: 'loading', message: 'Saving media details...' })

    try {
      const { data, error } = await supabase
        .from('media_assets')
        .update({
          name: editName.trim(),
          alt_text: editAltText.trim(),
        })
        .eq('id', editingAsset.id)
        .select()
        .single()

      if (error) throw error

      setAssets((previous) =>
        previous.map((asset) =>
          asset.id === editingAsset.id ? (data as ManagedMediaAsset) : asset
        )
      )

      setEditingAsset(null)
      notify({
        type: 'success',
        message: 'Media details saved successfully.',
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not update media.'
      notify({ type: 'error', message: `Update failed: ${message}` })
    } finally {
      setSavingEdit(false)
    }
  }

  const handleGalleryVisibility = async (asset: ManagedMediaAsset) => {
    const nextVisibility = asset.show_in_gallery !== true
    notify({ type: 'loading', message: 'Updating public gallery visibility...' })

    try {
      const { data, error } = await supabase
        .from('media_assets')
        .update({ show_in_gallery: nextVisibility })
        .eq('id', asset.id)
        .select()
        .single()

      if (error) throw error

      setAssets((previous) =>
        previous.map((item) =>
          item.id === asset.id ? (data as ManagedMediaAsset) : item
        )
      )

      if (previewAsset?.id === asset.id) {
        setPreviewAsset(data as ManagedMediaAsset)
      }

      notify({
        type: 'success',
        message: nextVisibility
          ? 'This item is now visible in the public gallery.'
          : 'This item is hidden from the public gallery. It remains available for use elsewhere.',
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not update visibility.'
      notify({ type: 'error', message: `Visibility update failed: ${message}` })
    }
  }

  const handleDelete = async () => {
    if (!deletingAsset) return

    setDeleting(true)
    notify({ type: 'loading', message: 'Deleting media file...' })

    try {
      const { error: storageError } = await supabase.storage
        .from('portfolio-media')
        .remove([deletingAsset.file_path])

      if (storageError) throw storageError

      const { error: recordError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', deletingAsset.id)

      if (recordError) {
        notify({
          type: 'warning',
          message: 'The storage file was removed, but its database record could not be deleted. Refresh and check the record.',
        })
        throw recordError
      }

      setAssets((previous) =>
        previous.filter((asset) => asset.id !== deletingAsset.id)
      )

      setDeletingAsset(null)
      notify({
        type: 'success',
        message: `${deletingAsset.name} deleted successfully.`,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not delete media.'
      notify({ type: 'error', message: `Delete failed: ${message}` })
    } finally {
      setDeleting(false)
    }
  }

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      notify({ type: 'success', message: 'Public URL copied to clipboard.' })
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      notify({
        type: 'error',
        message: 'Could not copy the URL. Check your browser clipboard permissions.',
      })
    }
  }

  const filteredAssets = assets
    .filter((asset) => {
      const query = search.trim().toLowerCase()

      const matchesSearch =
        asset.name.toLowerCase().includes(query) ||
        asset.file_path.toLowerCase().includes(query) ||
        (asset.alt_text || '').toLowerCase().includes(query)

      const matchesFilter =
        filter === 'all' || asset.media_type === filter

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'oldest') {
        return (
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
        )
      }
      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      )
    })

  const imageCount = assets.filter((asset) => asset.media_type === 'image').length
  const documentCount = assets.filter((asset) => asset.media_type === 'document').length
  const videoCount = assets.filter((asset) => asset.media_type === 'video').length

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 pb-12">
      <Toast feedback={feedback} onClose={() => setFeedback(null)} />

      <div className="flex justify-end border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => void fetchAssets()}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-100 disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh library
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total assets', value: assets.length, icon: FileImage },
          { label: 'Images', value: imageCount, icon: ImageIcon },
          { label: 'Documents', value: documentCount, icon: FileText },
          { label: 'Videos', value: videoCount, icon: Film },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <item.icon className="h-4 w-4 text-blue-700" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="!text-base !font-bold !text-slate-900">CV / Resume</h2>
              <p className="mt-1 text-xs !text-slate-700">
                Upload or replace your public professional CV.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <FileUp className="mx-auto h-8 w-8 text-blue-700" />
            <p className="mt-3 text-sm font-medium !text-slate-800">
              Select your CV in PDF format
            </p>
            <p className="mt-1 text-xs !text-slate-700">
              Your new CV URL will be saved to your profile.
            </p>
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              disabled={uploading}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Choose PDF
            </button>
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => handleFileSelection(event, true)}
              className="hidden"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="!text-base !font-bold !text-slate-900">Upload media</h2>
              <p className="mt-1 text-xs !text-slate-700">
                Add portfolio images, certificates, project files and videos.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <Plus className="mx-auto h-8 w-8 text-blue-700" />
            <p className="mt-3 text-sm font-medium !text-slate-800">
              Select a file from your computer
            </p>
            <p className="mt-1 text-xs !text-slate-700">
              Images can be cropped and optimized before uploading.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:border-blue-700 hover:bg-blue-700 disabled:opacity-50"
            >
              <FileUp className="h-4 w-4" />
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={(event) => handleFileSelection(event)}
              className="hidden"
            />
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="!text-lg !font-bold !text-slate-900">Your media library</h2>
              <p className="mt-1 text-xs font-medium !text-slate-500">
                {filteredAssets.length} of {assets.length} assets
              </p>
            </div>

            <div className="flex w-fit items-center gap-1 rounded-xl border border-slate-300 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search media by name, file path or description..."
              aria-label="Search media"
              className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter media by type"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort media"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
            Loading media library...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-slate-500" />
            <p className="mt-4 text-sm font-semibold text-slate-700">
              {assets.length === 0 ? 'Your media library is empty' : 'No matching files'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {assets.length === 0
                ? 'Upload your first image or document to get started.'
                : 'Try changing your search or filter.'}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                : 'space-y-3'
            }
          >
            {filteredAssets.map((asset) => (
              <article
                key={asset.id}
                className={`overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-slate-300 ${
                  viewMode === 'list'
                    ? 'flex flex-col gap-4 p-3 sm:flex-row sm:items-center'
                    : 'flex flex-col'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPreviewAsset(asset)}
                  className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-slate-50 ${
                    viewMode === 'list'
                      ? 'h-24 w-full rounded-xl sm:w-32'
                      : 'h-44 w-full'
                  }`}
                  title="Preview media"
                >
                  {asset.media_type === 'image' ? (
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  ) : asset.media_type === 'video' ? (
                    <Film className="h-10 w-10 text-slate-500" />
                  ) : (
                    <FileText className="h-10 w-10 text-blue-700" />
                  )}

                  <span className="absolute right-2 top-2 rounded-md border border-slate-300 bg-white/95 px-2 py-1 text-[9px] font-bold uppercase text-slate-700">
                    {asset.media_type}
                  </span>
                </button>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-bold !text-slate-900"
                      title={asset.name}
                    >
                      {asset.name}
                    </p>
                    <p className="mt-1 truncate font-mono text-[11px] !text-slate-700">
                      {asset.file_path}
                    </p>
                    <p className="mt-2 text-xs !text-slate-700">
                      {formatBytes(asset.size_bytes)} ·{' '}
                      {asset.mime_type || asset.media_type}
                    </p>
                    {asset.alt_text && (
                      <p className="mt-1 truncate text-[11px] italic !text-slate-700">
                        {asset.alt_text}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          asset.show_in_gallery === true
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {asset.show_in_gallery === true ? 'Publicly visible' : 'Hidden from gallery'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => void handleGalleryVisibility(asset)}
                        title={asset.show_in_gallery === true ? 'Hide from public gallery' : 'Show in public gallery'}
                        aria-label={asset.show_in_gallery === true ? 'Hide from public gallery' : 'Show in public gallery'}
                        className={`rounded-lg px-2.5 py-2 text-[10px] font-bold transition-colors ${
                          asset.show_in_gallery === true
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {asset.show_in_gallery === true ? 'Hide from gallery' : 'Show in gallery'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewAsset(asset)}
                        title="Preview"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {asset.media_type === 'image' && (
                        <button
                          type="button"
                          onClick={() => openCropEditor(asset, 'replace')}
                          title="Crop and replace"
                          className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"
                        >
                          <Crop className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingAsset(asset)
                          setEditName(asset.name)
                          setEditAltText(asset.alt_text || '')
                        }}
                        title="Edit details"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => void copyUrl(asset.public_url, asset.id)}
                        title="Copy public URL"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        {copiedId === asset.id ? (
                          <Check className="h-4 w-4 text-emerald-700" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>

                      <a
                        href={asset.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open file"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setDeletingAsset(asset)}
                        title="Delete"
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {cropState && (
        <Modal
          title="Image editor"
          subtitle={`Editing: ${cropState.fileName}`}
          onClose={closeCropEditor}
          wide
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div className="space-y-3">
              <div className="relative h-[350px] overflow-hidden rounded-xl bg-slate-950 sm:h-[470px]">
                <Cropper
                  image={cropState.imageUrl}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect || undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  showGrid
                  objectFit="contain"
                />
              </div>
              <p className="text-center text-[11px] text-slate-500">
                Drag the image to reposition it. Adjust the crop frame to select the area you want.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Aspect ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ASPECT_RATIOS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAspect(item.value)}
                      className={`rounded-lg border px-2 py-2 text-xs font-semibold ${
                        aspect === item.value
                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                          : 'border-slate-300 bg-slate-50 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Zoom
                  </label>
                  <span className="text-xs text-slate-500">
                    {zoom.toFixed(1)}x
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="h-4 w-4 text-slate-500" />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <ZoomIn className="h-4 w-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Rotation
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((value) => (value - 90 + 360) % 360)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((value) => (value + 90) % 360)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    <RotateCw className="h-4 w-4" />
                    Right
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Image quality
                  </label>
                  <span className="text-xs text-slate-500">{cropQuality}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={5}
                  value={cropQuality}
                  onChange={(event) => setCropQuality(Number(event.target.value))}
                  className="w-full accent-blue-500"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Higher quality produces a larger file.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">
                  Save options
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {cropState.mode === 'new'
                    ? 'Your cropped image will be added as a new media item.'
                    : cropState.mode === 'replace'
                      ? 'The existing media record will be updated with this edited image.'
                      : 'The original will remain unchanged. A separate edited copy will be added.'}
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
                {cropState.mode === 'replace' && (
                  <button
                    type="button"
                    disabled={savingCrop}
                    onClick={() => {
                      setCropState((current) =>
                        current ? { ...current, mode: 'copy' } : current
                      )
                    }}
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Save as new image instead
                  </button>
                )}

                {cropState.mode === 'copy' && (
                  <button
                    type="button"
                    disabled={savingCrop}
                    onClick={() => {
                      setCropState((current) =>
                        current ? { ...current, mode: 'replace' } : current
                      )
                    }}
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Replace original instead
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => void saveCrop()}
                  disabled={savingCrop || !croppedArea}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingCrop ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savingCrop ? 'Processing...' : 'Save and apply image'}
                </button>

                <button
                  type="button"
                  onClick={closeCropEditor}
                  disabled={savingCrop}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {editingAsset && (
        <Modal
          title="Edit media details"
          subtitle={editingAsset.name}
          onClose={() => setEditingAsset(null)}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Display name
              </label>
              <input
                required
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-blue-300"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Alt text / description
              </label>
              <textarea
                rows={3}
                value={editAltText}
                onChange={(event) => setEditAltText(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-blue-300"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {savingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingEdit ? 'Saving...' : 'Save details'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {previewAsset && (
        <Modal
          title="Media preview"
          subtitle={previewAsset.name}
          onClose={() => setPreviewAsset(null)}
          wide
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-3">
              {previewAsset.media_type === 'image' ? (
                <img
                  src={previewAsset.public_url}
                  alt={previewAsset.alt_text || previewAsset.name}
                  className="max-h-[65vh] max-w-full rounded-lg object-contain"
                />
              ) : previewAsset.media_type === 'video' ? (
                <video
                  src={previewAsset.public_url}
                  controls
                  className="max-h-[65vh] max-w-full"
                />
              ) : previewAsset.mime_type === 'application/pdf' ||
                previewAsset.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewAsset.public_url}
                  title={previewAsset.name}
                  className="h-[65vh] w-full rounded-lg bg-white"
                />
              ) : (
                <div className="text-center">
                  <FileText className="mx-auto h-14 w-14 text-blue-700" />
                  <p className="mt-3 text-sm text-slate-700">
                    Preview is not available for this file type.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  File information
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-white">
                  {previewAsset.name}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {previewAsset.mime_type || previewAsset.media_type}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatBytes(previewAsset.size_bytes)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-700">
                  {previewAsset.alt_text || 'No description provided.'}
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4">
                {previewAsset.media_type === 'image' && (
                  <button
                    type="button"
                    onClick={() => {
                      const asset = previewAsset
                      setPreviewAsset(null)
                      openCropEditor(asset, 'replace')
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-200"
                  >
                    <Crop className="h-4 w-4" />
                    Crop / edit image
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => void copyUrl(previewAsset.public_url, previewAsset.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Copy className="h-4 w-4" />
                  Copy public URL
                </button>

                <a
                  href={previewAsset.public_url}
                  download={previewAsset.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
                >
                  <Download className="h-4 w-4" />
                  Open / download
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {deletingAsset && (
        <Modal
          title="Delete media asset?"
          subtitle="This action cannot be undone."
          onClose={() => !deleting && setDeletingAsset(null)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="text-sm font-semibold text-rose-800">
                    You are about to permanently delete:
                  </p>
                  <p className="mt-1 break-words text-xs text-rose-700">
                    {deletingAsset.name}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-rose-700">
                    The file will be removed from Supabase Storage and its media record will be deleted.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletingAsset(null)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
