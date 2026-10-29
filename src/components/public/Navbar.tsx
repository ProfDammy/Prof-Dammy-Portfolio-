'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteCustomizer } from '@/context/CustomizerContext'
import { Menu, X, Shield, ChevronRight } from 'lucide-react'

interface NavbarProps {
  navLabels?: Record<string, string>
  visibility?: Record<string, boolean>
}

export function Navbar({ navLabels, visibility }: NavbarProps) {
  const { settings } = useSiteCustomizer()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const labels = navLabels || settings.navigation_labels || {}
  const visibleSections = visibility || settings.section_visibility || {}

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { key: 'about', href: '#about', label: labels.about || 'About' },
    { key: 'skills', href: '#skills', label: labels.skills || 'Skills' },
    { key: 'experience', href: '#experience', label: labels.experience || 'Experience' },
    { key: 'projects', href: '#projects', label: labels.projects || 'Projects' },
    { key: 'teaching', href: '#teaching', label: labels.teaching || 'Teaching' },
    { key: 'leadership', href: '#leadership', label: labels.leadership || 'Leadership' },
    { key: 'education', href: '#education', label: labels.education || 'Education' },
    { key: 'publications', href: '#publications', label: labels.publications || 'Research' },
    { key: 'achievements', href: '#achievements', label: labels.achievements || 'Awards' },
    { key: 'gallery', href: '#gallery', label: labels.gallery || 'Gallery' },
    { key: 'contact', href: '#contact', label: labels.contact || 'Contact' },
  ].filter((item) => visibleSections[item.key] !== false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            PD
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight block">Prof Dammy</span>
            <span className="text-xs text-slate-400 block font-medium">Data & AI Specialist</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center space-x-3">
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-1"
          >
            Get in Touch
            <ChevronRight className="w-4 h-4" />
          </a>
          <Link
            href="/admin/login"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/admin/login"
            className="p-2 text-slate-400 hover:text-white rounded-lg"
            title="Admin Portal"
          >
            <Shield className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
