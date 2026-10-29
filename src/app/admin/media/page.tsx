'use client'

import React, { useState } from 'react'
import { MediaAsset } from '@/types/database'
import { mockMediaAssets } from '@/lib/mockData'
import { Image as ImageIcon, FileText, CheckCircle2, FileUp } from 'lucide-react'

export default function AdminMediaPage() {
  const [assets] = useState<MediaAsset[]>(mockMediaAssets)
  const [uploading, setUploading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setSuccessMsg(`CV uploaded successfully: ${file.name}`)
      setTimeout(() => setSuccessMsg(''), 4000)
    }, 1000)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-blue-500" />
          Media Library & Document Vault
        </h1>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Replace CV / Resume
        </h2>

        <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/60 text-center space-y-3">
          <FileUp className="w-8 h-8 text-blue-400 mx-auto" />
          <p className="text-sm font-semibold text-white">
            {uploading ? 'Uploading...' : 'Select PDF file to update public CV link'}
          </p>

          <label className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
            Choose PDF File
            <input type="file" accept=".pdf" onChange={handleCVUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-white">{asset.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
