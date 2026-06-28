-- ==========================================
-- 1. TABLE CREATION
-- ==========================================

-- Profiles: Holds user account metadata
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'agent')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agents: Holds public facing real estate agent records
CREATE TABLE public.agents (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 5.0,
  total_sales INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Properties: Real estate listings
CREATE TABLE public.properties (
  id SERIAL PRIMARY KEY,
  agent_id INT REFERENCES public.agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('For Sale', 'For Rent', 'Sold')),
  property_type TEXT NOT NULL CHECK (property_type IN ('House', 'Apartment', 'Villa', 'Condo')),
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  bedrooms INT,
  bathrooms INT,
  area_sqft INT,
  year_built INT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_hot_deal BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Favorites: Bookmark mappings
CREATE TABLE public.favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id INT REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, property_id)
);

-- Enquiries: Client messages regarding properties or tours
CREATE TABLE public.enquiries (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES public.properties(id) ON DELETE CASCADE,
  agent_id INT REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. TRIGGER DEFINITION
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'buyer');
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  -- Create user profile row
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url, phone)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );

  -- If signing up as an agent, auto-create agent record
  IF user_role = 'agent' THEN
    INSERT INTO public.agents (profile_id, name, photo_url, bio, rating, total_sales)
    VALUES (
      NEW.id,
      user_name,
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      'Licensed Real Estate Agent at Casa Mare.',
      5.0,
      0
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. RLS POLICY DECLARATIONS
-- ==========================================

-- PROFILES Policies
CREATE POLICY "Allow users to read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- AGENTS Policies
CREATE POLICY "Allow public read agents"
  ON public.agents FOR SELECT
  USING (true);

CREATE POLICY "Allow agents to update their own public records"
  ON public.agents FOR UPDATE
  USING (auth.uid() = profile_id);

-- PROPERTIES Policies
CREATE POLICY "Allow public read properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Allow sellers and agents to create listings"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('seller', 'agent')
  );

CREATE POLICY "Allow agents to update their own properties"
  ON public.properties FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND 
    agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid())
  );

-- FAVORITES Policies
CREATE POLICY "Allow users access to their own favorites list"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ENQUIRIES Policies
CREATE POLICY "Allow authenticated enquiries submission"
  ON public.enquiries FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow agents to read their property enquiries"
  ON public.enquiries FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND 
    agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid())
  );

-- ==========================================
-- 5. TEST DATA SEEDING (FROM original mockData)
-- ==========================================

-- Seeding corresponding agents' profile placeholders
INSERT INTO public.profiles (id, full_name, email, role, phone) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'James Harrison', 'james@casamare.com', 'agent', '+1 (555) 234-5678'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sophia Martinez', 'sophia@casamare.com', 'agent', '+1 (555) 345-6789'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Michael Lee', 'michael@casamare.com', 'agent', '+1 (555) 456-7890'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Emily Davis', 'emily@casamare.com', 'agent', '+1 (555) 567-8901'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'David Clark', 'david@casamare.com', 'agent', '+1 (555) 678-9012'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Olivia Wilson', 'olivia@casamare.com', 'agent', '+1 (555) 789-0123')
ON CONFLICT (id) DO NOTHING;

-- Seeding Agents records
INSERT INTO public.agents (id, profile_id, name, photo_url, bio, rating, total_sales) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'James Harrison', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 'James has over 18 years of experience in luxury real estate investments and brokerages.', 4.9, 128),
(2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sophia Martinez', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Sophia specializes in modern family residences and residential property consulting.', 4.8, 94),
(3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Michael Lee', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 'Michael covers waterfront high-rise condos and luxury vacation rentals.', 4.7, 76),
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Emily Davis', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 'Emily handles high-end residential listings in coastal and metropolitan regions.', 4.9, 58),
(5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'David Clark', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'David evaluates market trends, pricing strategies, and local development.', 4.6, 49),
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Olivia Wilson', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Olivia helps clients secure ultra-modern homes, smart estates, and luxury penthouses.', 4.9, 37)
ON CONFLICT (id) DO NOTHING;

