import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { user } = useAuth();

  // Admin mode is determined by user's is_admin flag from database
  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  // Current county override (null = use user's real county)
  const [countyOverride, setCountyOverride] = useState(null);

  // Available counties (fetched from API)
  const [availableCounties, setAvailableCounties] = useState([]);

  // Fetch available counties on mount
  useEffect(() => {
    fetch('/api/geo/counties.php')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.counties) {
          setAvailableCounties(data.counties);
        }
      })
      .catch(err => {
        console.error('Failed to fetch counties:', err);
        // Fallback counties
        setAvailableCounties([
          { id: 1, name: 'Luzerne', officialsCount: 6 },
          { id: 2, name: 'Lackawanna', officialsCount: 4 },
          { id: 3, name: 'Monroe', officialsCount: 6 },
          { id: 4, name: 'Lehigh', officialsCount: 3 },
          { id: 5, name: 'Northampton', officialsCount: 6 },
        ]);
      });
  }, []);

  // Get the effective county_id to use in API calls
  const getEffectiveCountyId = () => {
    if (isAdmin && countyOverride) {
      return countyOverride.id;
    }
    // Use user's actual county, default to Luzerne (1)
    return user?.county_id || 1;
  };

  const value = {
    isAdmin,
    countyOverride,
    setCountyOverride,
    availableCounties,
    getEffectiveCountyId,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
