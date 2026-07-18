import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Mail, Award } from 'lucide-react';

export const AgentCard = ({ agent }) => {
  return (
    <div className="bg-cardBg rounded-card border border-borderLight overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Agent Photo & Badge */}
      <div className="relative h-72 overflow-hidden bg-gray-100">
        <img
          src={agent.photo}
          alt={agent.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
        {/* Award Badge for top rated */}
        {agent.rating >= 4.8 && (
          <div className="absolute top-4 left-4 bg-primary text-white p-2 rounded-full shadow-md flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-lg text-textDark group-hover:text-primary transition-colors">
              <Link to={`/agents/${agent.id}`}>{agent.name}</Link>
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-textDark">{agent.rating}</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wide">{agent.role}</p>
          <p className="text-xs text-textMuted font-medium">{agent.propertiesListed} Properties Listed • {agent.reviews} Reviews</p>
        </div>

        {/* Contact info & Action button */}
        <div className="mt-6 pt-4 border-t border-borderLight space-y-3">
          <div className="flex items-center space-x-2 text-xs text-textMuted font-medium">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{agent.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-textMuted font-medium truncate">
            <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{agent.email}</span>
          </div>

          <Link
            to={`/agents/${agent.id}`}
            className="block w-full text-center bg-primary hover:bg-primary-hover text-white py-2.5 rounded-btn font-heading font-bold text-xs tracking-wider uppercase transition-colors shadow-sm mt-4"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
