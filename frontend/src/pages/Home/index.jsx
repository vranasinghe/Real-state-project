import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calculator, ShieldCheck, Building2 } from 'lucide-react';
import SearchBar from '../../components/search/SearchBar';
import PropertyCard from '../../components/property/PropertyCard';
import { getProperties, getAgents } from '../../lib/api';
import { isConfigured } from '../../lib/supabase';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    setLoading(true);
    Promise.all([getProperties({ status: 'Buy' }), getAgents()]).then(([homes, people]) => {
      if (live) { setProperties(homes); setAgents(people); setError(''); }
    }).catch(() => { if (live) setError('We could not load listings. Please try again.'); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [attempt]);
  const cities = [...new Set(properties.map(p => p.city))].slice(0, 4);
  return <div className="home-page">
    <section className="original-hero">
      <img className="original-hero-image" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85" alt="Contemporary luxury home with a landscaped garden" fetchpriority="high" />
      <div className="original-hero-overlay" aria-hidden="true" />
      <div className="original-hero-content">
        <div className="original-hero-copy">
          <h1>Find Your Dream<br />Property Today!</h1>
          <p>Discover the perfect place to call home. Explore luxury villas, modern apartments, and family homes with Aura Space.</p>
          <div className="action-row"><Link className="cm-button" to="/properties">Explore Properties</Link><Link className="cm-button hero-secondary" to="/estimator">Try AI Price Estimator</Link></div>
        </div>
        <div className="original-hero-search"><SearchBar /></div>
      </div>
    </section>
    <section className="cm-section">
      <div className="section-heading"><div><h2>Homes worth a closer look.</h2><p>Find the space that fits the way you want to live.</p></div><Link className="text-link" to="/properties">View all properties</Link></div>
      {!isConfigured && <p className="demo-note">You’re exploring sample listings and agent profiles. Local demo enquiries stay in this browser.</p>}
      {error ? <div role="alert" className="notice">{error} <button className="text-link" onClick={() => setAttempt(a => a + 1)}>Retry listings</button></div> : <div className="grid gap-6 md:grid-cols-3">{loading ? [1,2,3].map(n => <div key={n} className="skeleton h-96" aria-label="Loading property" />) : properties.filter(p => p.isFeatured).concat(properties.filter(p => !p.isFeatured)).slice(0,3).map(p => <PropertyCard key={p.id} property={p} />)}</div>}
      {!loading && !error && properties.length === 0 && <p className="notice">No sale listings are available yet. <Link to="/properties">Browse all listings</Link>.</p>}
    </section>
    <section className="ai-showcase" id="services"><div className="cm-section ai-layout">
      <div><Calculator size={34} strokeWidth={1.4} /><h2>A little more insight.<br />A clearer perspective.</h2><p>Go behind the price with our interactive house-price prediction project. Describe an Ames home and explore how a trained machine-learning ensemble responds.</p><div className="action-row"><Link to="/estimator" className="cm-button light">Explore the AI estimator</Link><Link to="/model-report" className="light-link">Read the ML case study</Link></div></div>
      <div className="model-preview"><h3>Two models. One considered estimate.</h3><div className="model-pair"><span>Ridge regression<small>50% of log prediction</small></span><span>Gradient Boosting<small>50% of log prediction</small></span></div><p>18 property inputs · Real FastAPI inference · USD output</p><hr /><p className="scope-copy">A historical Ames, Iowa demonstration using 2006–2010 sales. Not a current market valuation, rental estimate, or model for other cities.</p></div>
    </div></section>
    {cities.length > 0 && <section className="cm-section"><div className="section-heading"><div><h2>Where would you like to land?</h2><p>Explore the places behind our listings.</p></div></div><div className="city-grid">{cities.map(city => { const p = properties.find(p => p.city === city); return <Link key={city} to={`/properties?location=${encodeURIComponent(city)}`} className="city-tile"><img src={p.image} alt={`Home listed in ${city}`} loading="lazy" /><span><MapPin size={18} />{city}</span></Link>; })}</div></section>}
    <section className="cm-section service-section"><h2>From a first look to your next move.</h2><div className="service-columns"><div><Building2 /><h3>Find your space</h3><p>Filter by location, budget and the details that make a home yours. Save your shortlist as you explore.</p><Link to="/properties" className="text-link">Browse properties</Link></div><div><ShieldCheck /><h3>Connect with a person</h3><p>Ask about a listing or request a tour directly from its property page.</p><Link to="/agents" className="text-link">Meet the agents</Link></div><div><Calculator /><h3>Explore the engineering</h3><p>Follow the data, preprocessing and model evaluation behind our historical price estimator.</p><Link to="/model-report" className="text-link">See how the model works</Link></div></div></section>
    {agents.length > 0 && <section className="cm-section agent-section"><div className="section-heading"><div><h2>People make the difference.</h2><p>{isConfigured ? 'Get to know the agents behind the listings.' : 'Explore the sample agent directory.'}</p></div><Link to="/agents" className="text-link">Meet all agents</Link></div><div className="grid gap-8 sm:grid-cols-3">{agents.slice(0,3).map(agent => <Link key={agent.id} to={`/agents/${agent.id}`} className="agent-preview"><img src={agent.photo} alt={agent.name} loading="lazy" /><div><h3>{agent.name}</h3><p>{agent.propertiesListed} listed {agent.propertiesListed === 1 ? 'property' : 'properties'}</p></div></Link>)}</div></section>}
    <section className="closing-section"><h2>Your next chapter starts with a look.</h2><p>Make room for what comes next.</p><Link to="/properties" className="cm-button">Find your home</Link></section>
  </div>;
}
