import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Pages
import Home from '../pages/Home';
import PropertiesPage from '../pages/Properties';
import PropertyPageDetail from '../pages/Properties/PropertyPage';
import AgentsPage from '../pages/Agents';
import AgentPageDetail from '../pages/Agents/AgentPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// Dashboard Placeholder for Seller & Agent roles
const DashboardPlaceholder = ({ role }) => {
  return (
    <div className="pt-32 pb-20 text-center space-y-4 max-w-md mx-auto px-4 font-body">
      <div className="p-8 bg-cardBg border border-borderLight rounded-card shadow-sm space-y-4">
        <h2 className="text-2xl font-heading font-extrabold text-textDark capitalize">{role} Dashboard</h2>
        <p className="text-sm text-textMuted leading-relaxed">
          Welcome to your professional {role} panel. Here you can list housing assets, manage contract templates, and coordinate client tour requests.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link to="/" className="bg-primary text-white text-xs font-heading font-bold px-5 py-2.5 rounded-btn hover:bg-primary-hover transition-colors uppercase tracking-wider">
            Go Home
          </Link>
          <Link to="/properties" className="bg-darkGreen text-white text-xs font-heading font-bold px-5 py-2.5 rounded-btn hover:bg-opacity-95 transition-colors uppercase tracking-wider">
            Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

// Scroll To Top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyPageDetail />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agents/:id" element={<AgentPageDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Dashboards */}
        <Route 
          path="/dashboard/seller" 
          element={
            <PrivateRoute>
              <DashboardPlaceholder role="seller" />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/agent" 
          element={
            <PrivateRoute>
              <DashboardPlaceholder role="agent" />
            </PrivateRoute>
          } 
        />

        {/* Protected Dashboard/Favorites */}
        <Route 
          path="/favorites" 
          element={
            <PrivateRoute>
              <PropertiesPage title="My Saved Properties" showFavoritesOnly={true} />
            </PrivateRoute>
          } 
        />
        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

