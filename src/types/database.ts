export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  full_name: string
  professional_title: string
  bio: string
  detailed_about: string | null
  avatar_url: string | null
  hero_media_url: string | null
  contact_email: string | null
  contact_phone: string | null
  location: string | null
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
    youtube?: string
    google_scholar?: string
    [key: string]: string | undefined
  } | null
  cv_url: string | null
  published?: boolean
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  theme_accent_color: string
  custom_headline: string
  custom_subtitle: string
  primary_cta_text: string
  primary_cta_link: string
  secondary_cta_text: string
  secondary_cta_link: string
  section_visibility: Record<string, boolean>
  section_order: string[]
  navigation_labels: Record<string, string>
  footer_content: string
  updated_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string | null
  employment_type: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string[]
  technologies: string[]
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  category: string
  name: string
  proficiency_level: number | null
  icon_name: string | null
  description: string | null
  display_order: number
  published: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string | null
  category: string
  status: 'completed' | 'in_progress'
  is_featured: boolean
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  technologies: string[]
  metrics_highlights: string[]
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface TeachingMentorship {
  id: string
  title: string
  organization: string
  role: string
  period: string
  summary: string
  impact_highlights: string[]
  students_impacted: number
  display_order: number
  published: boolean
  created_at: string
}

export interface LeadershipCommunity {
  id: string
  title: string
  organization: string
  role: string
  period: string
  summary: string
  achievements: string[]
  display_order: number
  published: boolean
  created_at: string
}

export interface Education {
  id: string
  degree: string
  field_of_study: string
  institution: string
  location: string | null
  start_year: number
  end_year: number | null
  is_current: boolean
  grade_or_honors: string | null
  activities: string | null
  display_order: number
  published: boolean
  created_at: string
}

export interface Certification {
  id: string
  title: string
  issuing_organization: string
  issue_date: string
  expiration_date: string | null
  credential_id: string | null
  credential_url: string | null
  display_order: number
  published: boolean
  created_at: string
}

export interface Publication {
  id: string
  title: string
  publisher_or_journal: string
  publication_date: string
  publication_type: 'paper' | 'article' | 'thesis' | 'technical_report'
  authors: string[]
  abstract: string
  doi_or_url: string | null
  display_order: number
  published: boolean
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  category: string
  issuer: string
  award_date: string
  description: string
  display_order: number
  published: boolean
  created_at: string
}

export interface MediaAsset {
  id: string
  name: string
  file_path: string
  public_url: string
  media_type: 'image' | 'video' | 'document'
  mime_type: string | null
  size_bytes: number | null
  alt_text: string | null
  created_at: string
}
