
import { supabase } from '@/lib/supabaseClient'

import {
  Profile,
  Experience,
  Skill,
  Project,
  TeachingMentorship,
  LeadershipCommunity,
  Education,
  Certification,
  Publication,
  Achievement,
  MediaAsset
} from '@/types/database'

export interface PortfolioData {
  profile: Profile | null
  experiences: Experience[]
  skills: Skill[]
  projects: Project[]
  teaching: TeachingMentorship[]
  leadership: LeadershipCommunity[]
  education: Education[]
  certifications: Certification[]
  publications: Publication[]
  achievements: Achievement[]
  mediaAssets: MediaAsset[]
}

export async function fetchLivePortfolioData(): Promise<PortfolioData> {
  const [
    profileResult,
    experiencesResult,
    skillsResult,
    projectsResult,
    teachingResult,
    leadershipResult,
    educationResult,
    certificationsResult,
    publicationsResult,
    achievementsResult,
    mediaResult
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from('experiences')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('skills')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('teaching_mentorship')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('leadership_community')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('education')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('certifications')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('publications')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('achievements')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
  ])

  const results = [
    profileResult,
    experiencesResult,
    skillsResult,
    projectsResult,
    teachingResult,
    leadershipResult,
    educationResult,
    certificationsResult,
    publicationsResult,
    achievementsResult,
    mediaResult
  ]

  const failedResult = results.find(result => result.error)

  if (failedResult?.error) {
    throw new Error(failedResult.error.message)
  }

  return {
    profile: (profileResult.data ?? null) as Profile | null,
    experiences: (experiencesResult.data ?? []) as Experience[],
    skills: (skillsResult.data ?? []) as Skill[],
    projects: (projectsResult.data ?? []) as Project[],
    teaching: (teachingResult.data ?? []) as TeachingMentorship[],
    leadership: (leadershipResult.data ?? []) as LeadershipCommunity[],
    education: (educationResult.data ?? []) as Education[],
    certifications: (certificationsResult.data ?? []) as Certification[],
    publications: (publicationsResult.data ?? []) as Publication[],
    achievements: (achievementsResult.data ?? []) as Achievement[],
    mediaAssets: (mediaResult.data ?? []) as MediaAsset[]
  }
}
