'use client'

import React from 'react'
import { MediaAsset } from '@/types/database'
import {
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink
} from 'lucide-react'

type GalleryMediaAsset = MediaAsset & {
  show_in_gallery?: boolean
}

interface GallerySectionProps {
  assets: GalleryMediaAsset[]
}

export function GallerySection({ assets }: GallerySectionProps) {
  // Only explicitly published items belong in the public gallery.
  // Hidden assets remain in storage and can still be used by other site sections.
  const visibleAssets = assets.filter((asset) => asset.show_in_gallery === true)
  const images = visibleAssets.filter((asset) => asset.media_type === 'image')
  const videos = visibleAssets.filter((asset) => asset.media_type === 'video')
  const documents = visibleAssets.filter((asset) => asset.media_type === 'document')

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            Portfolio Highlights
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-5">
            Gallery
          </h2>

          <p className="text-slate-600 mt-4 leading-7">
            A collection of selected moments, activities, media, and professional
            highlights.
          </p>
        </div>

        {visibleAssets.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-2xl py-16 px-6 text-center">
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-slate-800">
              Gallery coming soon
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Selected images, videos, and documents will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[4/3] bg-slate-50 overflow-hidden">
                        <img
                          src={asset.public_url}
                          alt={asset.alt_text || asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-800 truncate">{asset.name}</p>
                        <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {videos.map((asset) => (
                    <div key={asset.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <video
                        src={asset.public_url}
                        controls
                        preload="metadata"
                        className="w-full aspect-video bg-slate-100"
                      >
                        Your browser does not support video playback.
                      </video>
                      <div className="p-4 flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-600 shrink-0" />
                        <p className="font-semibold text-slate-800 truncate">{asset.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">{asset.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Open document</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
