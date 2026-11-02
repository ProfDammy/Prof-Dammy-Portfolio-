'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { SiteSettings } from '@/types/database'
import { mockSiteSettings } from '@/lib/mockData'
import { supabase } from '@/lib/supabaseClient'

interface CustomizerContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>
  resetSettings: () => Promise<void>
  refreshSettings: () => Promise<void>
  loading: boolean
}

const CustomizerContext = createContext<CustomizerContextType>({
  settings: mockSiteSettings,
  updateSettings: async () => false,
  resetSettings: async () => {},
  refreshSettings: async () => {},
  loading: false
})

export function CustomizerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data && !error) {
        setSettings({
          ...mockSiteSettings,
          ...data,
          section_visibility: data.section_visibility || mockSiteSettings.section_visibility,
          section_order: data.section_order || mockSiteSettings.section_order,
          navigation_labels: data.navigation_labels || mockSiteSettings.navigation_labels
        })
        localStorage.setItem('profdammy_site_settings', JSON.stringify(data))
      } else {
        const saved = localStorage.getItem('profdammy_site_settings')
        if (saved) {
          try {
            setSettings(JSON.parse(saved))
          } catch {
            setSettings(mockSiteSettings)
          }
        }
      }
    } catch (e) {
      console.error('Failed to load site settings from Supabase:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (settings.theme_accent_color) {
      document.documentElement.style.setProperty('--dynamic-accent', settings.theme_accent_color)
    }
  }, [settings.theme_accent_color])

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const updated = {
      ...settings,
      ...newSettings,
      updated_at: new Date().toISOString()
    }
    setSettings(updated)
    localStorage.setItem('profdammy_site_settings', JSON.stringify(updated))

    try {
      const payload = {
        id: updated.id || 'b0000000-0000-0000-0000-000000000001',
        theme_accent_color: updated.theme_accent_color,
        custom_headline: updated.custom_headline,
        custom_subtitle: updated.custom_subtitle,
        primary_cta_text: updated.primary_cta_text,
        primary_cta_link: updated.primary_cta_link,
        secondary_cta_text: updated.secondary_cta_text,
        secondary_cta_link: updated.secondary_cta_link,
        section_visibility: updated.section_visibility,
        section_order: updated.section_order,
        navigation_labels: updated.navigation_labels,
        footer_content: updated.footer_content,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('site_settings')
        .upsert(payload)

      if (error) {
        console.warn('Could not persist site_settings to Supabase:', error.message)
        return false
      }
      return true
    } catch (err) {
      console.error('Error updating site_settings:', err)
      return false
    }
  }

  const resetSettings = async () => {
    setSettings(mockSiteSettings)
    localStorage.removeItem('profdammy_site_settings')
    try {
      await supabase
        .from('site_settings')
        .upsert({
          ...mockSiteSettings,
          updated_at: new Date().toISOString()
        })
    } catch (err) {
      console.warn('Failed to reset in database:', err)
    }
  }

  return (
    <CustomizerContext.Provider value={{ settings, updateSettings, resetSettings, refreshSettings: fetchSettings, loading }}>
      {children}
    </CustomizerContext.Provider>
  )
}

export function useSiteCustomizer() {
  return useContext(CustomizerContext)
}
