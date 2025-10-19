import { useGetSession } from '@rest/api';
import type { GetSession } from '@rest/models/getSession';
import React, { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';

interface AuthContextType {
  session?: GetSession | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetSession({
    query: {
      throwOnError(_) {
        localStorage.removeItem('token');
        navigate('/auth/login');
        return false;
      },
    },
  });

  const isAuthenticated = useMemo(() => !!data, [data]);

  return (
    <AuthContext.Provider
      value={{
        session: data?.data,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
