-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to automatically set updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  professional_title VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  detailed_about TEXT,
  avatar_url TEXT,
  hero_media_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  location VARCHAR(255),
  social_links JSONB DEFAULT '{}'::jsonb,
  cv_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for public.profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_accent_color VARCHAR(50) DEFAULT '#2563eb',
  custom_headline VARCHAR(255) DEFAULT 'Transforming Data into Intelligence & Empowering Next-Gen Innovators',
  custom_subtitle TEXT DEFAULT 'Data Analysis Instructor at SQI College of ICT | AI Solutions Developer | Founder of Creative Thinkers Forum',
  primary_cta_text VARCHAR(100) DEFAULT 'Explore Projects',
  primary_cta_link VARCHAR(255) DEFAULT '#projects',
  secondary_cta_text VARCHAR(100) DEFAULT 'Download CV',
  secondary_cta_link VARCHAR(255) DEFAULT '#cv',
  section_visibility JSONB DEFAULT '{
    "hero": true,
    "about": true,
    "skills": true,
    "experience": true,
    "projects": true,
    "teaching": true,
    "leadership": true,
    "education": true,
    "publications": true,
    "achievements": true,
    "gallery": true,
    "contact": true
  }'::jsonb,
  section_order JSONB DEFAULT '["hero", "about", "skills", "experience", "projects", "teaching", "leadership", "education", "publications", "achievements", "gallery", "contact"]'::jsonb,
  navigation_labels JSONB DEFAULT '{
    "about": "About",
    "skills": "Skills",
    "experience": "Experience",
    "projects": "Projects",
    "teaching": "Teaching & Mentorship",
    "leadership": "Leadership",
    "education": "Education",
    "publications": "Research",
    "achievements": "Achievements",
    "gallery": "Gallery",
    "contact": "Contact"
  }'::jsonb,
  footer_content TEXT DEFAULT '© Damilola Miracle Oluwagbamila (Prof Dammy). All rights reserved.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for public.site_settings updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  employment_type VARCHAR(100) DEFAULT 'Full-time',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT[] DEFAULT '{}'::text[],
  technologies TEXT[] DEFAULT '{}'::text[],
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for public.experiences updated_at
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 100),
  icon_name VARCHAR(100),
  description TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}'::text[],
  metrics_highlights TEXT[] DEFAULT '{}'::text[],
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for public.projects updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Teaching & Mentorship Table
CREATE TABLE IF NOT EXISTS public.teaching_mentorship (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  role VARCHAR(150) NOT NULL,
  period VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  impact_highlights TEXT[] DEFAULT '{}'::text[],
  students_impacted INT DEFAULT 0,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Leadership & Community Table
CREATE TABLE IF NOT EXISTS public.leadership_community (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  role VARCHAR(150) NOT NULL,
  period VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}'::text[],
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_year INT NOT NULL,
  end_year INT,
  is_current BOOLEAN DEFAULT false,
  grade_or_honors VARCHAR(100),
  activities TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Publications Table
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  publisher_or_journal VARCHAR(255) NOT NULL,
  publication_date DATE NOT NULL,
  publication_type VARCHAR(100) NOT NULL DEFAULT 'paper',
  authors TEXT[] DEFAULT '{}'::text[],
  abstract TEXT NOT NULL,
  doi_or_url TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  award_date DATE NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  public_url TEXT NOT NULL,
  media_type VARCHAR(50) NOT NULL DEFAULT 'image',
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  alt_text VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_mentorship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_community ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public site_settings read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public experiences read" ON public.experiences FOR SELECT USING (published = true);
CREATE POLICY "Public skills read" ON public.skills FOR SELECT USING (published = true);
CREATE POLICY "Public projects read" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Public teaching read" ON public.teaching_mentorship FOR SELECT USING (published = true);
CREATE POLICY "Public leadership read" ON public.leadership_community FOR SELECT USING (published = true);
CREATE POLICY "Public education read" ON public.education FOR SELECT USING (published = true);
CREATE POLICY "Public certifications read" ON public.certifications FOR SELECT USING (published = true);
CREATE POLICY "Public publications read" ON public.publications FOR SELECT USING (published = true);
CREATE POLICY "Public achievements read" ON public.achievements FOR SELECT USING (published = true);
CREATE POLICY "Public media_assets read" ON public.media_assets FOR SELECT USING (true);

-- Authenticated Admin Write Policies
CREATE POLICY "Admin write profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write teaching" ON public.teaching_mentorship FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write leadership" ON public.leadership_community FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write publications" ON public.publications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write achievements" ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write media_assets" ON public.media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket configuration for portfolio-media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio-media bucket
CREATE POLICY "Public Read Access on portfolio-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Upload Access on portfolio-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Update Access on portfolio-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media')
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Delete Access on portfolio-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media');
