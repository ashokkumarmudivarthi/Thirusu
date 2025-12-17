import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('thirusu-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isGuestMode, setIsGuestMode] = useState(() => {
    return localStorage.getItem('thirusu-guest') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('thirusu-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('thirusu-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('thirusu-guest', isGuestMode.toString());
  }, [isGuestMode]);

  const login = (email, password) => {
    // Simple mock login - in production, this would call an API
    const mockUser = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      avatar: null,
    };
    setUser(mockUser);
    setIsGuestMode(false);
    return mockUser;
  };

  const signup = (name, email, password) => {
    // Simple mock signup - in production, this would call an API
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      avatar: null,
    };
    setUser(newUser);
    setIsGuestMode(false);
    return newUser;
  };

  const logout = () => {
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
