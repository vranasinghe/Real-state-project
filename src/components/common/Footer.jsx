import React from 'react';
import { Link } from 'react-router-dom';
import { House } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
export default function Footer() {
  return <footer className="cm-footer"><div className="cm-section"><div className="footer-grid"><div><Link className="footer-brand" to="/"><House /> Aura Space</Link><p>Considered homes. Clearer decisions.<br />Space for your next chapter.</p><small>{isConfigured ? 'Property discovery and historical housing ML.' : 'Portfolio demonstration · Sample property and agent data'}</small></div><div><h3>Find your place</h3><Link to="/properties">Explore properties</Link><Link to="/agents">Meet the agents</Link><Link to="/favorites">Saved homes</Link></div><div><h3>Behind the price</h3><Link to="/estimator">AI price estimator</Link><Link to="/model-report">Machine learning case study</Link><Link to="/dashboard">Listing dashboard</Link></div><div><h3>Let’s connect</h3><Link to="/contact">Contact Aura Space</Link><Link to="/about">About the project</Link><Link to="/login">Your account</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Aura Space</span><span>Estimator scope: Ames, Iowa · 2006–2010 sales · USD</span></div></div></footer>;
}
