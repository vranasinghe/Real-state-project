import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Award } from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import ContactForm from '../../components/agent/ContactForm';
import { getAgent } from '../../lib/api';

export const AgentPage = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAgent(id);
        setAgent(data);
      } catch (err) {
        console.error('Error loading agent:', err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4 font-body">
        <h2 className="text-2xl font-heading font-extrabold text-textDark">Agent Not Found</h2>
        <p className="text-textMuted text-sm">We couldn't locate the profile you are looking for.</p>
        <Link to="/agents" className="inline-block bg-primary text-white py-2 px-6 rounded-btn font-heading font-bold text-xs uppercase tracking-wider">
          Back to Agents
        </Link>
      </div>
    );
  }

  const agentProperties = agent.properties || [];

  return (
    <div className="pt-24 pb-20 font-body">
      
      {/* Breadcrumb path */}
      <section className="bg-cardBg py-6 border-b border-borderLight mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/agents" className="hover:text-primary transition-colors">Agents</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-textDark font-bold">{agent.name}</span>
        </div>
      </section>

      {/* Agent details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Agent Profile Banner Hero */}
        <div className="bg-cardBg border border-borderLight rounded-card p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-sm">
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-md bg-gray-100 shrink-0"
          />

          <div className="space-y-4 text-center md:text-left flex-grow">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight">{agent.name}</h1>
                {agent.rating >= 4.8 && (
                  <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-heading font-extrabold uppercase px-2.5 py-1 rounded-pill max-w-fit mx-auto md:mx-0">
                    <Award className="w-3 h-3" /> Top Rated
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-textMuted uppercase tracking-wide">{agent.role}</p>
            </div>

            <p className="text-textMuted text-sm max-w-2xl leading-relaxed">
              {agent.bio}
            </p>

            {/* Performance Stats */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-2">
              <div className="text-center md:text-left bg-white border border-borderLight px-5 py-3 rounded-card min-w-[120px]">
                <p className="text-2xl font-heading font-extrabold text-primary">{agent.propertiesListed}</p>
                <p className="text-[10px] text-textMuted font-bold uppercase tracking-wider mt-0.5">Properties Listed</p>
              </div>

              <div className="text-center md:text-left bg-white border border-borderLight px-5 py-3 rounded-card min-w-[120px]">
                <div className="flex items-center justify-center md:justify-start space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
                  <span className="text-2xl font-heading font-extrabold text-textDark">{agent.rating}</span>
                </div>
                <p className="text-[10px] text-textMuted font-bold uppercase tracking-wider mt-0.5">{agent.reviews} Customer Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings and Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Active listings */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading font-bold text-xl text-textDark">
              Active Listings ({agentProperties.length})
            </h3>
            
            {agentProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {agentProperties.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="bg-cardBg border border-borderLight p-10 rounded-card text-center text-textMuted">
                No active properties listed currently under this agent.
              </div>
            )}
          </div>

          {/* Inquiry form */}
          <div className="bg-white border border-borderLight p-6 rounded-card shadow-md">
            <h3 className="font-heading font-bold text-base text-textDark pb-4 border-b border-borderLight mb-4">
              Direct Agent Inquiry
            </h3>
            <ContactForm type="message" agentName={agent.name} agentId={agent.id} />
          </div>

        </div>

      </section>

    </div>
  );
};

export default AgentPage;
