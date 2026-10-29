'use client'

import React from 'react'
import { MediaAsset } from '@/types/database'

interface GallerySectionProps {
  assets: MediaAsset[]
}

export function GallerySection({ assets }: GallerySectionProps) {
  return (
    <section id="gallery" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-3xl font-bold text-white">Image & Video Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-sm font-bold text-white">{asset.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
