import { useState, useEffect } from 'react';
import { getProperties } from '../lib/api';

export const useSearch = (filters) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties(filters);
        if (isMounted) {
          setProperties(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return { properties, loading, error };
};

export default useSearch;
