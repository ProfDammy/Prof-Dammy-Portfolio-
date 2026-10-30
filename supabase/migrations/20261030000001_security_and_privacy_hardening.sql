-- Security & Privacy Hardening Migration

-- 1. Helper Function: is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin' OR
      COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin' OR
      LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('admin@profdammy.com', 'oluwagbamilad@gmail.com')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Profile Privacy Column & Policy
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (published = true OR public.is_admin());

-- 3. Restricted Write Policies (Administrator-Only)
DROP POLICY IF EXISTS "Admin write profiles" ON public.profiles;
CREATE POLICY "Admin write profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write experiences" ON public.experiences;
CREATE POLICY "Admin write experiences" ON public.experiences FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write skills" ON public.skills;
CREATE POLICY "Admin write skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write teaching" ON public.teaching_mentorship;
CREATE POLICY "Admin write teaching" ON public.teaching_mentorship FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write leadership" ON public.leadership_community;
CREATE POLICY "Admin write leadership" ON public.leadership_community FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write education" ON public.education;
CREATE POLICY "Admin write education" ON public.education FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write certifications" ON public.certifications;
CREATE POLICY "Admin write certifications" ON public.certifications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write publications" ON public.publications;
CREATE POLICY "Admin write publications" ON public.publications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write achievements" ON public.achievements;
CREATE POLICY "Admin write achievements" ON public.achievements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin write media_assets" ON public.media_assets;
CREATE POLICY "Admin write media_assets" ON public.media_assets FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Storage Security Policies for portfolio-media Bucket
DROP POLICY IF EXISTS "Authenticated Upload Access on portfolio-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access on portfolio-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access on portfolio-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access on portfolio-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access on portfolio-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access on portfolio-media" ON storage.objects;

CREATE POLICY "Admin Upload Access on portfolio-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admin Update Access on portfolio-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admin Delete Access on portfolio-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin());
