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
    <section id="gallery" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <ImageIcon className="h-4 w-4" />
            Portfolio Highlights
          </span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Gallery</h2>
          <p className="mt-4 leading-7 text-slate-600">
            A collection of selected moments, activities, media, and professional highlights.
          </p>
        </div>

        {visibleAssets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
            <ImageIcon className="mx-auto mb-4 h-10 w-10 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Gallery coming soon</h3>
            <p className="mt-2 text-sm text-slate-500">
              Selected images, videos, and documents will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {images.length > 0 && (
              <div>
                <h3 className="mb-6 text-xl font-bold text-slate-900">Images</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                        <img
                          src={asset.public_url}
                          alt={asset.alt_text || asset.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{asset.name}</p>
                          {asset.alt_text?.trim() && (
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                              {asset.alt_text}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <h3 className="mb-6 text-xl font-bold text-slate-900">Videos</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {videos.map((asset) => (
                    <article
                      key={asset.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <video
                        src={asset.public_url}
                        controls
                        preload="metadata"
                        playsInline
                        className="aspect-video w-full bg-slate-100"
                      >
                        Your browser does not support video playback.
                      </video>
                      <div className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700">
                            <Video className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base font-bold leading-6 text-slate-900">
                              {asset.name}
                            </h4>
                            {asset.alt_text?.trim() ? (
                              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {asset.alt_text}
                              </p>
                            ) : (
                              <p className="mt-2 text-sm italic text-slate-400">
                                Add a caption in the media manager to tell visitors what this video is about.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h3 className="mb-6 text-xl font-bold text-slate-900">Documents</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {documents.map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 rounded-xl border border-slate-200 p-5 transition-all hover:border-blue-300 hover:shadow-sm"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">{asset.name}</p>
                        {asset.alt_text?.trim() ? (
                          <p className="mt-1 whitespace-pre-line text-sm leading-5 text-slate-600">
                            {asset.alt_text}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">Open document</p>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-blue-600" />
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
