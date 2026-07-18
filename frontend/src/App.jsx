import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes';

function AppContent() {
  const location = useLocation();
  const hideNavFooter = ['/login', '/register', '/forgot-password'].includes(location.pathname.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
