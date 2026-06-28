import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Home, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-darkGreen text-white/90 pt-16 pb-8 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold flex items-center gap-2 text-primary">
                <svg className="w-8 h-8 fill-current text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
                  <path d="M10 14h4v5h-4z"/>
                </svg>
                Casa Mare
              </span>
            </Link>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We make real estate simple, smart, and seamless. Discover premium villas, luxury condos, and comfortable apartments with our team.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-base text-white tracking-wide mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Properties</Link></li>
              <li><a href="/#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Properties type */}
          <div>
            <h4 className="font-heading font-bold text-base text-white tracking-wide mb-6">Properties</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/properties?type=Villa" className="hover:text-primary transition-colors">Luxury Villas</Link></li>
              <li><Link to="/properties?type=Apartment" className="hover:text-primary transition-colors">Modern Apartments</Link></li>
              <li><Link to="/properties?type=Condo" className="hover:text-primary transition-colors">Waterfront Condos</Link></li>
              <li><Link to="/properties?type=House" className="hover:text-primary transition-colors">Family Houses</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-bold text-base text-white tracking-wide mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>123 Ocean View Drive, Miami, FL 33139</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@casamare.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-white/50">
          <p>© 2026 Casa Mare. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
