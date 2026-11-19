import { supabase, isConfigured } from './supabase';
import { properties as mockProperties, agents as mockAgents } from '../data/mockData';

// Adapter to map database models (snake_case) to UI components (camelCase)
const mapProperty = (dbProp) => {
  if (!dbProp) return null;
  return {
    id: dbProp.id,
    title: dbProp.title,
    description: dbProp.description,
    price: Number(dbProp.price),
    status: dbProp.status,
    type: dbProp.property_type,
    city: dbProp.city,
    location: dbProp.address,
    beds: dbProp.bedrooms,
    baths: dbProp.bathrooms,
    sqft: dbProp.area_sqft,
    yearBuilt: dbProp.year_built,
    features: dbProp.features || [],
    images: dbProp.images || [],
    image: dbProp.images && dbProp.images.length > 0 ? dbProp.images[0] : '',
    isHotDeal: dbProp.is_hot_deal,
    isFeatured: dbProp.is_featured,
    createdAt: dbProp.created_at,
    agent_id: dbProp.agent_id,
    agent: dbProp.agents ? {
      id: dbProp.agents.id,
      name: dbProp.agents.name,
      photo: dbProp.agents.photo_url,
      role: 'Listing agent',
      rating: dbProp.agents.rating,
      totalSales: dbProp.agents.total_sales || 0,
      email: dbProp.agents.profiles?.email || '',
      phone: dbProp.agents.profiles?.phone || ''
    } : null
  };
};

// ---- Mock-mode persistence (localStorage) so dashboards work without Supabase ----
const LISTINGS_KEY = 'mock_listings';
const ENQUIRIES_KEY = 'mock_enquiries';

const readStore = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const allMockProperties = () => [...mockProperties, ...readStore(LISTINGS_KEY)];

// When Supabase is configured but unreachable (paused/deleted project, offline), fall back to the
// bundled sample data so the site still renders. Real query errors are still surfaced.
const isNetworkError = (err) => /failed to fetch|fetch failed|networkerror|network request failed|load failed/i.test(String(err?.message || err));
const withFallback = async (label, fetchLive, fetchSample) => {
  try {
    return await fetchLive();
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    console.warn(`Supabase unreachable while loading ${label}; showing bundled sample data.`);
    return fetchSample();
  }
};

