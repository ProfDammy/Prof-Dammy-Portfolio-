'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { SiteSettings } from '@/types/database'
import { mockSiteSettings } from '@/lib/mockData'

interface CustomizerContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  resetSettings: () => void
}

const CustomizerContext = createContext<CustomizerContextType>({
  settings: mockSiteSettings,
  updateSettings: () => {},
  resetSettings: () => {}
})

export function CustomizerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings)

  useEffect(() => {
    const saved = localStorage.getItem('profdammy_site_settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved site settings:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (settings.theme_accent_color) {
      document.documentElement.style.setProperty('--dynamic-accent', settings.theme_accent_color)
    }
  }, [settings.theme_accent_color])

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings, updated_at: new Date().toISOString() }
      localStorage.setItem('profdammy_site_settings', JSON.stringify(updated))
      return updated
    })
  }

  const resetSettings = () => {
    setSettings(mockSiteSettings)
    localStorage.removeItem('profdammy_site_settings')
  }

  return (
    <CustomizerContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </CustomizerContext.Provider>
  )
}

export function useSiteCustomizer() {
  return useContext(CustomizerContext)
}
