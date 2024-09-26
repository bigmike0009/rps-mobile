import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUserDetails } from './authFunctions';

interface AuthContextType {
  email: string | null;
  isLoggedIn: boolean;
  setUser: (email: string | null) => void;
  checkUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    checkUser();
  }, []);

  const setUser = (email: string | null) => {
    setEmail(email);
    setIsLoggedIn(!!email);
  };

  const checkUser = async () => {
    console.log('CHECKING')
    const { email } = await getCurrentUserDetails();
    setEmail(email);
    setIsLoggedIn(!!email);
  };

  return (
    <AuthContext.Provider value={{ email, isLoggedIn, setUser, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};
