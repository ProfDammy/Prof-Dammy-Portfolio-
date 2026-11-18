
'use client'

import React from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Info,
} from 'lucide-react'

interface FeedbackAlertProps {
  type: 'success' | 'error' | 'loading'
  message: string
  onClose?: () => void
}

export function FeedbackAlert({
  type,
  message,
  onClose,
}: FeedbackAlertProps) {
  if (!message) return null

  const styles = {
    success: {
      container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      icon: 'text-emerald-600',
      close: 'text-emerald-500 hover:bg-emerald-100 hover:text-emerald-800',
      Icon: CheckCircle2,
    },
    error: {
      container: 'border-rose-200 bg-rose-50 text-rose-900',
      icon: 'text-rose-600',
      close: 'text-rose-500 hover:bg-rose-100 hover:text-rose-800',
      Icon: AlertCircle,
    },
    loading: {
      container: 'border-blue-200 bg-blue-50 text-blue-900',
      icon: 'text-blue-600',
      close: 'text-blue-500 hover:bg-blue-100 hover:text-blue-800',
      Icon: Info,
    },
  }

  const current = styles[type]
  const Icon = current.Icon

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-all ${current.container}`}
    >
      <div className="mt-0.5 shrink-0">
        {type === 'loading' ? (
          <Loader2
            className={`h-5 w-5 animate-spin ${current.icon}`}
          />
        ) : (
          <Icon className={`h-5 w-5 ${current.icon}`} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {type === 'success'
            ? 'Operation successful'
            : type === 'error'
              ? 'Something went wrong'
              : 'Please wait'}
        </p>

        <p className="mt-0.5 text-xs leading-relaxed opacity-90">
          {message}
        </p>
      </div>

      {onClose && type !== 'loading' && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          title="Dismiss"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${current.close}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
