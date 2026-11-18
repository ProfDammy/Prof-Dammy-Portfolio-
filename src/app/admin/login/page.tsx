
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ?.trim()
    .toLowerCase()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!adminEmail) {
      setError('Administrator configuration is missing. Please contact the site administrator.')
      return
    }

    if (email.trim().toLowerCase() !== adminEmail) {
      setError('This account is not authorized to access the Admin Workspace.')
      return
    }

    setLoading(true)

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (authError) {
        throw authError
      }

      if (!data.user || !data.session) {
        throw new Error('Authentication could not be completed.')
      }

      const authenticatedEmail = data.user.email?.toLowerCase()

      if (
        authenticatedEmail !== adminEmail ||
        !data.user.email_confirmed_at
      ) {
        await supabase.auth.signOut()
        throw new Error('This account is not authorized to access the Admin Workspace.')
      }

      setSuccess(true)

      router.replace('/admin')
      router.refresh()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred during sign in.'

      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-slate-100">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Shield className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin CMS Portal
          </h1>

          <p className="text-xs text-slate-400">
            Private Content Management System for Prof Dammy Portfolio
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950 p-3.5 text-xs text-rose-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950 p-3.5 text-xs text-emerald-300"
          >
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Authorization granted. Opening your workspace...</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Admin Email
            </label>

            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter administrator email"
              disabled={loading || success}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading || success}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Authenticating...'
              : success
                ? 'Opening workspace...'
                : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-5 text-center">
          <Link
            href="/"
            className="text-xs text-blue-400 transition hover:text-blue-300 hover:underline"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
