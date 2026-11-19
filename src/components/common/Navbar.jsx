import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { House, Menu, X, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useScrollNav } from '../../hooks/useScrollNav';
import { isConfigured } from '../../lib/supabase';
export default function Navbar() {
  const [open,setOpen] = useState(false);
  const [error,setError] = useState('');
  const { user,logout,isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const location = useLocation();
  const isScrolled = useScrollNav(50);
  const overHero = location.pathname === '/' && !isScrolled && !open;
  const links = [['/','Home'],['/properties','Properties'],['/estimator','AI Estimator'],['/model-report','The ML Project'],['/agents','Agents'],['/about','About'],['/contact','Contact']];
  const seller = ['seller','agent'].includes(user?.role);
  async function signOut() { try { await logout(); setOpen(false); } catch { setError('Could not sign out. Please try again.'); } }
  return <nav className={`site-nav ${overHero ? 'over-hero' : ''}`} aria-label="Main navigation" onKeyDown={e => { if(e.key === 'Escape') setOpen(false); }}><div className="nav-inner"><Link to="/" className="nav-brand" onClick={() => setOpen(false)}><House strokeWidth={1.7} size={30} /><span>Aura Space<small>REAL ESTATE & INSIGHT</small></span></Link><div className="desktop-nav">{links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'active' : ''}>{label}</NavLink>)}</div><div className="nav-account">{!isConfigured && <span className="demo-label">Local demo</span>}{isAuthenticated ? <><Link to="/favorites" aria-label={`Saved homes, ${favorites.length}`}><Heart size={20} /></Link>{seller && <Link to="/dashboard" className="text-link">Dashboard</Link>}<button onClick={signOut} aria-label="Sign out"><LogOut size={19} /></button></> : <Link to="/login" className="nav-login">Sign in</Link>}<Link to="/contact" className="cm-button">Let’s talk</Link></div><button className="mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(s => !s)}>{open ? <X /> : <Menu />}</button></div>{error && <p role="alert" className="error-notice">{error}</p>}{open && <div id="mobile-navigation" className="mobile-navigation">{[...links,...(isAuthenticated ? [['/favorites',`Saved homes (${favorites.length})`],...(seller ? [['/dashboard','Dashboard']] : [])] : [['/login','Sign in'],['/register','Create account']])].map(([to,label]) => <Link key={to} to={to} aria-current={location.pathname === to ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}{isAuthenticated && <button onClick={signOut}>Sign out</button>}{!isConfigured && <p className="demo-note">Local demo · Authentication is simulated.</p>}</div>}</nav>;
}
