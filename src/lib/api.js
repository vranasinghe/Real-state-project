import { supabase } from './supabase';

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
    agent_id: dbProp.agent_id,
    agent: dbProp.agents ? {
      id: dbProp.agents.id,
      name: dbProp.agents.name,
      photo: dbProp.agents.photo_url,
      role: 'Premium Sales Agent',
      rating: dbProp.agents.rating,
      reviews: dbProp.agents.total_sales || 0,
      email: dbProp.agents.profiles?.email || '',
      phone: dbProp.agents.profiles?.phone || ''
    } : null
  };
};

// 1. Get properties based on search filters
export const getProperties = async (filters = {}) => {
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
    query = query.or(`city.ilike.%${filters.location}%,address.ilike.%${filters.location}%`);
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

// 2. Fetch details for a single property
export const getProperty = async (id) => {
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

// 3. Get all agents with properties listed count
export const getAgents = async () => {
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
    bio: agent.bio || 'Licensed Agent at Casa Mare.',
    propertiesListed: agent.properties ? agent.properties.length : 0,
    rating: Number(agent.rating),
    reviews: agent.total_sales || 0
  }));
};

// 4. Get a single agent profile with properties
export const getAgent = async (id) => {
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
    bio: data.bio || 'Licensed Agent at Casa Mare.',
    propertiesListed: data.properties ? data.properties.length : 0,
    rating: Number(data.rating),
    reviews: data.total_sales || 0,
    properties: (data.properties || []).map(p => mapProperty({ ...p, agents: data }))
  };
};

// 5. Submit an enquiry message (Tour schedule or general query)
export const submitEnquiry = async (enquiryData) => {
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
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `properties/${fileName}`;

  const { data, error } = await supabase.storage
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
