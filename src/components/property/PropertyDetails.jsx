import React, { useState } from 'react';
import { Bed, Bath, Maximize2, Car, Calendar, Check } from 'lucide-react';

export const PropertyDetails = ({ property }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Features', 'Location', 'Floor Plan'];

  const stats = [
    { icon: <Bed className="w-5 h-5 text-primary" />, label: 'Bedrooms', value: `${property.beds} Beds` },
    { icon: <Bath className="w-5 h-5 text-primary" />, label: 'Bathrooms', value: `${property.baths} Baths` },
    { icon: <Maximize2 className="w-5 h-5 text-primary" />, label: 'Area Size', value: `${property.sqft} Sqft` },
    { icon: <Car className="w-5 h-5 text-primary" />, label: 'Garage', value: `${property.garage || 'No'} Garage` },
    { icon: <Calendar className="w-5 h-5 text-primary" />, label: 'Year Built', value: property.yearBuilt }
  ];

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-cardBg border border-borderLight p-6 rounded-card">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-white border border-borderLight rounded-full shadow-sm">
              {stat.icon}
            </div>
            <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted">{stat.label}</span>
            <span className="text-sm font-bold text-textDark">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-borderLight mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 px-6 text-sm font-heading font-bold transition-all duration-300 ${
                activeTab === tab ? 'text-primary' : 'text-textMuted hover:text-textDark'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="min-h-[200px] animate-fade-in">
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-textDark">Property Description</h3>
              <p className="text-textMuted text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
              <p className="text-textMuted text-sm leading-relaxed">
                This property has been constructed under top-tier engineering standards and showcases meticulous space planning. Featuring customized design fixtures, this home offers premium value and represents an incredible addition to our real estate portfolios.
              </p>
            </div>
          )}

          {activeTab === 'Features' && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-textDark">Interior & Exterior Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm text-textDark font-medium bg-cardBg border border-borderLight py-3 px-4 rounded-btn">
                    <div className="w-5 h-5 bg-primary-light text-primary rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
                {/* Standard general features to enrich lists */}
                {["Double Glazing", "High-speed Internet", "Air Conditioning", "Smoke Alarm"].map((f, idx) => (
                  <div key={`std-${idx}`} className="flex items-center space-x-3 text-sm text-textDark font-medium bg-cardBg border border-borderLight py-3 px-4 rounded-btn">
                    <div className="w-5 h-5 bg-primary-light text-primary rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Location' && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-textDark">Location Details</h3>
              <p className="text-textMuted text-sm">
                Located at <strong className="text-textDark">{property.location}</strong>. Excellent accessibility with schools, retail shopping centers, and public parks located within a 1-mile radius.
              </p>
              <div className="w-full h-80 rounded-card overflow-hidden border border-borderLight shadow-sm bg-gray-100 relative">
                <iframe
                  title="Google Maps Placeholder"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 grayscale opacity-90"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}

          {activeTab === 'Floor Plan' && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-textDark font-semibold">Standard Floor Plan</h3>
              <p className="text-textMuted text-sm">
                Excellently optimized room sizes featuring open spaces, a central living area, and separated master chambers.
              </p>
              {/* Custom SVG/Layout mockup for floor plan */}
              <div className="border border-borderLight rounded-card bg-cardBg p-6 flex items-center justify-center">
                <svg className="w-full max-w-md h-64 text-textMuted" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1">
                  {/* Master Bedroom */}
                  <rect x="10" y="10" width="80" height="40" rx="2" />
                  <text x="50" y="32" fontSize="6" className="fill-current text-textDark font-heading font-bold text-center" textAnchor="middle">Master Bedroom</text>
                  
                  {/* Living Room */}
                  <rect x="90" y="10" width="100" height="80" rx="2" />
                  <text x="140" y="52" fontSize="7" className="fill-current text-primary font-heading font-bold text-center" textAnchor="middle">Living Room & Kitchen</text>
                  
                  {/* Bathroom */}
                  <rect x="10" y="50" width="40" height="40" rx="2" />
                  <text x="30" y="72" fontSize="6" className="fill-current text-textDark font-heading font-bold text-center" textAnchor="middle">Bath</text>
                  
                  {/* Bedroom 2 */}
                  <rect x="50" y="50" width="40" height="40" rx="2" />
                  <text x="70" y="72" fontSize="6" className="fill-current text-textDark font-heading font-bold text-center" textAnchor="middle">Bedroom 2</text>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
