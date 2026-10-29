-- Seed Data for Prof Dammy's Portfolio Platform

INSERT INTO public.profiles (
  id, full_name, professional_title, bio, detailed_about, avatar_url, hero_media_url, contact_email, location, social_links, cv_url
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Damilola Miracle Oluwagbamila',
  'Data Analysis Instructor | AI & Software Solutions Developer | Academic Researcher',
  'Data Analytics Specialist, Educator, and Tech Leader dedicated to transforming complex data into actionable intelligence and mentoring the next generation of tech innovators.',
  'Damilola Miracle Oluwagbamila, known professionally as Prof Dammy, is an experienced Data Analysis Instructor, AI/Software Solutions Developer, and Community Leader. With a strong foundation in statistics, business intelligence, data science, and technical education, he leads data analytics training at SQI College of ICT while actively contributing to academic research, software development, and youth empowerment initiatives like the Creative Thinkers Forum.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'profdammy@example.com',
  'Ogbomoso, Oyo State, Nigeria',
  '{"github": "https://github.com/profdammy", "linkedin": "https://linkedin.com/in/damilola-oluwagbamila", "twitter": "https://twitter.com/prof_dammy", "google_scholar": "https://scholar.google.com"}'::jsonb,
  '/documents/Damilola_Oluwagbamila_CV.pdf'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (
  id, theme_accent_color, custom_headline, custom_subtitle, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '#2563eb',
  'Bridging Data Science, Intelligent Software & Empowering Tech Talent',
  'Data Analysis Instructor at SQI College of ICT | AI Solutions Developer | Founder of Creative Thinkers Forum',
  'Explore Projects',
  '#projects',
  'Download CV',
  '#cv'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.experiences (title, company, location, employment_type, start_date, is_current, description, technologies, display_order) VALUES
(
  'Data Analysis Instructor',
  'SQI College of ICT',
  'Ogbomoso, Nigeria',
  'Full-time',
  '2023-01-01',
  true,
  ARRAY[
    'Design and deliver comprehensive curriculums covering Python for Data Science, SQL, Power BI, Advanced Excel, and Statistical Analysis.',
    'Mentor over 200+ students through hands-on data analytics capstones and practical industry projects.',
    'Optimize student learning outcomes with real-world case studies in business intelligence and predictive modeling.'
  ],
  ARRAY['Python', 'SQL', 'Power BI', 'Pandas', 'NumPy', 'Excel', 'PostgreSQL'],
  1
),
(
  'Founder & Convener',
  'Creative Thinkers Forum',
  'Nigeria',
  'Leadership',
  '2022-05-01',
  true,
  ARRAY[
    'Establish and lead a vibrant community focused on youth empowerment, digital skills acquisition, and innovation.',
    'Organize technical workshops, hackathons, and mentorship sessions reaching hundreds of aspiring tech professionals.',
    'Drive strategic partnerships with ICT institutions and community stakeholders.'
  ],
  ARRAY['Community Leadership', 'Mentorship', 'Strategic Planning', 'Public Speaking'],
  2
);

INSERT INTO public.skills (category, name, proficiency_level, icon_name, description, display_order) VALUES
('Data Analytics & BI', 'Power BI & Tableau', 95, 'BarChart3', 'Interactive dashboard design, DAX formulas, data modeling, and automated ETL.', 1),
('Data Analytics & BI', 'SQL & Database Architecture', 92, 'Database', 'Complex queries, schema normalization, analytical queries, and performance indexing.', 2),
('AI & Software Engineering', 'Next.js & TypeScript', 88, 'Code', 'Full-stack React applications with server actions, Tailwind CSS, and secure REST/GraphQL APIs.', 3);

INSERT INTO public.projects (title, slug, short_description, full_description, category, status, is_featured, image_url, demo_url, github_url, technologies, metrics_highlights, display_order) VALUES
(
  'Educational Performance & Student Analytics Dashboard',
  'student-analytics-dashboard',
  'Interactive Power BI & SQL dashboard tracking student learning trajectories, assessment trends, and placement metrics at SQI College of ICT.',
  'Designed a unified reporting and analytics system that ingests student test scores, attendance records, and project completion rates.',
  'Data Analytics',
  'completed',
  true,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'https://powerbi.microsoft.com',
  'https://github.com/profdammy/student-analytics',
  ARRAY['Power BI', 'SQL', 'Python', 'DAX', 'Excel'],
  ARRAY['Processed 1,000+ student performance records', 'Improved course completion tracking efficiency by 40%'],
  1
);
