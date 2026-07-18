import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, Award, Heart, Shield, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, 
  MapPin, Bed, Bath, Maximize2, Quote, Star, ArrowUpRight, Smartphone, Compass
} from 'lucide-react';
import SearchBar from '../../components/search/SearchBar';
import PropertyCard from '../../components/property/PropertyCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { cities, testimonials } from '../../data/mockData';
import { getProperties, getAgents } from '../../lib/api';
import { formatPrice } from '../../utils/formatPrice';

export const Home = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ref for horizontal scroll carousel
  const carouselRef = useRef(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [propsData, agentsData] = await Promise.all([
          getProperties(),
          getAgents()
        ]);
        setProperties(propsData);
        setAgents(agentsData);
      } catch (err) {
        console.error('Error fetching Home page listings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Featured Properties list
  const featuredProperties = properties.filter(p => p.isFeatured);
  
  // Hottest Deals list
  const hottestDeals = properties.filter(p => p.isHotDeal);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 bg-darkGreen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Dream Mansion"
            className="w-full h-full object-cover object-center opacity-70"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-darkGreen via-darkGreen/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-12 md:pt-20 pb-20">
          <div className="max-w-2xl space-y-6 mb-10 text-white animate-fade-in">
            <Badge text="Premium Real Estate" variant="default" className="bg-primary text-white border-0" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Find Your Dream Property Today!
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-lg font-light">
              Discover the perfect place to call home. Aura Spaces connects you with top tier luxury villas, modern apartments, and premium family estates.
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>


      {/* SECTION 2 — STATS / TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Stats and Rows */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">About Aura Spaces</span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-textDark leading-tight">
                Over 15 Years of Excellence in Real Estate Services
              </h2>
              <p className="text-textMuted text-sm leading-relaxed">
                We are dedicated to helping our clients purchase and rent premium housing assets. Our expertise and transparent processes ensure top satisfaction.
              </p>
            </div>

            {/* 4 Icon + Text Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-primary-light text-primary rounded-card shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-textDark">Expertise & Experience</h4>
                  <p className="text-xs text-textMuted mt-1">Over 15 years of trusted premium service.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-primary-light text-primary rounded-card shadow-sm">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-textDark">Priority on Satisfaction</h4>
                  <p className="text-xs text-textMuted mt-1">Your housing goals are our top priority.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-primary-light text-primary rounded-card shadow-sm">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-textDark">Comprehensive Listings</h4>
                  <p className="text-xs text-textMuted mt-1">Wide range of luxury homes to choose.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-primary-light text-primary rounded-card shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-textDark font-semibold">Complete Guidance</h4>
                  <p className="text-xs text-textMuted mt-1">From initial search to legal settlement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Property Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-card translate-x-4 translate-y-4 -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300"></div>
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
              alt="Aura Spaces Villa"
              className="w-full h-[420px] object-cover rounded-card shadow-lg"
            />
          </div>
        </div>
      </section>


      {/* SECTION 3 — FEATURED PROPERTIES (CAROUSEL) */}
      <section className="bg-cardBg py-16 border-y border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Offers</span>
              <h2 className="text-3xl font-heading font-extrabold text-textDark mt-2">Explore Featured Properties</h2>
            </div>
            
            {/* Arrows */}
            <div className="flex space-x-3">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-11 h-11 bg-white border border-borderLight rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 text-textDark"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-11 h-11 bg-white border border-borderLight rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 text-textDark"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel container */}
          {loading ? (
            <div className="flex justify-center items-center py-16 w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-10 text-textMuted text-sm w-full">
              No featured properties available.
            </div>
          ) : (
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-6 scrollbar-hide pb-6 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProperties.map(property => (
                <div key={property.id} className="w-[320px] sm:w-[350px] shrink-0 snap-start">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* SECTION 4 — SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Services grid */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-8">
            <div>
              <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Solutions</span>
              <h2 className="text-3xl font-heading font-extrabold text-textDark mt-2">Comprehensive Real Estate Solutions</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-cardBg border border-borderLight p-6 rounded-card hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-primary/10 text-primary rounded-btn flex items-center justify-center mb-4">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-textDark">Property Sales</h4>
                <p className="text-xs text-textMuted mt-2 leading-relaxed">
                  Helping you find the absolute perfect luxury home, villa, or condo to purchase.
                </p>
              </div>

              <div className="bg-cardBg border border-borderLight p-6 rounded-card hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-primary/10 text-primary rounded-btn flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-textDark font-semibold">Property Management</h4>
                <p className="text-xs text-textMuted mt-2 leading-relaxed">
                  Professional management services for your high end investment assets.
                </p>
              </div>

              <div className="bg-cardBg border border-borderLight p-6 rounded-card hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-primary/10 text-primary rounded-btn flex items-center justify-center mb-4">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-textDark font-semibold">Home Valuation</h4>
                <p className="text-xs text-textMuted mt-2 leading-relaxed">
                  Accurate estimations and local property analysis for informed decisions.
                </p>
              </div>

              <div className="bg-cardBg border border-borderLight p-6 rounded-card hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-primary/10 text-primary rounded-btn flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-textDark font-semibold">Real Estate Consulting</h4>
                <p className="text-xs text-textMuted mt-2 leading-relaxed">
                  Expert advisory services for property investing, scaling, and portfolios.
                </p>
              </div>

            </div>
          </div>

          {/* Right Side: Image */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
              alt="Premium Living Space"
              className="w-full h-[450px] object-cover rounded-card shadow-lg"
            />
          </div>

        </div>
      </section>


      {/* SECTION 5 — WHY WORK WITH US */}
      <section className="bg-darkGreen text-white py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Why Us</span>
            <h2 className="text-3xl font-heading font-extrabold">Why Work with Us?</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              We separate ourselves by offering high-end property collections, expert local broker advice, and complete transaction transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 text-center sm:text-left bg-white/5 p-6 rounded-card border border-white/5">
              <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base">Extensive Portfolio</h4>
              <p className="text-xs text-white/75 leading-relaxed">Access to a wide range of luxury villas, family homes, and metropolitan condos.</p>
            </div>

            <div className="space-y-4 text-center sm:text-left bg-white/5 p-6 rounded-card border border-white/5">
              <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base font-semibold">Expert Local Knowledge</h4>
              <p className="text-xs text-white/75 leading-relaxed">In-depth analysis and understanding of hot local real estate markets.</p>
            </div>

            <div className="space-y-4 text-center sm:text-left bg-white/5 p-6 rounded-card border border-white/5">
              <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base font-semibold">Personalized Solutions</h4>
              <p className="text-xs text-white/75 leading-relaxed">Tailored options built specifically to fit your investment budget and goals.</p>
            </div>

            <div className="space-y-4 text-center sm:text-left bg-white/5 p-6 rounded-card border border-white/5">
              <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base font-semibold">Transparent & Honest</h4>
              <p className="text-xs text-white/75 leading-relaxed">Clear direct communication and open contract management every step of the way.</p>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 6 — CTA BANNER */}
      <section className="relative h-[320px] flex items-center justify-center text-white bg-darkGreen">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury Property Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-darkGreen/65"></div>
        </div>
        <div className="relative z-10 text-center max-w-xl px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">Ready to Find Your Dream Home?</h2>
          <p className="text-white/80 text-sm font-light">Explore our latest premium listings and speak directly with local agents.</p>
          <Button
            onClick={() => navigate('/properties')}
            variant="primary"
            className="px-8 py-3 text-sm rounded-btn uppercase tracking-wider"
          >
            View Properties
          </Button>
        </div>
      </section>


      {/* SECTION 7 — BROWSE BY CITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Locations</span>
            <h2 className="text-3xl font-heading font-extrabold text-textDark mt-2">Browse Properties By City</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/properties')}
            className="flex items-center gap-2 group text-xs py-2 px-5"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.slice(0, 4).map(city => (
            <div
              key={city.id}
              onClick={() => navigate(`/properties?location=${encodeURIComponent(city.name)}`)}
              className="relative h-64 rounded-card overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkGreen/90 via-darkGreen/20 to-transparent group-hover:via-darkGreen/40 transition-colors"></div>
              
              <div className="absolute bottom-5 left-5 text-white space-y-1">
                <h4 className="font-heading font-bold text-lg leading-none">{city.name}</h4>
                <p className="text-xs text-white/80">{city.propertyCount} Properties</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 8 — SMART OPTIONS FOR BUYERS */}
      <section className="bg-cardBg py-20 border-y border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest font-semibold">Guides</span>
            <h2 className="text-3xl font-heading font-extrabold text-textDark">Smart Options for Buyers & Services</h2>
            <p className="text-textMuted text-sm">
              We empower buyers with helpful guides, valuation systems, and financing calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border border-borderLight p-8 rounded-card hover:shadow-xl transition-shadow flex flex-col justify-between h-full group">
              <div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-textDark mb-3">Home Buying Guide</h3>
                <p className="text-xs text-textMuted leading-relaxed mb-6">
                  Step-by-step guidance to help you navigate lists, examine mortgages, and purchase your dream home.
                </p>
              </div>
              <Button onClick={() => navigate('/about')} variant="primary" className="w-full text-xs font-semibold py-2.5">
                Learn More
              </Button>
            </div>

            <div className="bg-white border border-borderLight p-8 rounded-card hover:shadow-xl transition-shadow flex flex-col justify-between h-full group">
              <div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-textDark mb-3">Home Valuation</h3>
                <p className="text-xs text-textMuted leading-relaxed mb-6">
                  Get a complete, accurate estimate of your home's current market value with local database trends.
                </p>
              </div>
              <Button onClick={() => navigate('/contact')} variant="primary" className="w-full text-xs font-semibold py-2.5">
                Learn More
              </Button>
            </div>

            <div className="bg-white border border-borderLight p-8 rounded-card hover:shadow-xl transition-shadow flex flex-col justify-between h-full group">
              <div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-textDark mb-3">Financing for Buyers</h3>
                <p className="text-xs text-textMuted leading-relaxed mb-6">
                  Explore competitive, flexible financing structures and loan rates available for property acquisition.
                </p>
              </div>
              <Button onClick={() => navigate('/properties')} variant="primary" className="w-full text-xs font-semibold py-2.5">
                Learn More
              </Button>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 9 — MEET OUR TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Our Team</span>
          <h2 className="text-3xl font-heading font-extrabold text-textDark">Meet Our Expert Team</h2>
          <p className="text-textMuted text-sm">
            Our certified agents bring years of local expertise to deliver superior brokerages.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-10 text-textMuted text-sm">
            No agent profiles available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agents.slice(0, 3).map(agent => (
              <div key={agent.id} className="bg-cardBg border border-borderLight p-6 rounded-card text-center relative group hover:shadow-md transition-shadow">
                {/* Circular Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                  <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                
                <h4 className="font-heading font-bold text-lg text-textDark group-hover:text-primary transition-colors">
                  <Link to={`/agents/${agent.id}`}>{agent.name}</Link>
                </h4>
                <p className="text-xs text-textMuted font-semibold mt-1 mb-4">{agent.role}</p>
                
                {/* Small Badge Icon */}
                <div className="absolute bottom-5 right-5 w-6 h-6 bg-primary-light text-primary rounded-full flex items-center justify-center shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 10 — TESTIMONIALS */}
      <section className="bg-darkGreen text-white py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <Quote className="w-16 h-16 text-primary/30 mx-auto" />
          
          <p className="text-xl sm:text-2xl font-body italic font-light leading-relaxed max-w-3xl mx-auto">
            "{testimonials[activeTestimonial].text}"
          </p>
          
          <div>
            <h4 className="font-heading font-bold text-lg">{testimonials[activeTestimonial].author}</h4>
            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mt-1">
              {testimonials[activeTestimonial].role}
            </p>
          </div>

          {/* Testimonial Nav Row */}
          <div className="flex justify-center items-center space-x-4 pt-4">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTestimonial(idx)}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                  activeTestimonial === idx ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 11 — HOTTEST DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Hot Offers</span>
            <h2 className="text-3xl font-heading font-extrabold text-textDark mt-2">Discover the Hottest Deals of the Month</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : hottestDeals.length === 0 ? (
          <div className="text-center py-10 text-textMuted text-sm">
            No hot deal listings available.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hottestDeals.map(deal => (
              <div key={deal.id} className="bg-cardBg rounded-card border border-borderLight overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group">
                {/* Left Side: Large Image */}
                <div className="relative sm:w-2/5 h-56 sm:h-auto overflow-hidden shrink-0">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge text="Hot Deal" variant="hot" />
                  </div>
                </div>

                {/* Right Side Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-textDark group-hover:text-primary transition-colors">
                      <Link to={`/properties/${deal.id}`}>{deal.title}</Link>
                    </h3>
                    <p className="text-xs text-textMuted flex items-center font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
                      {deal.location}
                    </p>
                    <div className="flex space-x-4 py-2 text-xs font-semibold text-textMuted">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-primary" /> {deal.beds} Beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-primary" /> {deal.baths} Baths</span>
                      <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-primary" /> {deal.sqft} Sqft</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-borderLight mt-4">
                    <p className="font-heading font-extrabold text-lg text-primary">{formatPrice(deal.price)}</p>
                    <Link
                      to={`/properties/${deal.id}`}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-heading font-bold tracking-wider py-2 px-4 rounded-btn uppercase transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 12 — MOBILE APP CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary-light rounded-card py-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest font-semibold">Aura Spaces Mobile</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-textDark leading-tight">
                Download Our Mobile App — Search. Find. Invest. On the go.
              </h2>
              <p className="text-textMuted text-sm leading-relaxed">
                Unlock instant listing alerts, save favorites, and contact local market agents directly from our premium mobile app. Available now for iOS and Android.
              </p>
            </div>

            {/* App Store badges */}
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-flex items-center space-x-3 bg-darkGreen text-white px-5 py-2.5 rounded-btn hover:bg-opacity-95 transition-all shadow-sm">
                <Smartphone className="w-5 h-5 text-primary" />
                <div className="text-left leading-none">
                  <p className="text-[10px] text-white/60">Download on the</p>
                  <p className="text-sm font-heading font-bold mt-0.5">App Store</p>
                </div>
              </a>

              <a href="#" className="inline-flex items-center space-x-3 bg-darkGreen text-white px-5 py-2.5 rounded-btn hover:bg-opacity-95 transition-all shadow-sm">
                <Smartphone className="w-5 h-5 text-primary" />
                <div className="text-left leading-none">
                  <p className="text-[10px] text-white/60">Get it on</p>
                  <p className="text-sm font-heading font-bold mt-0.5">Google Play</p>
                </div>
              </a>
            </div>

            {/* Feature Icons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-borderLight/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-bold text-textDark">Instant Notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-bold text-textDark">Favorites Syncing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-bold text-textDark">Direct Agent Chat</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="flex justify-center lg:justify-end relative">
            {/* Design circle backdrop */}
            <div className="absolute w-80 h-80 rounded-full bg-primary/10 -z-10 translate-y-6"></div>
            
            {/* Phone Image Mockup */}
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
              alt="Aura Spaces App Mockup"
              className="w-64 h-[460px] object-cover rounded-card border-8 border-darkGreen shadow-2xl relative z-10"
            />
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
