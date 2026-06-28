import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { formatPrice } from '../../utils/formatPrice';
import Badge from '../common/Badge';

export const PropertyCard = ({ property, viewType = 'grid' }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  // Badge Selection
  let badgeText = property.status; // "For Sale", "For Rent", "Sold"
  let badgeVariant = 'default';
  if (property.isHotDeal) {
    badgeText = 'Hot Deal';
    badgeVariant = 'hot';
  } else if (property.status === 'Sold') {
    badgeText = 'Sold';
    badgeVariant = 'sold';
  } else if (property.status === 'For Rent') {
    badgeVariant = 'rent';
  }

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  if (viewType === 'list') {
    return (
      <div className="bg-cardBg rounded-card border border-borderLight overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group">
        {/* Left Side: Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden shrink-0">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge text={badgeText} variant={badgeVariant} />
          </div>
          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 shadow-md transition-all active:scale-90"
          >
            <Heart className={`w-5 h-5 transition-colors ${favorited ? 'fill-red-500 text-red-500 scale-110' : 'text-textDark'}`} />
          </button>
        </div>

        {/* Right Side: Details */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading font-bold text-lg md:text-xl text-textDark group-hover:text-primary transition-colors">
                <Link to={`/properties/${property.id}`}>{property.title}</Link>
              </h3>
              <p className="font-heading font-extrabold text-xl text-primary whitespace-nowrap">
                {formatPrice(property.price)}
                {property.status === 'For Rent' && <span className="text-xs font-normal text-textMuted">/mo</span>}
              </p>
            </div>
            <p className="text-xs text-textMuted flex items-center mb-4 font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
              {property.location}
            </p>
            <p className="text-sm text-textMuted mb-6 line-clamp-2 md:line-clamp-3">
              {property.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-borderLight">
            <div className="flex space-x-6 text-sm text-textMuted font-semibold">
              <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-primary" /> {property.beds} Beds</span>
              <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-primary" /> {property.baths} Baths</span>
              <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-primary" /> {property.sqft} Sqft</span>
            </div>
            <Link
              to={`/properties/${property.id}`}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-btn font-heading font-bold text-xs tracking-wider uppercase transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cardBg rounded-card border border-borderLight overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Image & Badges */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge text={badgeText} variant={badgeVariant} />
        </div>
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 shadow-md transition-all active:scale-90"
        >
          <Heart className={`w-5 h-5 transition-colors ${favorited ? 'fill-red-500 text-red-500 scale-110' : 'text-textDark'}`} />
        </button>
      </div>

      {/* Info Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-textDark mb-1 group-hover:text-primary transition-colors line-clamp-1">
            <Link to={`/properties/${property.id}`}>{property.title}</Link>
          </h3>
          <p className="text-xs text-textMuted flex items-center mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
            {property.location}
          </p>
          <p className="font-heading font-extrabold text-lg text-primary mb-4">
            {formatPrice(property.price)}
            {property.status === 'For Rent' && <span className="text-xs font-normal text-textMuted">/mo</span>}
          </p>
        </div>

        {/* Specs Row */}
        <div className="flex items-center justify-between pt-4 border-t border-borderLight text-xs font-bold text-textMuted">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-primary" /> {property.beds} Beds</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-primary" /> {property.baths} Baths</span>
          <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4 text-primary" /> {property.sqft} Sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
