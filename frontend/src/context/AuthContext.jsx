import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// React Context API:
// Centralizes user authentication state across the component tree without prop-drilling.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On-Boot Session Check:
  // Calls GET /api/auth/me on app load. Axios transmits the HTTP-Only cookie automatically.
  // If valid, populates global user state; if invalid/expired, resets user state to null.
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect with empty dependency array []: Executes checkAuth() once after initial mount.
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password, role });
      if (response.data?.success) {
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    // Context Provider Value Object:
    // Exposes auth state, status loading flag, derived role booleans (isCandidate, isRecruiter), and auth dispatch actions.
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isCandidate: user?.role === 'candidate',
        isRecruiter: user?.role === 'recruiter',
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom React Hook (useAuth):
// Encapsulates useContext(AuthContext) and enforces component instantiation within an AuthProvider wrapper.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