-- Seeding listings properties
INSERT INTO public.properties (id, agent_id, title, description, price, status, property_type, city, address, bedrooms, bathrooms, area_sqft, year_built, features, images, is_hot_deal, is_featured) VALUES
(1, 1, 'Luxury Modern Villa', 'Nestled in the prestigious hills of Beverly Hills, this architectural marvel offers breathtaking views and state-of-the-art automation. Enjoy indoor-outdoor living, a private heated infinity pool, and custom marble finishes throughout.', 2880000, 'For Sale', 'Villa', 'Los Angeles', 'Beverly Hills, CA', 4, 2, 2500, 2021, ARRAY['Pool', 'Garage', 'Garden', 'Gym', 'Smart Home Tech', 'Wine Cellar'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'], false, true),
(2, 2, 'Gorgeous Family Home', 'A gorgeous single-family residence with a bright, open floor plan, spacious backyard garden, and proximity to top-tier elementary schools. Features custom cabinetry and updated stainless steel kitchen appliances.', 1450000, 'For Sale', 'House', 'Austin', 'Austin, TX', 4, 2, 2100, 2019, ARRAY['Garage', 'Garden', 'Fireplace', 'High Ceilings', 'Security System'], ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'], false, true),
(3, 3, 'Premium Waterfront Condo', 'Stunning modern condo boasting floor-to-ceiling glass windows that frame panoramic ocean vistas. Steps from the beach, upscale restaurants, and prime metropolitan nightlife.', 950000, 'For Sale', 'Condo', 'Miami', 'Miami, FL', 2, 2, 1200, 2022, ARRAY['Pool', 'Gym', 'Valet Parking', '24/7 Security', 'Balcony'], ARRAY['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'], false, true),
(4, 1, 'Stunning Luxury Villa', 'Experience the ultimate level of sophistication. This modern masterpiece features clean lines, natural materials, a massive home theater, wellness spa, and spectacular city lights views.', 3850000, 'For Sale', 'Villa', 'Los Angeles', 'Beverly Hills, CA', 4, 3, 2500, 2023, ARRAY['Pool', 'Garage', 'Garden', 'Gym', 'Home Theater', 'Spa Room'], ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'], true, false),
(5, 4, 'Glamorous Modern Residence', 'An elegant home with sophisticated modern designs, a state-of-the-art kitchen, an open deck patio, and gorgeous wrap-around professional landscaping.', 1950000, 'For Sale', 'House', 'Austin', 'Austin, TX', 4, 3, 2800, 2020, ARRAY['Garage', 'Garden', 'Deck', 'Outdoor Kitchen', 'Wine Rack'], ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'], true, false),
(6, 2, 'Contemporary Penthouse', 'Spacious Manhattan penthouse in a premium concierge building. Enjoy unmatched views of Central Park, a private roof terrace, and high-end built-in chef''s appliances.', 6500, 'For Rent', 'Apartment', 'New York City', 'Manhattan, NY', 3, 3, 1800, 2018, ARRAY['Pool', 'Gym', 'Roof Terrace', 'Central Park Views', 'Concierge'], ARRAY['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80'], false, true),
(7, 5, 'Classic Brick Estate', 'Timeless traditional brick estate in a highly coveted neighborhood. Features a grand entryway, library, custom wood trim, and a massive finished basement with wet bar.', 1650000, 'For Sale', 'House', 'Chicago', 'Chicago, IL', 5, 4, 3600, 2015, ARRAY['Garage', 'Garden', 'Library', 'Basement Bar', 'Fireplace'], ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'], false, false),
(8, 6, 'Elegant City Apartment', 'Stunning loft style apartment right in the center of Houston. High ceilings, exposed brick walls, and industrial hardware make this a designer''s dream property.', 3200, 'For Rent', 'Apartment', 'Houston', 'Downtown, Houston', 1, 1, 850, 2017, ARRAY['Gym', 'Garage', 'Exposed Brick', 'Rooftop Pool', 'Pets Allowed'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'], false, false),
(9, 3, 'Beachfront Luxury Villa', 'Wake up to the sound of waves. A stunning beachfront villa offering direct beach access, floor to ceiling impact glass, marble floors, a private pool, and outdoor bar.', 12000, 'For Rent', 'Villa', 'Miami', 'Golden Beach, Miami', 5, 5, 4200, 2022, ARRAY['Pool', 'Garage', 'Garden', 'Beach Access', 'Outdoor Bar', 'Dock'], ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'], false, false),
(10, 5, 'Cozy Suburban Cottage', 'Charming family cottage with a cozy porch, open kitchen layouts, and a newly fenced large backyard. Ideal for first-time home buyers.', 450000, 'Sold', 'House', 'Houston', 'Richmond, TX', 3, 2, 1600, 2012, ARRAY['Garage', 'Garden', 'Front Porch', 'Fenced Yard', 'Storage Shed'], ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'], false, false),
(11, 6, 'Ultra Modern Glass Mansion', 'An absolute masterpiece overlooking the Golden Gate Bridge. Features expansive glass walls, heated terraces, an infinity edge pool, elevator, and fully integrated smart systems.', 5200000, 'For Sale', 'Villa', 'San Francisco', 'Tiburon, SF', 5, 6, 5500, 2024, ARRAY['Pool', 'Garage', 'Garden', 'Gym', 'Elevator', 'Infinity Pool', 'Bridge Views'], ARRAY['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'], false, true),
(12, 4, 'Luxury High-Rise Condo', 'Beautiful modern condo in the heart of Seattle with stunning Space Needle and Puget Sound views. Walking distance to Amazon HQ, restaurants, and downtown retail.', 4800, 'For Rent', 'Condo', 'Seattle', 'Belltown, Seattle', 2, 2, 1100, 2020, ARRAY['Gym', 'Garage', 'Rooftop deck', 'Concierge', 'City Views'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'], false, false)
ON CONFLICT (id) DO NOTHING;

-- Fix the sequence auto-increments since we inserted explicit IDs
SELECT setval('public.agents_id_seq', COALESCE((SELECT MAX(id)+1 FROM public.agents), 1), false);
SELECT setval('public.properties_id_seq', COALESCE((SELECT MAX(id)+1 FROM public.properties), 1), false);
