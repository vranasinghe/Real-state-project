import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Pages
import Home from '../pages/Home';
const PropertiesPage = lazy(() => import('../pages/Properties'));
const PropertyPageDetail = lazy(() => import('../pages/Properties/PropertyPage'));
const AgentsPage = lazy(() => import('../pages/Agents'));
const AgentPageDetail = lazy(() => import('../pages/Agents/AgentPage'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Estimator = lazy(() => import('../pages/Estimator'));
const ModelReport = lazy(() => import('../pages/ModelReport'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));

const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'));

// Scroll To Top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div role="status" className="cm-section pt-32">Loading page…</div>}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyPageDetail />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:id" element={<AgentPageDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/estimator" element={<Estimator />} />
            <Route path="/model-report" element={<ModelReport />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboards (sellers and agents only) */}
            {['/dashboard', '/dashboard/seller', '/dashboard/agent'].map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute roles={['seller', 'agent']}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            ))}

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
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;

