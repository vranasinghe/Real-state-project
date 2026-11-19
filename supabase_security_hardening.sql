-- Apply after supabase_setup.sql (and the dashboard migration on older installs).
-- Also required for fresh installs. Run as database owner in Supabase SQL editor.
BEGIN;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Users may edit contact details, never their own identity, email or account role.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name, avatar_url, phone) ON public.profiles TO authenticated;
REVOKE UPDATE ON public.agents FROM anon, authenticated;
GRANT UPDATE (name, photo_url, bio) ON public.agents TO authenticated;

CREATE OR REPLACE FUNCTION public.protect_profile_identity()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') AND
     (NEW.id IS DISTINCT FROM OLD.id OR NEW.role IS DISTINCT FROM OLD.role OR NEW.email IS DISTINCT FROM OLD.email) THEN
    RAISE EXCEPTION 'Account identity and role require an administrator';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_profile_identity ON public.profiles;
CREATE TRIGGER protect_profile_identity BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_identity();

-- Agents and owners cannot transfer or reassign an existing listing through an update.
CREATE OR REPLACE FUNCTION public.protect_listing_ownership()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') AND
     (NEW.owner_id IS DISTINCT FROM OLD.owner_id OR NEW.agent_id IS DISTINCT FROM OLD.agent_id) THEN
    RAISE EXCEPTION 'Listing reassignment requires an administrator';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_listing_ownership ON public.properties;
CREATE TRIGGER protect_listing_ownership BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.protect_listing_ownership();

DROP POLICY IF EXISTS "Allow sellers and agents to create listings" ON public.properties;
CREATE POLICY "Allow sellers and agents to create listings" ON public.properties
FOR INSERT TO authenticated WITH CHECK (
  owner_id = auth.uid() AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('seller', 'agent') AND
  (agent_id IS NULL OR agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid()))
);

-- A caller may not impersonate another user or attach an unrelated recipient to a property enquiry.
DROP POLICY IF EXISTS "Allow anyone to submit enquiries" ON public.enquiries;
CREATE POLICY "Allow anyone to submit enquiries" ON public.enquiries
FOR INSERT TO anon, authenticated WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid()) AND
  length(message) BETWEEN 1 AND 10000 AND
  (property_id IS NULL OR EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_id
    AND (enquiries.agent_id IS NULL OR enquiries.agent_id = p.agent_id)
  ))
);

-- Private upload ownership; public read is intentional for listing photography.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-images', 'property-images', true, 1048576, ARRAY['image/jpeg','image/png','image/webp','image/avif'])
ON CONFLICT (id) DO UPDATE SET file_size_limit = EXCLUDED.file_size_limit,
allowed_mime_types = EXCLUDED.allowed_mime_types;
DROP POLICY IF EXISTS "Casa Mare owner image upload" ON storage.objects;
CREATE POLICY "Casa Mare owner image upload" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Casa Mare owner image delete" ON storage.objects;
CREATE POLICY "Casa Mare owner image delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
COMMIT;
