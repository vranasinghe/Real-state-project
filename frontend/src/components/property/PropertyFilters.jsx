import React from 'react';
import { PROPERTY_TYPES, AMENITIES } from '../../utils/constants';

export const PropertyFilters = ({ filters, updateFilter, resetFilters }) => {
  
  const handleTypeChange = (type) => {
    if (filters.type === type) {
      updateFilter('type', '');
    } else {
      updateFilter('type', type);
    }
  };

  const handleAmenityChange = (amenity) => {
    const current = filters.amenities || [];
    if (current.includes(amenity)) {
      updateFilter('amenities', current.filter(a => a !== amenity));
    } else {
      updateFilter('amenities', [...current, amenity]);
    }
  };

  const bedsOptions = [
    { label: 'All', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5+', value: '5' }
  ];

  return (
    <div className="bg-cardBg rounded-card border border-borderLight p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-borderLight">
        <h3 className="font-heading font-bold text-lg text-textDark">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Property Status Tab switching */}
      <div>
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted mb-3">Status</h4>
        <div className="grid grid-cols-3 gap-2">
          {['Buy', 'Rent', 'Sold'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updateFilter('status', status)}
              className={`py-2 px-3 text-center text-xs font-bold rounded-btn transition-all border ${
                filters.status === status
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-borderLight text-textMuted hover:text-textDark'
              }`}
            >
              {status === 'Buy' ? 'Buy' : status === 'Rent' ? 'Rent' : 'Sold'}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Location</h4>
        <input
          type="text"
          placeholder="City, State, Zip"
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="w-full border border-borderLight rounded-btn px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
        />
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Property Type</h4>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex items-center space-x-3 text-sm text-textDark font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={filters.type === type}
                onChange={() => handleTypeChange(type)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <span>{type}s</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full border border-borderLight rounded-btn px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full border border-borderLight rounded-btn px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Bedrooms</h4>
        <div className="flex bg-white border border-borderLight rounded-btn overflow-hidden">
          {bedsOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => updateFilter('bedrooms', opt.value)}
              className={`flex-1 py-2 text-center text-xs font-bold border-r border-borderLight last:border-0 transition-all ${
                filters.bedrooms === opt.value
                  ? 'bg-primary text-white'
                  : 'text-textMuted hover:text-textDark hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="space-y-2">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Min Bathrooms</h4>
        <select
          value={filters.bathrooms}
          onChange={(e) => updateFilter('bathrooms', e.target.value)}
          className="w-full border border-borderLight rounded-btn px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all"
        >
          <option value="">Any</option>
          <option value="1">1+ Baths</option>
          <option value="2">2+ Baths</option>
          <option value="3">3+ Baths</option>
          <option value="4">4+ Baths</option>
        </select>
      </div>

      {/* Area (sqft) */}
      <div className="space-y-3">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Area (Sqft)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Sqft"
            value={filters.minArea}
            onChange={(e) => updateFilter('minArea', e.target.value)}
            className="w-full border border-borderLight rounded-btn px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
          />
          <input
            type="number"
            placeholder="Max Sqft"
            value={filters.maxArea}
            onChange={(e) => updateFilter('maxArea', e.target.value)}
            className="w-full border border-borderLight rounded-btn px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div className="space-y-3">
        <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-textMuted">Amenities</h4>
        <div className="space-y-2.5">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-3 text-sm text-textDark font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.amenities || []).includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
