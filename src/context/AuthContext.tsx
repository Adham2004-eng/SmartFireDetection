import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole } from '../types';
import type { MockUser } from '../mockData/mockUsers';

interface AuthContextType {
  user: MockUser | null;
  role: UserRole | null;
  login: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    const savedUser = localStorage.getItem('sff_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (id: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    const { authenticateUser } = await import('../mockData/mockUsers');
    const authenticatedUser = authenticateUser(id, password);

    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem('sff_user', JSON.stringify(authenticatedUser));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid ID or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sff_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
