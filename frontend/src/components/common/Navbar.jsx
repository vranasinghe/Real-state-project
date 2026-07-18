import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Heart, LogOut } from 'lucide-react';
import { useScrollNav } from '../../hooks/useScrollNav';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pagesDropdown, setPagesDropdown] = useState(false);
  const isScrolled = useScrollNav(50);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();

  const isHome = location.pathname === '/';
  // Transparent only on Home page and when not scrolled
  const navBg = isHome && !isScrolled ? 'bg-transparent text-white' : 'bg-white text-textDark shadow-md border-b border-borderLight';
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-primary';
  const linkHover = isHome && !isScrolled ? 'hover:text-primary-light' : 'hover:text-primary';
  const pillStyle = isHome && !isScrolled
    ? 'bg-white text-darkGreen hover:bg-primary-light'
    : 'bg-primary text-white hover:bg-primary-hover';

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold flex items-center gap-2 ${logoColor}`}>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
                <path d="M10 14h4v5h-4z"/>
              </svg>
              Aura Spaces
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 font-heading font-semibold text-sm">
            <Link to="/" className={`transition-colors duration-200 ${linkHover}`}>Home</Link>
            <Link to="/properties" className={`transition-colors duration-200 ${linkHover}`}>Properties</Link>
            <a href="/#services" className={`transition-colors duration-200 ${linkHover}`}>Services</a>
            <Link to="/about" className={`transition-colors duration-200 ${linkHover}`}>About Us</Link>
            
            {/* Pages Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setPagesDropdown(!pagesDropdown)}
                className={`flex items-center space-x-1 transition-colors duration-200 ${linkHover}`}
              >
                <span>Pages</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {pagesDropdown && (
                <div className="absolute top-8 right-0 w-48 bg-white rounded-md shadow-lg py-2 border border-borderLight text-textDark animate-fade-in">
                  <Link 
                    to="/agents" 
                    className="block px-4 py-2 hover:bg-primary hover:text-white transition-all text-sm"
                    onClick={() => setPagesDropdown(false)}
                  >
                    Agents
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/favorites" 
                        className="flex items-center justify-between px-4 py-2 hover:bg-primary hover:text-white transition-all text-sm"
                        onClick={() => setPagesDropdown(false)}
                      >
                        <span>Favorites</span>
                        {favorites.length > 0 && (
                          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {favorites.length}
                          </span>
                        )}
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setPagesDropdown(false);
                        }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 hover:bg-primary hover:text-white transition-all text-sm"
                        onClick={() => setPagesDropdown(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-4 py-2 hover:bg-primary hover:text-white transition-all text-sm"
                        onClick={() => setPagesDropdown(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/properties" className={`relative p-2 rounded-full hover:bg-black/5 ${isHome && !isScrolled ? 'hover:bg-white/10 text-white' : 'text-textDark'}`}>
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}
            <Link 
              to="/contact" 
              className={`px-6 py-2.5 rounded-pill font-heading font-bold text-sm tracking-wide transition-all shadow-sm ${pillStyle}`}
            >
              Contact Us
            </Link>
          </div>

          {/* Hamburger Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/properties" className="relative p-2 text-current">
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}
            <button onClick={toggleMenu} className="p-2 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white text-textDark border-b border-borderLight w-full px-4 py-4 space-y-3 shadow-lg">
          <Link to="/" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">Home</Link>
          <Link to="/properties" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">Properties</Link>
          <a href="/#services" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">Services</a>
          <Link to="/about" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">About Us</Link>
          <Link to="/agents" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">Agents</Link>
          
          {isAuthenticated ? (
            <button 
              onClick={() => {
                logout();
                toggleMenu();
              }}
              className="w-full text-left py-2 font-semibold text-red-600 hover:text-red-800 transition-all flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout ({user.name})</span>
            </button>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">Login</Link>
              <Link to="/register" onClick={toggleMenu} className="block py-2 font-semibold hover:text-primary transition-all">Register</Link>
            </>
          )}

          <Link 
            to="/contact" 
            onClick={toggleMenu} 
            className="block w-full text-center bg-primary text-white py-3 rounded-btn font-heading font-bold text-sm tracking-wide shadow-md"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
