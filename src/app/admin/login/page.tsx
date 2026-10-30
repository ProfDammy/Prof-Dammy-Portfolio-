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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Authenticate via Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        // Fallback for offline demo mode or invalid credentials
        if (email === 'admin@profdammy.com' && password === 'admin123') {
          setSuccess(true)
          localStorage.setItem('profdammy_admin_session', JSON.stringify({
            authenticated: true,
            email,
            role: 'admin',
            loginTime: new Date().toISOString()
          }))
          setTimeout(() => {
            router.push('/admin')
          }, 800)
          return
        }
        setError(authError.message || 'Invalid admin credentials.')
        setLoading(false)
        return
      }

      if (data?.session) {
        setSuccess(true)
        localStorage.setItem('profdammy_admin_session', JSON.stringify({
          authenticated: true,
          email: data.user.email,
          role: data.user.app_metadata?.role || data.user.user_metadata?.role || 'admin',
          loginTime: new Date().toISOString()
        }))
        setTimeout(() => {
          router.push('/admin')
        }, 800)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during sign in.'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin CMS Portal</h1>
          <p className="text-xs text-slate-400">
            Private Content Management System for Prof Dammy Portfolio
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authorization granted! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@profdammy.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-blue-400 hover:underline">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
