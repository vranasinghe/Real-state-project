import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  const loadFavorites = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);
      if (error) throw error;
      
      setFavorites(data.map(fav => fav.property_id));
    } catch (err) {
      console.error('Error loading favorites from Supabase:', err.message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadFavorites(user.id);
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  const toggleFavorite = async (propertyId) => {
    if (!user?.id) {
      console.warn('User must be logged in to save properties');
      return;
    }

    const numericId = parseInt(propertyId, 10);
    const isFav = favorites.includes(numericId);

    // Optimistic UI updates
    const previousFavorites = [...favorites];
    const optimisticFavorites = isFav 
      ? favorites.filter(id => id !== numericId)
      : [...favorites, numericId];
    
    setFavorites(optimisticFavorites);

    try {
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', numericId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: numericId
          });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Failed to sync favorite with database, reverting:', err.message);
      setFavorites(previousFavorites); // Revert on failure
    }
  };

  const isFavorite = (propertyId) => favorites.includes(parseInt(propertyId, 10));

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
export default FavoritesContext;
