import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { PROPERTY_TYPES } from '../../utils/constants';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Buy'); // Buy, Rent, Sold
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('status', status);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-card shadow-2xl p-4 sm:p-6 animate-fade-in relative z-10">
      {/* Tabs */}
      <div className="flex border-b border-borderLight pb-4 mb-4">
        {['Buy', 'Rent', 'Sold'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatus(tab)}
            className={`relative pb-3 px-6 text-sm font-heading font-bold transition-all duration-300 ${
              status === tab ? 'text-primary' : 'text-textMuted hover:text-textDark'
            }`}
          >
            {tab === 'Buy' ? 'Buy Property' : tab === 'Rent' ? 'Rent Property' : 'Recently Sold'}
            {status === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full transition-all duration-300"></span>
            )}
          </button>
        ))}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Location */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Location
          </label>
          <input
            type="text"
            placeholder="Enter City or State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-borderLight rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Property Type */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-primary" /> Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-borderLight rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Price Ranges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-0.5">
              <DollarSign className="w-3 h-3 text-primary" /> Min Price
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-borderLight rounded-btn px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-0.5">
              <DollarSign className="w-3 h-3 text-primary" /> Max Price
            </label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-borderLight rounded-btn px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Search Action */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white font-heading font-bold text-sm tracking-wide py-3 px-6 rounded-btn shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
