import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = !!(supabaseUrl && supabaseAnonKey);
export const isDemoMode = !isConfigured && (import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO === 'true');
const requireDemo = () => { if (!isDemoMode) throw new Error('Authentication is not configured. Connect Supabase to use accounts.'); };

let supabaseClient = null;

if (isConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase URL or Anon Key is missing. Running in local mock mode.');

  // In-memory callbacks for auth
  const authListeners = new Set();
  
  // Helper to load/save mock session from localStorage
  const getMockSession = () => {
    try {
      const stored = localStorage.getItem('mock_supabase_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const setMockSession = (session) => {
    if (session) {
      localStorage.setItem('mock_supabase_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('mock_supabase_session');
    }
  };

  supabaseClient = {
    auth: {
      getSession: async () => {
        const session = isDemoMode ? getMockSession() : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback) => {
        authListeners.add(callback);
        const session = isDemoMode ? getMockSession() : null;
        // Trigger initial check
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners.delete(callback);
              }
            }
          }
        };
      },
      signInWithPassword: async ({ email }) => {
        requireDemo();
        // Simple mock authentication (any password works).
        // Reuse the account registered with this email so the role (seller/agent) is kept.
        let known = null;
        try {
          known = JSON.parse(localStorage.getItem(`mock_account_${email.toLowerCase()}`));
        } catch { /* ignore corrupt entry */ }
        const mockUser = known || {
          id: `mock-${crypto.randomUUID()}`,
          email,
          user_metadata: {
            full_name: email.split('@')[0],
            role: 'buyer'
          }
        };
        localStorage.setItem(`mock_account_${email.toLowerCase()}`, JSON.stringify(mockUser));
        if (!known) localStorage.setItem(`mock_profile_${mockUser.id}`, JSON.stringify({id:mockUser.id,email,full_name:mockUser.user_metadata.full_name,role:'buyer',phone:''}));
        const session = { user: mockUser, access_token: 'mock-token' };
        setMockSession(session);
        authListeners.forEach(cb => cb('SIGNED_IN', session));
        return { data: { user: mockUser, session }, error: null };
      },
      signUp: async ({ email, options }) => {
        requireDemo();
        const mockUser = {
          id: 'mock-user-id-' + Math.random().toString(36).substring(2, 9),
          email,
          user_metadata: options?.data || {
            full_name: email.split('@')[0],
            role: 'buyer'
          }
        };
        const session = { user: mockUser, access_token: 'mock-token' };
        setMockSession(session);
        // Save the profile to mock database representation
        const profile = {
          id: mockUser.id,
          email: mockUser.email,
          full_name: mockUser.user_metadata.full_name,
          role: mockUser.user_metadata.role || 'buyer',
          phone: '',
          created_at: new Date().toISOString()
        };
        localStorage.setItem(`mock_profile_${mockUser.id}`, JSON.stringify(profile));
        localStorage.setItem(`mock_account_${email.toLowerCase()}`, JSON.stringify(mockUser));

        authListeners.forEach(cb => cb('SIGNED_IN', session));
        return { data: { user: mockUser, session }, error: null };
      },
      signOut: async () => {
        setMockSession(null);
        authListeners.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
      }
    },
    from: (table) => {
      return {
        select: () => {
          return {
            eq: (field, value) => {
              return {
                eq: () => {
                  return {
                    async then(resolve) {
                      if (table === 'favorites') {
                        const favs = JSON.parse(localStorage.getItem(`mock_favorites_${value}`) || '[]');
                        resolve({ data: favs.map(id => ({ property_id: id })), error: null });
                      } else {
                        resolve({ data: [], error: null });
                      }
                    }
                  };
                },
                single: async () => {
                  if (table === 'profiles') {
                    // Try to load custom profile
                    let profile = localStorage.getItem(`mock_profile_${value}`);
                    if (profile) {
                      return { data: JSON.parse(profile), error: null };
                    }
                    // Default fallback mock profiles based on roles
                    return {
                      data: {
                        id: value,
                        email: 'user@example.com',
                        full_name: 'Mock User',
                        role: 'buyer',
                        phone: '+1 (555) 019-2834'
                      },
                      error: null
                    };
                  }
                  return { data: null, error: null };
                },
                async then(resolve) {
                  if (table === 'favorites') {
                    const favs = JSON.parse(localStorage.getItem(`mock_favorites_${value}`) || '[]');
                    resolve({ data: favs.map(id => ({ property_id: id })), error: null });
                  } else {
                    resolve({ data: [], error: null });
                  }
                }
              };
            },
            async then(resolve) {
              resolve({ data: [], error: null });
            }
          };
        },
        delete: () => {
          return {
            eq: (field1, value1) => {
              return {
                eq: (field2, value2) => {
                  return {
                    async then(resolve) {
                      if (table === 'favorites') {
                        // value1 is user.id, value2 is numericId
                        const favs = JSON.parse(localStorage.getItem(`mock_favorites_${value1}`) || '[]');
                        const updated = favs.filter(id => id !== value2);
                        localStorage.setItem(`mock_favorites_${value1}`, JSON.stringify(updated));
                      }
                      resolve({ error: null });
                    }
                  };
                }
              };
            }
          };
        },
        insert: (payload) => {
          return {
            select: () => {
              return {
                single: async () => {
                  return { data: payload, error: null };
                }
              };
            },
            async then(resolve) {
              if (table === 'favorites') {
                const { user_id, property_id } = payload;
                const favs = JSON.parse(localStorage.getItem(`mock_favorites_${user_id}`) || '[]');
                if (!favs.includes(property_id)) {
                  favs.push(property_id);
                  localStorage.setItem(`mock_favorites_${user_id}`, JSON.stringify(favs));
                }
              }
              resolve({ data: payload, error: null });
            }
          };
        }
      };
    }
  };
}

export const supabase = supabaseClient;
export default supabase;
