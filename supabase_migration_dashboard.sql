-- Run this ONCE in the Supabase SQL Editor if you already ran supabase_setup.sql
-- before the seller/agent dashboard was added. New installs do not need it.

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Allow sellers and agents to create listings" ON public.properties;
DROP POLICY IF EXISTS "Allow agents to update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Allow owners and agents to update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Allow owners and agents to delete their own properties" ON public.properties;
DROP POLICY IF EXISTS "Allow agents to read their property enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow owners and agents to read their property enquiries" ON public.enquiries;

CREATE POLICY "Allow sellers and agents to create listings"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    owner_id = auth.uid() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('seller', 'agent')
  );

CREATE POLICY "Allow owners and agents to update their own properties"
  ON public.properties FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND (
      owner_id = auth.uid() OR
      agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "Allow owners and agents to delete their own properties"
  ON public.properties FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND (
      owner_id = auth.uid() OR
      agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "Allow owners and agents to read their property enquiries"
  ON public.enquiries FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid()) OR
      property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid())
    )
  );