// 1. Get properties based on search filters
const getMockProperties = (filters = {}) => {
  let list = [...allMockProperties()];

  // Attach agent details (user-created listings carry their own owner card)
  list = list.map(p => {
    const agent = mockAgents.find(a => a.id === p.agent_id) || p.agent || null;
    return { ...p, agent };
  });

  if (filters.status) {
    const mappedStatus = filters.status === 'Buy' ? 'For Sale' : (filters.status === 'Rent' ? 'For Rent' : 'Sold');
    list = list.filter(p => p.status === mappedStatus);
  }

  if (filters.city) {
    list = list.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
  } else if (filters.location) {
    list = list.filter(p => 
      p.city.toLowerCase().includes(filters.location.toLowerCase()) || 
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.type) {
    list = list.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
  }

  if (filters.minPrice) {
    list = list.filter(p => p.price >= parseInt(filters.minPrice, 10));
  }
  if (filters.maxPrice) {
    list = list.filter(p => p.price <= parseInt(filters.maxPrice, 10));
  }

  if (filters.bedrooms) {
    list = list.filter(p => p.beds >= parseInt(filters.bedrooms, 10));
  }
  if (filters.bathrooms) {
    list = list.filter(p => p.baths >= parseInt(filters.bathrooms, 10));
  }

  if (filters.minArea) {
    list = list.filter(p => p.sqft >= parseInt(filters.minArea, 10));
  }
  if (filters.maxArea) {
    list = list.filter(p => p.sqft <= parseInt(filters.maxArea, 10));
  }

  if (filters.amenities && filters.amenities.length > 0) {
    list = list.filter(p => filters.amenities.every(amenity => p.features.includes(amenity)));
  }

  return list;
};

const fetchLiveProperties = async (filters = {}) => {
  let query = supabase
    .from('properties')
    .select('*, agents(*, profiles(*))');

  // Status Filter mapping
  if (filters.status) {
    const mappedStatus = filters.status === 'Buy' ? 'For Sale' : (filters.status === 'Rent' ? 'For Rent' : 'Sold');
    query = query.eq('status', mappedStatus);
  }

  // City and Location Filter
  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`);
  } else if (filters.location) {
    const location = filters.location.replace(/[^\p{L}\p{N} .-]/gu, '').slice(0, 100);
    query = query.or(`city.ilike.%${location}%,address.ilike.%${location}%`);
  }

  // Property Type
  if (filters.type) {
    query = query.eq('property_type', filters.type);
  }

  // Price boundaries
  if (filters.minPrice) {
    query = query.gte('price', parseInt(filters.minPrice, 10));
  }
  if (filters.maxPrice) {
    query = query.lte('price', parseInt(filters.maxPrice, 10));
  }

  // Bedrooms & Bathrooms
  if (filters.bedrooms) {
    query = query.gte('bedrooms', parseInt(filters.bedrooms, 10));
  }
  if (filters.bathrooms) {
    query = query.gte('bathrooms', parseInt(filters.bathrooms, 10));
  }

  // Sqft area boundaries
  if (filters.minArea) {
    query = query.gte('area_sqft', parseInt(filters.minArea, 10));
  }
  if (filters.maxArea) {
    query = query.lte('area_sqft', parseInt(filters.maxArea, 10));
  }

  // Amenities contained list
  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains('features', filters.amenities);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching properties:', error.message);
    throw error;
  }
  return (data || []).map(mapProperty);
};

export const getProperties = async (filters = {}) => {
  if (!isConfigured) return getMockProperties(filters);
  return withFallback('properties', () => fetchLiveProperties(filters), () => getMockProperties(filters));
};

// 2. Fetch details for a single property
const getMockProperty = (id) => {
  const prop = allMockProperties().find(p => p.id === parseInt(id, 10));
  if (!prop) throw new Error(`Property ${id} not found`);
  const agent = mockAgents.find(a => a.id === prop.agent_id) || prop.agent || null;
  return { ...prop, agent };
};

const fetchLiveProperty = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, agents(*, profiles(*))')
    .eq('id', parseInt(id, 10))
    .single();

  if (error) {
    console.error(`Error fetching property ${id}:`, error.message);
    throw error;
  }
  return mapProperty(data);
};

export const getProperty = async (id) => {
  if (!isConfigured) return getMockProperty(id);
  return withFallback(`property ${id}`, () => fetchLiveProperty(id), () => getMockProperty(id));
};

// 3. Get all agents with properties listed count
const getMockAgents = () => mockAgents.map(agent => ({
  ...agent,
  propertiesListed: mockProperties.filter(p => p.agent_id === agent.id).length
}));

const fetchLiveAgents = async () => {
  const { data, error } = await supabase
    .from('agents')
    .select('*, profiles(*), properties(id)');

  if (error) {
    console.error('Error fetching agents:', error.message);
    throw error;
  }

  return (data || []).map(agent => ({
    id: agent.id,
    name: agent.name,
    photo: agent.photo_url,
    role: agent.profiles?.role === 'agent' ? 'Premium Sales Agent' : 'Real Estate Consultant',
    phone: agent.profiles?.phone || '',
    email: agent.profiles?.email || '',
    bio: agent.bio || 'Licensed Agent at Aura Space.',
    propertiesListed: agent.properties ? agent.properties.length : 0,
    rating: Number(agent.rating),
    totalSales: agent.total_sales || 0
  }));
};

export const getAgents = async () => {
  if (!isConfigured) return getMockAgents();
  return withFallback('agents', fetchLiveAgents, getMockAgents);
};

// 4. Get a single agent profile with properties
const getMockAgent = (id) => {
  const agent = mockAgents.find(a => a.id === parseInt(id, 10));
  if (!agent) throw new Error(`Agent ${id} not found`);
  const agentProperties = mockProperties.filter(p => p.agent_id === agent.id).map(p => ({ ...p, agent }));
  return {
    ...agent,
    propertiesListed: agentProperties.length,
    properties: agentProperties
  };
};

const fetchLiveAgent = async (id) => {
  const { data, error } = await supabase
    .from('agents')
    .select('*, profiles(*), properties(*)')
    .eq('id', parseInt(id, 10))
    .single();

  if (error) {
    console.error(`Error fetching agent ${id}:`, error.message);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    photo: data.photo_url,
    role: data.profiles?.role === 'agent' ? 'Premium Sales Agent' : 'Real Estate Consultant',
    phone: data.profiles?.phone || '',
    email: data.profiles?.email || '',
    bio: data.bio || 'Licensed Agent at Aura Space.',
    propertiesListed: data.properties ? data.properties.length : 0,
    rating: Number(data.rating),
    totalSales: data.total_sales || 0,
    properties: (data.properties || []).map(p => mapProperty({ ...p, agents: data }))
  };
};

export const getAgent = async (id) => {
  if (!isConfigured) return getMockAgent(id);
  return withFallback(`agent ${id}`, () => fetchLiveAgent(id), () => getMockAgent(id));
};

// 5. Submit an enquiry message (Tour schedule or general query)
export const submitEnquiry = async (enquiryData) => {
  if (!isConfigured) {
    const saved = { id: Date.now(), created_at: new Date().toISOString(), ...enquiryData };
    writeStore(ENQUIRIES_KEY, [saved, ...readStore(ENQUIRIES_KEY)]);
    return saved;
  }

  const { propertyId, agentId, userId, name, email, phone, subject, date, time, message } = enquiryData;

  const formattedMessage = `Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject || (date ? 'Tour Request' : 'General Enquiry')}
${date ? `Preferred Tour Date: ${date} at ${time}` : ''}

Message: ${message}`;

  const { data, error } = await supabase
    .from('enquiries')
    .insert({
      property_id: propertyId ? parseInt(propertyId, 10) : null,
      agent_id: agentId ? parseInt(agentId, 10) : null,
      user_id: userId || null,
      message: formattedMessage
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting enquiry:', error.message);
    throw error;
  }
  return data;
};

// 6. Upload a property image asset to Supabase Storage bucket 'property-images'
export const uploadPropertyImage = async (file) => {
  if (!isConfigured) {
    // A data URL (not a blob URL) so the image survives a page reload in mock mode
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read the image file'));
      reader.readAsDataURL(file);
    });
  }

  const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
  const fileExt = extensions[file.type];
  if (!fileExt || file.size > 1024 * 1024) throw new Error('Choose a JPEG, PNG, WebP or AVIF image under 1 MB.');
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const { data: { user: uploadUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !uploadUser) throw new Error('Sign in before uploading an image.');
  const filePath = `${uploadUser.id}/${fileName}`;

  const { error } = await supabase.storage
    .from('property-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading property image:', error.message);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

// ---- Seller / Agent dashboard ----

const DEFAULT_LISTING_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80';

// 7. Create a listing owned by the signed-in seller/agent
export const createProperty = async (form, user) => {
  if (!user?.id) throw new Error('You must be signed in to list a property');
  const image = form.image || DEFAULT_LISTING_IMAGE;

  if (!isConfigured) {
    const listing = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      price: Number(form.price),
      status: form.status,
      type: form.type,
      city: form.city,
      location: form.address,
      beds: Number(form.beds),
      baths: Number(form.baths),
      sqft: Number(form.sqft),
      yearBuilt: Number(form.yearBuilt) || null,
      features: form.features,
      images: [image],
      image,
      isFeatured: false,
      isHotDeal: false,
      createdAt: new Date().toISOString(),
      agent_id: null,
      owner_id: user.id,
      agent: { name: user.name, photo: '', role: 'Listing owner', rating: 5, reviews: 0, email: user.email || '', phone: '' },
    };
    writeStore(LISTINGS_KEY, [listing, ...readStore(LISTINGS_KEY)]);
    return listing;
  }

  const { data: agentRow } = await supabase
    .from('agents').select('id').eq('profile_id', user.id).maybeSingle();

  const { data, error } = await supabase
    .from('properties')
    .insert({
      owner_id: user.id,
      agent_id: agentRow?.id ?? null,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      status: form.status,
      property_type: form.type,
      city: form.city,
      address: form.address,
      bedrooms: Number(form.beds),
      bathrooms: Number(form.baths),
      area_sqft: Number(form.sqft),
      year_built: Number(form.yearBuilt) || null,
      features: form.features,
      images: [image],
    })
    .select('*, agents(*, profiles(*))')
    .single();
  if (error) {
    console.error('Error creating property:', error.message);
    throw error;
  }
  return mapProperty(data);
};

// 8. Listings that belong to the signed-in user
export const getMyProperties = async (user) => {
  if (!user?.id) return [];
  if (!isConfigured) {
    return readStore(LISTINGS_KEY).filter((p) => p.owner_id === user.id);
  }
  const { data: agentRow } = await supabase
    .from('agents').select('id').eq('profile_id', user.id).maybeSingle();
  const owner = `owner_id.eq.${user.id}`;
  const filter = agentRow ? `${owner},agent_id.eq.${agentRow.id}` : owner;
  const { data, error } = await supabase
    .from('properties')
    .select('*, agents(*, profiles(*))')
    .or(filter)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProperty);
};

// 9. Delete a listing (owner only; enforced by RLS in Supabase mode)
export const deleteProperty = async (id, user) => {
  if (!user?.id) throw new Error('Sign in to delete a listing.');
  if (!isConfigured) {
    const listings = readStore(LISTINGS_KEY);
    if (!listings.some(p => p.id === id && p.owner_id === user.id)) throw new Error('You can delete only your own demo listings.');
    writeStore(LISTINGS_KEY, listings.filter((p) => p.id !== id));
    return true;
  }
  const { data, error } = await supabase.from('properties').delete().eq('id', id).select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('The listing could not be deleted. Check your ownership and refresh.');
  return true;
};

const field = (text, label) => {
  const m = new RegExp(`^${label}: (.*)$`, 'm').exec(text || '');
  return m ? m[1].trim() : '';
};

// 10. Enquiries received on the user's listings
export const getMyEnquiries = async (user) => {
  if (!user?.id) return [];
  if (!isConfigured) {
    const mine = new Map(readStore(LISTINGS_KEY).filter((p) => p.owner_id === user.id).map((p) => [p.id, p.title]));
    return readStore(ENQUIRIES_KEY)
      .filter((e) => mine.has(parseInt(e.propertyId, 10)))
      .map((e) => ({
        id: e.id, created_at: e.created_at, propertyTitle: mine.get(parseInt(e.propertyId, 10)),
        name: e.name, email: e.email, phone: e.phone,
        subject: e.subject || (e.date ? 'Tour Request' : 'General Enquiry'), message: e.message,
      }));
  }
  const { data, error } = await supabase
    .from('enquiries')
    .select('*, properties(title)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((e) => ({
    id: e.id, created_at: e.created_at, propertyTitle: e.properties?.title || 'General enquiry',
    name: field(e.message, 'Name'), email: field(e.message, 'Email'), phone: field(e.message, 'Phone'),
    subject: field(e.message, 'Subject'), message: (e.message.split('Message: ')[1] || e.message).trim(),
  }));
};
