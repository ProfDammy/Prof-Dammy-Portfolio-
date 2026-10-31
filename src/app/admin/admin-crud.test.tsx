import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AdminProjectsPage from './projects/page'
import AdminSkillsPage from './skills/page'
import AdminExperiencePage from './experience/page'
import AdminEducationPage from './education/page'

vi.mock('@/lib/supabaseClient', () => {
  const dummyProject = {
    id: 'proj-test-1',
    title: 'Test Data Pipeline',
    slug: 'test-data-pipeline',
    short_description: 'An automated ETL pipeline in Python.',
    category: 'Data Analytics',
    status: 'completed',
    technologies: ['Python', 'PostgreSQL'],
    display_order: 1,
    published: true
  }

  const dummySkill = {
    id: 'skill-test-1',
    name: 'Power BI',
    category: 'Data Analytics & BI',
    proficiency_level: 95,
    display_order: 1,
    published: true
  }

  const dummyExperience = {
    id: 'exp-test-1',
    title: 'Instructor',
    company: 'Tech Academy',
    location: 'Remote',
    employment_type: 'Full-time',
    start_date: '2023-01-01',
    end_date: null,
    is_current: true,
    description: ['Curriculum lead'],
    technologies: ['Python'],
    display_order: 1,
    published: true
  }

  const dummyEducation = {
    id: 'edu-test-1',
    degree: 'B.Tech Mathematics',
    field_of_study: 'Mathematics',
    institution: 'University of Technology',
    location: 'State',
    start_year: 2018,
    end_year: 2023,
    is_current: false,
    display_order: 1,
    published: true
  }

  const dummyCert = {
    id: 'cert-test-1',
    title: 'Certified Data Scientist',
    issuing_organization: 'Tech Org',
    issue_date: '2023-01-01',
    display_order: 1,
    published: true
  }

  return {
    supabase: {
      from: vi.fn((table: string) => {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({
                data: table === 'projects'
                  ? [dummyProject]
                  : table === 'skills'
                  ? [dummySkill]
                  : table === 'experiences'
                  ? [dummyExperience]
                  : table === 'education'
                  ? [dummyEducation]
                  : [dummyCert],
                error: null
              })),
              data: table === 'projects'
                ? [dummyProject]
                : table === 'skills'
                ? [dummySkill]
                : table === 'experiences'
                ? [dummyExperience]
                : table === 'education'
                ? [dummyEducation]
                : [dummyCert],
              error: null
            }))
          })),
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: { id: 'new-id', title: 'New Created Item', name: 'New Skill', company: 'New Co', degree: 'New Degree' },
                error: null
              }))
            }))
          })),
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: { id: 'updated-id', title: 'Updated Item' },
                  error: null
                }))
              }))
            }))
          })),
          delete: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null }))
          }))
        }
      })
    }
  }
})

describe('CMS Admin CRUD Interfaces', () => {
  it('renders Projects Manager with Add button and project cards', async () => {
    render(<AdminProjectsPage />)

    expect(screen.getByText('Projects Manager')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add new project/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Test Data Pipeline')).toBeInTheDocument()
    })

    // Open Add Project Modal
    fireEvent.click(screen.getByRole('button', { name: /add new project/i }))
    expect(screen.getAllByText('Add New Project').length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText(/student-analytics-dashboard/i)).toBeInTheDocument()
  })

  it('renders Skills Manager with Add button and proficiency bar', async () => {
    render(<AdminSkillsPage />)

    expect(screen.getByText('Skills Manager')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add skill/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Power BI')).toBeInTheDocument()
      expect(screen.getByText('95%')).toBeInTheDocument()
    })
  })

  it('renders Experience Manager with add button and role details', async () => {
    render(<AdminExperiencePage />)

    expect(screen.getByText('Experience Manager')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add experience/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Instructor')).toBeInTheDocument()
      expect(screen.getByText(/Tech Academy/i)).toBeInTheDocument()
    })
  })

  it('renders Education & Certifications with tabs and add buttons', async () => {
    render(<AdminEducationPage />)

    expect(screen.getByText(/Education & Certifications Manager/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('B.Tech Mathematics')).toBeInTheDocument()
    })

    // Switch Tab to Certifications
    fireEvent.click(screen.getByRole('button', { name: /certifications & credentials/i }))
    await waitFor(() => {
      expect(screen.getByText('Certified Data Scientist')).toBeInTheDocument()
    })
  })
})
