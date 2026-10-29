import {
  Profile,
  SiteSettings,
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

export const mockProfile: Profile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  full_name: 'Damilola Miracle Oluwagbamila',
  professional_title: 'Data Analysis Instructor | AI & Software Solutions Developer | Academic Researcher',
  bio: 'Data Analytics Specialist, Educator, and Tech Leader dedicated to transforming complex data into actionable intelligence and mentoring the next generation of tech innovators.',
  detailed_about: `Damilola Miracle Oluwagbamila, known professionally as Prof Dammy, is a dedicated Data Analysis Instructor at SQI College of ICT, AI & Software Solutions Developer, and Community Leader.

His professional focus encompasses:
• Data Analytics & Business Intelligence (Power BI, SQL, Python, Excel)
• AI-Assisted Solution Development & Machine Learning Systems
• Technical Mentorship & Pedagogy
• Academic Research & Data-Driven Publications
• Youth Empowerment & Digital Literacy through Creative Thinkers Forum`,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  hero_media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  contact_email: 'profdammy@example.com',
  contact_phone: '+234 800 000 0000',
  location: 'Ogbomoso, Oyo State, Nigeria',
  social_links: {
    github: 'https://github.com/profdammy',
    linkedin: 'https://linkedin.com/in/damilola-oluwagbamila',
    twitter: 'https://twitter.com/prof_dammy',
    google_scholar: 'https://scholar.google.com'
  },
  cv_url: '/documents/Damilola_Oluwagbamila_CV.pdf',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const mockSiteSettings: SiteSettings = {
  id: 'b0000000-0000-0000-0000-000000000001',
  theme_accent_color: '#2563eb',
  custom_headline: 'Bridging Data Science, Intelligent Software & Empowering Tech Talent',
  custom_subtitle: 'Data Analysis Instructor at SQI College of ICT | AI Solutions Developer | Founder of Creative Thinkers Forum',
  primary_cta_text: 'Explore Projects',
  primary_cta_link: '#projects',
  secondary_cta_text: 'Download CV',
  secondary_cta_link: '#cv',
  section_visibility: {
    hero: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    teaching: true,
    leadership: true,
    education: true,
    publications: true,
    achievements: true,
    gallery: true,
    contact: true
  },
  section_order: ['hero', 'about', 'skills', 'experience', 'projects', 'teaching', 'leadership', 'education', 'publications', 'achievements', 'gallery', 'contact'],
  navigation_labels: {
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    teaching: 'Teaching & Mentorship',
    leadership: 'Leadership',
    education: 'Education',
    publications: 'Research',
    achievements: 'Achievements',
    gallery: 'Gallery',
    contact: 'Contact'
  },
  footer_content: '© Damilola Miracle Oluwagbamila (Prof Dammy). All rights reserved.',
  updated_at: new Date().toISOString()
}

export const mockExperiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Data Analysis Instructor',
    company: 'SQI College of ICT',
    location: 'Ogbomoso, Nigeria',
    employment_type: 'Full-time',
    start_date: '2023-01-01',
    end_date: null,
    is_current: true,
    description: [
      'Design and deliver comprehensive curriculums covering Python for Data Science, SQL, Power BI, Advanced Excel, and Statistical Analysis.',
      'Mentor over 200+ students through hands-on data analytics capstones and practical industry projects.'
    ],
    technologies: ['Python', 'SQL', 'Power BI', 'Pandas', 'NumPy', 'Excel', 'PostgreSQL'],
    display_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'exp-2',
    title: 'Founder & Convener',
    company: 'Creative Thinkers Forum',
    location: 'Nigeria',
    employment_type: 'Leadership',
    start_date: '2022-05-01',
    end_date: null,
    is_current: true,
    description: [
      'Establish and lead a vibrant community focused on youth empowerment, digital skills acquisition, and innovation.',
      'Organize technical workshops, hackathons, and mentorship sessions reaching hundreds of aspiring tech professionals.'
    ],
    technologies: ['Community Leadership', 'Mentorship', 'Strategic Planning', 'Public Speaking'],
    display_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    category: 'Data Analytics & BI',
    name: 'Power BI & Tableau',
    proficiency_level: 95,
    icon_name: 'BarChart3',
    description: 'Interactive dashboard design, DAX formulas, data modeling, and automated ETL.',
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'skill-2',
    category: 'Data Analytics & BI',
    name: 'SQL & Database Architecture',
    proficiency_level: 92,
    icon_name: 'Database',
    description: 'Complex queries, schema normalization, analytical queries, and performance indexing.',
    display_order: 2,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Educational Performance & Student Analytics Dashboard',
    slug: 'student-analytics-dashboard',
    short_description: 'Interactive Power BI & SQL dashboard tracking student learning trajectories, assessment trends, and placement metrics at SQI College of ICT.',
    full_description: 'Designed a unified reporting and analytics system that ingests student test scores, attendance records, and project completion rates.',
    category: 'Data Analytics',
    status: 'completed',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    demo_url: 'https://powerbi.microsoft.com',
    github_url: 'https://github.com/profdammy/student-analytics',
    technologies: ['Power BI', 'SQL', 'Python', 'DAX', 'Excel'],
    metrics_highlights: ['Processed 1,000+ student performance records', 'Improved course completion tracking efficiency by 40%'],
    display_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'proj-2',
    title: 'AI-Assisted Customer Churn Prediction & Insights Tool',
    slug: 'churn-prediction-ai',
    short_description: 'Machine learning pipeline with interactive Next.js dashboard predicting subscription churn risk for telecom & SaaS clients.',
    full_description: 'Built a predictive classifier using Python (RandomForest & XGBoost) deployed via FastAPI and consumed by a modern Next.js interface.',
    category: 'AI Solution',
    status: 'completed',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    demo_url: 'https://churn-predictor-demo.vercel.app',
    github_url: 'https://github.com/profdammy/churn-prediction',
    technologies: ['Python', 'Scikit-Learn', 'FastAPI', 'Next.js', 'Tailwind CSS'],
    metrics_highlights: ['Achieved 88% model precision', 'Reduced evaluation latency to under 200ms'],
    display_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'proj-3',
    title: 'Automated Research Citation & Data Extraction Toolkit',
    slug: 'research-citation-toolkit',
    short_description: 'Ongoing open-source research automation tool helping academic writers analyze dataset structures and compile citations.',
    full_description: 'An intelligent literature and dataset analysis tool currently in active development.',
    category: 'Research Tool',
    status: 'in_progress',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    demo_url: null,
    github_url: 'https://github.com/profdammy/research-toolkit',
    technologies: ['Python', 'LangChain', 'Streamlit', 'Pandas'],
    metrics_highlights: ['Beta tested with 50+ research articles', 'In-progress active feature development'],
    display_order: 3,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockTeachingMentorship: TeachingMentorship[] = [
  {
    id: 'teach-1',
    title: 'Data Analysis & BI Certification Program',
    organization: 'SQI College of ICT',
    role: 'Lead Instructor',
    period: '2023 - Present',
    summary: 'Lead instructor responsible for training diploma and professional certificate students in modern data analytics, database querying, and data visualization.',
    impact_highlights: [
      'Guided 200+ students through industry-aligned capstone projects.',
      'Achieved a 90%+ pass rate in professional portfolio evaluations.'
    ],
    students_impacted: 250,
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockLeadershipCommunity: LeadershipCommunity[] = [
  {
    id: 'lead-1',
    title: 'Creative Thinkers Forum Community Outreach',
    organization: 'Creative Thinkers Forum',
    role: 'Founder & Convener',
    period: '2022 - Present',
    summary: 'Initiated community-driven digital literacy and career empowerment seminars for university students and youths.',
    achievements: [
      'Organized 10+ free technical workshops on data literacy and ICT career planning.',
      'Built an active community network of over 500+ aspiring tech enthusiasts.'
    ],
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockEducation: Education[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology (B.Tech)',
    field_of_study: 'Pure and Applied Mathematics / Computer Science Specialization',
    institution: 'Ladoke Akintola University of Technology (LAUTECH)',
    location: 'Ogbomoso, Nigeria',
    start_year: 2018,
    end_year: 2023,
    is_current: false,
    grade_or_honors: 'First Class Honors Candidate / Distinction',
    activities: 'President of Academic Society, Lead Math & Data Tutor',
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Certified Data Analyst Professional',
    issuing_organization: 'SQI College of ICT / Industry Certification',
    issue_date: '2023-03-15',
    expiration_date: null,
    credential_id: 'SQI-DA-2023-889',
    credential_url: 'https://edu.sqi.ng/verify',
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockPublications: Publication[] = [
  {
    id: 'pub-1',
    title: 'Optimizing Predictive Analytics in Technical Education: A Data-Driven Framework',
    publisher_or_journal: 'Journal of Educational Technology and Applied Data Science',
    publication_date: '2024-02-10',
    publication_type: 'paper',
    authors: ['Damilola Miracle Oluwagbamila'],
    abstract: 'This research investigates the impact of real-time learning analytics on student retention and practical skill mastery.',
    doi_or_url: 'https://doi.org/10.1000/example-doi',
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockAchievements: Achievement[] = [
  {
    id: 'achieve-1',
    title: 'Outstanding Data Analysis Instructor of the Year',
    category: 'Teaching Excellence',
    issuer: 'SQI College of ICT Academic Board',
    award_date: '2023-12-15',
    description: 'Recognized for exceptional teaching feedback, student mentorship outcomes, and innovation in analytics curriculum delivery.',
    display_order: 1,
    published: true,
    created_at: new Date().toISOString()
  }
]

export const mockMediaAssets: MediaAsset[] = [
  {
    id: 'media-1',
    name: 'Prof Dammy Headshot',
    file_path: 'avatars/prof-dammy.jpg',
    public_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    media_type: 'image',
    mime_type: 'image/jpeg',
    size_bytes: 245000,
    alt_text: 'Damilola Miracle Oluwagbamila professional portrait',
    created_at: new Date().toISOString()
  }
]
