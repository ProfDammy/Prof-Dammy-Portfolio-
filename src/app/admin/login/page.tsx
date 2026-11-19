
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowLeft,
  LockKeyhole,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      setError(
        'Administrator configuration is missing. Please contact the site administrator.'
      )
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail !== adminEmail) {
      setError(
        'This account is not authorized to access the Admin Workspace.'
      )
      return
    }

    setLoading(true)

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })

      if (authError) throw authError

      if (!data.user || !data.session) {
        throw new Error('Authentication could not be completed.')
      }

      const authenticatedEmail = data.user.email?.toLowerCase()

      if (
        authenticatedEmail !== adminEmail ||
        !data.user.email_confirmed_at
      ) {
        await supabase.auth.signOut()
        throw new Error(
          'This account is not authorized to access the Admin Workspace.'
        )
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070D1B] px-4 py-12 text-slate-100">

      {/* Background accents */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[110px]" />

      <div className="relative w-full max-w-[440px]">

        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-600/15 text-blue-400 shadow-lg shadow-blue-950/30">
            <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />
          </div>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-400">
            Private Administration
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Admin Workspace
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Damilola Oluwagbamila
            <span className="mx-2 text-slate-600">·</span>
            Portfolio Management
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/[0.09] bg-[#111B2E] p-6 shadow-2xl shadow-black/30 sm:p-9">

          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Sign in to manage your portfolio content.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              role="status"
              className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Access granted. Opening your workspace...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Administrator email
              </label>

              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={loading || success}
                className="h-12 w-full rounded-xl border border-slate-700/80 bg-[#0A1221] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <LockKeyhole className="h-4 w-4 text-slate-500" />
              </div>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading || success}
                  className="h-12 w-full rounded-xl border border-slate-700/80 bg-[#0A1221] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-white disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-500 hover:shadow-blue-500/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Authenticating...'
                : success
                  ? 'Opening workspace...'
                  : 'Sign in to workspace'}
            </button>
          </form>

          <div className="mt-7 border-t border-white/[0.08] pt-5">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              Back to portfolio
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-[11px] tracking-wide text-slate-600">
          SECURE ADMINISTRATION · AUTHORISED ACCESS ONLY
        </p>
      </div>
    </main>
  )
}
