import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to fetch user profiles dynamically
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error loading user profile:', err.message);
      return null;
    }
  };

  useEffect(() => {
    // 1. Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    // Schedule profile I/O after the auth event callback has returned.
    let profileTimer;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      clearTimeout(profileTimer);
      setUser(session?.user || null);
      setProfile(null);
      setLoading(!!session);
      if (session) profileTimer = setTimeout(() => {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      }, 0);
    });

    return () => {
      clearTimeout(profileTimer);
      subscription.unsubscribe();
    };
  }, []);

  const redirectAfterLogin = (userRole) => {
    const routes = {
      buyer: '/',
      seller: '/dashboard/seller',
      agent: '/dashboard/agent'
    };
    navigate(routes[userRole] || '/');
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Fetch profile details immediately to resolve role for navigation
    const prof = await fetchProfile(data.user.id);
    return { success: true, role: prof?.role || 'buyer' };
  };

  const signUp = async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: options.full_name,
          role: options.role || 'buyer'
        }
      }
    });
    if (error) throw error;
    return { success: true, data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate('/');
  };

  // Backward compatible properties for older views (e.g. Navbar)
  const legacyUser = user ? {
    ...user,
    name: profile?.full_name || user.email?.split('@')[0],
    role: profile && user && profile.id === user.id ? profile.role : 'buyer'
  } : null;

  return (
    <AuthContext.Provider value={{
      user: legacyUser, // Exports compatible wrapper
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      // Compatibility adapters
      login: signIn,
      register: (firstName, lastName, email, password, role) => 
        signUp(email, password, { full_name: `${firstName} ${lastName}`, role }),
      logout: signOut,
      role: profile && user && profile.id === user.id ? profile.role : 'buyer',
      isAuthenticated: !!user,
      redirectAfterLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

