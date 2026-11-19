import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Grid, List, ChevronRight, SlidersHorizontal } from 'lucide-react';
import PropertyFilters from '../../components/property/PropertyFilters';
import PropertyGrid from '../../components/property/PropertyGrid';
import { useSearch } from '../../hooks/useSearch';
import { useFavorites } from '../../context/FavoritesContext';

export const PropertiesPage = ({ title = 'Find Your Dream Home', showFavoritesOnly = false }) => {
  const [searchParams] = useSearchParams();
  const { favorites } = useFavorites();
  
  // Local state to manage filters now that hook is pure query runner
  const [filters, setFilters] = useState({
    status: 'Buy',
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: []
  });

  const updateFilter = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: []
    });
  };

  const { properties: filteredProperties, loading, error } = useSearch(filters);
  
  const [viewType, setViewType] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 6;

  // Replace URL-derived filters together so navigation cannot retain stale values.
  useEffect(() => {
    setFilters({
      status: searchParams.get('status') || (showFavoritesOnly ? '' : 'Buy'),
      location: searchParams.get('location') || searchParams.get('city') || '',
      type: searchParams.get('type') || '', minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '', bedrooms: '', bathrooms: '',
      minArea: '', maxArea: '', amenities: [],
    });
  }, [searchParams, showFavoritesOnly]);
  useEffect(() => { setCurrentPage(1); }, [filters, sortBy, favorites]);

  // Handle Favorites Only listing mode
  const baseListings = showFavoritesOnly 
    ? filteredProperties.filter(p => favorites.includes(p.id))
    : filteredProperties;

  // Sorting
  const sortedProperties = React.useMemo(() => {
    const list = [...baseListings];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Most recently listed first; listings without a date fall back to year built
      const listed = (p) => Date.parse(p.createdAt) || 0;
      return list.sort((a, b) => listed(b) - listed(a) || b.yearBuilt - a.yearBuilt);
    }
    return list;
  }, [baseListings, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 pb-20 font-body">
      
      {/* Page Header & Breadcrumb */}
      <section className="bg-cardBg py-10 border-b border-borderLight mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight mb-2">
                {title}
              </h1>
              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-textDark font-bold">{showFavoritesOnly ? 'Favorites' : 'Properties'}</span>
              </div>
            </div>
            {showFavoritesOnly && (
              <p className="text-sm font-semibold text-textMuted bg-primary-light text-primary px-4 py-2 rounded-btn">
                Saved Properties count: <span className="font-bold">{favorites.length}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter (Desktop) */}
          <div className="hidden lg:block">
            <PropertyFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          {/* Mobile Filter Toggle Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex justify-end">
              <div className="w-80 bg-white h-full p-6 overflow-y-auto relative animate-fade-in">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="absolute top-4 right-4 text-textMuted hover:text-textDark font-heading font-bold"
                >
                  Close
                </button>
                <div className="mt-8">
                  <PropertyFilters
                    filters={filters}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Listings Columns */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="flex flex-wrap gap-2" aria-label="Active filters">
              {Object.entries(filters).filter(([, value]) => Array.isArray(value) ? value.length : value).map(([key,value]) => <button key={key} className="filter-chip" aria-label={`Remove ${key} filter`} onClick={() => updateFilter(key, Array.isArray(value) ? [] : '')}>{key}: {Array.isArray(value) ? value.join(', ') : value} ×</button>)}
            </div>
            {/* Topbar: Results & Sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-cardBg border border-borderLight rounded-card p-4 gap-4">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <p className="text-sm font-bold text-textDark">
                  Showing <span className="text-primary">{sortedProperties.length}</span> Results
                </p>
                
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center space-x-1 bg-white border border-borderLight px-3 py-1.5 rounded-btn text-xs font-bold text-textDark active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Sorting */}
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  <label htmlFor="listing-sort" className="text-textMuted">Sort By:</label>
                  <select id="listing-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-borderLight rounded-btn px-3 py-1.5 bg-white text-textDark outline-none font-bold"
                  >
                    <option value="newest">Newest Listings</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Grid/List View Toggles */}
                <div className="flex bg-white border border-borderLight rounded-btn overflow-hidden">
                  <button
                    aria-label="Grid view" aria-pressed={viewType === 'grid'} onClick={() => setViewType('grid')}
                    className={`p-2 transition-all ${viewType === 'grid' ? 'bg-primary text-white' : 'text-textMuted hover:text-textDark'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    aria-label="List view" aria-pressed={viewType === 'list'} onClick={() => setViewType('list')}
                    className={`p-2 transition-all ${viewType === 'list' ? 'bg-primary text-white' : 'text-textMuted hover:text-textDark'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

             {/* Property list Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6" role="status" aria-label="Loading listings">{[1,2,3,4].map(n => <div className="skeleton h-80" key={n} />)}</div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-card text-center">
                Failed to load properties: {error.message || 'Unknown error occurred'}
              </div>
            ) : sortedProperties.length === 0 ? <div className="notice"><h2 className="text-xl">No homes match these filters.</h2><p className="my-3">Try a wider budget or a different location.</p><button className="text-link" onClick={resetFilters}>Clear filters</button></div> : (
              <PropertyGrid properties={paginatedProperties} viewType={viewType} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 border border-borderLight rounded-btn flex items-center justify-center text-textMuted hover:bg-primary-light hover:text-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-textMuted"
                >
                  ‹
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 border rounded-btn flex items-center justify-center font-heading font-extrabold text-xs tracking-wider transition-all ${
                      currentPage === page
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'border-borderLight text-textMuted hover:bg-primary-light hover:text-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 border border-borderLight rounded-btn flex items-center justify-center text-textMuted hover:bg-primary-light hover:text-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-textMuted"
                >
                  ›
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default PropertiesPage;
