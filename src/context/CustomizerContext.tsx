'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'

import { SiteSettings } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'

const defaultSettings: SiteSettings = {
  id: '',
  theme_accent_color: '#2563eb',
  custom_headline: '',
  custom_subtitle: '',
  primary_cta_text: 'Explore My Work',
  primary_cta_link: '#projects',
  secondary_cta_text: 'Contact Me',
  secondary_cta_link: '#contact',
  section_visibility: {},
  section_order: [],
  navigation_labels: {},
  footer_content: '',
  updated_at: new Date().toISOString()
}

interface CustomizerContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>
  resetSettings: () => Promise<void>
  refreshSettings: () => Promise<void>
  loading: boolean
}

const CustomizerContext = createContext<CustomizerContextType>({
  settings: defaultSettings,
  updateSettings: async () => false,
  resetSettings: async () => {},
  refreshSettings: async () => {},
  loading: true
})

export function CustomizerProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setSettings({
          ...defaultSettings,
          ...data
        } as SiteSettings)
      } else {
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Failed to load site settings:', error)
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--dynamic-accent',
      settings.theme_accent_color || '#2563eb'
    )
  }, [settings.theme_accent_color])

  const updateSettings = async (
    newSettings: Partial<SiteSettings>
  ): Promise<boolean> => {
    const updated = {
      ...settings,
      ...newSettings,
      updated_at: new Date().toISOString()
    }

    const payload = {
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
      updated_at: updated.updated_at
    }

    try {
      let error

      if (settings.id) {
        const result = await supabase
          .from('site_settings')
          .update(payload)
          .eq('id', settings.id)

        error = result.error
      } else {
        const result = await supabase
          .from('site_settings')
          .insert(payload)
          .select('*')
          .single()

        error = result.error

        if (result.data) {
          setSettings(result.data as SiteSettings)
          return true
        }
      }

      if (error) throw error

      setSettings(updated)
      await fetchSettings()

      return true
    } catch (error) {
      console.error('Error updating site settings:', error)
      return false
    }
  }

  const resetSettings = async () => {
    const success = await updateSettings(defaultSettings)

    if (!success) {
      console.error('Could not reset site settings.')
    }
  }

    return (
    <CustomizerContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        refreshSettings: fetchSettings,
        loading
      }}
    >
      {children}
    </CustomizerContext.Provider>
  )
}

export function useSiteCustomizer() {
  return useContext(CustomizerContext)
}