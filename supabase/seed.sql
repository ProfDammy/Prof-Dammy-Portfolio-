-- Seed Data for Prof Dammy's Portfolio Platform (Verified Information Only)

INSERT INTO public.profiles (
  id, full_name, professional_title, bio, detailed_about, avatar_url, hero_media_url, contact_email, contact_phone, location, social_links, cv_url, published
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Damilola Miracle Oluwagbamila',
  'Data Analysis Instructor | AI & Software Solutions Developer | Academic Researcher',
  'Data Analytics Specialist, Educator, and Tech Leader dedicated to transforming complex data into actionable intelligence and mentoring next-generation tech talent.',
  'Damilola Miracle Oluwagbamila, known professionally as Prof Dammy, is a Data Analysis Instructor, AI/Software Solutions Developer, and Community Leader. With a foundation in mathematics, data analytics, and software development, he teaches data analytics at SQI College of ICT while contributing to community empowerment through the Creative Thinkers Forum.',
  NULL,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'contact@profdammy.com',
  NULL,
  'Oyo State, Nigeria',
  '{"github": "https://github.com/profdammy", "linkedin": "https://linkedin.com/in/damilola-oluwagbamila", "twitter": "https://twitter.com/prof_dammy", "google_scholar": "https://scholar.google.com"}'::jsonb,
  '/documents/Damilola_Oluwagbamila_CV.pdf',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (
  id, theme_accent_color, custom_headline, custom_subtitle, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '#2563eb',
  'Transforming Data into Intelligence & Empowering Next-Gen Innovators',
  'Data Analysis Instructor at SQI College of ICT | AI Solutions Developer | Founder of Creative Thinkers Forum',
  'Explore Projects',
  '#projects',
  'Download CV',
  '#cv'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.experiences (title, company, location, employment_type, start_date, is_current, description, technologies, display_order, published) VALUES
(
  'Data Analysis Instructor',
  'SQI College of ICT',
  'Oyo State, Nigeria',
  'Full-time',
  '2023-01-01',
  true,
  ARRAY[
    'Design and deliver curriculums covering Python for Data Science, SQL, Power BI, Advanced Excel, and Statistical Analysis.',
    'Mentor students through practical data analytics capstones and business intelligence projects.'
  ],
  ARRAY['Python', 'SQL', 'Power BI', 'Pandas', 'NumPy', 'Excel', 'PostgreSQL'],
  1,
  true
),
(
  'Founder & Convener',
  'Creative Thinkers Forum',
  'Nigeria',
  'Leadership',
  '2022-05-01',
  true,
  ARRAY[
    'Establish and lead a community focused on youth empowerment, digital skills acquisition, and innovation.',
    'Organize technical workshops, seminars, and mentorship sessions for aspiring tech professionals.'
  ],
  ARRAY['Community Leadership', 'Mentorship', 'Strategic Planning', 'Public Speaking'],
  2,
  true
);

INSERT INTO public.skills (category, name, proficiency_level, icon_name, description, display_order, published) VALUES
('Data Analytics & BI', 'Power BI & Data Visualization', 95, 'BarChart3', 'Interactive dashboard design, DAX formulas, data modeling, and reporting.', 1, true),
('Data Analytics & BI', 'SQL & Database Querying', 92, 'Database', 'Analytical queries, schema design, and data aggregation.', 2, true),
('AI & Software Engineering', 'Next.js & TypeScript', 88, 'Code', 'Full-stack Web applications with modern UI, API integrations, and styling.', 3, true);

INSERT INTO public.projects (title, slug, short_description, full_description, category, status, is_featured, image_url, demo_url, github_url, technologies, metrics_highlights, display_order, published) VALUES
(
  'Educational Performance & Student Analytics Dashboard',
  'student-analytics-dashboard',
  'Interactive Power BI & SQL dashboard tracking student learning performance and assessment metrics.',
  'Designed a unified reporting and analytics system that synthesizes student assessment records and attendance trends.',
  'Data Analytics',
  'completed',
  true,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'https://powerbi.microsoft.com',
  'https://github.com/profdammy/student-analytics',
  ARRAY['Power BI', 'SQL', 'Python', 'DAX', 'Excel'],
  ARRAY['Unified student assessment reporting', 'Automated course tracking'],
  1,
  true
);
