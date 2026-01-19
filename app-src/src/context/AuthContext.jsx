import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const session = await auth.getSession();
      if (session) {
        setUser(session.user);
        setPreferences(session.preferences);
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await auth.login(email, password);
    setUser(data.user);
    return data;
  }

  async function register(email, password, zipCode) {
    const data = await auth.register(email, password, zipCode);
    setUser(data.user);
    return data;
  }

  async function logout() {
    await auth.logout();
    setUser(null);
    setPreferences(null);
  }

  const value = {
    user,
    preferences,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkSession,
    setUser,
    setPreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
