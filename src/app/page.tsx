'use client'

import React from 'react'
import { useSiteCustomizer } from '@/context/CustomizerContext'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { ExperienceSection } from '@/components/public/ExperienceSection'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { TeachingSection } from '@/components/public/TeachingSection'
import { LeadershipSection } from '@/components/public/LeadershipSection'
import { EducationSection } from '@/components/public/EducationSection'
import { PublicationsSection } from '@/components/public/PublicationsSection'
import { GallerySection } from '@/components/public/GallerySection'
import { ContactSection } from '@/components/public/ContactSection'

import {
  mockProfile,
  mockExperiences,
  mockSkills,
  mockProjects,
  mockTeachingMentorship,
  mockLeadershipCommunity,
  mockEducation,
  mockCertifications,
  mockPublications,
  mockAchievements,
  mockMediaAssets
} from '@/lib/mockData'

export default function PortfolioHomePage() {
  const { settings } = useSiteCustomizer()
  const visibility = settings.section_visibility || {}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar navLabels={settings.navigation_labels} visibility={visibility} />
      <main>
        {visibility.hero !== false && <HeroSection profile={mockProfile} settings={settings} />}
        {visibility.about !== false && <AboutSection profile={mockProfile} />}
        {visibility.skills !== false && <SkillsSection skills={mockSkills} />}
        {visibility.experience !== false && <ExperienceSection experiences={mockExperiences} />}
        {visibility.projects !== false && <ProjectsSection projects={mockProjects} />}
        {visibility.teaching !== false && <TeachingSection teaching={mockTeachingMentorship} />}
        {visibility.leadership !== false && <LeadershipSection leadership={mockLeadershipCommunity} />}
        {visibility.education !== false && <EducationSection education={mockEducation} certifications={mockCertifications} />}
        {visibility.publications !== false && <PublicationsSection publications={mockPublications} achievements={mockAchievements} />}
        {visibility.gallery !== false && <GallerySection assets={mockMediaAssets} />}
        {visibility.contact !== false && <ContactSection profile={mockProfile} />}
      </main>
      <Footer profile={mockProfile} settings={settings} />
    </div>
  )
}
