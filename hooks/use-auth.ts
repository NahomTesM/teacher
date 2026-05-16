'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/mock-data';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('auth_session');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse auth session", e);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('auth_session', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
}
