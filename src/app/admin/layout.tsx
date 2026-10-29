'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Shield } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }

    const session = localStorage.getItem('profdammy_admin_session')
    if (!session) {
      router.push('/admin/login')
    } else {
      setAuthorized(true)
      setChecking(false)
    }
  }, [pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Shield className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
