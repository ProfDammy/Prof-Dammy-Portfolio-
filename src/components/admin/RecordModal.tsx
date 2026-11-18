
'use client'

import React from 'react'
import { X } from 'lucide-react'

interface RecordModalProps {
  isOpen: boolean
  title: string
  subtitle?: string
  maxWidth?: string
  onClose: () => void
  children: React.ReactNode
}

export function RecordModal({
  isOpen,
  title,
  subtitle,
  maxWidth = 'max-w-2xl',
  onClose,
  children,
}: RecordModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-[3px] sm:p-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
        className={`relative my-auto flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15`}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="record-modal-title"
              className="text-lg font-bold tracking-tight text-[#142D50]"
            >
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal content */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
