'use client'

import React from 'react'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'

interface FeedbackAlertProps {
  type: 'success' | 'error' | 'loading'
  message: string
  onClose?: () => void
}

export function FeedbackAlert({ type, message, onClose }: FeedbackAlertProps) {
  if (!message) return null

  if (type === 'loading') {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-950/70 border border-blue-800 text-blue-200 text-xs shadow-md">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
        <span className="flex-1">{message}</span>
      </div>
    )
  }

  if (type === 'error') {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs shadow-md">
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        <span className="flex-1 font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-rose-400 hover:text-rose-200 transition-colors p-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs shadow-md">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-emerald-400 hover:text-emerald-200 transition-colors p-1"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
