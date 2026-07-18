import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AgentCard from '../../components/agent/AgentCard';
import { getAgents } from '../../lib/api';

export const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        console.error('Error fetching agents:', err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="pt-24 pb-20 font-body">
      
      {/* Header banner */}
      <section className="bg-cardBg py-10 border-b border-borderLight mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight mb-2">Meet Our Expert Team</h1>
          
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-textDark font-bold">Agents</span>
          </div>
        </div>
      </section>

      {/* Agents grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-cardBg border border-borderLight rounded-card">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-card text-center">
            Failed to load agents: {error.message || 'Unknown error occurred'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default AgentsPage;
