
"use client";
import type { User } from '@/lib/types';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const MOCK_BUSINESS_OWNER_EMAIL = "owner@example.com";
const MOCK_USER_EMAIL = "user@example.com";


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted user session
    try {
      const storedUser = localStorage.getItem('eventideUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      // Potentially corrupted data, clear it
      localStorage.removeItem('eventideUser');
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User) => {
    // In a real app, this would involve an API call and token handling
    // For mock purposes, we check email for role
    let role: User['role'] = 'user';
    if (userData.email === MOCK_BUSINESS_OWNER_EMAIL) {
      role = 'business_owner';
    }
    const userWithRole = { ...userData, role };
    setUser(userWithRole);
    localStorage.setItem('eventideUser', JSON.stringify(userWithRole));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('eventideUser');
    // In a real app, also invalidate token on backend if possible
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
