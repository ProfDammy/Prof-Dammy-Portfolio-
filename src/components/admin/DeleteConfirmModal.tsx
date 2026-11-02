'use client'

import React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  title?: string
  description?: string
  itemName?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  isOpen,
  title = 'Delete Record',
  description = 'Are you sure you want to delete this record? This action cannot be undone.',
  itemName,
  loading = false,
  onConfirm,
  onCancel
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
            {itemName && (
              <p className="text-xs font-mono text-blue-300 bg-slate-950 px-2 py-1 rounded-md inline-block mt-1">
                &ldquo;{itemName}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
