import React from 'react';
import PropertyCard from './PropertyCard';

export const PropertyGrid = ({ properties, viewType = 'grid' }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-cardBg rounded-card border border-borderLight p-8">
        <svg className="mx-auto h-12 w-12 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <h3 className="mt-4 text-lg font-heading font-bold text-textDark">No Properties Found</h3>
        <p className="mt-2 text-sm text-textMuted max-w-xs mx-auto">
          We couldn't find any listings matching your search filter options. Please try resetting or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className={viewType === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "flex flex-col gap-6"
    }>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} viewType={viewType} />
      ))}
    </div>
  );
};

export default PropertyGrid;
