import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="pt-40 pb-32 text-center px-4 font-body">
    <p className="text-primary font-heading font-extrabold text-sm uppercase tracking-widest">Error 404</p>
    <h1 className="text-4xl font-heading font-extrabold text-textDark mt-2">We couldn't find that page</h1>
    <p className="text-textMuted mt-3 max-w-md mx-auto text-sm leading-relaxed">
      The link may be broken or the page may have moved. Try one of these instead.
    </p>
    <div className="mt-8 flex justify-center gap-4">
      <Link to="/" className="bg-primary text-white text-xs font-heading font-bold px-5 py-3 rounded-btn hover:bg-primary-hover transition-colors uppercase tracking-wider">Go Home</Link>
      <Link to="/properties" className="border border-primary text-primary text-xs font-heading font-bold px-5 py-3 rounded-btn hover:bg-primary hover:text-white transition-colors uppercase tracking-wider">Browse Properties</Link>
    </div>
  </div>
);

export default NotFound;
