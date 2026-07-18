import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight, Star } from 'lucide-react';
import PropertyGallery from '../../components/property/PropertyGallery';
import PropertyDetails from '../../components/property/PropertyDetails';
import ContactForm from '../../components/agent/ContactForm';
import PropertyCard from '../../components/property/PropertyCard';
import Badge from '../../components/common/Badge';
import { getProperty, getProperties } from '../../lib/api';
import { formatPrice } from '../../utils/formatPrice';

export const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true);
      setError(null);
      try {
        const propData = await getProperty(id);
        setProperty(propData);
        
        // Fetch similar properties of the same type
        if (propData && propData.type) {
          const similar = await getProperties({ type: propData.type });
          setSimilarProperties(
            similar.filter(p => p.id !== propData.id).slice(0, 2)
          );
        }
      } catch (err) {
        console.error('Error fetching property details:', err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4 font-body">
        <h2 className="text-2xl font-heading font-extrabold text-textDark">Property Not Found</h2>
        <p className="text-textMuted text-sm">
          {error ? error.message : 'The listing you are searching for does not exist or has been removed.'}
        </p>
        <Link to="/properties" className="inline-block bg-primary text-white py-2 px-6 rounded-btn font-heading font-bold text-xs uppercase tracking-wider">
          Back to Listings
        </Link>
      </div>
    );
  }

  const agent = property.agent || {
    name: 'Aura Spaces Advisor',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    role: 'Real Estate Consultant',
    phone: '+1 (555) 000-0000',
    email: 'info@auraspaces.com',
    rating: 5.0,
    reviews: 0
  };

  const finalSimilar = similarProperties.length > 0 ? similarProperties : [];

  return (
    <div className="pt-24 pb-20 font-body">
      
      {/* Breadcrumb section */}
      <section className="bg-cardBg py-6 border-b border-borderLight mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-textDark font-bold truncate max-w-[200px]">{property.title}</span>
        </div>
      </section>

      {/* Main details body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery, description, tabs */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge text={property.status} variant={property.status === 'Sold' ? 'sold' : (property.status === 'For Rent' ? 'rent' : 'sale')} />
                {property.isHotDeal && <Badge text="Hot Deal" variant="hot" />}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight leading-tight">
                  {property.title}
                </h1>
                <p className="text-2xl sm:text-3xl font-heading font-extrabold text-primary shrink-0 leading-none">
                  {formatPrice(property.price)}
                  {property.status === 'For Rent' && <span className="text-sm font-normal text-textMuted">/month</span>}
                </p>
              </div>

              <p className="text-sm text-textMuted flex items-center font-medium">
                <MapPin className="w-4 h-4 text-primary mr-1 shrink-0" />
                {property.location}
              </p>
            </div>

            {/* Gallery Component */}
            <PropertyGallery mainImage={property.image} title={property.title} />

            {/* Detail Tabs Specification */}
            <PropertyDetails property={property} />
          </div>

          {/* Right Column Sidebar: Agent details, schedule form, similar properties */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Agent Info Card */}
            <div className="bg-cardBg border border-borderLight rounded-card p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-textDark pb-4 border-b border-borderLight mb-4">Listed By Agent</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-16 h-16 rounded-full object-cover border border-borderLight shadow-sm bg-gray-100 shrink-0"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-textDark hover:text-primary transition-colors">
                    {agent.id ? (
                      <Link to={`/agents/${agent.id}`}>{agent.name}</Link>
                    ) : (
                      <span>{agent.name}</span>
                    )}
                  </h4>
                  <p className="text-xs text-textMuted font-semibold mt-0.5">{agent.role}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-textDark">{agent.rating} ({agent.reviews} Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pb-4 border-b border-borderLight mb-4 text-xs font-semibold text-textMuted">
                {agent.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span>{agent.phone}</span>
                  </div>
                )}
                {agent.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span>{agent.email}</span>
                  </div>
                )}
              </div>

              {agent.id && (
                <Link
                  to={`/agents/${agent.id}`}
                  className="block w-full text-center bg-primary-light hover:bg-primary/20 text-primary py-2.5 rounded-btn font-heading font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  View Agent Profile
                </Link>
              )}
            </div>

            {/* Schedule a Tour Form */}
            <div className="bg-white border border-borderLight rounded-card p-6 shadow-md">
              <h3 className="font-heading font-bold text-base text-textDark pb-4 border-b border-borderLight mb-4">Schedule a Tour</h3>
              <ContactForm type="tour" agentName={agent.name} agentId={agent.id} propertyId={property.id} />
            </div>

            {/* Similar Properties Suggestions */}
            {finalSimilar.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-base text-textDark">Similar Properties</h3>
                <div className="grid grid-cols-1 gap-6">
                  {finalSimilar.map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default PropertyPage;
