import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isGuestMode, setIsGuestMode] = useState(() => {
    return localStorage.getItem('thirusu-guest') === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('thirusu-guest', isGuestMode.toString());
  }, [isGuestMode]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.login(email, password);
      setUser(data.user);
      setIsGuestMode(false);
      return data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.register(name, email, password);
      // Auto-login after signup
      const loginData = await authAPI.login(email, password);
      setUser(loginData.user);
      setIsGuestMode(false);
      return loginData.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsGuestMode(false);
  };

  const continueAsGuest = () => {
    setIsGuestMode(true);
    setUser(null);
  };

  const value = {
    user,
    isGuestMode,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
